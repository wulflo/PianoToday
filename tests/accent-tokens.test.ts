import { describe, expect, it } from 'vitest'
import { ACCENT_COLORS } from '../src/state/settings'
import { accentTokens } from '../src/state/accent'

function luminance(hex: string): number {
  const value = hex.replace('#', '')
  const channels = [0, 2, 4].map((offset) => {
    const channel = Number.parseInt(value.slice(offset, offset + 2), 16) / 255
    return channel <= 0.03928
      ? channel / 12.92
      : ((channel + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2]
}

function contrast(foreground: string, background: string): number {
  const first = luminance(foreground)
  const second = luminance(background)
  const [light, dark] = first >= second ? [first, second] : [second, first]
  return (light + 0.05) / (dark + 0.05)
}

describe('Acentos personalizables', () => {
  it('deriva todos los tokens del color elegido en tema claro', () => {
    const tokens = accentTokens('#1d4ed8', false)
    expect(tokens['--accent']).toBe('#1d4ed8')
    expect(tokens['--primary']).toBe('#1d4ed8')
    expect(tokens['--focus']).toBe('#1d4ed8')
    expect(tokens['--primary-container']).not.toBe('#d7e8df')
    expect(tokens['--on-primary-container']).toBe('#1d4ed8')
  })

  it('aclara el acento en tema oscuro para que siga siendo visible', () => {
    const light = accentTokens('#1d4ed8', false)
    const dark = accentTokens('#1d4ed8', true)
    expect(luminance(dark['--accent'])).toBeGreaterThan(
      luminance(light['--accent']),
    )
    expect(contrast(dark['--accent'], '#171a18')).toBeGreaterThanOrEqual(4.5)
  })

  it('mantiene texto legible sobre el botón para toda la paleta', () => {
    for (const dark of [false, true]) {
      for (const color of ACCENT_COLORS) {
        const tokens = accentTokens(color.value, dark)
        expect(contrast(tokens['--on-primary'], tokens['--primary'])).toBeGreaterThanOrEqual(4.5)
      }
    }
  })

  it('mantiene cada acento legible sobre papel y panel claro', () => {
    for (const color of ACCENT_COLORS) {
      expect(
        contrast(color.value, '#faf7f2'),
        `${color.label} sobre fondo`,
      ).toBeGreaterThanOrEqual(4.5)
      expect(
        contrast(color.value, '#fffdf9'),
        `${color.label} sobre panel`,
      ).toBeGreaterThanOrEqual(4.5)
    }
  })

  it('cae al verde por defecto ante un color no válido', () => {
    expect(accentTokens('no-es-un-color', false)['--primary']).toBe('#2f5d50')
  })
})
