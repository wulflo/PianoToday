/**
 * Detección de Web MIDI y solicitud de permiso.
 *
 * F7-002: antes `requestMidiAccess` devolvía `null` ante cualquier excepción y
 * la capa superior lo mostraba siempre como «permiso denegado». Ahora se
 * conservan el nombre y el mensaje reales del error para poder distinguir una
 * denegación de un contexto inseguro o de un navegador sin la API.
 */
export type MidiPermissionState = 'granted' | 'denied' | 'prompt' | 'unsupported'

/** Datos de un fallo al pedir acceso, tal como los expone el navegador. */
export interface MidiAccessFailure {
  name: string
  message: string
  isSecureContext: boolean
}

/** Resultado discriminado: nunca se pierde el motivo de un fallo. */
export type MidiAccessResult =
  | { ok: true; access: MIDIAccess }
  | { ok: false; failure: MidiAccessFailure }

/** Un entorno sin `window` (por ejemplo, un test puro) se considera seguro. */
function currentSecureContext(): boolean {
  return typeof window === 'undefined' ? true : window.isSecureContext
}

/** Convierte cualquier valor lanzado en datos diagnosticables. */
export function describeMidiFailure(
  reason: unknown,
  isSecureContext: boolean = currentSecureContext(),
): MidiAccessFailure {
  if (
    typeof DOMException !== 'undefined' &&
    reason instanceof DOMException
  ) {
    return { name: reason.name, message: reason.message, isSecureContext }
  }
  if (reason instanceof Error) {
    return {
      name: reason.name || 'Error',
      message: reason.message,
      isSecureContext,
    }
  }
  return { name: 'Error', message: String(reason), isSecureContext }
}

export function isWebMidiSupported(): boolean {
  return (
    typeof navigator !== 'undefined' &&
    typeof (navigator as Navigator & { requestMIDIAccess?: unknown })
      .requestMIDIAccess === 'function'
  )
}

export async function requestMidiAccess(): Promise<MidiAccessResult> {
  if (!isWebMidiSupported()) {
    return {
      ok: false,
      failure: {
        name: 'NotSupportedError',
        message: 'Este navegador no expone la API Web MIDI.',
        isSecureContext: currentSecureContext(),
      },
    }
  }
  try {
    const access = await (
      navigator as Navigator & {
        requestMIDIAccess: (options?: { sysex?: boolean }) => Promise<MIDIAccess>
      }
    ).requestMIDIAccess({ sysex: false })
    return { ok: true, access }
  } catch (reason) {
    return { ok: false, failure: describeMidiFailure(reason) }
  }
}

export async function getMidiPermissionState(): Promise<MidiPermissionState> {
  if (!isWebMidiSupported()) return 'unsupported'
  try {
    const permission = await navigator.permissions.query({
      name: 'midi' as PermissionName,
    })
    return permission.state as MidiPermissionState
  } catch {
    return 'prompt'
  }
}
