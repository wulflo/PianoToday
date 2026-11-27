---
name: estructure
description: Consultar el índice técnico de Piano Today (mapa de archivos, modelo de contenido, esquemas, rutas, MIDI, pentagrama, audio, estado, scripts y comandos); usar cuando se pregunte dónde está una función, un archivo de contenido o un comando, o antes de tocar código para no duplicar estructuras existentes.
---

# Estructure — índice técnico de Piano Today

Propósito: responder «¿dónde está?» sin leer todo el repo. **Revisa y reporta**; no cambies código salvo petición explícita.

El índice completo vive en `references/Estructure.md`, escrito para consultarse por sección: busca por símbolo, selector o ruta, no de principio a fin.

## Cuándo usarla

- Antes de añadir una lección, ejercicio, pieza, componente, script o clave de `localStorage`: comprobar la convención y si existe ya.
- Al buscar dónde se implementa una vista, un permiso MIDI, un render de partitura o una auditoría.
- Al actualizar documentación técnica tras un cambio visible: las guías de uso y el protocolo de cambio están en `docs/`, aquí van rutas y símbolos.

## Cómo consultarla

1. Leer solo la sección relevante de `references/Estructure.md` (índice al inicio).
2. Confirmar en el código con `grep -RIn "<símbolo>" src content scripts tests docs`.
3. Si el cambio afecta a símbolos documentados, actualizar **esta** referencia en el mismo commit.

## Reglas

- Los números de línea son orientativos: buscar por símbolo, no por línea fija.
- `docs/ESTADO.md` es generado (`npm run estado`): no editarlo a mano. `docs/CHECKLIST.md` es la fuente de verdad de las tareas.
- Esta skill es la fuente técnica única; no recrear un `docs/Estructure.md`.
- Para cambios visibles, seguir `docs/GUIA-CAMBIOS.md` y la skill `interfaz-moderna`.

## Referencias rápidas

| Qué | Dónde |
| --- | --- |
| Índice completo | `references/Estructure.md` |
| Contenido fuente | `content/modules.json`, `content/lessons/`, `content/exercises/`, `content/skills.json`, `content/repertoire/` |
| Cargadores y validación | `src/content/*.ts` |
| Tipos y esquemas | `src/schemas/*.ts` (Zod 4) |
| Shell y rutas | `src/App.tsx`, `src/router/hash-route.ts`, `src/pages/*.tsx` |
| Subsistemas | `src/midi/`, `src/audio/`, `src/staff/`, `src/exercises/` |
| Auditorías y estado | `scripts/`, `docs/CHECKLIST.md`, `docs/GUIA-CAMBIOS.md`, `docs/AUDITORIA.md` |
