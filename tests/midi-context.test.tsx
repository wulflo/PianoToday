import { useEffect } from 'react'
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, type Mock } from 'vitest'
import { MidiProvider, useMidi } from '../src/midi/context'
import {
  installFakeMidi,
  NOTE_OFF,
  NOTE_ON,
  type FakeMidi,
} from './helpers/fake-midi'

let fake: FakeMidi
const permissionsDescriptor = Object.getOwnPropertyDescriptor(
  navigator,
  'permissions',
)

const secureDescriptor = Object.getOwnPropertyDescriptor(
  window,
  'isSecureContext',
)

beforeEach(() => {
  // jsdom sirve desde http://localhost y marca el contexto como inseguro; la
  // app real se sirve por HTTPS, que es donde Web MIDI está disponible.
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
  if (permissionsDescriptor) {
    Object.defineProperty(navigator, 'permissions', permissionsDescriptor)
  } else {
    Reflect.deleteProperty(navigator, 'permissions')
  }
})

function setPermissionState(state: string): void {
  Object.defineProperty(navigator, 'permissions', {
    configurable: true,
    writable: true,
    value: { query: async () => ({ state, onchange: null }) },
  })
}

function rejectWith(name: string, message: string): void {
  fake.restore()
  Object.defineProperty(navigator, 'requestMIDIAccess', {
    configurable: true,
    writable: true,
    value: async () => {
      throw new DOMException(message, name)
    },
  })
}

function Probe() {
  const midi = useMidi()
  return (
    <div>
      <span data-testid="status">{midi.status}</span>
      <span data-testid="held">{midi.heldNotes.join(',')}</span>
      <span data-testid="devices">
        {midi.devices.map((device) => device.name).join(',')}
      </span>
      <span data-testid="last">
        {midi.lastEvent === null
          ? '-'
          : `${midi.lastEvent.note}:${midi.lastEvent.velocity}`}
      </span>
      <span data-testid="profile">{midi.profile}</span>
      <span data-testid="permission">{midi.permission ?? '-'}</span>
      <span data-testid="outputs">
        {midi.outputs.map((output) => output.name).join(',')}
      </span>
      <span data-testid="raw">
        {midi.lastRaw === null ? '-' : midi.lastRaw.data.join(',')}
      </span>
      <span data-testid="events">{midi.events.length}</span>
      <span data-testid="failure">
        {midi.failure === null
          ? '-'
          : `${midi.failure.name}:${midi.failure.message}`}
      </span>
      <span data-testid="failureKind">{midi.failureKind ?? '-'}</span>
      <button type="button" onClick={() => void midi.connect()}>
        conectar
      </button>
      <button type="button" onClick={midi.clearEvents}>
        limpiar
      </button>
    </div>
  )
}

function Subscriber({ received }: { received: number[] }) {
  const { subscribe } = useMidi()
  useEffect(
    () => subscribe((event) => void received.push(event.note)),
    [received, subscribe],
  )
  return null
}

async function connect(): Promise<void> {
  fireEvent.click(screen.getByRole('button', { name: 'conectar' }))
  await waitFor(() =>
    expect(screen.getByTestId('status')).toHaveTextContent('listening'),
  )
}

describe('F6-033 — contexto MIDI compartido', () => {
  it('conecta, enumera el PSR-373 y sigue las notas pulsadas', async () => {
    render(
      <MidiProvider>
        <Probe />
      </MidiProvider>,
    )

    await connect()
    expect(fake.inputs.get('in-1')?.onmidimessage).not.toBeNull()
    // La conexión abre el puerto explícitamente: en algunos navegadores el
    // listener no recibe nada hasta llamar a `open()`.
    expect(fake.inputs.get('in-1')?.openCalls).toBeGreaterThan(0)
    expect(screen.getByTestId('devices')).toHaveTextContent('Yamaha PSR-373')
    expect(screen.getByTestId('profile')).toHaveTextContent('yamaha-psr-373')
    expect(screen.getByTestId('permission')).not.toHaveTextContent('-')

    const input = fake.inputs.get('in-1')
    act(() => input?.emit([NOTE_ON, 60, 96], 1000))
    expect(screen.getByTestId('held')).toHaveTextContent('60')
    expect(screen.getByTestId('last')).toHaveTextContent('60:96')
    expect(screen.getByTestId('raw')).toHaveTextContent('144,60,96')

    act(() => input?.emit([NOTE_ON, 64, 90], 1100))
    expect(screen.getByTestId('held')).toHaveTextContent('60,64')

    act(() => input?.emit([NOTE_OFF, 60, 0], 1200))
    expect(screen.getByTestId('held')).toHaveTextContent('64')

    // Note on con velocity 0 equivale a note off.
    act(() => input?.emit([NOTE_ON, 64, 0], 1300))
    expect(screen.getByTestId('held')).toBeEmptyDOMElement()

    fireEvent.click(screen.getByRole('button', { name: 'limpiar' }))
    expect(screen.getByTestId('last')).toHaveTextContent('-')
  })

  it('entrega todas las pulsaciones al suscriptor aunque events se recorte', async () => {
    const received: number[] = []
    render(
      <MidiProvider>
        <Probe />
        <Subscriber received={received} />
      </MidiProvider>,
    )

    await connect()
    const input = fake.inputs.get('in-1')
    act(() => {
      for (let index = 0; index < 1100; index += 1) {
        input?.emit([NOTE_ON, 60, 80], 1000 + index)
      }
    })

    // `events` conserva las últimas 1024 pulsaciones; el suscriptor, todas.
    expect(screen.getByTestId('events')).toHaveTextContent('1024')
    expect(received).toHaveLength(1100)
    expect(received.at(-1)).toBe(60)
  })

  it('detecta entradas que se conectan después', async () => {
    fake.restore()
    fake = installFakeMidi([])
    render(
      <MidiProvider>
        <Probe />
      </MidiProvider>,
    )

    await connect()
    expect(screen.getByTestId('devices')).toBeEmptyDOMElement()

    fake.addInput('in-2', 'Digital Piano', 'Yamaha')
    act(() => fake.notifyStateChange())
    await waitFor(() =>
      expect(screen.getByTestId('devices')).toHaveTextContent('Digital Piano'),
    )
    expect(fake.inputs.get('in-2')?.onmidimessage).not.toBeNull()
  })

  it('queda en denied solo si la denegación es real', async () => {
    rejectWith('SecurityError', 'Permission denied')
    render(
      <MidiProvider>
        <Probe />
      </MidiProvider>,
    )

    fireEvent.click(screen.getByRole('button', { name: 'conectar' }))
    await waitFor(() =>
      expect(screen.getByTestId('status')).toHaveTextContent('denied'),
    )
    expect(screen.getByTestId('failureKind')).toHaveTextContent(
      'permission-denied',
    )
    expect(screen.getByTestId('failure')).toHaveTextContent(
      'SecurityError:Permission denied',
    )
  })

  it('muestra error con ayuda ante el complemento de Firefox', async () => {
    const message = 'WebMIDI requires a site permission add-on to activate'
    rejectWith('SecurityError', message)
    render(
      <MidiProvider>
        <Probe />
      </MidiProvider>,
    )

    fireEvent.click(screen.getByRole('button', { name: 'conectar' }))
    await waitFor(() =>
      expect(screen.getByTestId('status')).toHaveTextContent('error'),
    )
    expect(screen.getByTestId('failureKind')).toHaveTextContent(
      'addon-required-or-no-device',
    )
    expect(screen.getByTestId('failure')).toHaveTextContent(message)
  })

  it('no trata un diálogo descartado como permiso denegado', async () => {
    rejectWith('AbortError', 'Permission dismissed')
    render(
      <MidiProvider>
        <Probe />
      </MidiProvider>,
    )

    fireEvent.click(screen.getByRole('button', { name: 'conectar' }))
    await waitFor(() =>
      expect(screen.getByTestId('status')).toHaveTextContent('error'),
    )
    expect(screen.getByTestId('failureKind')).toHaveTextContent(
      'permission-dismissed',
    )
  })

  it('no fija denied al montar aunque Permissions API diga denied', async () => {
    setPermissionState('denied')
    render(
      <MidiProvider>
        <Probe />
      </MidiProvider>,
    )

    await waitFor(() =>
      expect(screen.getByTestId('permission')).toHaveTextContent('denied'),
    )
    expect(screen.getByTestId('status')).toHaveTextContent('idle')
    expect((navigator.requestMIDIAccess as unknown as Mock).mock.calls).toHaveLength(0)
  })

  it('autoconecta solo cuando el permiso está concedido', async () => {
    setPermissionState('granted')
    render(
      <MidiProvider>
        <Probe />
      </MidiProvider>,
    )

    await waitFor(() =>
      expect(screen.getByTestId('status')).toHaveTextContent('listening'),
    )
  })

  it('informa de la ausencia de API con el fallo tipado', async () => {
    fake.restore()
    render(
      <MidiProvider>
        <Probe />
      </MidiProvider>,
    )

    fireEvent.click(screen.getByRole('button', { name: 'conectar' }))
    await waitFor(() =>
      expect(screen.getByTestId('failureKind')).toHaveTextContent('unsupported'),
    )
    expect(screen.getByTestId('failure')).toHaveTextContent('NotSupportedError:')
    expect(screen.getByTestId('status')).toHaveTextContent('unsupported')
  })
})
