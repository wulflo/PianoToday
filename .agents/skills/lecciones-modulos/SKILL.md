---
name: Lecciones y módulos
description: Revisar que las lecciones de los módulos de Piano Today estén detalladas y completas —esquema Zod, ES/EN, objetivos, secciones, ejercicios, tarea de teclado con demo y digitación, glosario y coherencia habilidad↔ejercicio— distinguiendo fallos duros de excepciones documentadas; usar al añadir o auditar una lección, un módulo o el índice de contenido.
---

# Lecciones y módulos — revisión de completitud

Propósito: detectar lecciones que «pasan el build» pero enseñan poco. **Revisa y reporta**; no edites `content/` ni los índices generados salvo petición explícita.

> Origen: creada siguiendo el formato de `.agents/skills` de SinNotas. Complementa `estructure` (mapa de archivos) y `material-libre` (licencia del contenido).

## 1. Línea base (inventario verificado)

`npm run validate:content` imprime `OK · 9 módulos, 79 lecciones, 720 ejercicios, 67 habilidades, 28 piezas`. Hoy **0 lecciones `draft`, 0 textos ES/EN vacíos y 0 ejercicios huérfanos**: el esquema está limpio, así que limitarse a ejecutarlo no detecta una lección pobre. Los huecos reales son de profundidad.

| Dato | Valor |
| --- | --- |
| Módulos | 9 (`M0`…`M8`, solo `M8` opcional) |
| Lecciones | 79, todas `published`; 6 opcionales (`m5-10`, `m5-11`, `m8-01`…`m8-04`) |
| Distribución | `M0:6 M1:12 M2:12 M3:5 M4:12 M5:11 M6:6 M7:11 M8:4` |
| Ejercicios | 720, todos referenciados; 67 habilidades (62 con ejercicios) |
| Secciones | 474 (texto 236, partitura 131, ejercicio 74, callout 23, audio 6, teclado 4) |
| Índices commiteados | `src/content/course-index.json`, `src/content/exercise-index.json` (schemaVersion 1) |

## 2. Capa dura: lo que el gate ya comprueba

`src/schemas/content.ts` + `validateContentBundle()` (`src/content/validate.ts`) y `npm run validate:content` (también en `npm run build`) verifican:

- `ModuleSchema` (`content/modules.json`): `id`, `order`, `titleEs/En`, `summaryEs/En`.
- `LessonSchema` (`content/lessons/mX-YY.json`): `id` = `lesson.mX-YY`, `moduleId`, `slug` kebab, título/resumen/objetivos ES, `minutes` 3-20 y ≥1 sección que tenga `bodyEs` **o** `score` **o** `keys`.
- Si `status === "published"`: obligatoria `keyboardTask`; ES/EN de título, resumen y objetivos con la misma longitud; `titleEn/bodyEn` de secciones; `titleEn/instructionsEn/checklistEn/fingeringEn` de la tarea; `meaningEn/exampleEn` del glosario.
- Referencias existentes: `moduleId`, `prerequisites`, `skillIds`, `exerciseIds`, `skills[].lessonIds`; ningún ID duplicado ni ejercicio huérfano.
- Por ejercicio: `skillId` válido, `promptEs/En`, `explanationEs/En`, `choicesEn` de la misma longitud y validaciones semánticas por tipo (índices, respuesta entre opciones, compases, BPM, velocity, mínimo de notas…).
- Cada pieza del repertorio con `license.transcriptionAuthor` no vacío (ver skill `material-libre`).

## 3. Capa blanda: criterios de «detallada y completa» que NADA valida hoy

Revisa estos puntos uno por uno y reporta por ID de lección con un `path` tipo `lessons.lesson.m2-12.exerciseIds`:

1. **Ejercicios**: `exerciseIds` vacío o ausente deja la pestaña «Ejercicios» con `t('lesson.exercise.empty')` («Esta sección todavía no tiene ejercicios»). Casos actuales: `m0-03`, `m0-04`, `m0-05`, `m0-06` (autoevaluación, excepción aceptada en el checklist) y `m2-12` (sin el campo; es el caso más débil).
2. **Demo de la tarea**: sin `keyboardTask.demoScore`, `KeyboardTask.tsx` deshabilita el botón de demo. **10 lecciones** lo tienen ausente: `m2-03`…`m2-12` (excepción documentada en ADR-029 y en `docs/LOG.md`).
3. **Digitación**: sin `fingeringEs/En` la tarea no guía la mano. Falta en `m3-05`.
4. **Glosario**: solo `m1-12` tiene términos italianos con glosario; **78 de 79** no lo tienen. Exigirlo solo cuando la lección introduce un término nuevo, no de forma ciega.
5. **Profundidad del texto**: seis secciones tienen `bodyEs` < 120 caracteres (`sec.m0-01.demo`, `sec.m0-02.keyboard`, `sec.m2-02.score`, `sec.m2-07.exercises`, `sec.m2-09.score`, `sec.m2-11.score`). Cinco lecciones tienen solo 3 secciones (`m2-03`, `m2-05`, `m2-06`, `m2-11`, `m2-12`). Busca un ejemplo concreto (partitura, demo o tarea) por sección, no solo prosa.
6. **Objetivos medibles**: objectives genéricos (<3 palabras o sin verbo observable) no sirven para `completeLesson` ni para la rúbrica de `lesson-progress.ts` (`DEFAULT_MASTERY_THRESHOLD = 0.8`).
7. **Coherencia habilidad↔ejercicio**: una `skillId` de la lección sin entradas en `src/content/exercise-index.json` deja la sugerencia vacía. Hoy 5 skills sin ejercicios: `skill.posture`, `skill.practice-planning`, `skill.course-orientation`, `skill.self-observation`, `skill.improvisation` (todas de autoevaluación/técnica).
8. **Tipos de sección**: 131 secciones `score` frente a 6 `audio`; una lección de oído sin sección `audio` ni ejercicio de dictado es sospechosa. `LessonPlayer.tsx` separa secciones `exercise` y crea pestañas `content`/`exercises`/`task` (`persistKey=lesson:<id>:tabs`): comprueba que las tres pestañas tengan contenido cuando la lección no es una excepción.

## 4. Cómo revisar

1. Leer el módulo en `content/modules.json` y la lección en `content/lessons/mX-YY.json`; contrastar con `src/content/lessons.ts` (`LESSON_ID_PATTERN`, `loadLesson`) y `src/content/localize.ts` (`pickLocalized`: si falta EN cae al ES; las listas solo se usan si tienen la misma longitud).
2. Ejecutar el gate duro y los tests de la lección (`tests/content-mX-YY.test.ts` existe para cada una). El estándar de referencia es `tests/content-m5-01.test.ts` (12 tonalidades, conceptos ES/EN, 2 demos con MIDI exacto, 12 ejercicios con respuesta canónica, tarea con `demoScore`); `tests/content-m2-12.test.ts` muestra una aceptación más débil, no el patrón a copiar.
3. Aplicar la capa blanda del §3. Antes de marcar algo como defecto, buscar la excepción en `docs/CHECKLIST.md`, `docs/LOG.md` y `docs/DECISIONES.md` (ADR-029, ADR-044). Una excepción documentada se reporta como `note`, no como `error`.
4. Comprobar el renderizado: `src/pages/LessonPage.tsx` (bloqueo/desbloqueo, `computeLessonUnlocks`, botón «Completar»), `src/components/LessonPlayer.tsx`, `KeyboardTask.tsx`, `ExercisePlayer.tsx`. Si la lección está bloqueada, revisa también el ajuste `unlockAllLessons` (`SettingsPanel.tsx`, `src/state/settings.tsx`).
5. Si se añade contenido, regenerar los índices con `npm run index:content` (**escribe** `src/content/*.json`) y verificar que el diff incluye ambos archivos.

## 5. Comandos

```bash
npm run validate:content          # solo lectura; 9/79/720/67/28
npm run typecheck
npx vitest run tests/content-schema.test.ts tests/content-m0-m2-validation.test.ts \
  tests/course-index.test.ts tests/exercise-index.test.ts tests/lesson-content.test.ts \
  tests/content-m5-01.test.ts
npm test                          # 266 archivos de test
npm run build                     # incluye validate:content; ESCRIBE dist/
```

Precaución: `npm run index:content`, `npm run estado` y `npm run build` escriben archivos; para una auditoría read-only usa `validate:content`, `typecheck`, `npx vitest run` y lectura directa de `content/`.

## 6. Formato del informe

Para cada hallazgo: `lección · ruta:campo · evidencia concreta · clasificación`. Usa `error` (no publicable o experiencia rota), `warning` (laguna pedagógica sin excepción documentada) y `note` (excepción aceptada o precisión). Cierra con el recuento por módulo y con las verificaciones humanas pendientes: `docs/CHECKLIST.md` mantiene `F7-023 [~]` en curso y `F6-054 [ ]` (pruebas manuales de hardware/Safari/iOS/Android, solo las cierra un usuario).

## Referencias rápidas

| Qué | Dónde |
| --- | --- |
| Contenido fuente | `content/modules.json`, `content/lessons/*.json`, `content/exercises/*.json`, `content/skills.json` |
| Cargadores y validación | `src/content/course.ts`, `lessons.ts`, `exercises.ts`, `localize.ts`, `validate.ts`, `exercise-catalog.ts` |
| Esquemas | `src/schemas/content.ts`, `course-index.ts`, `exercise-index.ts`, `skill.ts` |
| Render y progreso | `src/pages/LessonPage.tsx`, `src/components/LessonPlayer.tsx`, `src/state/lesson-progress.ts`, `src/state/course-progress.ts` |
| Decisiones e inventario | `docs/DECISIONES.md` (ADR-029, ADR-044), `docs/CHECKLIST.md`, `docs/LOG.md` |
| Mapa técnico | skill `estructure` → `references/Estructure.md` |
