import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

const root = process.cwd()
const html = readFileSync(join(root, 'index.html'), 'utf8')
const manifest = JSON.parse(
  readFileSync(join(root, 'public', 'manifest.webmanifest'), 'utf8'),
) as Record<string, string>
const css = readFileSync(join(root, 'src', 'styles.css'), 'utf8')

describe('F7-017 — metadatos de tema y accesibilidad', () => {
  it('el manifiesto usa el papel cálido de ADR-050', () => {
    expect(manifest.theme_color).toBe('#faf7f2')
    expect(manifest.background_color).toBe('#faf7f2')
  })

  it('index.html declara el color claro y una variante oscura por sistema', () => {
    expect(html).toContain('<meta name="theme-color" content="#faf7f2" />')
    expect(html).toMatch(
      /name="theme-color"\s+content="#171a18"\s+media="\(prefers-color-scheme: dark\)"/,
    )
  })

  it('mantiene foco visible, movimiento reducido y objetivos táctiles', () => {
    expect(css).toContain(':focus-visible')
    expect(css).toContain('@media (prefers-reduced-motion: reduce)')
    expect(css).toContain('min-height: var(--touch-min)')
    expect(css).toContain('--touch-min: 2.75rem')
  })

  it('el tema oscuro sigue siendo una paleta distinta de la clara', () => {
    expect(css).toContain(":root[data-theme='dark']")
    expect(css).toContain('--bg: #faf7f2')
    expect(css).toContain('--bg: #171a18')
  })
})
