import { describe, expect, it } from 'vitest'
import type { MidiAccessFailure } from '../src/midi/detect'
import {
  classifyMidiFailure,
  isPermissionDeniedFailure,
  MIDI_FAILURE_KINDS,
  type MidiFailureKind,
} from '../src/midi/failure'

function failure(overrides: Partial<MidiAccessFailure> = {}): MidiAccessFailure {
  return {
    name: 'SecurityError',
    message: 'Permission denied',
    isSecureContext: true,
    ...overrides,
  }
}

describe('F7-003 — clasificación de fallos Web MIDI', () => {
  const cases: Array<[string, MidiAccessFailure, MidiFailureKind]> = [
    [
      'API ausente',
      failure({
        name: 'NotSupportedError',
        message: 'Este navegador no expone la API Web MIDI.',
      }),
      'unsupported',
    ],
    [
      'contexto inseguro',
      failure({ isSecureContext: false, message: 'Permission denied' }),
      'insecure-context',
    ],
    [
      'mensaje de contexto inseguro con contexto seguro',
      failure({ message: 'Web MIDI only works in a secure context.' }),
      'insecure-context',
    ],
    [
      'denegación de Chrome',
      failure({ name: 'SecurityError', message: 'Permission denied' }),
      'permission-denied',
    ],
    [
      'NotAllowedError',
      failure({ name: 'NotAllowedError', message: 'The user did not allow it' }),
      'permission-denied',
    ],
    [
      'diálogo descartado por AbortError',
      failure({ name: 'AbortError', message: 'La operación se canceló' }),
      'permission-dismissed',
    ],
    [
      'diálogo descartado por mensaje',
      failure({ message: 'Permission dismissed by user' }),
      'permission-dismissed',
    ],
    [
      'complemento de Firefox o sin dispositivo',
      failure({
        message:
          'WebMIDI requires a site permission add-on to activate',
      }),
      'addon-required-or-no-device',
    ],
    [
      'fallo sin categoría',
      failure({ name: 'InvalidStateError', message: 'Algo inesperado' }),
      'unknown',
    ],
  ]

  it.each(cases)('%s → %s', (_name, input, expected) => {
    expect(MIDI_FAILURE_KINDS).toContain(expected)
    expect(classifyMidiFailure(input)).toBe(expected)
  })

  it('solo la denegación real activa el estado denied', () => {
    expect(isPermissionDeniedFailure(failure())).toBe(true)
    expect(
      isPermissionDeniedFailure(failure({ name: 'AbortError' })),
    ).toBe(false)
    expect(
      isPermissionDeniedFailure(
        failure({ message: 'WebMIDI requires a site permission add-on' }),
      ),
    ).toBe(false)
    expect(isPermissionDeniedFailure(failure({ isSecureContext: false }))).toBe(
      false,
    )
  })
})
