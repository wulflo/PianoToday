import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

const readme = readFileSync(join(process.cwd(), 'README.md'), 'utf8')

/**
 * F6-021 — README y guía de uso.
 *
 * El README debe explicar qué es la app, cómo correrla y aprender con ella,
 * sus límites sin profesor y las licencias, sin prometer funciones que no
 * existen.
 */
describe('F6-021 — README', () => {
  it('explica qué es y qué incluye', () => {
    expect(readme).toContain('9 modules and 79 lessons')
    expect(readme).toContain('720 exercises')
    expect(readme).toContain('28 repertoire pieces')
    expect(readme).toContain('Installable PWA')
  })

  it('explica el público objetivo, la utilidad y cómo usarla', () => {
    expect(readme).toContain('## Who it is for')
    expect(readme).toContain('## What it is useful for')
    expect(readme).toContain('## How to use it')
    expect(readme).toContain('## How to learn')
    expect(readme).toContain('npm ci')
    expect(readme).toContain('npm run estado')
  })

  it('documenta límites, accesibilidad y licencias', () => {
    expect(readme).toContain('## Limitations')
    expect(readme).toContain('## Accessibility')
    expect(readme).toContain('THIRD_PARTY_LICENSES.md')
    expect(readme).toContain('MIT')
    expect(readme).toContain('CC0')
  })

  it('no promete fases ya cerradas como pendientes', () => {
    expect(readme).toContain('Phases 0 through 6 are closed')
    expect(readme).toContain('`fase-0` to `fase-6`')
    expect(readme).toContain('https://wulflo.github.io/piano-learning/')
  })
})
