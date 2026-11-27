---
name: Compatibilidad MIDI
description: Verificar la compatibilidad Web MIDI de Piano Today —detección y permisos, contexto seguro, familias de navegador, puertos y hot-plug, parseo de notas, tempo/ritmo y feedback, diagnóstico en UI y degradación elegante— sin confundir mocks con prueba en hardware; usar al tocar src/midi, permisos, teclado o al auditar navegadores.
---

# Compatibilidad MIDI — Piano Today

Propósito: comprobar que la entrada MIDI funciona —o degrada con elegancia— en cada navegador soportado, y separar lo verificado en tests de lo que solo está simulado. **Revisa y reporta**; no cambies el canal MIDI salvo petición explícita.

> Origen: creada siguiendo el formato de `.agents/skills` de SinNotas. Fuentes: `docs/DIAGNOSTICO-MIDI.md`, `docs/QA-NAVEGADORES.md`, `docs/PRUEBAS-MANUALES.md` (P2), ADR-048/049.

## 1. Mapa del subsistema

| Archivo | Responsabilidad |
| --- | --- |
| `src/midi/detect.ts` | `isWebMidiSupported`, `requestMidiAccess` (`{sysex:false}`), `getMidiPermissionState`, `describeMidiFailure` |
| `src/midi/context.tsx` | `MidiProvider`, `useMidi`, estados `unsupported/idle/requesting/listening/denied/error`, `MAX_MIDI_EVENTS=1024`, `subscribe` |
| `src/midi/input.ts` | `connectMidiInput`, puertos `inputs/outputs`, `onstatechange`, `open()` explícito, `disconnect()` |
| `src/midi/device.ts` | `parseMidiMessage` (solo `0x90`/`0x80`), `detectDeviceProfile` (Yamaha PSR-373), `midiNoteName` (C4=60) |
| `src/midi/failure.ts` | `classifyMidiFailure` (6 `MidiFailureKind`), `isPermissionDeniedFailure` |
| `src/midi/browser.ts` | `detectBrowserFamily` por características, `blockedMessageKey`, `browserLabel`; la familia **nunca** bloquea ni permite |
| `src/midi/permissions.ts` | `permissionHelpFor`, URLs verificadas (`chrome://`, `brave://`, `opera://`) y guía Safari/iOS/Android |
| `src/midi/feedback.ts`, `tempo.ts`, `exercise-attempt.ts` | `evaluateMidiPerformance`, `estimateTempo`, `evaluateRhythm`, `taskExpectedStrikes` |
| `src/components/MidiDiagnostics.tsx`, `MidiPermissionFlow.tsx`, `MidiStatusBar.tsx`, `MidiSupportNotice.tsx` | Diagnóstico, confirmación en línea, barra global y aviso por familia |
| `src/audio/*` | **Salida** (AudioEngine/sampler); no hay ruta MIDI→Tone.js: el dispositivo no suena por sí mismo |

Frontera: MIDI es entrada (`src/midi/*`), audio es salida (`src/audio/*`). Se acoplan en la UI por `heldNotes`/`activeNotes` (`Keyboard.tsx`, `Staff.tsx`, `KeyboardTask.tsx`) y `PlaybackScopeProvider` evita iluminar pestañas ocultas.

## 2. Invariantes que deben cumplirse

1. **API y contexto seguro:** `typeof navigator.requestMIDIAccess === 'function'`; sin API → `unsupported` y aviso. Solo HTTPS o localhost (`window.isSecureContext`); `classifyMidiFailure` prioriza `insecure-context` y muestra `midi.help.insecure`.
2. **Permiso correcto:** `requestMIDIAccess({ sysex: false })`; el permiso se pide solo tras gesto del usuario y con confirmación en línea. Autoconectar solo cuando `permission === 'granted'`. **`denied` significa denegación real**: `dismissed` (`AbortError`), fallo de complemento (`addon-required-or-no-device`) o contexto inseguro clasifican como `error`, con ayuda específica. No fijar `denied` al montar desde Permissions API.
3. **Fallo informativo:** conservar `name`/`message`/`isSecureContext` de `DOMException`/`Error`; `MidiDiagnostics` muestra navegador, contexto, permiso, estado, fallo, entradas/salidas, último mensaje hex (`90 3C 60`) y ofrece «Copiar informe» **sin User-Agent**.
4. **Familia por características:** `detectBrowserFamily` usa `window.chrome`, `InstallTrigger`, `webkitAudioContext` y brands con cuidado (Chrome incluye `Safari/` y expone `webkitAudioContext`). Solo cambia textos; no decidir compatibilidad por UA.
5. **Ayuda verificada:** `src/midi/permissions.ts` solo publica rutas confirmadas; **no inventar** `edge://`, `vivaldi://` ni `samsung://`. Safari macOS: extensión de terceros opcional (`SAFARI_WEBMIDI_EXTENSION_URL`, verificado 2026-11-22) + fallback manual. Firefox Android e iOS: aviso; Firefox desktop: complemento + «Volver a buscar dispositivos».
6. **Puertos:** `listInputs`/`listOutputs` recorren `access.inputs/outputs`; `onmidimessage` en todas las entradas, `onstatechange` vuelve a adjuntar (hot-plug), `input.open()` explícito (algunos navegadores no entregan eventos sin abrir) y `disconnect()` limpia handlers. `outputs` es diagnóstico: la app **no escribe** a puertos de salida.
7. **Parseo acotado:** `parseMidiMessage` acepta `0x90` (note on, velocity 0 = off) y `0x80`; valida nota/velocity 0-127; ignora mensajes de sistema `>= 0xf0` (clock, active sensing, sysex) y no interpreta `0xB0` CC, pitch bend (`0xE0`), aftertouch ni poly pressure. `MidiProvider.handleRaw` conserva channel messages en `lastRaw` y descarta los de sistema.
8. **Evaluación justa:** `accuracy = matched / max(expected.length, played.length)` (las notas sobrantes penalizan); `RHYTHM_TOLERANCE_MS = 80`; `steady` si accuracy ≥ 0.8; `even` si desviación de velocity ≤ 16; `evaluateTaskAttempt` normaliza timestamps absolutos restando el primer onset. Rangos distintos a vigilar: `KeyboardTaskSchema.tempoBpm` 30-240, fallback `taskExpectedStrikes` 60, `estimateTempo` 30-300.
9. **Degradación elegante:** sin MIDI siguen funcionando el teclado virtual (A–L / W–P, `DEFAULT_COMPUTER_KEY_MAP`) y la autoevaluación manual. ADR-049: el teclado de ordenador **no** se inyecta en `MidiProvider` (F7-009 descartado para evitar notas duplicadas). Grabación larga usa `subscribe()`, no `events` (tope 1024).
10. **Sin regresiones de i18n:** textos ES/EN en `src/state/settings.tsx` (`midi.*`); claves nuevas se comprueban con `tests/i18n-parity.test.ts`.

## 3. Verificación automática

```bash
npm run typecheck && npm test && npm run build
npx vitest run tests/midi-detect.test.ts tests/midi-input.test.ts tests/midi-browser.test.ts \
  tests/midi-failure.test.ts tests/midi-permissions.test.ts tests/midi-device.test.ts \
  tests/midi-tempo.test.ts tests/midi-feedback.test.ts tests/midi-exercise-attempt.test.ts \
  tests/midi-context.test.tsx tests/midi-permission-flow.test.tsx tests/midi-firefox-flow.test.tsx \
  tests/midi-webkit-flow.test.tsx tests/midi-diagnostics.test.tsx tests/midi-diagnostics-copy.test.tsx \
  tests/midi-support-notice.test.tsx tests/keyboard-midi.test.tsx tests/staff-midi.test.tsx \
  tests/keyboard-task-midi.test.tsx tests/song-recorder.test.ts
npx playwright test e2e/midi-permissions.spec.ts --project=chromium
npx playwright test e2e/midi-permissions.spec.ts --project=firefox
git diff --check
```

El helper `tests/helpers/fake-midi.ts` (`installFakeMidi`, `emit`, `notifyStateChange`, perfil PSR-373 por defecto) parchea `navigator.requestMIDIAccess`. Úsalo para reproducir antes de investigar; busca por símbolo, no por número de línea.

## 4. Matriz de compatibilidad (estado real documentado)

| Entorno | Soporte | Evidencia |
| --- | --- | --- |
| Chrome / Edge / Brave / Opera / Vivaldi / Samsung Internet / Chrome Android | Web MIDI sí; las rutas de permiso verificadas son `chrome://`, `brave://`, `opera://` | README, ADR-048; Brave/Opera/Vivaldi/Samsung **no ejecutados**, solo por equivalencia de motor |
| Chromium (Playwright 158) | 8/8 E2E; con `midi` concedido + acceso simulado (el host no expone subsistema MIDI) | `docs/QA-NAVEGADORES.md` |
| Firefox desktop | Sí con complemento de permiso del sitio; dos diálogos, conectar teclado antes y «Look for devices again» | 7/7 E2E con `DOMException` inyectado; complemento real **no verificado** |
| Safari macOS | No nativo; guía de extensión + autoevaluación | Solo mocks de componente |
| iOS / iPadOS | No en ningún navegador (todos WebKit) | Aviso en `MidiPermissionFlow`; sin prueba en dispositivo |
| Firefox Android / WebKit (Playwright) | No / no ejecutable en este host (`libicudata.so.74`) | `npx playwright test --project=webkit` falla por entorno, no por código |
| Windows con navegador no Chromium (informe del usuario 2026-11-27) | El diálogo de permiso **nunca aparece**; en Linux funciona en todos | No reproducido aquí: `isWindowsNonChromium()` solo elige el texto `midi.help.windowsNonChromium`; no afirma causa ni bloquea el intento. Ver hipótesis H6 en `docs/DIAGNOSTICO-MIDI.md` |

**Regla de oro:** un test con API simulada demuestra el flujo de UI, **no** la compatibilidad del dispositivo. `docs/PRUEBAS-MANUALES.md` P2 (Yamaha PSR-373 por USB-MIDI), P3 Safari, P4 iOS y P5 Android siguen pendientes de humano; `docs/DIAGNOSTICO-MIDI.md` marca H1-H5 como hipótesis no verificadas en hardware. No las reportes como «verificado».

## 5. Huecos que una auditoría debe señalar

- Sin test con teclado físico; sin medición de latencia ni umbral (no se compara `event.timeStamp` contra la salida de audio).
- Sin test del fallback `performance.now()` en `eventTimestamp`, ni de timestamps desordenados/jitter.
- Sin tests de pitch bend, aftertouch, sysex real ni de clock/active sensing en `onRawMessage` frente a `lastRaw`.
- `fake.access.outputs` siempre vacío: lista de salidas del diagnóstico sin datos reales; no hay MIDI out.
- Sin test de `disconnect()` del provider, `focus`/`visibilitychange`, `PermissionStatus.onchange` ni puertos `state:'disconnected'`.
- `MidiStatusBar` solo se monta en `tests/songs-page.test.tsx`; ramas `listening/requesting/denied/error/idle` sin tests propios. `MidiSupportNotice` cubre solo `unsupported`.
- `docs/DIAGNOSTICO-MIDI.md` cita `test-results/reproduce-midi.mjs`, hoy ausente (test-results está ignorado).
- Windows + navegador no Chromium: reportado pero sin reproducir; hace falta un informe real con `failure.name` y `message` antes de culpar al complemento o al controlador.

## 6. Formato del informe

Para cada comprobación: `entorno (real/simulado) · pasos · evidencia (test, captura o salida) · resultado ✅/❌/⏳`. Agrupa al final lo pendiente de usuario (P2–P5) con el motivo de la limitación. Clasifica `error` si rompe la entrada MIDI en un navegador soportado, `warning` si el fallo queda silencioso o la ayuda es engañosa, `note` si es solo cobertura pendiente.

## Referencias rápidas

| Qué | Dónde |
| --- | --- |
| Flujo de permisos y diagnóstico | `src/midi/detect.ts`, `failure.ts`, `permissions.ts`, `src/components/MidiDiagnostics.tsx` |
| Canal compartido y puertos | `src/midi/context.tsx`, `input.ts`, `device.ts`, `tests/helpers/fake-midi.ts` |
| Matriz y límites | `README.md` (MIDI), `docs/QA-NAVEGADORES.md`, `docs/DIAGNOSTICO-MIDI.md`, `docs/PRUEBAS-MANUALES.md` |
| Decisiones | `docs/DECISIONES.md` (ADR-048, ADR-049) |
| Mapa técnico | skill `estructure` → `references/Estructure.md` |
