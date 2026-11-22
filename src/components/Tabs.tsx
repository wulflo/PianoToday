import { useId, useState, type KeyboardEvent, type ReactNode } from 'react'

/**
 * Subpestañas horizontales con navegación de teclado.
 *
 * Es puramente presentacional: recibe las etiquetas y los paneles ya montados.
 * El panel inactivo se oculta con `hidden`, de modo que solo el contenido
 * visible entra en el orden de tabulación y en el árbol de accesibilidad.
 */

export interface TabItem {
  id: string
  label: string
  content: ReactNode
}

export interface TabsProps {
  /** Etiqueta accesible de la barra de pestañas. */
  label: string
  items: readonly TabItem[]
  /** Índice seleccionado al abrir. Por defecto, el primero. */
  initialSelected?: number
}

/** Índice siguiente según la tecla pulsada, con envolvente. */
function navigate(key: string, current: number, count: number): number | null {
  if (count === 0) return null
  switch (key) {
    case 'ArrowRight':
      return (current + 1) % count
    case 'ArrowLeft':
      return (current + count - 1) % count
    case 'Home':
      return 0
    case 'End':
      return count - 1
    default:
      return null
  }
}

export function Tabs({ label, items, initialSelected = 0 }: TabsProps) {
  const baseId = `tab-${useId().replace(/:/g, '')}`
  const [selected, setSelected] = useState(initialSelected)
  const count = items.length

  const select = (index: number) => {
    setSelected(index)
    document.getElementById(`${baseId}-tab-${index}`)?.focus()
  }

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const next = navigate(event.key, index, count)
    if (next === null) return
    event.preventDefault()
    select(next)
  }

  return (
    <div className="tabs" data-tabs={baseId}>
      <div className="tablist" role="tablist" aria-label={label}>
        {items.map((item, index) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            id={`${baseId}-tab-${index}`}
            className="tab"
            aria-selected={selected === index}
            aria-controls={`${baseId}-panel-${index}`}
            tabIndex={selected === index ? 0 : -1}
            onClick={() => setSelected(index)}
            onKeyDown={(event) => onKeyDown(event, index)}
          >
            <span className="tab-label">{item.label}</span>
            <span className="tab-indicator" aria-hidden="true" />
          </button>
        ))}
      </div>
      <div className="tabpanels">
        {items.map((item, index) => (
          <div
            key={item.id}
            role="tabpanel"
            id={`${baseId}-panel-${index}`}
            className="tabpanel"
            aria-labelledby={`${baseId}-tab-${index}`}
            hidden={selected !== index}
          >
            {item.content}
          </div>
        ))}
      </div>
    </div>
  )
}
