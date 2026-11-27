import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { MidiPermissionFlow } from '../src/components/MidiPermissionFlow'
import { MidiProvider } from '../src/midi/context'
import { SettingsProvider, dictionaryFor } from '../src/state/settings'
import { installFakeMidi, type FakeMidi } from './helpers/fake-midi'

let fake: FakeMidi
const secureDescriptor = Object.getOwnPropertyDescriptor(
  window,
  'isSecureContext',
)

beforeEach(() => {
  Object.defineProperty(window, 'isSecureContext', {
    configurable: true,
    value: true,
  })
  fake = installFakeMidi()
})

afterEach(() => {
  fake.restore()
  if (secureDescriptor) {
    Object.defineProperty(window, 'isSecureContext', secureDescriptor)
  } else {
    Reflect.deleteProperty(window, 'isSecureContext')
  }
})

function renderFlow() {
  return render(
    <SettingsProvider>
      <MidiProvider>
        <MidiPermissionFlow />
      </MidiProvider>
    </SettingsProvider>,
  )
}

describe('F7-006 — explicación previa del permiso MIDI', () => {
  it('explica antes de pedir y respeta la cancelación', async () => {
    renderFlow()

    fireEvent.click(screen.getByRole('button', { name: 'Conectar entrada MIDI' }))
    expect(
      screen.getByText(/va a pedir permiso para consultar tus dispositivos MIDI/),
    ).toBeInTheDocument()
    expect(navigator.requestMIDIAccess).not.toHaveBeenCalled()

    fireEvent.click(screen.getByRole('button', { name: 'Ahora no' }))
    expect(
      screen.queryByText(/va a pedir permiso para consultar tus dispositivos MIDI/),
    ).not.toBeInTheDocument()
    expect(navigator.requestMIDIAccess).not.toHaveBeenCalled()
  })

  it('pide el permiso solo después de confirmar', async () => {
    renderFlow()

    fireEvent.click(screen.getByRole('button', { name: 'Conectar entrada MIDI' }))
    fireEvent.click(screen.getByRole('button', { name: 'Pedir permiso MIDI' }))

    await waitFor(() => expect(navigator.requestMIDIAccess).toHaveBeenCalled())
  })

  it('muestra ayuda de bloqueo cuando el permiso se deniega', async () => {
    Object.defineProperty(navigator, 'requestMIDIAccess', {
      configurable: true,
      writable: true,
      value: async () => {
        throw new DOMException('Permission denied', 'SecurityError')
      },
    })
    renderFlow()

    fireEvent.click(screen.getByRole('button', { name: 'Conectar entrada MIDI' }))
    fireEvent.click(screen.getByRole('button', { name: 'Pedir permiso MIDI' }))

    await waitFor(() =>
      expect(screen.getByText(/El permiso está bloqueado para este sitio/)).toBeInTheDocument(),
    )
  })

  it('muestra ayuda específica en Windows con navegador no Chromium', async () => {
    Object.defineProperty(navigator, 'requestMIDIAccess', {
      configurable: true,
      writable: true,
      value: async () => {
        throw new DOMException('Permission denied', 'SecurityError')
      },
    })
    render(
      <SettingsProvider>
        <MidiProvider>
          <MidiPermissionFlow
            browserInfo={{
              family: 'firefox',
              label: 'Firefox',
              platform: 'Win32',
              userAgent: 'Mozilla/5.0 (Windows NT 10.0; rv:...)',
            }}
          />
        </MidiProvider>
      </SettingsProvider>,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Conectar entrada MIDI' }))
    fireEvent.click(screen.getByRole('button', { name: 'Pedir permiso MIDI' }))

    await waitFor(() =>
      expect(
        screen.getByText(/En Windows, los navegadores no basados en Chromium/),
      ).toBeInTheDocument(),
    )
  })

  it('explica por qué un diálogo descartado no es una denegación', async () => {
    Object.defineProperty(navigator, 'requestMIDIAccess', {
      configurable: true,
      writable: true,
      value: async () => {
        throw new DOMException('Permission dismissed', 'AbortError')
      },
    })
    renderFlow()

    fireEvent.click(screen.getByRole('button', { name: 'Conectar entrada MIDI' }))
    fireEvent.click(screen.getByRole('button', { name: 'Pedir permiso MIDI' }))

    await waitFor(() =>
      expect(screen.getByText(/Descartaste el diálogo de permiso/)).toBeInTheDocument(),
    )
  })

  it('tiene los textos nuevos en español y en inglés', () => {
    for (const language of ['es', 'en'] as const) {
      const dictionary = dictionaryFor(language)
      for (const key of [
        'midi.connect.intro',
        'midi.connect.accept',
        'midi.connect.cancel',
        'midi.help.denied.url',
        'midi.help.denied.siteInfo',
        'midi.help.denied.android',
        'midi.help.dismissed',
        'midi.help.insecure',
        'midi.help.windowsNonChromium',
      ]) {
        expect(dictionary[key], `${key} en ${language}`).toBeTruthy()
      }
    }
  })
})
