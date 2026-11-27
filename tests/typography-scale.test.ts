import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

/** ADR-050 — escala 1,25 e interlineados como tokens reutilizables. */
const css = readFileSync(join(process.cwd(), 'src', 'styles.css'), 'utf8')

function block(selector: string): string {
  const start = css.indexOf(selector)
  if (start === -1) throw new Error(`No se encontró el selector ${selector}`)
  const open = css.indexOf('{', start)
  let depth = 1
  let index = open + 1
  while (depth > 0 && index < css.length) {
    if (css[index] === '{') depth += 1
    if (css[index] === '}') depth -= 1
    index += 1
  }
  return css.slice(open + 1, index - 1)
}

const root = block(':root {')

describe('ADR-050 — escala tipográfica', () => {
  it('define los siete tamaños y ambos interlineados como tokens', () => {
    const expected: Record<string, string> = {
      '--type-xs': '0.75rem',
      '--type-sm': '0.875rem',
      '--type-base': '1rem',
      '--type-md': '1.25rem',
      '--type-lg': '1.5rem',
      '--type-xl': '2rem',
      '--type-2xl': '2.5rem',
      '--leading-body': '1.5',
      '--leading-heading': '1.2',
    }
    for (const [name, value] of Object.entries(expected)) {
      expect(root).toContain(`${name}: ${value}`)
    }
  })

  it('aplica la escala a encabezados y cuerpo sin tamaños sueltos', () => {
    expect(block('h1 {')).toContain(
      'font-size: clamp(var(--type-xl), 5vw, var(--type-2xl))',
    )
    expect(block('h1 {')).toContain('line-height: var(--leading-heading)')
    expect(block('h2 {')).toContain('font-size: var(--type-lg)')
    expect(block('h3 {')).toContain('font-size: var(--type-md)')
    expect(root).toContain('line-height: var(--leading-body)')
    expect(block('.lede {')).toContain('font-size: var(--type-md)')
  })

  it('no declara una fuente que no se descarga', () => {
    expect(css).not.toMatch(/Roboto/i)
  })
})
