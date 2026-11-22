/**
 * Ayuda verificada para el permiso Web MIDI (F7-006).
 *
 * Las rutas profundas son datos: si un navegador cambia la ruta se corrige aquí
 * sin tocar los componentes. Solo se escriben rutas con fuente verificada; para
 * los demás navegadores se usa la ruta genérica del icono del sitio.
 */
import type { MidiBrowserInfo } from './browser'

export interface MidiPermissionHelp {
  /** Ruta profunda verificada, o null si no hay fuente que la confirme. */
  settingsUrl: string | null
  /** El icono de información del sitio está disponible en escritorio. */
  useSiteInfo: boolean
  /** En Android el menú del sitio sustituye al icono de la barra de direcciones. */
  useAndroidMenu: boolean
}

/**
 * Extensión de terceros para Safari en macOS, verificada el 2026-11-22:
 * «Web MIDI for Safari» v0.1.11, gratuita, macOS 13.5+/Safari 18.4+, solo Mac.
 * Se aísla aquí para poder cambiarla sin tocar textos ni componentes.
 */
export const SAFARI_WEBMIDI_EXTENSION_URL =
  'https://triglavmodular.hu/mods/safari-webmidi/'

const VERIFIED_SETTINGS_URLS: Readonly<Record<string, string>> = {
  Chrome: 'chrome://settings/content/midiDevices',
  Chromium: 'chrome://settings/content/midiDevices',
  Brave: 'brave://settings/content/midiDevices',
  Opera: 'opera://settings/content/midiDevices',
}

export function permissionHelpFor(info: MidiBrowserInfo): MidiPermissionHelp {
  // En Android Chrome informa `platform = Linux armv8l`: el UA o el UA-CH son
  // la única señal fiable de que el navegador corre sobre Android.
  const android = /android/i.test(`${info.platform} ${info.userAgent}`)
  const chromium = info.family === 'chromium'
  return {
    settingsUrl:
      chromium && !android ? (VERIFIED_SETTINGS_URLS[info.label] ?? null) : null,
    useSiteInfo: chromium && !android,
    useAndroidMenu: chromium && android,
  }
}
