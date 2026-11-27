import { describe, expect, it } from 'vitest'
import {
  blockedMessageKey,
  browserLabel,
  detectBrowserFamily,
  getMidiBrowserInfo,
  type BrowserEnvironment,
} from '../src/midi/browser'
import type { MidiBrowserFamily } from '../src/midi/browser'

function env(overrides: Partial<BrowserEnvironment> = {}): BrowserEnvironment {
  return {
    userAgent:
      'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    vendor: 'Google Inc.',
    platform: 'Linux x86_64',
    maxTouchPoints: 0,
    hasChrome: true,
    // Chrome expone el prefijo webkit por compatibilidad: no basta para
    // clasificarlo como WebKit.
    hasWebkitAudio: true,
    hasInstallTrigger: false,
    ...overrides,
  }
}

const families: MidiBrowserFamily[] = [
  'chromium',
  'firefox',
  'webkit-mac',
  'webkit-ios',
  'other',
]

describe('F7-003 — familia de navegador por características', () => {
  const cases: Array<[string, BrowserEnvironment, MidiBrowserFamily]> = [
    [
      'Chrome de escritorio',
      env({}),
      'chromium',
    ],
    [
      'Edge',
      env({
        userAgent:
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 Edg/124.0.0.0',
      }),
      'chromium',
    ],
    [
      'Chrome Android',
      env({ platform: 'Linux armv8l', userAgent: env().userAgent + ' Mobile' }),
      'chromium',
    ],
    [
      'Firefox de escritorio',
      env({
        hasChrome: false,
        hasWebkitAudio: false,
        hasInstallTrigger: true,
        vendor: '',
        userAgent:
          'Mozilla/5.0 (X11; Linux x86_64; rv:108.0) Gecko/20100101 Firefox/108.0',
      }),
      'firefox',
    ],
    [
      'Waterfox en Windows se reconoce como Firefox',
      env({
        hasChrome: false,
        hasWebkitAudio: false,
        hasInstallTrigger: false,
        vendor: '',
        platform: 'Win32',
        userAgent:
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:115.0) Gecko/20100101 Waterfox/115.0',
      }),
      'firefox',
    ],
    [
      'Safari en Windows',
      env({
        hasChrome: false,
        hasWebkitAudio: false,
        vendor: 'Apple Computer, Inc.',
        platform: 'Win32',
        userAgent:
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/5.1.7 Safari/534.57.2',
      }),
      'webkit-mac',
    ],
    [
      'Safari en macOS',
      env({
        hasChrome: false,
        vendor: 'Apple Computer, Inc.',
        platform: 'MacIntel',
        userAgent:
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Safari/605.1.15',
      }),
      'webkit-mac',
    ],
    [
      'Safari en iPadOS',
      env({
        hasChrome: false,
        vendor: 'Apple Computer, Inc.',
        platform: 'MacIntel',
        maxTouchPoints: 5,
        userAgent:
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Safari/605.1.15',
      }),
      'webkit-ios',
    ],
    [
      'Chrome en iOS usa WebKit',
      env({
        platform: 'iPhone',
        maxTouchPoints: 1,
        userAgent:
          'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/124.0.0.0 Mobile/15E148 Safari/604.1',
      }),
      'webkit-ios',
    ],
    [
      'Firefox en iOS usa WebKit',
      env({
        platform: 'iPhone',
        maxTouchPoints: 1,
        hasChrome: false,
        userAgent:
          'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) FxiOS/124.0 Mobile/15E148 Safari/605.1.15',
      }),
      'webkit-ios',
    ],
    [
      'entorno desconocido',
      env({
        hasChrome: false,
        hasWebkitAudio: false,
        vendor: '',
        userAgent: 'Mozilla/5.0 (X11; Linux x86_64)',
      }),
      'other',
    ],
  ]

  it.each(cases)('%s → %s', (_name, environment, expected) => {
    expect(detectBrowserFamily(environment)).toBe(expected)
  })

  it('el nombre legible distingue derivados sin cambiar la familia', () => {
    const edge = env({
      userAgent:
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 Edg/124.0.0.0',
    })
    const samsung = env({
      userAgent: env().userAgent + ' SamsungBrowser/25.0',
    })
    const firefox = env({
      hasChrome: false,
      hasWebkitAudio: false,
      hasInstallTrigger: true,
      userAgent:
        'Mozilla/5.0 (X11; Linux x86_64; rv:108.0) Gecko/20100101 Firefox/108.0',
    })
    expect(detectBrowserFamily(edge)).toBe('chromium')
    expect(browserLabel(edge)).toBe('Edge')
    expect(browserLabel(samsung)).toBe('Samsung Internet')
    expect(browserLabel(firefox)).toBe('Firefox')
    expect(
      browserLabel(
        env({
          hasChrome: false,
          userAgent:
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:115.0) Gecko/20100101 LibreWolf/115.0',
        }),
      ),
    ).toBe('LibreWolf')
  })

  it('prefixa la etiqueta desde UA-CH cuando no hay token en el UA', () => {
    expect(
      browserLabel(
        env({
          userAgent: 'Mozilla/5.0 (X11; Linux x86_64)',
          brands: [{ brand: 'Vivaldi' }],
        }),
      ),
    ).toBe('Vivaldi')
  })

  it('un Chromium sin window.chrome no se confunde con WebKit', () => {
    // El Chrome de Playwright no expone window.chrome, pero su UA contiene
    // «Safari/» y el objeto webkitAudioContext; las dos señales solas engañan.
    const playwrightChrome = env({
      hasChrome: false,
      vendor: 'Google Inc.',
      userAgent:
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/158.0.0.0 Safari/537.36',
    })
    expect(detectBrowserFamily(playwrightChrome)).toBe('chromium')
    expect(browserLabel(playwrightChrome)).toBe('Chrome')
  })

  it('elige el texto de bloqueo según la familia', () => {
    expect(blockedMessageKey('chromium')).toBe('midi.blocked.chromium')
    expect(blockedMessageKey('firefox')).toBe('midi.blocked.firefox')
    expect(blockedMessageKey('webkit-mac')).toBe('midi.blocked.webkit')
    expect(blockedMessageKey('webkit-ios')).toBe('midi.blocked.webkit')
    expect(blockedMessageKey('other')).toBe('midi.blocked.other')
  })

  it('lee el navegador real sin lanzar aunque falten señales', () => {
    const info = getMidiBrowserInfo()
    expect(families).toContain(info.family)
    expect(typeof info.label).toBe('string')
    expect(typeof info.userAgent).toBe('string')
    expect(typeof info.platform).toBe('string')
  })
})
