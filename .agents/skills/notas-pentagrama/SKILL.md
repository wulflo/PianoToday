---
name: Notas en el pentagrama
description: Verificar que las notas estén bien ubicadas en el pentagrama de Piano Today —clave, armadura (incluido modo menor), líneas y espacios, líneas adicionales, acordes, compases, alineación bimanual y resaltado por subsección— con reglas musicales comprobables contra el SVG; usar al tocar partituras, VexFlow, src/staff, src/notation o al corregir una nota mal dibujada.
---

# Notas en el pentagrama — Piano Today

Propósito: pasar de «esta nota está mal puesta» a una regla musical verificada y una aserción sobre el SVG. **Revisa y reporta**; no cambies partituras ni el render salvo petición explícita y test que demuestre el fallo.

> Origen: creada siguiendo el formato de `.agents/skills` de SinNotas. Render: **VexFlow 5.0.0** (ADR-002). No hay render propio: la capa propia es integración (mapeo de alturas, medición vertical, resaltado, barras y sistemas).

## 1. Mapa del flujo

`JSON de contenido` → Zod `Score`/`NoteEvent` → `spelledPitchToPitch` (`src/theory/pitch.ts`) → `pitchToVexKey` (`src/staff/vex.ts`) → `VF.StaveNote` → SVG.

| Archivo | Responsabilidad |
| --- | --- |
| `src/staff/vex.ts` | `pitchToVexKey` (`C4→c/4`, `F#4→f#/4`, `Bbb3→bbb/3`), `STAFF_DURATIONS` |
| `src/staff/layout.ts` | `verticalExtent`, `LINE_SPACING=10`, `NOTE_BASE=90`; altura antes de dibujar para no recortar líneas adicionales |
| `src/staff/render.ts` | `renderStaff`: un `StaveNote` por measure, una voz, `applyAccidentals`, barras manuales (`barline`), digitación |
| `src/staff/grand-staff.ts` | Dos `Stave` por compás, `eventsByMeasure`, `fillGap`, tuplets, `joinVoices` y same-x para ambas manos |
| `src/staff/highlight.ts` | `createHighlightPlanner`: `activeIds` manda; si no, reclama una sola ocurrencia por MIDI |
| `src/components/Staff.tsx`, `GrandStaff.tsx` | `ResizeObserver`, zoom, texto accesible, `aria-busy`, `role=button` por nota |
| `src/content/score.ts` | `scoreKeySignature` (modo menor → `Am`), `scoreToMeasures`, `scoreToTimeline`, `barline`, dedos |
| `src/exercises/generators/note-staff.ts` | `STAFF_LINES`, `diatonicIndex`, `ledgerLineCount`, `describeStaffPosition` (fuente de la posición diatónica) |
| `src/schemas/notation.ts`, `src/schemas/content.ts` | `SpelledPitchSchema`, `NoteEventSchema`, `ScoreSchema`, `note-staff`, `KeyboardTask.demoScore` |

## 2. Reglas musicales de referencia (comprobar contra `diatonicIndex` y `y = 90 - línea*10`)

| Pentagrama | Líneas 1→5 | Espacios | Líneas adicionales |
| --- | --- | --- | --- |
| Sol (treble) | `E4, G4, B4, D5, F5` | `F4, A4, C5, E5` | `C4` = 1ª inferior; `D4` = espacio inferior; `A3` = 2ª inferior; `G5` = espacio superior; `A5` = 1ª superior |
| Fa (bass) | `G2, B2, D3, F3, A3` | `A2, C3, E3, G3` | `C4` = 1ª superior; `B3` = espacio superior; `F2` = espacio inferior; `E2` = 1ª inferior; `D2` = −0,5; `C2` = 2ª inferior |

- Fórmula: `line = 1 + 0.5 * (diatonicIndex(pitch) - diatonicIndex(lowLine))`, con `lowLine = E4` (sol) / `G2` (fa) y `diatonicIndex = octave*7 + índiceDeLetra`.
- **La alteración no cambia línea/espacio**: `C#4` y `Db4` están en el mismo sitio; solo cambian MIDI y el glifo.
- `ledgerLineCount = floor(distancia diatónica fuera del pentagrama / 2)`; el espacio adyacente (distancia 1) dibuja **0** líneas. En ejercicios, `NOTE_STAFF_MAX_LEDGER_LINES = {1:0, 2:1, 3:2}`.
- Armadura: `applyAccidentals([voice], keySignature)`; `scoreKeySignature()` debe devolver `Am`/`Cm`/… si `mode === 'minor'` (ADR-045: sin la `m`, La menor se dibujaba como La mayor).
- Compás: `beatsPerMeasure = numerator * (4/denominator)`; `event.beat` es **0-based** en `Score` (`scoreToTimeline`, `scoreToMeasures`), pero `attackingHandAt` y algunos campos de ejercicios (`hand-coordination`, `pedal`) son 1-based. Vigilar la conversión.
- Duración: `w,h,q,8,16,32`; puntillos ×1,5 / ×1,75; tresillo ×2/3 (`rhythmicValueBeats`). `barline` solo al cambiar de `measure`, nunca en el primero.
- Acordes: `pitches[]` van en el mismo `StaveNote`; los dedos se unen con `·` en el mismo orden de `pitches` (ojo: `fingeringFor` devuelve dedos en orden MIDI, no de escritura).
- Gran pentagrama: claves por mano (`right` treble salvo `bass` explícito, `left` bass salvo `treble` explícito), mismo `x` inicial = `max(getNoteStartX)`, mismo ancho por compás, `joinVoices([right,left])` → notas del mismo pulso con `|Δx| < 0,05`, cajas `data-box-*` dentro del ancho del compás ±0,5.
- Resaltado: `activeIds` gana sobre MIDI; una sola ocurrencia por altura reclamada; `PlaybackScopeProvider` (`src/audio/playback-scope.tsx`) impide que la misma nota se encienda en otra subpestaña/partitura (fix de `7891f1b`).

## 3. Invariantes que deben cumplirse (y cómo comprobarlos)

1. **`clef` se pasa a cada `StaveNote`** en `renderStaff` y en `createNote` del gran pentagrama. Sin él VexFlow trata todo como clave de sol y Do2 en fa se dibuja con líneas de más y se recorta (regresión de `docs/LOG.md:2287`).
2. **La altura del SVG es la calculada**, no fija: `verticalExtent` + `staveY = 34 + max(0, 8 - (34 + extent.top))` + `renderHeight = max(max(150,height), staveY + extent.bottom + 8)`; test con `C1` grave.
3. **Posición absoluta**: verificar en el SVG que `E4→y80`, `G4→y70`, `F5→y40` en sol; `G2→y80`, `A3→y40`, `C4→y30` en fa. Hoy solo se prueba la comparación relativa `C2` sol (más abajo) vs fa (más arriba): no des por buena una posición sin medirla.
4. **Líneas adicionales dibujadas**: contar los `rect`/glyphs de `ledger` frente a `ledgerLineCount`, no solo el texto del generador.
5. **Glifos de alteración**: comprobar el símbolo esperado por armadura (incluidas 15 armaduras) y que un `F#` en Re mayor no duplica el sostenido; hoy solo se verifica que "no lanza".
6. **Texto accesible coherente**: `aria-label` usa `midiNameWithOctave`, que **pierde la grafía** (`Bb4` se anuncia `A#4`, limitación en `docs/DECISIONES.md:1202`); `describeStaffNotes` une acordes con ` + ` y eventos con ` · `.
7. **Compases y solapes**: `ScoreSchema.superRefine` solo rechaza IDs duplicados. Comprueba a mano (o con un test) que no haya `beat >= beatsPerMeasure`, eventos solapados ni compases incompletos; `tests/content-m6-04.test.ts` y `m6-05` lo hacen **por voz**, no el validador global.
8. **Limitaciones conocidas que no son bugs nuevos**: `voice: 1..3` existe en el esquema pero los renderizadores lo ignoran (una voz por mano en gran pentagrama); `tieToNext` no se dibuja; en el pentagrama simple, puntillos y tresillos afectan al audio pero no se dibujan (`src/content/score.ts:22-24`); `ClefSchema` admite `grand` pero los componentes solo treble/bass.

## 4. Verificación

```bash
npm test -- tests/staff.test.tsx tests/grand-staff.test.tsx \
  tests/note-staff-generator.test.ts tests/staff-midi.test.tsx \
  tests/lesson-playback-scope.test.tsx tests/lesson-content.test.ts tests/theory-pitch.test.ts
npx vitest run tests/generators-fuzz.test.ts   # 500 ejercicios/clave: ≤2 adicionales, opciones únicas
npm run validate:content
npm run typecheck && npm test && git diff --check
```

Vecindad: `tests/content-m1-02.test.ts` y `tests/content-m0-02.test.ts` tienen las etiquetas accesibles canónicas de sol y fa; `tests/content-m5-11.test.ts` comprueba armaduras menores; `tests/grand-staff.test.tsx` la alineación bimanual con 4 piezas reales. Si el cambio es visible, aplica también la skill `interfaz-moderna`.

## 5. Regresiones históricas (no repetir)

- `docs/LOG.md:2287-2293`: Do2 en fa con líneas adicionales de más y recortado → falta de `clef` en `StaveNote` + altura fija.
- `docs/DECISIONES.md:1216-1225` (ADR-045): La menor dibujada con armadura de La mayor → `scoreKeySignature` sin `mode`.
- `docs/LOG.md:478`: límite alto de la clave de fa corregido a **La3** (no Sol3) y `usesLedgerLines` no cuenta el espacio adyacente.
- `7891f1b` (último commit): resaltado aislado por subsección + barras de compás y digitación en el pentagrama. **Aún no reflejado en `docs/`**: `ESTADO.md` sigue en `HEAD 58838d5`, `LOG.md` termina en F7-022 y las referencias de `AUDITORIA.md` a `grand-staff.ts`/`render.ts` quedaron desplazadas. Mencionarlo como `note` en el informe.

## 6. Formato del informe

Para cada nota o partitura: `archivo:índice de evento · clave/armadura/compás · posición esperada (línea, y, adicionales) · posición observada · clasificación`. Usa `error` si la nota cae en línea/espacio incorrecto o queda recortada, `warning` si la grafía/armadura es engañosa o el texto accesible no coincide, `note` si es una limitación documentada. Adjunta captura del SVG o el valor del atributo `data-*` que lo demuestra.

## Referencias rápidas

| Qué | Dónde |
| --- | --- |
| Render y medición | `src/staff/render.ts`, `grand-staff.ts`, `layout.ts`, `vex.ts`, `highlight.ts` |
| Conversión y esquemas | `src/content/score.ts`, `src/theory/pitch.ts`, `src/notation.ts`, `src/schemas/notation.ts` |
| Posición diatónica y ejercicios | `src/exercises/generators/note-staff.ts`, `content/lessons/m1-02.json`, `content/exercises/m1-02.c.json` |
| Resaltado por subsección | `src/audio/playback-scope.tsx`, `tests/lesson-playback-scope.test.tsx` |
| Decisiones e historial | `docs/DECISIONES.md` (ADR-002, ADR-045), `docs/LOG.md`, `docs/AUDITORIA.md` |
| Mapa técnico | skill `estructure` → `references/Estructure.md` §7 |
