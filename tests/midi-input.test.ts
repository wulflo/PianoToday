import { afterEach, describe, expect, it, vi, type Mock } from 'vitest'
import { isWebMidiSupported } from '../src/midi/detect'
import {
  classifyMidiFailure,
  type MidiFailureKind,
} from '../src/midi/failure'
import { connectMidiInput } from '../src/midi/input'
import { installFakeMidi, NOTE_ON, type FakeMidi } from './helpers/fake-midi'

let fake: FakeMidi | null = null

afterEach(() => {
  fake?.restore()
  fake = null
})

describe('F6-007 — Entrada MIDI', () => {
  it('no hay Web MIDI en jsdom', () => {
    expect(isWebMidiSupported()).toBe(false)
  })
})

describe('F7-002 — connectMidiInput propaga el fallo tipado', () => {
  it('no convierte un SecurityError en null', async () => {
    fake = installFakeMidi()
    const request = navigator.requestMIDIAccess as unknown as Mock
    request.mockRejectedValueOnce(
      new DOMException('El sitio no tiene permiso', 'SecurityError'),
    )

    const result = await connectMidiInput(() => undefined)

    expect(result.ok).toBe(false)
    if (result.ok) return
    expect(result.failure.name).toBe('SecurityError')
    expect(result.failure.message).toBe('El sitio no tiene permiso')
  })

  it('devuelve la conexión y sigue recibiendo notas cuando hay acceso', async () => {
    fake = installFakeMidi()
    const listener = vi.fn()

    const result = await connectMidiInput(listener)

    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.connection.inputs.map((input) => input.name)).toContain(
      'Yamaha PSR-373',
    )
    fake.inputs.get('in-1')?.emit([NOTE_ON, 60, 100])
    expect(listener).toHaveBeenCalledWith(
      expect.objectContaining({ note: 60, velocity: 100 }),
    )
    result.connection.disconnect()
  })
})

describe('F7-011 — un caso por categoría de fallo con fake-midi', () => {
  const secureDescriptor = Object.getOwnPropertyDescriptor(
    window,
    'isSecureContext',
  )

  afterEach(() => {
    if (secureDescriptor) {
      Object.defineProperty(window, 'isSecureContext', secureDescriptor)
    } else {
      Reflect.deleteProperty(window, 'isSecureContext')
    }
  })

  const cases: Array<[MidiFailureKind, boolean, string, string]> = [
    [
      'unsupported',
      true,
      'NotSupportedError',
      'Este navegador no expone la API Web MIDI.',
    ],
    [
      'insecure-context',
      false,
      'SecurityError',
      'Web MIDI only works in a secure context.',
    ],
    ['permission-denied', true, 'SecurityError', 'Permission denied'],
    ['permission-dismissed', true, 'AbortError', 'Permission dismissed'],
    [
      'addon-required-or-no-device',
      true,
      'SecurityError',
      'WebMIDI requires a site permission add-on to activate',
    ],
    ['unknown', true, 'InvalidStateError', 'Algo inesperado'],
  ]

  it.each(cases)(
    '%s se propaga con su nombre y mensaje',
    async (expected, secure, name, message) => {
      Object.defineProperty(window, 'isSecureContext', {
        configurable: true,
        value: secure,
      })
      fake = installFakeMidi()
      const request = navigator.requestMIDIAccess as unknown as Mock
      request.mockRejectedValueOnce(new DOMException(message, name))

      const result = await connectMidiInput(() => undefined)

      expect(result.ok).toBe(false)
      if (result.ok) return
      expect(result.failure.name).toBe(name)
      expect(result.failure.message).toBe(message)
      expect(result.failure.isSecureContext).toBe(secure)
      expect(classifyMidiFailure(result.failure)).toBe(expected)
    },
  )
})
