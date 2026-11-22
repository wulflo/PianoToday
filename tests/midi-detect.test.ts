import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  describeMidiFailure,
  getMidiPermissionState,
  isWebMidiSupported,
  requestMidiAccess,
} from '../src/midi/detect'

// jsdom no trae Web MIDI: se instala y se retira la API en cada test.
const requestDescriptor = Object.getOwnPropertyDescriptor(
  navigator,
  'requestMIDIAccess',
)
const permissionsDescriptor = Object.getOwnPropertyDescriptor(
  navigator,
  'permissions',
)
const secureDescriptor = Object.getOwnPropertyDescriptor(
  window,
  'isSecureContext',
)

type RequestFn = (options?: { sysex?: boolean }) => Promise<MIDIAccess>

function setRequest(value: RequestFn | undefined): void {
  Object.defineProperty(navigator, 'requestMIDIAccess', {
    configurable: true,
    writable: true,
    value,
  })
}

function setPermissions(value: unknown): void {
  Object.defineProperty(navigator, 'permissions', {
    configurable: true,
    writable: true,
    value,
  })
}

function setSecureContext(value: boolean): void {
  Object.defineProperty(window, 'isSecureContext', {
    configurable: true,
    value,
  })
}

function restore(
  descriptor: PropertyDescriptor | undefined,
  object: object,
  key: string,
): void {
  if (descriptor) Object.defineProperty(object, key, descriptor)
  else Reflect.deleteProperty(object, key)
}

afterEach(() => {
  restore(requestDescriptor, navigator, 'requestMIDIAccess')
  restore(permissionsDescriptor, navigator, 'permissions')
  restore(secureDescriptor, window, 'isSecureContext')
  vi.restoreAllMocks()
})

describe('F6-006 — Detección de Web MIDI', () => {
  it('detecta la ausencia de Web MIDI en jsdom', () => {
    setRequest(undefined)
    expect(isWebMidiSupported()).toBe(false)
  })
})

describe('F7-002 — requestMidiAccess devuelve un resultado tipado', () => {
  it('informa de la ausencia de API sin perder el contexto seguro', async () => {
    setRequest(undefined)
    const result = await requestMidiAccess()
    expect(result.ok).toBe(false)
    if (result.ok) return
    expect(result.failure.name).toBe('NotSupportedError')
    expect(result.failure.message).toMatch(/Web MIDI/)
    expect(result.failure.isSecureContext).toBe(window.isSecureContext)
  })

  it('pide acceso con sysex desactivado y devuelve el acceso', async () => {
    const access = {} as MIDIAccess
    const request = vi.fn(async () => access)
    setRequest(request)
    const result = await requestMidiAccess()
    expect(result).toEqual({ ok: true, access })
    expect(request).toHaveBeenCalledWith({ sysex: false })
  })

  it.each([
    'SecurityError',
    'NotAllowedError',
    'AbortError',
    'InvalidStateError',
  ])('conserva el nombre y el mensaje de %s', async (name) => {
    setSecureContext(true)
    setRequest(
      vi.fn(async () => {
        throw new DOMException('mensaje del navegador', name)
      }),
    )
    const result = await requestMidiAccess()
    expect(result.ok).toBe(false)
    if (result.ok) return
    expect(result.failure).toEqual({
      name,
      message: 'mensaje del navegador',
      isSecureContext: true,
    })
  })

  it('captura un contexto inseguro y un valor lanzado que no es Error', async () => {
    setSecureContext(false)
    setRequest(
      vi.fn(async () => {
        throw 'fallo extraño'
      }),
    )
    const result = await requestMidiAccess()
    expect(result.ok).toBe(false)
    if (result.ok) return
    expect(result.failure).toEqual({
      name: 'Error',
      message: 'fallo extraño',
      isSecureContext: false,
    })
  })

  it('describeMidiFailure conserva el nombre de un Error ordinario', () => {
    setSecureContext(true)
    expect(describeMidiFailure(new TypeError('valor malo'))).toEqual({
      name: 'TypeError',
      message: 'valor malo',
      isSecureContext: true,
    })
  })
})

describe('F7-002 — estado del permiso', () => {
  it('devuelve unsupported cuando no hay API', async () => {
    setRequest(undefined)
    expect(await getMidiPermissionState()).toBe('unsupported')
  })

  it('lee el estado que informa Permissions API', async () => {
    setRequest(vi.fn(async () => ({} as MIDIAccess)))
    setPermissions({ query: vi.fn(async () => ({ state: 'denied' })) })
    expect(await getMidiPermissionState()).toBe('denied')
  })

  it('devuelve prompt si Permissions API no está disponible', async () => {
    setRequest(vi.fn(async () => ({} as MIDIAccess)))
    setPermissions(undefined)
    expect(await getMidiPermissionState()).toBe('prompt')
  })
})
