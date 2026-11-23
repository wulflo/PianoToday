import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { Tabs } from '../src/components/Tabs'

const items = [
  { id: 'one', label: 'Uno', content: <p>Contenido uno</p> },
  { id: 'two', label: 'Dos', content: <p>Contenido dos</p> },
  { id: 'three', label: 'Tres', content: <p>Contenido tres</p> },
]

describe('Subpestañas', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('muestra solo el panel seleccionado y expone la relación ARIA', () => {
    render(<Tabs label="Secciones" items={items} />)

    const tab = screen.getByRole('tab', { name: 'Uno' })
    expect(tab).toHaveAttribute('aria-selected', 'true')
    expect(tab).toHaveAttribute('tabindex', '0')
    expect(screen.getByRole('tab', { name: 'Dos' })).toHaveAttribute(
      'tabindex',
      '-1',
    )
    expect(screen.getByText('Contenido uno')).toBeVisible()
    expect(screen.queryByText('Contenido dos')).not.toBeVisible()

    fireEvent.click(screen.getByRole('tab', { name: 'Dos' }))
    expect(screen.getByRole('tab', { name: 'Dos' })).toHaveAttribute(
      'aria-selected',
      'true',
    )
    expect(screen.getByText('Contenido dos')).toBeVisible()
    expect(screen.queryByText('Contenido uno')).not.toBeVisible()
  })

  it('navega con flechas, Inicio y Fin con envolvente', () => {
    render(<Tabs label="Secciones" items={items} />)

    const first = screen.getByRole('tab', { name: 'Uno' })
    first.focus()
    fireEvent.keyDown(first, { key: 'ArrowRight' })
    expect(screen.getByRole('tab', { name: 'Dos' })).toHaveFocus()

    const second = screen.getByRole('tab', { name: 'Dos' })
    fireEvent.keyDown(second, { key: 'End' })
    expect(screen.getByRole('tab', { name: 'Tres' })).toHaveFocus()

    const third = screen.getByRole('tab', { name: 'Tres' })
    fireEvent.keyDown(third, { key: 'ArrowRight' })
    expect(first).toHaveFocus()

    fireEvent.keyDown(first, { key: 'ArrowLeft' })
    expect(third).toHaveFocus()

    fireEvent.keyDown(third, { key: 'Home' })
    expect(first).toHaveFocus()
  })

  it('recuerda la pestaña elegida al volver a montar', () => {
    const first = render(
      <Tabs label="Secciones" items={items} persistKey="leccion:uno" />,
    )
    fireEvent.click(screen.getByRole('tab', { name: 'Dos' }))
    first.unmount()

    render(<Tabs label="Secciones" items={items} persistKey="leccion:uno" />)
    expect(screen.getByRole('tab', { name: 'Dos' })).toHaveAttribute(
      'aria-selected',
      'true',
    )
    expect(screen.getByText('Contenido dos')).toBeVisible()
  })

  it('no guarda la selección si no se indica persistKey', () => {
    const first = render(<Tabs label="Secciones" items={items} />)
    fireEvent.click(screen.getByRole('tab', { name: 'Tres' }))
    first.unmount()

    render(<Tabs label="Secciones" items={items} />)
    expect(screen.getByRole('tab', { name: 'Uno' })).toHaveAttribute(
      'aria-selected',
      'true',
    )
  })
})
