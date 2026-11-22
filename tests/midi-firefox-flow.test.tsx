import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, type Mock } from 'vitest'
import { MidiPermissionFlow } from '../src/components/MidiPermissionFlow'
import type { MidiBrowserInfo } from '../src/midi/browser'
import { MidiProvider } from '../src/midi/context'
import { SettingsProvider, dictionaryFor } from '../src/state/settings'
import { installFakeMidi, type FakeMidi } from './helpers/fake-midi'

const firefox: MidiBrowserInfo = {
  family: 'firefox',
  label: 'Firefox',
  platform: 'Linux x86_64',
  userAgent: 'Mozilla/5.0 (X11; Linux x86_64; rv:108.0) Gecko/20100101 Firefox/108.0',
}

const firefoxAndroid: MidiBrowserInfo = {
  ...firefox,
  platform: 'Linux armv8l',
  userAgent: 'Mozilla/5.0 (Android 14; Mobile; rv:108.0) Gecko/108.0 Firefox/108.0',
}

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

function renderFlow(browserInfo: MidiBrowserInfo = firefox) {
  return render(
    <SettingsProvider>
      <MidiProvider>
        <MidiPermissionFlow browserInfo={browserInfo} />
      </MidiProvider>
    </SettingsProvider>,
  )
}

describe('F7-007 — flujo Firefox del complemento de permiso', () => {
  it('explica los dos diálogos y la necesidad de conectar el teclado primero', () => {
    renderFlow()

    fireEvent.click(screen.getByRole('button', { name: 'Conectar entrada MIDI' }))

    expect(screen.getByText(/dos diálogos/)).toBeInTheDocument()
    expect(screen.getByText(/Continuar con la instalación/)).toBeInTheDocument()
    expect(screen.getByText(/Añadir/)).toBeInTheDocument()
    expect(screen.getByText(/encendé y conectá el teclado/)).toBeInTheDocument()
  })

  it('ante el SecurityError aconseja conectar y ofrece volver a buscar', async () => {
    const request = navigator.requestMIDIAccess as unknown as Mock
    request.mockRejectedValueOnce(
      new DOMException(
        'WebMIDI requires a site permission add-on to activate',
        'SecurityError',
      ),
    )
    renderFlow()

    fireEvent.click(screen.getByRole('button', { name: 'Conectar entrada MIDI' }))
    fireEvent.click(screen.getByRole('button', { name: 'Pedir permiso MIDI' }))

    await waitFor(() =>
      expect(
        screen.getByText(/Primero encendé y conectá el teclado/),
      ).toBeInTheDocument(),
    )
    const rescan = screen.getByRole('button', {
      name: 'Volver a buscar dispositivos',
    })
    fireEvent.click(rescan)
    await waitFor(() => expect(request.mock.calls).toHaveLength(2))
  })

  it('avisa de que Firefox Android no tiene Web MIDI', () => {
    renderFlow(firefoxAndroid)

    expect(
      screen.getByText(/Firefox para Android no admite Web MIDI/),
    ).toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: 'Conectar entrada MIDI' }),
    ).not.toBeInTheDocument()
  })

  it('tiene los textos nuevos en español y en inglés', () => {
    for (const language of ['es', 'en'] as const) {
      const dictionary = dictionaryFor(language)
      for (const key of [
        'midi.firefox.intro',
        'midi.firefox.addon.help',
        'midi.firefox.rescan',
        'midi.firefox.android',
      ]) {
        expect(dictionary[key], `${key} en ${language}`).toBeTruthy()
      }
    }
  })
})
