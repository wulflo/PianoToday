import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { ScrollControls } from '../src/components/ScrollControls'
import { SettingsProvider } from '../src/state/settings'

describe('F8-008 — botones de desplazamiento', () => {
  it('ofrece dos botones etiquetados y desplaza al inicio y al final', () => {
    const scrollTo = vi.spyOn(window, 'scrollTo').mockImplementation(() => undefined)
    render(
      <SettingsProvider>
        <ScrollControls />
      </SettingsProvider>,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Ir al inicio de la página' }))
    expect(scrollTo).toHaveBeenCalledWith(
      expect.objectContaining({ top: 0, behavior: 'smooth' }),
    )

    fireEvent.click(screen.getByRole('button', { name: 'Ir al final de la página' }))
    expect(scrollTo).toHaveBeenLastCalledWith(
      expect.objectContaining({
        top: document.documentElement.scrollHeight,
        behavior: 'smooth',
      }),
    )
    scrollTo.mockRestore()
  })

  it('respeta prefers-reduced-motion', () => {
    const original = Object.getOwnPropertyDescriptor(window, 'matchMedia')
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      value: () =>
        ({
          matches: true,
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
        }) as unknown as MediaQueryList,
    })
    const scrollTo = vi.spyOn(window, 'scrollTo').mockImplementation(() => undefined)
    render(
      <SettingsProvider>
        <ScrollControls />
      </SettingsProvider>,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Ir al inicio de la página' }))
    expect(scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'auto' })
    vi.restoreAllMocks()
    if (original) Object.defineProperty(window, 'matchMedia', original)
    else Reflect.deleteProperty(window, 'matchMedia')
  })
})
