import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

const root = process.cwd()
const lock = JSON.parse(
  readFileSync(join(root, 'package-lock.json'), 'utf8'),
) as {
  packages?: Record<
    string,
    { name?: string; version?: string; license?: string | { type: string } }
  >
}
const doc = readFileSync(
  join(root, 'docs', 'DEPENDENCIAS-LICENCIAS.md'),
  'utf8',
)

function lockPackages(): Array<{ name: string; version: string; license: string }> {
  const seen = new Set<string>()
  const result: Array<{ name: string; version: string; license: string }> = []
  for (const [path, info] of Object.entries(lock.packages ?? {})) {
    if (!path.includes('node_modules/') || !info.version) continue
    const name = info.name ?? path.slice(path.lastIndexOf('node_modules/') + 13)
    const key = `${name}@${info.version}`
    if (seen.has(key)) continue
    seen.add(key)
    const rawLicense = info.license
    const license =
      typeof rawLicense === 'string'
        ? rawLicense
        : (rawLicense?.type ?? 'UNKNOWN')
    result.push({ name, version: info.version, license })
  }
  return result
}

function section(start: string, end: string): string {
  const from = doc.indexOf(start)
  const to = doc.indexOf(end)
  expect(from, `falta ${start}`).toBeGreaterThan(-1)
  expect(to, `falta ${end}`).toBeGreaterThan(from)
  return doc.slice(from + start.length, to)
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

describe('F7-020 — documento de licencias de dependencias', () => {
  const packages = lockPackages()
  const rows = section('<!-- deps:start -->', '<!-- deps:end -->')
    .split('\n')
    .filter((line) => line.startsWith('| ') && !line.startsWith('| Paquete'))

  it('cubre todos los paquetes del lockfile', () => {
    expect(rows).toHaveLength(packages.length)
    for (const item of packages) {
      const row = rows.find((line) =>
        line.startsWith(`| ${item.name} | ${item.version} |`),
      )
      expect(row, `${item.name}@${item.version} falta en el documento`).toBeDefined()
    }
  })

  it('no deja licencias sin declarar', () => {
    expect(packages.some((item) => item.license === 'UNKNOWN')).toBe(false)
    expect(rows.some((line) => line.includes('| UNKNOWN |'))).toBe(false)
  })

  it('el resumen por licencia cuadra con el inventario', () => {
    const counts = new Map<string, number>()
    for (const item of packages) {
      counts.set(item.license, (counts.get(item.license) ?? 0) + 1)
    }
    const summary = section('<!-- licenses:start -->', '<!-- licenses:end -->')
    for (const [license, count] of counts) {
      expect(summary).toMatch(
        new RegExp(`\\| ${escapeRegExp(license)} \\| ${count} \\|`),
      )
    }
    const total = [...counts.values()].reduce((sum, value) => sum + value, 0)
    expect(total).toBe(packages.length)
    expect(doc).toContain(`Total: **${packages.length} paquetes**`)
  })

  it('distingue ámbitos y es reproducible', () => {
    expect(rows.some((line) => line.includes('| producción (directa) |'))).toBe(true)
    expect(rows.some((line) => line.includes('| desarrollo (directa) |'))).toBe(true)
    expect(rows.some((line) => line.includes('| desarrollo (transitiva) |'))).toBe(
      true,
    )
    expect(rows.some((line) => line.includes('https://'))).toBe(true)
    expect(doc).toContain('node scripts/generate-dependency-licenses.mjs')
    expect(doc).toContain('THIRD_PARTY_LICENSES.md')
  })
})
