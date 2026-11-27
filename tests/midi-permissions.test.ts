import { describe, expect, it } from 'vitest'
import type { MidiBrowserInfo } from '../src/midi/browser'
import { isWindowsNonChromium, permissionHelpFor } from '../src/midi/permissions'

function info(
  label: string,
  platform = 'Linux x86_64',
  family: MidiBrowserInfo['family'] = 'chromium',
): MidiBrowserInfo {
  const android = platform === 'Android'
  return {
    family,
    label,
    platform: android ? 'Linux armv8l' : platform,
    userAgent: android ? 'Mozilla/5.0 (Linux; Android 14)' : '',
  }
}

describe('F7-006 — ayuda de permisos con rutas verificadas', () => {
  it.each([
    ['Chrome', 'chrome://settings/content/midiDevices'],
    ['Chromium', 'chrome://settings/content/midiDevices'],
    ['Brave', 'brave://settings/content/midiDevices'],
    ['Opera', 'opera://settings/content/midiDevices'],
  ])('%s usa su ruta verificada', (label, url) => {
    const help = permissionHelpFor(info(label))
    expect(help.settingsUrl).toBe(url)
    expect(help.useSiteInfo).toBe(true)
    expect(help.useAndroidMenu).toBe(false)
  })

  it.each(['Edge', 'Vivaldi'])(
    '%s no recibe una ruta inventada',
    (label) => {
      const help = permissionHelpFor(info(label))
      expect(help.settingsUrl).toBeNull()
      expect(help.useSiteInfo).toBe(true)
    },
  )

  it.each(['Chrome', 'Samsung Internet'])(
    '%s en Android usa el menú del sitio',
    (label) => {
      const help = permissionHelpFor(info(label, 'Android'))
      expect(help.settingsUrl).toBeNull()
      expect(help.useSiteInfo).toBe(false)
      expect(help.useAndroidMenu).toBe(true)
    },
  )

  it('detecta Windows con navegador no Chromium para mostrar la ayuda específica', () => {
    const windowsFirefox = info('Firefox', 'Win32', 'firefox')
    windowsFirefox.userAgent = 'Mozilla/5.0 (Windows NT 10.0; rv:...)'

    expect(isWindowsNonChromium(windowsFirefox)).toBe(true)
    expect(
      isWindowsNonChromium(info('Chrome', 'Win32', 'chromium')),
    ).toBe(false)
    expect(
      isWindowsNonChromium(info('Firefox', 'Linux x86_64', 'firefox')),
    ).toBe(false)
    expect(
      isWindowsNonChromium(info('Safari', 'Win32', 'webkit-mac')),
    ).toBe(true)
  })

  it('no prescribe rutas de Chromium a Firefox ni a WebKit', () => {
    for (const family of ['firefox', 'webkit-mac', 'webkit-ios'] as const) {
      const help = permissionHelpFor(info('Firefox', 'Linux x86_64', family))
      expect(help.settingsUrl).toBeNull()
      expect(help.useSiteInfo).toBe(false)
      expect(help.useAndroidMenu).toBe(false)
    }
  })
})
