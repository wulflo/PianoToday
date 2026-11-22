#!/usr/bin/env node
/**
 * Genera `docs/DEPENDENCIAS-LICENCIAS.md` desde `package-lock.json`.
 *
 * F7-020: el inventario de `THIRD_PARTY_LICENSES.md` está pensado para la
 * auditoría de producción y mezcla audio y contenido. Este documento es solo
 * de dependencias y distingue producción, desarrollo y transitivas. La fecha
 * se toma del lockfile para que regenerar no produzca cambios espurios.
 *
 *   node scripts/generate-dependency-licenses.mjs
 */
import { readFileSync, statSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

const ROOT = resolve(import.meta.dirname, '..')
const LOCK_PATH = resolve(ROOT, 'package-lock.json')
const OUT_PATH = resolve(ROOT, 'docs', 'DEPENDENCIAS-LICENCIAS.md')

/** Para qué se usa cada dependencia declarada directamente. */
const USES = {
  dexie: 'IndexedDB y repositorios de progreso',
  react: 'Interfaz de usuario',
  'react-dom': 'Renderizado de la interfaz',
  tonal: 'Teoría musical y notación',
  tone: 'Audio y metrónomo (carga diferida)',
  'ts-fsrs': 'Repetición espaciada',
  vexflow: 'Pentagrama y notación (carga diferida)',
  'vite-plugin-pwa': 'Service worker y manifiesto PWA',
  zod: 'Validación de contenido y datos',
  '@playwright/test': 'Recorridos E2E multi-navegador',
  '@testing-library/dom': 'Consultas de DOM en tests',
  '@testing-library/jest-dom': 'Aserciones de DOM en tests',
  '@testing-library/react': 'Render de componentes en tests',
  '@testing-library/user-event': 'Interacción simulada en tests',
  '@types/node': 'Tipos de Node para los scripts',
  '@types/react': 'Tipos de React',
  '@types/react-dom': 'Tipos de React DOM',
  '@vitejs/plugin-react': 'Plugin de React para Vite',
  'axe-core': 'Auditoría de accesibilidad',
  'fake-indexeddb': 'IndexedDB simulada en tests',
  jscpd: 'Auditoría de duplicación de código',
  jsdom: 'Entorno DOM de los tests unitarios',
  'license-checker': 'Auditoría de licencias de producción',
  tsx: 'Ejecución de scripts TypeScript',
  typescript: 'Typecheck del proyecto',
  vite: 'Build y servidor de desarrollo',
  vitest: 'Suite de tests unitarios',
}

const lock = JSON.parse(readFileSync(LOCK_PATH, 'utf8'))
const root = lock.packages?.[''] ?? {}
const directProduction = new Set(Object.keys(root.dependencies ?? {}))
const directDevelopment = new Set(Object.keys(root.devDependencies ?? {}))

function licenseOf(info) {
  const value = info.license
  if (typeof value === 'string') return value.trim() || 'UNKNOWN'
  if (value && typeof value === 'object' && typeof value.type === 'string') {
    return value.type.trim() || 'UNKNOWN'
  }
  return 'UNKNOWN'
}

function normalizeUrl(raw) {
  if (typeof raw !== 'string' || raw.trim() === '') return null
  let value = raw.trim()
  if (value.startsWith('github:')) {
    return `https://github.com/${value.slice('github:'.length)}`
  }
  value = value
    .replace(/^git\+/, '')
    .replace(/^git:\/\//, 'https://')
    .replace(/^ssh:\/\/git@/, 'https://')
    .replace(/^git@github\.com:/, 'https://github.com/')
    .replace(/\.git$/, '')
  return value.startsWith('http') ? value : null
}

function sourceOf(name, info) {
  const repo =
    typeof info.repository === 'string'
      ? info.repository
      : (info.repository?.url ?? null)
  return (
    normalizeUrl(repo) ??
    normalizeUrl(info.homepage) ??
    `https://www.npmjs.com/package/${name}`
  )
}

function scopeOf(name, info) {
  if (directProduction.has(name)) return 'producción (directa)'
  if (directDevelopment.has(name)) return 'desarrollo (directa)'
  return info.dev ? 'desarrollo (transitiva)' : 'producción (transitiva)'
}

function cell(value) {
  return String(value).replaceAll('|', '\\|')
}

const packages = new Map()
for (const [path, info] of Object.entries(lock.packages ?? {})) {
  if (!path.includes('node_modules/') || !info.version) continue
  const name = info.name ?? path.slice(path.lastIndexOf('node_modules/') + 13)
  const key = `${name}@${info.version}`
  if (!packages.has(key)) {
    packages.set(key, {
      name,
      version: info.version,
      license: licenseOf(info),
      scope: scopeOf(name, info),
      source: sourceOf(name, info),
    })
  }
}

const rows = [...packages.values()].sort(
  (a, b) => a.name.localeCompare(b.name, 'en') || a.version.localeCompare(b.version, 'en'),
)
const counts = new Map()
for (const row of rows) {
  counts.set(row.license, (counts.get(row.license) ?? 0) + 1)
}
const production = rows.filter((row) => row.scope.startsWith('producción')).length
const development = rows.length - production
const generated = statSync(LOCK_PATH).mtime.toISOString()

const lines = []
lines.push('# Dependencias de terceros — Piano Today')
lines.push('')
lines.push(
  `Generado desde \`package-lock.json\` (última modificación: ${generated}) para F7-020.`,
)
lines.push('')
lines.push('Para regenerar tras cambiar dependencias:')
lines.push('')
lines.push('```bash')
lines.push('node scripts/generate-dependency-licenses.mjs')
lines.push('```')
lines.push('')
lines.push('Este documento cubre **solo dependencias**. El inventario auditado de')
lines.push('producción, las muestras de audio y el contenido de terceros siguen en')
lines.push('`THIRD_PARTY_LICENSES.md`. Ante una discrepancia, prevalece el texto de')
lines.push('licencia incluido en el paquete original dentro de `node_modules/`.')
lines.push('')
lines.push('## Resumen')
lines.push('')
lines.push('| Concepto | Cantidad |')
lines.push('|---|---:|')
lines.push(`| Paquetes únicos (nombre y versión) | ${rows.length} |`)
lines.push(`| Producción (directas y transitivas) | ${production} |`)
lines.push(`| Desarrollo (directas y transitivas) | ${development} |`)
lines.push(`| Identificadores de licencia distintos | ${counts.size} |`)
lines.push('')
lines.push('## Dependencias declaradas directamente')
lines.push('')
lines.push('| Paquete | Versión | Licencia | Ámbito | Uso |')
lines.push('|---|---|---|---|---|')
for (const row of rows.filter((row) => row.scope.includes('(directa)'))) {
  lines.push(
    `| ${cell(row.name)} | ${cell(row.version)} | ${cell(row.license)} | ${cell(row.scope)} | ${cell(USES[row.name] ?? 'Herramienta de desarrollo')} |`,
  )
}
lines.push('')
lines.push('## Inventario completo')
lines.push('')
lines.push('<!-- deps:start -->')
lines.push('| Paquete | Versión | Licencia | Ámbito | Procedencia |')
lines.push('|---|---|---|---|---|')
for (const row of rows) {
  lines.push(
    `| ${cell(row.name)} | ${cell(row.version)} | ${cell(row.license)} | ${cell(row.scope)} | ${cell(row.source)} |`,
  )
}
lines.push('<!-- deps:end -->')
lines.push('')
lines.push('## Resumen por licencia')
lines.push('')
lines.push('<!-- licenses:start -->')
lines.push('| Licencia | Paquetes |')
lines.push('|---|---:|')
for (const [license, count] of [...counts.entries()].sort((a, b) =>
  a[0].localeCompare(b[0], 'en'),
)) {
  lines.push(`| ${cell(license)} | ${count} |`)
}
lines.push('<!-- licenses:end -->')
lines.push('')
lines.push(`Total: **${rows.length} paquetes**.`)
lines.push('')
lines.push('## Notas sobre licencias')
lines.push('')
lines.push(
  '- **MPL-2.0** (Mozilla Public License 2.0): aparece en `axe-core` y en la familia `lightningcss`. Es una licencia débil de copyleft: si se modifica el código fuente de esos paquetes, hay que publicar esas modificaciones. La app los usa sin modificarlos (auditoría y build), y sus textos están en `node_modules/<paquete>/LICENSE`.',
)
lines.push(
  '- **CC-BY-4.0** (`caniuse-lite`) y **CC-BY-3.0** (`spdx-exceptions`): exigen atribución; se conserva el identificador de licencia y la procedencia de cada paquete en la tabla.',
)
lines.push(
  '- **CC0-1.0** y **0BSD**: licencias permisivas de datos y código (`spdx-license-ids`, `tslib`).',
)
lines.push(
  '- **UNKNOWN**: si aparece, el paquete no declara licencia en `package.json`. Hay que revisar su LICENSE antes de distribuirlo.',
)
lines.push('')
lines.push('## Verificación')
lines.push('')
lines.push('```bash')
lines.push('npm run audit:licenses   # licencias de producción contra THIRD_PARTY_LICENSES.md')
lines.push('npx vitest run tests/dependency-licenses.test.ts')
lines.push('```')

writeFileSync(OUT_PATH, `${lines.join('\n')}\n`)
console.log(
  `${OUT_PATH.replace(`${ROOT}/`, '')} · ${rows.length} paquetes · ${counts.size} licencias`,
)
