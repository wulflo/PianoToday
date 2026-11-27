/**
 * Familia de navegador para elegir la ayuda de Web MIDI (F7-003).
 *
 * La familia se deduce sobre todo de características del entorno. El User-Agent
 * y los User-Agent Client Hints solo se usan para poner un nombre legible en el
 * diagnóstico: nunca deciden si se puede pedir el permiso ni bloquean la app.
 */

export type MidiBrowserFamily =
  | 'chromium'
  | 'firefox'
  | 'webkit-mac'
  | 'webkit-ios'
  | 'other'

/** Entorno observable, separado de `window` para poder probarlo sin navegador. */
export interface BrowserEnvironment {
  userAgent: string
  vendor: string
  platform: string
  maxTouchPoints: number
  /** Marcas de UA-CH, exclusivamente para el texto de ayuda. */
  brands?: Array<{ brand: string; version?: string }>
  /** `window.chrome`; presente en Chromium de escritorio y Android. */
  hasChrome: boolean
  /** `window.webkitAudioContext`; Chrome también lo expone por compatibilidad. */
  hasWebkitAudio: boolean
  /** `window.InstallTrigger`; exclusivo de Firefox de escritorio. */
  hasInstallTrigger: boolean
}

export interface MidiBrowserInfo {
  family: MidiBrowserFamily
  /** Nombre legible para el diagnóstico; no condiciona ningún flujo. */
  label: string
  userAgent: string
  platform: string
}

/**
 * iPadOS 13+ se declara como Macintosh, pero conserva la pantalla táctil. El
 * número de puntos táctiles distingue ese caso del macOS de escritorio.
 */
function isIOS(env: BrowserEnvironment): boolean {
  const platform = env.platform.toLowerCase()
  if (/iphone|ipad|ipod/.test(platform)) return true
  return /macintosh|macintel/.test(platform) && env.maxTouchPoints > 1
}

export function detectBrowserFamily(env: BrowserEnvironment): MidiBrowserFamily {
  const ua = env.userAgent
  // Chrome incluye «Safari/» en su UA y expone `webkitAudioContext` por
  // compatibilidad: esas dos señales solas no bastan para clasificar WebKit.
  const brands = env.brands?.map((entry) => entry.brand).join(' ') ?? ''
  const chromiumSignal =
    env.hasChrome ||
    /\b(chrome|chromium|crios|edg|edga|edgios|opr|vivaldi|samsungbrowser)\//i.test(
      ua,
    ) ||
    /chrome|chromium|edge|opera|vivaldi|samsung/i.test(brands)

  // iOS usa WebKit en todos los navegadores, incluidos Chrome y Firefox.
  if (chromiumSignal && !isIOS(env)) return 'chromium'
  if (isIOS(env)) return 'webkit-ios'
  // Derivados de Firefox comparten el modelo de complemento de permiso de
  // sitio: se reconocen por su token de UA, aunque no expongan InstallTrigger.
  const firefoxSignal =
    env.hasInstallTrigger ||
    /\b(firefox(?:-esr)?|waterfox|librewolf|icecat|palemoon|basilisk|seamonkey)\//i.test(
      ua,
    )
  if (firefoxSignal) return 'firefox'

  const webkitSignal =
    (env.vendor === 'Apple Computer, Inc.' && /\bsafari\//i.test(ua)) ||
    (/\bsafari\//i.test(ua) && !chromiumSignal) ||
    env.hasWebkitAudio
  if (webkitSignal || isIOS(env)) {
    return isIOS(env) ? 'webkit-ios' : 'webkit-mac'
  }
  return 'other'
}

/** Clave de texto para un permiso bloqueado, según la familia detectada. */
export function blockedMessageKey(family: MidiBrowserFamily): string {
  if (family === 'chromium') return 'midi.blocked.chromium'
  if (family === 'firefox') return 'midi.blocked.firefox'
  if (family === 'webkit-mac' || family === 'webkit-ios') {
    return 'midi.blocked.webkit'
  }
  return 'midi.blocked.other'
}

/** Nombre comercial aproximado, útil solo para explicar los pasos al usuario. */
export function browserLabel(env: BrowserEnvironment): string {
  const brands = env.brands?.map((entry) => entry.brand).join(' ') ?? ''
  const hints = `${brands} ${env.userAgent}`
  if (/samsungbrowser|samsung internet/i.test(hints)) return 'Samsung Internet'
  if (/vivaldi/i.test(hints)) return 'Vivaldi'
  if (/\bopr\/|opera/i.test(hints)) return 'Opera'
  if (/brave/i.test(hints)) return 'Brave'
  if (/edg([ea]?)\//i.test(hints)) return 'Edge'
  if (/crios\//i.test(hints)) return 'Chrome en iOS'
  if (/fxios\//i.test(hints)) return 'Firefox en iOS'
  if (/waterfox/i.test(hints)) return 'Waterfox'
  if (/librewolf/i.test(hints)) return 'LibreWolf'
  if (/icecat/i.test(hints)) return 'IceCat'
  if (/palemoon/i.test(hints)) return 'Pale Moon'
  if (/basilisk/i.test(hints)) return 'Basilisk'
  if (/seamonkey/i.test(hints)) return 'SeaMonkey'
  if (/\bfirefox(?:-esr)?\//i.test(hints)) return 'Firefox'
  if (/chromium\//i.test(hints)) return 'Chromium'
  if (/chrome\//i.test(hints)) return 'Chrome'
  if (/\bsafari\//i.test(hints)) return 'Safari'
  return 'Navegador'
}

/** Lee el entorno real y devuelve una foto inmutable para el diagnóstico. */
export function getMidiBrowserInfo(): MidiBrowserInfo {
  if (typeof navigator === 'undefined') {
    return { family: 'other', label: 'Navegador', userAgent: '', platform: '' }
  }
  const nav = navigator as Navigator & {
    userAgentData?: { brands?: Array<{ brand: string; version?: string }> }
  }
  const env: BrowserEnvironment = {
    userAgent: nav.userAgent ?? '',
    vendor: nav.vendor ?? '',
    platform: nav.platform ?? '',
    maxTouchPoints: nav.maxTouchPoints ?? 0,
    brands: nav.userAgentData?.brands,
    hasChrome: typeof window !== 'undefined' && 'chrome' in window,
    hasWebkitAudio:
      typeof window !== 'undefined' && 'webkitAudioContext' in window,
    hasInstallTrigger:
      typeof window !== 'undefined' && 'InstallTrigger' in window,
  }
  return {
    family: detectBrowserFamily(env),
    label: browserLabel(env),
    userAgent: env.userAgent,
    platform: env.platform,
  }
}
