import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import {
  PlaybackScopeProvider,
  SectionScopeProvider,
  useScopedPlayback,
  useSectionScope,
} from '../src/audio/playback-scope'
import { Staff } from '../src/components/Staff'
import { DEFAULT_SETTINGS, SettingsProvider } from '../src/state/settings'
import { parsePitch } from '../src/theory/pitch'

function Probe({ id }: { id: string }) {
  const scope = useSectionScope(id)
  const { activeNotes, includeMidiNotes } = useScopedPlayback([60])
  return (
    <div>
      <button type="button" onClick={scope.claim}>
        reclamar {id}
      </button>
      <span data-testid={`notas-${id}`}>{activeNotes.join(',')}</span>
      <span data-testid={`midi-${id}`}>{String(includeMidiNotes)}</span>
    </div>
  )
}

function StaffProbe({ id }: { id: string }) {
  const scope = useSectionScope(id)
  return (
    <SectionScopeProvider id={id}>
      <button type="button" onClick={scope.claim}>
        tocar {id}
      </button>
      <Staff
        label={`Partitura ${id}`}
        measures={[{ id: `${id}.c4`, pitches: [parsePitch('C4')] }]}
        activeNotes={[60]}
      />
    </SectionScopeProvider>
  )
}

describe('ámbito de reproducción de una lección', () => {
  it('sin proveedor conserva el comportamiento de siempre', () => {
    render(<Probe id="suelto" />)
    expect(screen.getByTestId('notas-suelto')).toHaveTextContent('60')
    expect(screen.getByTestId('midi-suelto')).toHaveTextContent('true')
  })

  it('solo ilumina la subsección que reclama el audio', () => {
    render(
      <PlaybackScopeProvider>
        <SectionScopeProvider id="uno">
          <Probe id="uno" />
        </SectionScopeProvider>
        <SectionScopeProvider id="dos">
          <Probe id="dos" />
        </SectionScopeProvider>
      </PlaybackScopeProvider>,
    )

    expect(screen.getByTestId('notas-uno')).toBeEmptyDOMElement()
    expect(screen.getByTestId('notas-dos')).toBeEmptyDOMElement()

    fireEvent.click(screen.getByRole('button', { name: 'reclamar uno' }))
    expect(screen.getByTestId('notas-uno')).toHaveTextContent('60')
    expect(screen.getByTestId('midi-uno')).toHaveTextContent('true')
    expect(screen.getByTestId('notas-dos')).toBeEmptyDOMElement()
    expect(screen.getByTestId('midi-dos')).toHaveTextContent('false')

    fireEvent.click(screen.getByRole('button', { name: 'reclamar dos' }))
    expect(screen.getByTestId('notas-uno')).toBeEmptyDOMElement()
    expect(screen.getByTestId('notas-dos')).toHaveTextContent('60')
  })

  it('no resalta la misma nota en otra partitura de la lección', async () => {
    render(
      <SettingsProvider initialSettings={DEFAULT_SETTINGS}>
        <PlaybackScopeProvider>
          <StaffProbe id="a" />
          <StaffProbe id="b" />
        </PlaybackScopeProvider>
      </SettingsProvider>,
    )

    await waitFor(() =>
      expect(document.querySelectorAll('[data-staff-note]')).toHaveLength(2),
    )
    const highlighted = () =>
      [...document.querySelectorAll('[data-staff-note]')].map(
        (note) => note.getAttribute('data-highlighted') === 'true',
      )
    expect(highlighted()).toEqual([false, false])

    fireEvent.click(screen.getByRole('button', { name: 'tocar a' }))
    await waitFor(() => expect(highlighted()).toEqual([true, false]))

    fireEvent.click(screen.getByRole('button', { name: 'tocar b' }))
    await waitFor(() => expect(highlighted()).toEqual([false, true]))
  })
})
