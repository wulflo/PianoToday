import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi, type Mock } from 'vitest'
import { MidiDiagnostics } from '../src/components/MidiDiagnostics'
import { MidiProvider } from '../src/midi/context'
import { SettingsProvider, dictionaryFor } from '../src/state/settings'

const secureDescriptor = Object.getOwnPropertyDescriptor(
  window,
  'isSecureContext',
)
const clipboardDescriptor = Object.getOwnPropertyDescriptor(
  navigator,
  'clipboard',
)
let writeText: Mock

beforeEach(() => {
  Object.defineProperty(window, 'isSecureContext', {
    configurable: true,
    value: true,
  })
  writeText = vi.fn(async () => undefined)
  Object.defineProperty(navigator, 'clipboard', {
    configurable: true,
    value: { writeText },
  })
  Object.defineProperty(navigator, 'requestMIDIAccess', {
    configurable: true,
    writable: true,
    value: async () => {
      throw new DOMException('Permission denied', 'SecurityError')
    },
  })
})

afterEach(() => {
  if (secureDescriptor) {
    Object.defineProperty(window, 'isSecureContext', secureDescriptor)
  } else {
    Reflect.deleteProperty(window, 'isSecureContext')
  }
  if (clipboardDescriptor) {
    Object.defineProperty(navigator, 'clipboard', clipboardDescriptor)
  } else {
    Reflect.deleteProperty(navigator, 'clipboard')
  }
  Reflect.deleteProperty(navigator, 'requestMIDIAccess')
})

describe('F7-010 — diagnóstico con datos reales e informe copiable', () => {
  it('muestra navegador, contexto seguro y el fallo con su nombre y mensaje', async () => {
    render(
      <SettingsProvider>
        <MidiProvider>
          <MidiDiagnostics />
        </MidiProvider>
      </SettingsProvider>,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Conectar entrada MIDI' }))
    fireEvent.click(screen.getByRole('button', { name: 'Pedir permiso MIDI' }))

    await waitFor(() =>
      expect(screen.getByText('SecurityError: Permission denied')).toBeInTheDocument(),
    )
    expect(screen.getAllByText(/Navegador/).length).toBeGreaterThan(0)
    expect(screen.getByText('sí (HTTPS)')).toBeInTheDocument()
  })

  it('copia un informe en texto plano sin el User-Agent', async () => {
    render(
      <SettingsProvider>
        <MidiProvider>
          <MidiDiagnostics />
        </MidiProvider>
      </SettingsProvider>,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Conectar entrada MIDI' }))
    fireEvent.click(screen.getByRole('button', { name: 'Pedir permiso MIDI' }))
    await waitFor(() =>
      expect(screen.getByText('SecurityError: Permission denied')).toBeInTheDocument(),
    )

    fireEvent.click(
      screen.getByRole('button', { name: 'Copiar informe de diagnóstico' }),
    )

    await waitFor(() => expect(writeText).toHaveBeenCalledTimes(1))
    const report = String(writeText.mock.calls[0]?.[0])
    expect(report).toContain('SecurityError: Permission denied')
    expect(report).toContain('sí (HTTPS)')
    expect(report).not.toContain(navigator.userAgent)
    expect(screen.getByText('Informe copiado.')).toBeInTheDocument()
  })

  it('tiene las claves del diagnóstico y del bloqueo en ambos idiomas', () => {
    for (const language of ['es', 'en'] as const) {
      const dictionary = dictionaryFor(language)
      for (const key of [
        'midi.diag.browser',
        'midi.diag.secure',
        'midi.diag.secure.yes',
        'midi.diag.secure.no',
        'midi.diag.failure',
        'midi.diag.copyReport',
        'midi.diag.copied',
        'midi.diag.copyError',
        'midi.blocked.chromium',
        'midi.blocked.firefox',
        'midi.blocked.webkit',
        'midi.blocked.other',
        'midi.denied',
        'midi.status.denied',
      ]) {
        expect(dictionary[key], `${key} en ${language}`).toBeTruthy()
      }
      expect(dictionary['midi.denied']).not.toMatch(/Chrome/)
      expect(dictionary['midi.status.denied']).not.toMatch(/Chrome/)
    }
  })
})
