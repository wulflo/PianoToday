import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

const readme = readFileSync(join(process.cwd(), 'README.md'), 'utf8')
const LIVE_URL = 'https://wulflo.github.io/PianoToday/'

/** GitHub elimina emojis y puntuación de los encabezados para hacer el ancla. */
function slug(heading: string): string {
  return heading
    .replace(/^#+\s*/, '')
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
}

describe('README de Piano Today', () => {
  it('apunta solo al repositorio publicado', () => {
    expect(readme).not.toMatch(/github\.io\/piano-learning/i)
    expect(readme).not.toMatch(/github\.com\/wulflo\/piano-learning/i)
    expect(readme.split(LIVE_URL).length - 1).toBeGreaterThanOrEqual(3)
  })

  it('los anclas del índice y de las secciones existen', () => {
    const headings = new Set(
      [...readme.matchAll(/^##\s+(.+)$/gm)].map((match) => slug(match[1] ?? '')),
    )
    const anchors = [...readme.matchAll(/\]\(#([^)]+)\)/g)].map(
      (match) => match[1] ?? '',
    )
    expect(anchors.length).toBeGreaterThan(5)
    for (const anchor of anchors) {
      expect(headings.has(anchor), `ancla rota: #${anchor}`).toBe(true)
    }
  })

  it('enlaza la documentación nueva y el inventario de licencias', () => {
    for (const path of [
      'docs/DIAGNOSTICO-MIDI.md',
      'docs/DEPENDENCIAS-LICENCIAS.md',
      'docs/QA-NAVEGADORES.md',
      'THIRD_PARTY_LICENSES.md',
    ]) {
      expect(readme, `${path} falta en el README`).toContain(path)
    }
  })
})
