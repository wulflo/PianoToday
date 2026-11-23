import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

/**
 * Ámbito de reproducción dentro de una lección.
 *
 * Todas las subpestañas de una lección están montadas a la vez (las inactivas
 * solo se ocultan con `hidden`) y comparten un único motor de audio. Sin este
 * ámbito, las notas que suenan —y las teclas que mantiene el MIDI— iluminan la
 * misma altura en todas las partituras y teclados de la lección, incluso en
 * pestañas que no se están viendo.
 *
 * Cada subsección reclama el ámbito cuando el alumno interactúa con ella y solo
 * esa subsección recibe las notas activas. El proveedor vive dentro de
 * `LessonPlayer`, por lo que al cambiar de lección el ámbito vuelve a empezar:
 * un resaltado de otra lección nunca puede filtrarse aquí.
 */

interface ActiveScope {
  active: string | null
  claim: (id: string) => void
}

const ActiveScopeContext = createContext<ActiveScope | null>(null)
const SectionScopeContext = createContext<string | null>(null)

const NO_NOTES: ReadonlyArray<number> = []
const NO_IDS: ReadonlyArray<string> = []

export interface PlaybackScopeProviderProps {
  children: ReactNode
}

export function PlaybackScopeProvider({ children }: PlaybackScopeProviderProps) {
  const [active, setActive] = useState<string | null>(null)
  const claim = useCallback((id: string) => setActive(id), [])
  const value = useMemo(() => ({ active, claim }), [active, claim])
  return (
    <ActiveScopeContext.Provider value={value}>
      {children}
    </ActiveScopeContext.Provider>
  )
}

export interface SectionScopeProviderProps {
  /** Identificador único de la subsección dentro de la lección. */
  id: string
  children: ReactNode
}

/** Asocia a todo su contenido con una subsección de la lección. */
export function SectionScopeProvider({ id, children }: SectionScopeProviderProps) {
  return (
    <SectionScopeContext.Provider value={id}>
      {children}
    </SectionScopeContext.Provider>
  )
}

export interface SectionScope {
  /** `true` cuando esta subsección es la que reclama el audio actual. */
  isActive: boolean
  /** Marca esta subsección como origen del audio que suena. */
  claim: () => void
  /** Se expanden en el contenedor de la subsección. */
  scopeProps: {
    onPointerDownCapture: () => void
    onFocusCapture: () => void
  }
}

/**
 * Devuelve el ámbito de una subsección. Sin `id`, usa el provider más cercano,
 * de modo que los componentes anidados (`Staff`, `Keyboard`, `ExercisePlayer`)
 * hereden automáticamente la subsección en la que están.
 */
export function useSectionScope(id?: string): SectionScope {
  const active = useContext(ActiveScopeContext)
  const inherited = useContext(SectionScopeContext)
  const target = id ?? inherited

  const claim = useCallback(() => {
    if (target !== null) active?.claim(target)
  }, [active, target])

  return {
    isActive: target !== null && active?.active === target,
    claim,
    scopeProps: {
      onPointerDownCapture: claim,
      onFocusCapture: claim,
    },
  }
}

export interface ScopedPlayback {
  /** Notas del motor que deben iluminarse en este componente. */
  activeNotes: ReadonlyArray<number>
  /** Si las notas mantenidas por MIDI deben sumarse a las anteriores. */
  includeMidiNotes: boolean
}

/**
 * Filtra las notas activas según el ámbito de la subsección.
 * Fuera de una lección (demo, repertorio, canciones, ejercicios sueltos) no hay
 * provider y el comportamiento es el de siempre.
 */
function useScopeBelongs(): boolean {
  const active = useContext(ActiveScopeContext)
  const target = useContext(SectionScopeContext)
  return active === null || (target !== null && active.active === target)
}

export function useScopedPlayback(notes: ReadonlyArray<number>): ScopedPlayback {
  const belongs = useScopeBelongs()

  return useMemo(
    () => ({
      activeNotes: belongs ? notes : NO_NOTES,
      includeMidiNotes: belongs,
    }),
    [belongs, notes],
  )
}

/** Los ids del timeline también viajan con el ámbito de la subsección. */
export function useScopedActiveIds(ids: ReadonlyArray<string>): ReadonlyArray<string> {
  const belongs = useScopeBelongs()
  return useMemo(() => (belongs ? ids : NO_IDS), [belongs, ids])
}
