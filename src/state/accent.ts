/**
 * Tokens de color derivados del acento elegido por la persona.
 *
 * `src/styles.css` mantiene los valores por defecto en hexadecimal (los tests
 * de contraste y el primer pintado los leen de ahí). En cuanto se elige un
 * acento, `App` sobrescribe estos tokens en el elemento raíz para que TODOS los
 * componentes —botones, ayudas, bordes, foco y resaltado del teclado— sigan el
 * mismo color en lugar de quedarse con el verde inicial.
 */

export type AccentTokens = Record<
  '--accent' | '--primary' | '--on-primary' | '--primary-container' | '--on-primary-container' | '--focus',
  string
>

interface Rgb {
  r: number
  g: number
  b: number
}

const WHITE: Rgb = { r: 255, g: 255, b: 255 }
const DARK_TEXT: Rgb = { r: 15, g: 15, b: 15 }
const DARK_SURFACE: Rgb = { r: 32, g: 37, b: 33 }

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

function parseHex(hex: string): Rgb | null {
  const match = /^#([0-9a-f]{6})$/i.exec(hex.trim())
  if (match === null) return null
  const value = Number.parseInt(match[1], 16)
  return { r: (value >> 16) & 255, g: (value >> 8) & 255, b: value & 255 }
}

function toHex(color: Rgb): string {
  const channel = (value: number) =>
    Math.round(clamp(value, 0, 255)).toString(16).padStart(2, '0')
  return `#${channel(color.r)}${channel(color.g)}${channel(color.b)}`
}

/** Mezcla sRGB: `amount` es la proporción del primer color. */
function mix(first: Rgb, second: Rgb, amount: number): Rgb {
  return {
    r: first.r * amount + second.r * (1 - amount),
    g: first.g * amount + second.g * (1 - amount),
    b: first.b * amount + second.b * (1 - amount),
  }
}

function luminance({ r, g, b }: Rgb): number {
  const linear = (channel: number) => {
    const value = channel / 255
    return value <= 0.03928
      ? value / 12.92
      : ((value + 0.055) / 1.055) ** 2.4
  }
  return 0.2126 * linear(r) + 0.7152 * linear(g) + 0.0722 * linear(b)
}

/** Texto legible sobre un fondo, con el contraste AA como criterio. */
function readableText(background: Rgb): string {
  return toHex(luminance(background) > 0.21 ? DARK_TEXT : WHITE)
}

/**
 * Calcula los tokens para el acento `hex` y el tema effective (oscuro o claro).
 * Los colores de la paleta son oscuros: en tema oscuro se aclaran para que el
 * texto, el foco y los bordes sigan siendo visibles sobre el fondo oscuro.
 */
export function accentTokens(hex: string, dark: boolean): AccentTokens {
  const accent = parseHex(hex) ?? parseHex('#2f5d50')!

  if (dark) {
    const ink = mix(accent, WHITE, 0.55)
    const primary = mix(accent, WHITE, 0.45)
    const container = mix(accent, DARK_SURFACE, 0.3)
    return {
      '--accent': toHex(ink),
      '--primary': toHex(primary),
      '--on-primary': readableText(primary),
      '--primary-container': toHex(container),
      '--on-primary-container': toHex(ink),
      '--focus': toHex(ink),
    }
  }

  const container = mix(accent, WHITE, 0.12)
  return {
    '--accent': toHex(accent),
    '--primary': toHex(accent),
    '--on-primary': readableText(accent),
    '--primary-container': toHex(container),
    '--on-primary-container': toHex(accent),
    '--focus': toHex(accent),
  }
}
