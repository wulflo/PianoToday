import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

/** Navegación de lección: anterior/siguiente a los lados y acciones agrupadas. */
const css = readFileSync(join(process.cwd(), 'src', 'styles.css'), 'utf8')
const app = readFileSync(join(process.cwd(), 'src', 'App.tsx'), 'utf8')

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

describe('encabezado y navegación de lección', () => {
  it('centra la marca sin glifo y usa una fuente editorial del sistema', () => {
    expect(app).not.toContain('brand-mark')
    expect(block('.site-header-top {')).toContain('justify-content: center')
    expect(css).toMatch(/\.brand \{[^}]*font-family: var\(--font-display\)/)
    expect(block(':root {')).toContain('--font-display:')
    expect(block('.brand-link {')).toContain('white-space: nowrap')
    expect(css).toContain('.brand-link::before,')
    expect(css).toContain('.brand-link::after {')
    expect(css).toContain('radial-gradient(circle at 100% 50%, var(--accent)')
    expect(css).not.toContain('@font-face')
  })

  it('distribuye anterior y siguiente a los lados con acciones separadas', () => {
    expect(block('.lesson-nav ul {')).toContain('justify-content: space-between')
    expect(block('.lesson-nav li {')).toContain('flex: 1 1 14rem')
    expect(block('.lesson-nav li:last-child {')).toContain('text-align: right')
    expect(block('.lesson-nav .page-actions {')).toContain('border-top: 1px solid var(--border)')
    expect(block('.lesson-nav .page-actions {')).toContain(
      'justify-content: center',
    )
    expect(block('.lesson-nav a {')).toContain('text-decoration: none')
    expect(block('.lesson-nav a {')).toContain('min-height: var(--touch-min)')
    expect(block('.lesson-nav a {')).toContain('border-radius: var(--radius-md)')
  })
})
