/**
 * Clasificación de fallos de Web MIDI (F7-003).
 *
 * Módulo puro: convierte el `name` y el `message` reales del navegador en una
 * categoría que determine qué ayuda se muestra. Se comprueba primero el
 * mensaje del complemento de Firefox porque también llega como `SecurityError`.
 */
import type { MidiAccessFailure } from './detect'

export type MidiFailureKind =
  | 'unsupported'
  | 'insecure-context'
  | 'permission-denied'
  | 'permission-dismissed'
  | 'addon-required-or-no-device'
  | 'unknown'

export const MIDI_FAILURE_KINDS: readonly MidiFailureKind[] = [
  'unsupported',
  'insecure-context',
  'permission-denied',
  'permission-dismissed',
  'addon-required-or-no-device',
  'unknown',
]

const ADDON = /site permission add-?on|webmidi requires|add-?on/i
const DISMISSED = /dismiss|cancel|abort/i
const INSECURE = /secure context|insecure context|https|origen no seguro/i
const UNSUPPORTED = /not supported|does not support|unsupported|no expone/i
const DENIED = /denied|blocked|not allowed|permission|permiso|rechazad|bloquead/i

export function classifyMidiFailure(failure: MidiAccessFailure): MidiFailureKind {
  const name = failure.name.trim()
  const message = failure.message.toLowerCase()

  if (!failure.isSecureContext) return 'insecure-context'
  if (ADDON.test(message)) return 'addon-required-or-no-device'
  if (
    name === 'NotSupportedError' ||
    name === 'ReferenceError' ||
    UNSUPPORTED.test(message)
  ) {
    return 'unsupported'
  }
  if (name === 'AbortError' || DISMISSED.test(message)) {
    return 'permission-dismissed'
  }
  if (INSECURE.test(message)) return 'insecure-context'
  if (
    name === 'NotAllowedError' ||
    name === 'PermissionDeniedError' ||
    DENIED.test(message) ||
    // Con contexto seguro y sin mensaje del complemento, un SecurityError
    // al pedir MIDI es la denegación del permiso del sitio (Chrome ≥ 124).
    name === 'SecurityError'
  ) {
    return 'permission-denied'
  }
  return 'unknown'
}

/**
 * Solo una denegación real lleva el estado `denied`. Un diálogo descartado, un
 * complemento ausente o un contexto inseguro son errores con ayuda específica.
 */
export function isPermissionDeniedFailure(
  failure: MidiAccessFailure,
): boolean {
  return classifyMidiFailure(failure) === 'permission-denied'
}
