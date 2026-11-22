import { expect, test } from '@playwright/test'

/**
 * F7-011 — recorridos del flujo de permiso MIDI.
 *
 * Chromium se prueba con el permiso concedido y con un rechazo simulado.
 * Firefox y WebKit se cubren con mocks inyectados antes de cargar la app:
 * este host no tiene esos navegadores reales garantizados y el resultado
 * documentado como verificado es el del mock, no el de un navegador físico.
 */
const CONNECT = 'Conectar entrada MIDI'
const ACCEPT = 'Pedir permiso MIDI'

async function openSettings(page: import('@playwright/test').Page) {
  await page.goto('/#/ajustes')
  await expect(
    page.getByRole('heading', { level: 1, name: 'Ajustes' }),
  ).toBeVisible()
  await page.getByRole('tab', { name: 'MIDI' }).click()
}

async function clickConnect(page: import('@playwright/test').Page) {
  await page.getByRole('button', { name: CONNECT }).click()
  await page.getByRole('button', { name: ACCEPT }).click()
}

test.describe('flujo de permiso MIDI', () => {
  test('Chromium con permiso concedido conecta el teclado', async ({
    page,
    context,
    browserName,
  }) => {
    test.skip(browserName !== 'chromium')
    await context.grantPermissions(['midi'] as never)
    await page.addInitScript(() => {
      const input = {
        id: 'in-1',
        name: 'Yamaha PSR-373',
        manufacturer: 'Yamaha',
        state: 'connected',
        onmidimessage: null,
        open: async () => undefined,
      }
      Object.defineProperty(navigator, 'requestMIDIAccess', {
        configurable: true,
        value: async () => ({
          inputs: new Map([['in-1', input]]),
          outputs: new Map(),
          onstatechange: null,
        }),
      })
    })

    await openSettings(page)

    // Con el permiso ya concedido el contexto se autoconecta sin gesto previo.
    await expect(page.locator('.midi-status.is-connected')).toBeVisible()
    await expect(
      page.locator('.midi-status.is-connected').getByText('Yamaha PSR-373'),
    ).toBeVisible()
  })

  test('Chromium con permiso bloqueado muestra ayuda', async ({
    page,
    browserName,
  }) => {
    test.skip(browserName !== 'chromium')
    await page.addInitScript(() => {
      Object.defineProperty(navigator, 'requestMIDIAccess', {
        configurable: true,
        value: async () => {
          throw new DOMException('Permission denied', 'SecurityError')
        },
      })
    })

    await openSettings(page)
    await clickConnect(page)

    await expect(
      page
        .locator('.midi-diagnostics')
        .getByText(/El permiso está bloqueado para este sitio/),
    ).toBeVisible()
  })

  test('Firefox con el mensaje del complemento aconseja conectar el teclado', async ({
    page,
    browserName,
  }) => {
    test.skip(browserName !== 'firefox')
    await page.addInitScript(() => {
      Object.defineProperty(navigator, 'requestMIDIAccess', {
        configurable: true,
        value: async () => {
          throw new DOMException(
            'WebMIDI requires a site permission add-on to activate',
            'SecurityError',
          )
        },
      })
    })

    await openSettings(page)
    await clickConnect(page)

    await expect(
      page
        .locator('.midi-diagnostics')
        .getByText(/Primero encendé y conectá el teclado/),
    ).toBeVisible()
    await expect(
      page
        .locator('.midi-diagnostics')
        .getByRole('button', { name: 'Volver a buscar dispositivos' }),
    ).toBeVisible()
  })

  test('WebKit sin API ofrece la guía opcional y el fallback manual', async ({
    page,
    browserName,
  }) => {
    test.skip(browserName !== 'webkit')
    await page.addInitScript(() => {
      Object.defineProperty(navigator, 'requestMIDIAccess', {
        configurable: true,
        value: undefined,
      })
    })

    await openSettings(page)

    await expect(page.getByText(/Safari no incluye Web MIDI/)).toBeVisible()
    await expect(page.getByText(/teclado virtual y la autoevaluación manual/)).toBeVisible()
  })
})
