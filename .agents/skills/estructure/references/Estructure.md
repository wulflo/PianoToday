# Estructure — índice técnico de Piano Today

> Mapa, no guía de cambio. Busca por símbolo (`grep -RIn "<símbolo>" src content scripts tests docs`); los números de línea son orientativos y se desplazan.
> Para el protocolo de trabajo, `docs/GUIA-CAMBIOS.md`; para decisiones, `docs/DECISIONES.md`; para tareas, `docs/CHECKLIST.md` (fuente de verdad).
> HEAD documentado en este índice: `7891f1b` (2026-11-23, «fix: aislar el resaltado por subsección y mejorar las partituras»). Nota: `docs/ESTADO.md` sigue apuntando a `58838d5`.

## Índice

1. Stack, configuración y comandos
2. Árbol de directorios y convenciones
3. Modelo de contenido e inventario
4. Esquemas Zod y validación
5. Cargadores de contenido, índices y localización
6. Enrutado, shell y páginas
7. Notación y pentagrama
8. MIDI
9. Audio
10. Ejercicios y generadores
11. Estado, progreso y persistencia
12. Componentes, estilos, temas e i18n
13. Scripts, auditorías y documentos generados
14. Pruebas (Vitest, Playwright, auditorías)
15. Documentación
16. Matriz funcionalidad → código
17. Glosario de formatos y convenciones
18. Estado actual y deudas conocidas

---

## 1. Stack, configuración y comandos

- **App**: Vite 8 + React 19 + TypeScript 7 (`strict`, `noEmit`, `moduleResolution: Bundler`, `verbatimModuleSyntax`, `noUnusedLocals/Parameters`), local-first con Dexie 4.4 (IndexedDB). Gestor **npm** (`package-lock.json` v3), Node ≥22.12.
- **Librerías clave**: `zod 4.6.7` (esquemas de contenido), `vexflow 5.0.0` (pentagrama SVG), `tonal 6.5.1` (teoría), `tone 15.1.22` (audio/samples), `ts-fsrs 6.0.0` (repaso), `vite-plugin-pwa` (service worker).
- `package.json` (`name: piano-desde-cero`, v0.1.0) — scripts:

| Script | Qué hace | Escribe |
| --- | --- | --- |
| `npm run dev` | Vite en desarrollo | — |
| `npm run typecheck` | `tsc --noEmit` (incluye `src`, `tests`, `e2e`, `scripts`) | — |
| `npm test` / `npm run test:watch` | `vitest run` / watch (jsdom + globals) | — |
| `npm run validate:content` | `tsx scripts/validate-content.ts`: Zod + reglas semánticas del bundle | — |
| `npm run build` | `validate:content && typecheck && vite build` | `dist/` |
| `npm run preview` | Sirve `dist/` en `:4173` | — |
| `npm run test:e2e` | `playwright test --project=chromium` (webServer = build + preview) | `test-results/` |
| `npm run index:content` | `build-course-index.ts` + `buildExerciseIndex` | `src/content/course-index.json`, `src/content/exercise-index.json` |
| `npm run budget` | build + `scripts/check-bundle.mjs` (límite de tamaño) | `dist/` |
| `npm run fetch:samples` / `:dry` | Descarga/verifica las 30 muestras | `public/audio/samples/` |
| `npm run audit:audio` / `licenses` / `code` / `text` / `reuse` | Auditorías parciales | `docs/AUDITORIA.md` (agregado) |
| `npm run audit` | `scripts/audit-all.ts`: audio + licenses + code + text | `docs/AUDITORIA.md` |
| `npm run licenses:dependencies` | Inventario desde `package-lock.json` | `docs/DEPENDENCIAS-LICENCIAS.md` |
| `npm run estado` | Regenera el estado tras typecheck/test/build | `docs/ESTADO.md` |

- `vite.config.ts`: `base = VITE_BASE ?? '/'`, React, `VitePWA({registerType:'autoUpdate', manifest:false, navigateFallback:'index.html', runtimeCaching audio CacheFirst 64/30d})`, target `es2022`, `chunkSizeWarningLimit 1200`.
- `vitest.config.ts`: `environment:'jsdom'`, `globals:true`, `setupFiles: ['./src/test/setup.ts']`, alias `virtual:pwa-register/react`, include `tests/**/*.test.{ts,tsx}` y `src/**/*.test.{ts,tsx}`, timeout 20 s.
- `playwright.config.ts`: `testDir:'e2e'`, `BASE_URL=http://127.0.0.1:4173`, proyectos `chromium|firefox|webkit`, `workers:1`, trace en fallo.
- `.github/workflows/deploy-pages.yml`: `npm ci`, typecheck+test, `npm run build` con `VITE_BASE`, publica `dist/` en Pages. `e93acae` evita GitHub Deployments por privacidad.

## 2. Árbol de directorios y convenciones

```
content/                     # FUENTE de verdad del contenido (JSON versionado)
  modules.json, skills.json
  lessons/mX-YY.json         # 79
  exercises/*.json           # 720 (dos convenciones de nombre, ver §5)
  repertoire/*.json          # 28
src/
  main.tsx, App.tsx, styles.css
  content/                   # cargadores, índices, localización, score, validate
  schemas/                   # 11 esquemas Zod + barrel index.ts
  router/                    # hash-route.ts, useHashRoute.ts
  pages/                     # 11 páginas
  components/                # componentes reutilizables
  midi/ audio/ staff/ exercises/ keyboard/ theory/ songs/ repertoire/ state/ test/
scripts/                     # índices, auditorías, muestras, estado, bundle
tests/                       # ~266 archivos .test.ts/.test.tsx + fixtures/ + helpers/
e2e/                         # 6 specs (10 tests)
docs/                        # 13 .md (Checklist y Log son bitácoras largas)
public/                      # audio/samples/ (30 MP3), icons/, manifest.webmanifest
assets/audio/manifest.json   # manifiesto con autor/licencia/SHA-256
LICENSE, LICENSE-CONTENT, LICENSES/, REUSE.toml, THIRD_PARTY_LICENSES.md
dist/, test-results/         # ignorados por git
```

- Nombres: archivos y símbolos en kebab-case; tests junto a la raíz de `tests/` con sufijo `.test.ts(x)`. Componentes: `export interface <Nombre>Props` + `export function <Nombre>` en `src/components/<Nombre>.tsx`.
- Textos de UI siempre con `useSettings().t(...)` de `src/state/settings.tsx` (ES/EN); no literales en componentes.
- Estilos: **un solo archivo** `src/styles.css` (≈3.564 líneas), importado en `src/main.tsx:4`. No hay Tailwind, CSS-in-JS ni fuentes descargadas.

## 3. Modelo de contenido e inventario

| Entidad | Archivo | Campos clave |
| --- | --- | --- |
| Módulo | `content/modules.json` | `id` (`M0`…`M8`), `order`, `titleEs/En`, `summaryEs/En`, `optional` (solo M8) |
| Lección | `content/lessons/mX-YY.json` | `id = lesson.mX-YY`, `moduleId`, `slug`, `titleEs`, `summaryEs`, `objectivesEs` (≥1), `minutes` 3-20, `sections` (≥1); opcionales `titleEn/summaryEn/objectivesEn`, `optional`, `prerequisites`, `skillIds`, `exerciseIds`, `glossary`, `keyboardTask`, `contentLicense`, `status` (`draft`\|`published`, default `draft`) |
| Sección | dentro de `sections[]` | `id`, `kind ∈ text\|keyboard\|score\|audio\|callout\|exercise`, `titleEs/En`, `bodyEs/En`, `score`, `keys[]`; exige `bodyEs` **o** `score` **o** `keys` |
| Tarea de teclado | `keyboardTask` | `titleEs`, `instructionsEs`, `keys` (≥1), `checklistEs` (≥3); opcionales `titleEn/instructionsEn/checklistEn/fingeringEs/En`, `tempoBpm` 30-240 (default 60), `demoScore` |
| Glosario | `glossary[]` | `term` (uno de 20 términos italianos), `category`, `meaningEs/En`, `exampleEs/En` |
| Ejercicio | `content/exercises/*.json` | `id`, `skillId`, `promptEs/En`, `explanationEs/En`, `difficulty` 1-5, `optional`, `choices/choicesEn` 2-8; unión discriminada por `type` (~50 variantes) |
| Habilidad | `content/skills.json` | `SkillItemSchema`, `lessonIds`, `kind`, parámetros |
| Pieza | `content/repertoire/*.json` | `RepertoirePieceSchema`: ficha `license` obligatoria + `hands.right\|left\|both` con `Score` |

**Inventario verificado**: 9 módulos, 79 lecciones (todas `published`, 6 opcionales: `m5-10`, `m5-11`, `m8-01`…`m8-04`), 720 ejercicios, 67 habilidades (62 con ejercicios), 28 piezas. Distribución `M0:6 M1:12 M2:12 M3:5 M4:12 M5:11 M6:6 M7:11 M8:4`. Secciones: 474 (texto 236, partitura 131, ejercicio 74, callout 23, audio 6, teclado 4).

## 4. Esquemas Zod y validación

`src/schemas/index.ts` reexporta 11 módulos; **no hay `schemas/midi.ts`** (los tipos MIDI son interfaces TS).

| Módulo | Símbolos |
| --- | --- |
| `primitives.ts` | `IdSchema`, `LocaleSchema`, `ThemePreferenceSchema` |
| `notation.ts` | `StepSchema`, `AccidentalSchema`, `SpelledPitchSchema` (octava −1..9), `KeySchema`, `MODE_VALUES`, `ScaleModeSchema`, `CHORD_QUALITY_VALUES`, `RhythmicValueSchema`, `RhythmCellSchema`, `TimeSignatureSchema`, `ClefSchema` (`treble\|bass\|grand`), `HandSchema`, `NoteEventSchema`, `PedalMarkSchema`, `ScoreSchema`, `NotationPreferenceSchema` |
| `content.ts` | `MODULE_IDS`, `ModuleSchema`, `LessonSectionSchema`, `KeyboardTaskSchema`, `ITALIAN_TERM_VALUES/CATEGORIES`, `GlossaryEntrySchema`, `LessonSchema`, `PhraseSegmentSchema`, `FormSectionSchema`, `ExerciseSchema` (unión ~50 tipos), `SoundExampleSchema`, `ContentBundleSchema` (`version:1`) |
| `course-index.ts`, `exercise-index.ts` | Índices compactos commiteados (`schemaVersion 1`); `superRefine` verifica que todo `lessonIds` exista |
| `license.ts` | `MIN_PUBLIC_DOMAIN_YEARS=100`, `LicenseKindSchema`, `ComposerSchema`, `LicenseFicheSchema` (>100 años desde muerte salvo tradicional anónima) |
| `repertoire.ts` | `TempoProgressionSchema`, `RepertoirePieceSchema` |
| `skill.ts`, `progress.ts`, `audio.ts`, `song.ts` | Habilidades; `ReviewRating/FsrsCard/ReviewLog/LessonProgress/Settings/ProgressEnvelope` (SHA-256); `AudioManifestSchema` (30 muestras, CC BY 3.0); `UserSongSchema` (`source: midi\|manual`) |

`validateContentBundle()` (`src/content/validate.ts`): parsea con `ContentBundleSchema.safeParse`, detecta IDs duplicados y orden de módulo, referencias rotas (`moduleId`, prerrequisitos, skills, exerciseIds, `skills[].lessonIds`), ejercicios huérfanos, ES/EN de publicadas con longitudes iguales y validaciones semánticas por tipo de ejercicio (índices, respuesta entre opciones, compases, BPM, velocity). **No valida**: profundidad del texto, mínimo de ejercicios por lección, existencia de `demoScore` o glosario, posición de notas en el pentagrama, compases completos globalmente (solo en tests concretos M6-04/05).

## 5. Cargadores de contenido, índices y localización

| Archivo | Símbolos |
| --- | --- |
| `src/content/course.ts` | `COURSE_INDEX`, `COURSE_MODULES`, `COURSE_LESSONS`, `COURSE_LESSON_GRAPH`, `findCourseLesson`, `findCourseModule`, `lessonsForModule` |
| `src/content/lessons.ts` | `import.meta.glob('../../content/lessons/*.json')`, `LESSON_ID_PATTERN`, `lessonContentPath`, `hasLessonContent`, `loadLesson` |
| `src/content/exercises.ts` | `exerciseContentPaths` (prueba `ex.m2-07.a.json`, `m1-01.a.json` y `m0-01.json` compartido), `hasExerciseContent`, `loadExercise`, `loadExercises` |
| `src/content/exercise-catalog.ts` | `loadExerciseIndex()` con caché, `pickExercisesForSkills`, `pickExerciseIdsForSkills`, `DEFAULT_PER_SKILL=3` |
| `src/content/repertoire.ts` | `repertoireContentPaths`, `loadRepertoirePiece`, `loadAllRepertoirePieces` |
| `src/content/skills.ts` | `CONTENT_SKILLS`, `findContentSkill` |
| `src/content/score.ts` | `scoreToMeasures`, `scoreToTimeline`, `spelledPitchToMidi`, `scoreKeySignature`, `attackingHandAt`, `scoreForHand`, `pedalWindows`, `rhythmicValueBeats`, `fingerAt`, `fingeringFor` |
| `src/content/localize.ts` | `pickLocalized`, `pickLocalizedList`, `lessonTitle/Summary/Objectives`, `sectionTitle/Body`, `taskTitle/Instructions/Fingering/Checklist`, `glossaryMeaning/Example`, `exercisePrompt/Explanation/Choices`. Sin EN cae al ES; listas solo si la longitud coincide |
| `src/content/style-map.ts` | `STYLE_MAP`: 4 lecciones opcionales de M8 y su pieza original |
| `src/content/diagnostic.ts` | `DIAGNOSTIC_ITEMS` (8), `DIAGNOSTIC_BANDS`, `scoreDiagnostic` |

Índices generados (commiteados, regenerar con `npm run index:content`): `src/content/course-index.json` (9 módulos/79 lecciones, solo metadatos) y `src/content/exercise-index.json` (720 entradas `{id, skillId, difficulty}`). Convención de ejercicios no uniforme: `ex.m3-01.a…l`, `m1-01.a…h`, `m0-01.json` compartido por `ex.m0-01.a`.

## 6. Enrutado, shell y páginas

- `src/router/hash-route.ts`: `parseHash(hash): AppRoute`, `routeHash`, `routeTitleKey`, `isNavActive`, `NAV_ITEMS` (7 entradas). Constantes: `#/curso`, `#/demo`, `#/practica`, `#/repaso`, `#/progreso`, `#/ajustes`, `#/repertorio`, `#/canciones`, `#/atribuciones`; constructores `lessonHash()`, `pieceHash()`. `AppRoute` incluye `not-found`. `useHashRoute.ts` usa `useSyncExternalStore` + `hashchange`.
- `src/App.tsx`: `RouteView` (switch), `AppShell`, `App({databaseName})`. Orden de providers: `SettingsProvider → MidiProvider → ProgressProvider → SettingsPersistence → AppShell`. DOM: `.app-shell > a.skip-link + header.site-header (brand + nav aria-label) + MidiStatusBar + PwaStatus + ScrollControls + ErrorBoundary(key=routeKey) > #main-content[tabIndex=-1] > RouteView + footer.site-footer`. Efectos: `document.documentElement.lang`, `data-theme` (con rama `system`), `accentTokens(settings.accentColor, dark)` como CSS vars, `document.title` por ruta.
- `src/components/ScrollControls.tsx`: dos botones fijos abajo a la derecha, apilados, con chevrons en `--accent`; respeta `prefers-reduced-motion`. Estilos `.scroll-controls`/`.scroll-control`. Claves `scroll.*` en `src/state/settings.tsx`.
- `src/pages/*.tsx` (11): `CoursePage`, `LessonPage`, `PiecePage`, `RepertoirePage`, `SongsPage`, `PracticePage`, `ReviewPage`, `ProgressPage`, `SettingsPage`, `AttributionsPage`, `NotFoundPage`. Convención: `<main className="page …" aria-labelledby="…">`, `<section className="hero">`, un solo `<h1 id=…>`, `<p className="page-actions">`.
- `LessonPage.tsx`: `findCourseLesson` → `useCourseProgress()`/`computeLessonUnlocks` → bloqueo o `loadLesson()` → `<LessonPlayer>` → `completeLesson` y nav anterior/siguiente. Ajuste `unlockAllLessons` en `SettingsPanel.tsx` (`b1bc6f1`).

## 7. Notación y pentagrama

- Render **VexFlow 5.0.0** (ADR-002), importación dinámica (`await import('vexflow')`) y backend SVG; no canvas. Flujo: JSON → `Score`/`NoteEvent` → `spelledPitchToPitch` (`src/theory/pitch.ts`) → `pitchToVexKey` (`src/staff/vex.ts`, `C4→c/4`) → `VF.StaveNote` → SVG.
- `src/staff/render.ts`: `StaffMeasure` (`pitches`, `duration`, `highlighted`, `pedalPress/Release`, `chordSymbol`, `finger/fingers`, `barline`), `renderStaff`: `verticalExtent` → `staveY` → `VF.Stave` con `addClef/addKeySignature/addTimeSignature` → una voz `setStrict(false)` → `applyAccidentals([voice], keySignature)` → barras manuales con `VF.Barline` → atributos `data-staff-note`, `data-midi`, `data-highlighted`, `data-x`, `data-box-*`, `role=button`, `aria-label`. `describeStaffNotes` da el texto accesible.
- `src/staff/layout.ts`: `LINE_SPACING=10`, `NOTE_BASE=90`, `STEM_PADDING=42`, `NOTE_PADDING=18`, `CHORD_SYMBOL_PADDING=34`, `PEDAL_PADDING=24`, `FINGER_PADDING=18`; `verticalExtent` usa `getLineNumber(false/true)` para no recortar.
- `src/staff/grand-staff.ts`: constantes `GRAND_STAFF_MIN_MEASURE_WIDTH=110`, `GRAND_STAFF_SYSTEM_HEIGHT=190`; `grandStaffLayout`, `distributeMeasureWidths`, `eventsByMeasure`, `buildHandVoice`, `fillGap` (silencios + `GhostNote`), `tripletChunks`/`VF.Tuplet`, `measureMinWidth` (con accidentales aplicados **antes** de medir), `systemRanges`, `renderGrandStaff`. Alineación: `noteStartX = max(top.getNoteStartX, bottom.getNoteStartX)` y `Formatter().joinVoices([right,left])` → mismo pulso con `|Δx|<0,05`.
- `src/staff/highlight.ts`: `createHighlightPlanner`: gana el `activeIds`, si no se reclama una altura por MIDI para no encender repeticiones. `src/audio/playback-scope.tsx` (nuevo en `7891f1b`) aísla el resaltado por subsección: `PlaybackScopeProvider`, `SectionScopeProvider`, `useSectionScope`, `useScopedPlayback`, `useScopedActiveIds`.
- Reglas musicales: sol = líneas `E4 G4 B4 D5 F5`, espacios `F4 A4 C5 E5`, `C4` 1ª adicional inferior; fa = líneas `G2 B2 D3 F3 A3`, espacios `A2 C3 E3 G3`, `C4` 1ª adicional superior. `diatonicIndex = octave*7 + índiceLetra`; la alteración **no** cambia la línea. `ledgerLineCount = floor(distancia/2)`; el espacio adyacente cuenta 0. `scoreKeySignature()` añade `m` en modo menor (ADR-045). `beat` 0-based en `Score`, 1-based en `attackingHandAt` y algunos ejercicios.
- Limitaciones documentadas: `voice 1..3` no se usa en el render; `tieToNext` no se dibuja; puntillos/tresillos no se dibujan en el pentagrama simple (`src/content/score.ts:22-24`); `aria-label` usa `A#4` en vez de `Bb4` (`docs/DECISIONES.md:1202`); `ClefSchema` admite `grand` pero los componentes solo treble/bass.
- Regresiones históricas: `StaveNote` sin `clef` (Do2 en fa mal puesto/recortado, `docs/LOG.md:2287`), altura fija del SVG, armadura mayor en modo menor, límite alto de fa corregido a La3.

## 8. MIDI

- **Entrada** en `src/midi/*` (la salida es `src/audio/*`); no hay ruta MIDI→Tone.js.
- `detect.ts`: `isWebMidiSupported`, `requestMidiAccess()` con `{sysex:false}`, `getMidiPermissionState`, `describeMidiFailure`, `currentSecureContext`. `failure.ts`: 6 `MidiFailureKind` (`unsupported`, `insecure-context`, `permission-denied`, `permission-dismissed`, `addon-required-or-no-device`, `unknown`), `classifyMidiFailure` (ADDON antes que SecurityError), `isPermissionDeniedFailure`.
- `context.tsx`: `MidiProvider`, `useMidi`, `MidiStatus`, `MAX_MIDI_EVENTS=1024`, `heldNotes`, `events`, `lastRaw` (descarta `>=0xf0`), `subscribe()` para tomas largas, autoconexión solo si `permission==='granted'`, reconexión en `focus`/`visibilitychange` y `PermissionStatus.onchange`.
- `input.ts`: `connectMidiInput`, `listInputs/listOutputs`, `onmidimessage` en todas las entradas, `onstatechange` (hot-plug), `input.open()` explícito, `disconnect()`. No escribe a salidas.
- `device.ts`: `parseMidiMessage` solo `0x90`/`0x80` (velocity 0 = off), ignora sistema/CC/pitch bend; `detectDeviceProfile` (Yamaha PSR-373), `midiNoteName` (C4=60).
- `browser.ts`: `detectBrowserFamily` por características (`window.chrome`, `InstallTrigger`, `webkitAudioContext`, brands) — la familia solo elige textos, nunca bloquea. `permissions.ts`: `permissionHelpFor`, URLs verificadas `chrome://`, `brave://`, `opera://`; extensión Safari verificada; guía iOS/Firefox Android.
- `feedback.ts`/`tempo.ts`/`exercise-attempt.ts`: `evaluateMidiPerformance` (`accuracy=matched/max(expected,played)`, `even` si σ velocity ≤16), `estimateTempo` (IOI mediana, 30-300 BPM), `evaluateRhythm` (`RHYTHM_TOLERANCE_MS=80`, `steady` si ≥0,8), `taskExpectedStrikes` (usa `demoScore` o `keys`, normaliza timestamps restando el primer onset).
- UI: `MidiDiagnostics.tsx` (panel + «Copiar informe» sin UA), `MidiPermissionFlow.tsx` (confirmación en línea y ayuda por categoría), `MidiStatusBar.tsx`, `MidiSupportNotice.tsx`. Helpers: `tests/helpers/fake-midi.ts`.
- ADR-048/049: rutas verificadas, familia por características; el teclado de ordenador **no** se puentea al canal MIDI (F7-009 descartado). Matriz real en `docs/QA-NAVEGADORES.md`: Chromium y Firefox (con mocks) OK, WebKit no ejecutable, PSR-373 físico pendiente (P2).

## 9. Audio

- `engine.ts`: `AudioEngine`, `Scheduler`, `playTimeline` (`lookaheadSeconds=0,15`, `tickMs=25`), `noteOn/noteOff` con `Map` de sostenidos, metrónomo, `stop()/dispose()`. No crea `AudioContext` hasta `ensureStarted()` en un gesto.
- `adapter.ts`: `createToneAdapter()`, `loadSampler` con timeout 6.000 ms → cae a `PolySynth` si falla; `midiToToneName` (C4=60).
- `sampler.ts`: `readSampleManifest` (Zod, `null` si roto), `sampleUrls`, `loadSampleConfig`, `audioCredits` (créditos derivados del manifiesto). `assets/audio/manifest.json`: `instrument:'salamander-grand-piano'`, CC BY 3.0, `expectedSamples:30`. Presupuesto <150 MB, ~2 MB reales.
- `notes.ts`: `TimelineEvent {time,duration,midis,label}`, `CHORD_STYLES`, `clampTempo`, `noteTimeline`, `intervalTimeline`, `scaleTimeline`, `chordTimeline`, `timelineDuration`, `shiftTimeline`.
- `playback-scope.tsx`: aísla audio/resaltado por subsección (ver §7). `useAudioEngine.ts` mantiene el engine con `useRef` y hace `dispose()` al desmontar.

## 10. Ejercicios y generadores

- `ExerciseSchema` (`src/schemas/content.ts`): unión discriminada por `type` (~50): `note-keyboard`, `note-staff` (`target`, `clef`, `choices`), `chord`, `interval`, `ear-melody`, `melody-dictation`, `chord-dictation`, `style-pattern`, `hand-coordination`, `pedal`, `sight-reading`, `worked-example`, `augmented-sixth`, `progression-*`, `alberti`, `arpeggiated`, `stride`, `walking`, `accompaniment`, análisis de frase/forma/textura/contrapunto, etc.
- Generadores en `src/exercises/generators/`: `note-staff.ts` (`STAFF_LINES`, `diatonicIndex`, `ledgerLineCount`, `describeStaffPosition`, `generateNoteStaffExercise` con `safeParse`), `note-keyboard.ts`, `sight-reading.ts`, `worked-example.ts` (`clefFor` elige fa si MIDI <60). Lógica de lotes duplicada entre `note-staff` y `note-keyboard` (registrada en `docs/AUDITORIA.md`).
- Resolución y feedback: `src/exercises/answer.ts`, `distractors.ts`, `audio.ts`, `playback.ts`, `worked-example.ts`, `ornament-labels.ts`, `formats.ts`, `pedal.ts`. `src/content/exercise-catalog.ts` elige ejercicios por skill (`DEFAULT_PER_SKILL=3`).
- `ExercisePlayer.tsx` usa `AudioEngine.playTimeline` + `useSectionScope`, dictados, FSRS y «Recordá» (`resolvePedagogicalFeedback`, `buildWorkedExample`). **No importa `useMidi`**: es audio de salida, no diagnóstico de entrada.

## 11. Estado, progreso y persistencia

- `src/state/progress-context.tsx`: `ProgressProvider` (abre Dexie una vez, estados `loading|ready|error`, `reload()`), `useProgress()`; `databaseName` aisla tests.
- `src/state/db.ts` + `repositories.ts` + `migrations.ts`: tablas y progreso en IndexedDB; `SettingsPersistence` en `App.tsx`.
- `lesson-progress.ts`: `computeLessonUnlocks`, `loadLessonUnlocks`, `startLesson`, `completeLesson`, `LessonLockedError`, `UnknownLessonError`, `DEFAULT_MASTERY_THRESHOLD=0,8`.
- `course-progress.ts`: `summarizeCourse`, `CourseModuleStatus` (incluye `empty`), `nextLessonId`. `daily-queue.ts`: `buildDailyQueue`, vencidos primero, `newPerDay`, `mixKinds`.
- Repaso: `fsrs.ts`/`fsrs-settings.ts` (ts-fsrs), `review-day.ts`, `review-history.ts`, `rating.ts`, `exercise-attempt.ts`, `practice-log.ts`, `practice-plan.ts`, `practice-timer.ts`, `progressive-metronome.ts`, `load-forecast.ts`.
- Exportación/importación: `progress-export.ts`, `progress-import.ts`, `optimizer-export.ts`, `progress-folder.ts`, `progress-reset.ts`.
- Ajustes: `settings.tsx` (`DEFAULT_SETTINGS.theme='light'`, `ACCENT_COLORS` 10, `SETTINGS_STORAGE_KEY='pdc.settings.v1'`; `normalizeSettings()` colapsa `system` a `light`), `accent.ts` (`accentTokens` con luminancia WCAG), `settings-record.ts`, `tab-selection.ts` (persistencia de subpestañas), `state/accent.ts`.

## 12. Componentes, estilos, temas e i18n

- Componentes en `src/components/` (ver §16 para cuáles). Convención: props tipadas, `useId()` para ARIA, `hidden` en paneles inactivos, texto vía `t()`.
- `Tabs.tsx`: `TabItem {id,label,content}`, `TabsProps {label,items,initialSelected?,persistKey?}`, roving `tabIndex`, `ArrowLeft/Right/Home/End`, ids ARIA, persistencia en `src/state/tab-selection.ts`. Usado en `CoursePage`, `SettingsPage`, `LessonPlayer`.
- `Keyboard.tsx`: `heldNotes` del contexto + notas del scope (`sourcesRef: Map<midi,Set<string>>` por `key:`/`pointer:`/`button:`), mapa `DEFAULT_COMPUTER_KEY_MAP` (blancas A–L, negras W–P), ignora `repeat`/modificadores/campos de texto, `releaseAll` en blur.
- `GrandStaff.tsx`/`Staff.tsx`: `ResizeObserver`, zoom, `aria-label` con descripción textual, `aria-busy`, `role=alert` en error.
- `src/styles.css` (3.564 líneas): tokens en `:root` (`--bg-*`, `--surface-*`, `--text/--muted/--border/--outline*`, `--accent/--primary*`, `--success*`, `--error*`, `--staff-*`, `--piano-*`, `--radius-*`, `--space-1..8`, `--elev-1/2/3`, `--motion-fast/base/slow`, `--ease-out`, `--touch-min:2.75rem`). Temas: claro por defecto, `@media (prefers-color-scheme:dark) :root:not([data-theme='light'])` y `:root[data-theme='dark']`. Capas acumuladas F6-034/F6-037/F7-013…017 con selectores duplicados (`.app-shell`, `.brand`, nav activa, `body`).
- Accesibilidad: skip-link, `:focus-visible`, `aria-current`, targets `--touch-min`, `prefers-reduced-motion` (global con `!important`); tests axe en `tests/a11y.test.tsx` y hermanos. Sin `prefers-contrast`/`forced-colors`. Ver skill `interfaz-moderna`.
- i18n: diccionarios ES/EN en `src/state/settings.tsx` (claves `app.*`, `midi.*`, `lesson.*`, etc.), `tests/i18n-parity.test.ts`, `document.documentElement.lang`.

## 13. Scripts, auditorías y documentos generados

| Script | Uso |
| --- | --- |
| `scripts/validate-content.ts` + `lib/load-content.ts` | Gate de contenido (solo lectura) |
| `scripts/build-course-index.ts`, `lib/course-index.ts`, `lib/exercise-index.ts` | Regeneran los dos índices |
| `scripts/estado.mjs` | Escribe `docs/ESTADO.md` |
| `scripts/audit-all.ts`, `audit-code.ts`, `audit-licenses.ts`, `audit-text-similarity.mjs`, `lib/audit-summary.ts`, `lib/code-audit.ts`, `lib/license-audit.ts` | Auditorías; `audit-all` escribe `docs/AUDITORIA.md` |
| `scripts/verify-audio.mjs`, `fetch-samples.mjs`, `generate-dependency-licenses.mjs`, `third-party-licenses.mjs`, `check-bundle.mjs` | Muestras, inventario de licencias y presupuesto |

`docs/ESTADO.md` y `docs/DEPENDENCIAS-LICENCIAS.md` son generados: no editar a mano. `docs/AUDITORIA.md` refleja audio OK (30 muestras), licencias OK, código OK y texto **NO VERIFICABLE** (falta `refs/`, ignorado). `docs/PRUEBAS-MANUALES.md` P1 audio, P2 PSR-373, P3 Safari, P4 iOS, P5 Android: pendientes de humano.

## 14. Pruebas (Vitest, Playwright, auditorías)

- `tests/` (~266): puros y de componentes; 79 tests `tests/content-mX-YY.test.ts` (uno por lección; `content-m5-01.test.ts` es el estándar alto, `content-m2-12.test.ts` el más débil), `tests/content-m0-m2-validation.test.ts`, `tests/content-schema.test.ts`, `tests/course-index.test.ts`, `tests/exercise-index.test.ts`, `tests/lesson-content.test.ts`.
- Pentagrama: `staff.test.tsx`, `grand-staff.test.tsx`, `note-staff-generator.test.ts`, `generators-fuzz.test.ts` (500 ejercicios), `staff-midi.test.tsx`, `lesson-playback-scope.test.tsx`, `theory-pitch.test.ts`.
- MIDI: `midi-detect`, `midi-input`, `midi-browser`, `midi-failure`, `midi-permissions`, `midi-device`, `midi-tempo`, `midi-feedback`, `midi-exercise-attempt`, `midi-context`, `midi-permission-flow`, `midi-firefox-flow`, `midi-webkit-flow`, `midi-diagnostics`, `midi-diagnostics-copy`, `midi-support-notice`, `keyboard-midi`, `keyboard-task-midi`, `song-recorder`.
- Licencias: `licenses`, `public-domain`, `licencias-doc`, `reuse`, `audit-licenses`, `dependency-licenses`, `verify-audio`, `attributions-credits`, `repertoire-license` y una por pieza.
- UI/a11y: `a11y`, `analysis-a11y`, `auditory-a11y`, `keyboard-navigation`, `reduced-motion`, `theme`, `i18n-parity`, `tabs`, `readme`, `f7-theme-metadata`.
- `e2e/` (6 specs, 10 tests): `lesson-exercise-review`, `m3-m4-lesson-review`, `m5-m6-lesson-review`, `midi-permissions` (4), `pwa-offline`, `repertoire`. Sin `toHaveScreenshot()`: las capturas F7-018 son ad-hoc en `test-results/` (ignorado).
- Verificación estándar: `npm run typecheck && npm test && npm run build && git diff --check`; añadir `npm run budget` si cambia el bundle y `npm run validate:content` si cambia contenido. Los E2E compilan `dist/`, no el dev server.

## 15. Documentación

| Archivo | Contenido |
| --- | --- |
| `README.md` | 262 líneas, en inglés: público, contenidos, quick start, matriz MIDI (139-153), limitaciones (157-167), PWA, accesibilidad, comandos, estado. URL `wulflo.github.io/PianoToday/` |
| `CONTRIBUTING.md` | Checklist-first, DCO, prohibición de pegar texto/audio/partituras de terceros, ficha obligatoria |
| `CHANGELOG.md` | Entradas `[Fase 0]`…`[Fase 7]` (F7 sin tag) |
| `docs/CHECKLIST.md` | 1.821 líneas, fuente de verdad de tareas. PUNTO `F7-023 [~]` (separar tarjetas y uniformar primera fila); `F6-054 [ ]` (pruebas manuales) |
| `docs/GUIA-CAMBIOS.md` | Protocolo: marcar `[~]`, verificar, commit atómico, cerrar `[x]`, actualizar `LOG`/`ENTORNO`, regenerar `ESTADO` |
| `docs/DECISIONES.md` | ADR-001…050. ADR-002 VexFlow, ADR-011 PD, ADR-026/027 tema y contraste, ADR-029 (10 lecciones M2 sin `demoScore`), ADR-045 armadura menor, ADR-046 REUSE, ADR-048/049 MIDI, ADR-050 brief visual |
| `docs/DIAGNOSTICO-MIDI.md` | Escenarios A-G, tabla causa→síntoma→corrección e hipótesis H1-H5 no verificadas en hardware |
| `docs/ENTORNO.md`, `docs/LOG.md` (2.675 líneas), `docs/RESUME.md` (1.006) | Entorno, bitácora y resumen (RESUME conserva URL vieja `piano-learning`) |
| `docs/ESTADO.md` | Generado; 326/330 tareas, tarea actual F6-054, HEAD `58838d5` (desincronizado) |
| `docs/LICENCIAS.md`, `docs/DEPENDENCIAS-LICENCIAS.md`, `docs/AUDITORIA.md` | Licencias de contenido/dependencias y resultados de auditoría |
| `docs/PRUEBAS-MANUALES.md`, `docs/QA-NAVEGADORES.md` | P1-P5 y matriz multi-navegador (Chromium 8/8, Firefox 7/7, WebKit no ejecutable) |

## 16. Matriz funcionalidad → código

| Funcionalidad | Dónde está |
| --- | --- |
|Índice de curso y desbloqueo | `src/content/course.ts`, `src/state/lesson-progress.ts`, `src/pages/CoursePage.tsx` |
| Cargar una lección | `src/content/lessons.ts` (`loadLesson`), `src/pages/LessonPage.tsx` |
| Pestañas de la lección | `src/components/LessonPlayer.tsx`, `Tabs.tsx`, `src/state/tab-selection.ts` |
| Tarea de teclado y demo | `src/components/KeyboardTask.tsx`, `src/midi/exercise-attempt.ts` |
| Ejercicio y feedback | `src/components/ExercisePlayer.tsx`, `src/exercises/*`, `src/state/fsrs.ts` |
| Sugerencias por skill | `src/components/ExerciseSuggestions.tsx`, `src/content/exercise-catalog.ts` |
| Pentagrama simple / gran pentagrama | `src/staff/render.ts` / `grand-staff.ts`, `src/components/Staff.tsx` / `GrandStaff.tsx` |
| Aislar resaltado por subsección | `src/audio/playback-scope.tsx` (7891f1b) |
| Permiso y diagnóstico MIDI | `src/midi/detect.ts`, `failure.ts`, `permissions.ts`, `src/components/MidiDiagnostics.tsx` |
| Entrada MIDI y notas sostenidas | `src/midi/input.ts`, `context.tsx`, `device.ts` |
| Grabar una canción desde MIDI | `src/components/SongRecorder.tsx`, `src/songs/recorder.ts` |
| Reproducción con samples | `src/audio/engine.ts`, `adapter.ts`, `sampler.ts` |
| Repertorio y ficha de licencia | `src/content/repertoire.ts`, `src/repertoire/license.ts`, `public-domain.ts`, `src/pages/AttributionsPage.tsx` |
| Progreso, repaso y cola diaria | `src/state/progress-context.tsx`, `db.ts`, `fsrs.ts`, `daily-queue.ts`, `course-progress.ts` |
| Ajustes, tema y acento | `src/state/settings.tsx`, `accent.ts`, `src/components/SettingsPanel.tsx`, `src/styles.css` |
| Navegación y título | `src/router/hash-route.ts`, `useHashRoute.ts`, `src/App.tsx` |
| PWA / offline | `vite.config.ts`, `src/components/PwaStatus.tsx`, `public/manifest.webmanifest` |
| Atajos de desplazamiento | `src/components/ScrollControls.tsx`, `src/styles.css` (`.scroll-controls`) |
| Validación de contenido | `src/content/validate.ts`, `src/schemas/*`, `scripts/validate-content.ts` |
| Auditoría y estado | `scripts/audit-*.ts`, `scripts/estado.mjs`, `docs/AUDITORIA.md`, `docs/ESTADO.md` |

## 17. Glosario de formatos y convenciones

| Término | Significado |
| --- | --- |
| `lesson.mX-YY` | ID de lección; archivo `content/lessons/mX-YY.json` |
| `ex.mX-YY.a` / `mX-YY.a` / `m0-01` | Tres convenciones de nombre de ejercicio (`src/content/exercises.ts` prueba las tres) |
| `Score` | Partitura: `clef`, `key`, `mode`, `timeSignature`, `tempoBpm`, `events[]`, `pedals[]` |
| `NoteEvent` | `id`, `measure` (≥1), `beat` (0-based), `value`, `pitches[]` 1-8, `hand`, `voice` 1-3, `velocity`, `tieToNext` |
| `SpelledPitch` | `{step, accidental, octave}`; C4 = MIDI 60; octava −1..9 |
| `beat` 0-based vs 1-based | `Score` usa 0-based; `attackingHandAt` y algunos ejercicios usan 1-based |
| `diatonicIndex` | `octave*7 + índiceDeLetra`; determine línea/espacio, no la alteración |
| `ledgerLineCount` | `floor(distancia diatónica fuera del pentagrama / 2)` |
| `RHYTHM_TOLERANCE_MS` | 80 ms; `steady` si accuracy ≥0,8 |
| `MAX_MIDI_EVENTS` | 1.024 en `MidiProvider`; `subscribe()` para no perder tomas largas |
| `contentLicense` | `cc-by-sa-4.0` (defecto) o `cc0-1.0` |
| `LicenseFicheSchema` | >100 años desde la muerte salvo `anonymousTraditional`; exige fuente, transcripción, atribución y verificación |
| `pdc.settings.v1` | Clave de `localStorage` de ajustes; `data-theme` y acento inline en `<html>` |
| `unlockAllLessons` | Ajuste que permite abrir cualquier lección (b1bc6f1) |
| `system` (tema) | Rama en `App.tsx`/CSS pero `normalizeSettings()` la colapsa a `light` |

## 18. Estado actual y deudas conocidas

- **Contenido**: 79/79 lecciones `published` con ES/EN; huecos de profundidad no detectados por el esquema: 10 sin `demoScore` (`m2-03`…`m2-12`, ADR-029), 78/79 sin glosario, 5 sin ejercicios (4 de autoevaluación + `m2-12`), `m3-05` sin digitación, 6 secciones con `bodyEs` <120 chars, 5 skills sin ejercicios. Ver skill `lecciones-modulos`.
- **Documentación desincronizada**: el último commit `7891f1b` no aparece en `docs/`; `ESTADO.md` dice `HEAD 58838d5`, ` LOG.md` termina en F7-022 y `AUDITORIA.md` tiene referencias de línea desplazadas.
- **UI**: F7-023 en curso (tarjetas/primera fila), duplicación de capas CSS, escala 1,25 del ADR-050 sin tokens, `theme:'system'` inalcanzable, colores hardcoded, sin `prefers-contrast`. Ver skill `interfaz-moderna`.
- **MIDI**: sin prueba en hardware (P2 PSR-373), latencia sin medir, WebKit no ejecutable en este host, ayuda no inventada para Edge/Vivaldi. Ver skill `compatibilidad-midi`.
- **Licencias**: footer vs `app.credits.code` contradictorios, `#/creditos` obsoleto en `THIRD_PARTY_LICENSES.md`, CC BY 3.0 sin texto local, `audit:text` NO VERIFICABLE, PD no comprobada en runtime. Ver skill `material-libre`.
- **Otros**: `docs/RESUME.md` con URL antigua `piano-learning`; `LICENSE-CONTENT` con placeholder de URL; `test-results/reproduce-midi.mjs` citado pero ausente.
