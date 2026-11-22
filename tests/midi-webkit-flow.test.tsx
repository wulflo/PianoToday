import { fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { MidiPermissionFlow } from '../src/components/MidiPermissionFlow'
import type { MidiBrowserInfo } from '../src/midi/browser'
import { SAFARI_WEBMIDI_EXTENSION_URL } from '../src/midi/permissions'
import { MidiProvider } from '../src/midi/context'
import { SettingsProvider, dictionaryFor } from '../src/state/settings'
import { installFakeMidi, type FakeMidi } from './helpers/fake-midi'

const safariMac: MidiBrowserInfo = {
  family: 'webkit-mac',
  label: 'Safari',
  platform: 'MacIntel',
  userAgent:
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Safari/605.1.15',
}

const safariIOS: MidiBrowserInfo = {
  ...safariMac,
  family: 'webkit-ios',
  platform: 'iPhone',
  userAgent:
    'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1',
}

let fake: FakeMidi

beforeEach(() => {
  fake = installFakeMidi()
})

afterEach(() => {
  fake.restore()
})

function renderFlow(browserInfo: MidiBrowserInfo) {
  return render(
    <SettingsProvider>
      <MidiProvider>
        <MidiPermissionFlow browserInfo={browserInfo} />
      </MidiProvider>
    </SettingsProvider>,
  )
}

describe('F7-008 — flujo Safari y WebKit', () => {
  it('explica en iOS que ningún navegador ofrece Web MIDI', () => {
    renderFlow(safariIOS)

    expect(
      screen.getByText(/ningún navegador ofrece Web MIDI/),
    ).toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: 'Conectar entrada MIDI' }),
    ).not.toBeInTheDocument()
  })

  it('ofrece la extensión de terceros en macOS sin API, sin respaldo oficial', () => {
    fake.restore()
    renderFlow(safariMac)

    expect(screen.getByText(/Safari no incluye Web MIDI/)).toBeInTheDocument()
    expect(screen.getByText(/Web MIDI for Safari/)).toBeInTheDocument()
    expect(screen.getByText(new RegExp(SAFARI_WEBMIDI_EXTENSION_URL.replaceAll('.', '\\.')))).toBeInTheDocument()
    expect(screen.getByText(/no la respaldamos/)).toBeInTheDocument()
    expect(screen.getAllByText(/teclado virtual y la autoevaluación manual/).length).toBeGreaterThan(0)
  })

  it('usa el flujo normal si la API existe (por ejemplo, con la extensión)', () => {
    renderFlow(safariMac)

    const connect = screen.getByRole('button', {
      name: 'Conectar entrada MIDI',
    })
    fireEvent.click(connect)
    expect(screen.getByRole('button', { name: 'Pedir permiso MIDI' })).toBeInTheDocument()
  })

  it('tiene los textos nuevos en español y en inglés', () => {
    for (const language of ['es', 'en'] as const) {
      const dictionary = dictionaryFor(language)
      for (const key of [
        'midi.webkit.ios',
        'midi.webkit.mac.guide',
        'midi.webkit.fallback',
      ]) {
        expect(dictionary[key], `${key} en ${language}`).toBeTruthy()
      }
    }
  })
})
