/**
 * F6-033 — Diagnóstico MIDI para Ajustes.
 *
 * Muestra exactamente lo que ve el navegador: permiso, puertos de entrada y
 * salida, y el último mensaje recibido. Sirve para distinguir un problema de
 * la app (no hay permiso) de uno del sistema/cable (no aparece ningún puerto).
 */
import { useMemo, useState } from 'react'
import { midiNameWithOctave } from '../notation'
import { getMidiBrowserInfo } from '../midi/browser'
import { MidiPermissionFlow } from './MidiPermissionFlow'
import { midiNoteName, type MidiDeviceProfile } from '../midi/device'
import { useMidi, type MidiStatus } from '../midi/context'
import { useSettings } from '../state/settings'

function statusKey(status: MidiStatus): string {
  return `midi.diag.status.${status}`
}

function profileLabel(profile: MidiDeviceProfile): string {
  return profile === 'yamaha-psr-373'
    ? 'Yamaha PSR-373'
    : 'MIDI genérico'
}

export function MidiDiagnostics() {
  const { settings, t } = useSettings()
  const {
    status,
    permission,
    devices,
    outputs,
    profile,
    lastRaw,
    lastEvent,
    error,
    failure,
    supported,
    disconnect,
  } = useMidi()
  const browser = useMemo(() => getMidiBrowserInfo(), [])
  const secureContext =
    typeof window === 'undefined' ? false : window.isSecureContext
  const [copyState, setCopyState] = useState<'idle' | 'ok' | 'error'>('idle')

  const report = [
    `${t('midi.diag.browser')}: ${browser.label} (${browser.family})`,
    `${t('midi.diag.secure')}: ${
      secureContext ? t('midi.diag.secure.yes') : t('midi.diag.secure.no')
    }`,
    `${t('midi.diag.permission')}: ${permission ?? '-'}`,
    `${t('midi.diag.status')}: ${status}`,
    `${t('midi.diag.failure')}: ${
      failure === null ? '-' : `${failure.name}: ${failure.message}`
    }`,
    `${t('midi.diag.inputs')}: ${devices.length}`,
    `${t('midi.diag.outputs')}: ${outputs.length}`,
  ].join('\n')

  const copyReport = async () => {
    try {
      await navigator.clipboard.writeText(report)
      setCopyState('ok')
    } catch {
      setCopyState('error')
    }
  }

  const bytes = lastRaw?.data
    .map((byte) => byte.toString(16).padStart(2, '0').toUpperCase())
    .join(' ')
  const noteStatus = lastRaw?.data[0] === undefined ? 0 : lastRaw.data[0] & 0xf0
  const isNoteMessage = noteStatus === 0x80 || noteStatus === 0x90
  const note =
    lastEvent !== null && lastEvent.velocity > 0
      ? midiNameWithOctave(lastEvent.note, settings.notation)
      : isNoteMessage && lastRaw !== null && lastRaw.data.length >= 2
        ? midiNoteName(lastRaw.data[1])
        : null

  return (
    <section
      className="panel midi-diagnostics"
      aria-labelledby="midi-diagnostics-title"
    >
      <h2 id="midi-diagnostics-title">{t('midi.diag.title')}</h2>
      <p className="muted">{t('midi.diag.lead')}</p>

      <dl className="midi-diag-grid">
        <div>
          <dt>{t('midi.diag.webMidi')}</dt>
          <dd>
            {supported ? t('midi.diag.available') : t('midi.diag.unavailable')}
          </dd>
        </div>
        <div>
          <dt>{t('midi.diag.permission')}</dt>
          <dd>
            {permission === null
              ? '—'
              : t(`midi.diag.permission.${permission}`)}
          </dd>
        </div>
        <div>
          <dt>{t('midi.diag.status')}</dt>
          <dd>{t(statusKey(status))}</dd>
        </div>
        <div>
          <dt>{t('midi.diag.profile')}</dt>
          <dd>{profileLabel(profile)}</dd>
        </div>
        <div>
          <dt>{t('midi.diag.browser')}</dt>
          <dd>
            {browser.label} · {browser.family}
          </dd>
        </div>
        <div>
          <dt>{t('midi.diag.secure')}</dt>
          <dd>
            {secureContext
              ? t('midi.diag.secure.yes')
              : t('midi.diag.secure.no')}
          </dd>
        </div>
        <div>
          <dt>{t('midi.diag.failure')}</dt>
          <dd>
            {failure === null
              ? '—'
              : `${failure.name}: ${failure.message}`}
          </dd>
        </div>
      </dl>

      <div className="midi-diag-actions">
        <MidiPermissionFlow />
        <button
          type="button"
          className="button-secondary"
          onClick={disconnect}
          disabled={status !== 'listening'}
        >
          {t('midi.diag.disconnect')}
        </button>
      </div>

      <div className="midi-diag-copy">
        <button
          type="button"
          className="button-secondary"
          onClick={() => void copyReport()}
        >
          {t('midi.diag.copyReport')}
        </button>
        {copyState !== 'idle' && (
          <span role="status" className="muted">
            {t(copyState === 'ok' ? 'midi.diag.copied' : 'midi.diag.copyError')}
          </span>
        )}
      </div>

      {error !== null && <p role="alert">{t('midi.diag.error', { message: error })}</p>}

      <h3>{t('midi.diag.inputs')}</h3>
      {devices.length === 0 ? (
        <p className="muted">{t('midi.diag.noInputs')}</p>
      ) : (
        <ul className="midi-device-list">
          {devices.map((device) => (
            <li key={device.id}>
              <strong>{device.name}</strong>
              {device.manufacturer !== '' && (
                <span className="muted"> · {device.manufacturer}</span>
              )}
              <span className="midi-device-state">
                {t(`midi.diag.state.${device.state}`)}
              </span>
            </li>
          ))}
        </ul>
      )}

      <h3>{t('midi.diag.outputs')}</h3>
      {outputs.length === 0 ? (
        <p className="muted">{t('midi.diag.noOutputs')}</p>
      ) : (
        <ul className="midi-device-list">
          {outputs.map((device) => (
            <li key={device.id}>
              <strong>{device.name}</strong>
              <span className="midi-device-state">
                {t(`midi.diag.state.${device.state}`)}
              </span>
            </li>
          ))}
        </ul>
      )}

      <h3>{t('midi.diag.last')}</h3>
      {lastRaw === null ? (
        <p className="muted">{t('midi.diag.waiting')}</p>
      ) : (
        <p className="midi-diag-raw">
          <strong>{lastRaw.portName}</strong> · <code>{bytes}</code>
          {note !== null && ` · ${t('midi.diag.note', { note })}`}
        </p>
      )}

      <p className="muted midi-diag-tip">{t('midi.diag.tip')}</p>
    </section>
  )
}
