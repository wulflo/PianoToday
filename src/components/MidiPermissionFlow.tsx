/**
 * F7-006 — Botón de conexión MIDI con explicación previa y ayuda contextual.
 *
 * El permiso se pide solo después de que la persona confirme qué va a ocurrir.
 * Si el fallo es de permiso, el texto se elige por la categoría del fallo y por
 * la familia del navegador; el mensaje crudo sigue en el diagnóstico de F7-010.
 */
import { useMemo, useState } from 'react'
import { getMidiBrowserInfo, type MidiBrowserInfo } from '../midi/browser'
import { useMidi } from '../midi/context'
import { permissionHelpFor } from '../midi/permissions'
import { useSettings } from '../state/settings'

export interface MidiPermissionFlowProps {
  /** La barra de estado y el panel de diagnóstico nombran distinto al botón. */
  variant?: 'status' | 'diagnostics'
  /** Se puede inyectar en los tests; la app usa la detección del navegador. */
  browserInfo?: MidiBrowserInfo
}

export function MidiPermissionFlow({
  variant = 'diagnostics',
  browserInfo,
}: MidiPermissionFlowProps = {}) {
  const { t } = useSettings()
  const { status, failureKind, connect, retry } = useMidi()
  const detected = useMemo(() => getMidiBrowserInfo(), [browserInfo])
  const info = browserInfo ?? detected
  const help = useMemo(() => permissionHelpFor(info), [info])
  const [confirming, setConfirming] = useState(false)

  if (
    info.family === 'firefox' &&
    /android/i.test(`${info.platform} ${info.userAgent}`)
  ) {
    return (
      <aside className="notice" role="status">
        <p>{t('midi.firefox.android')}</p>
      </aside>
    )
  }

  if (status === 'requesting' || status === 'unsupported') return null

  let helpText: string | null = null
  if (failureKind === 'permission-denied') {
    helpText = help.settingsUrl
      ? t('midi.help.denied.url', { url: help.settingsUrl })
      : help.useAndroidMenu
        ? t('midi.help.denied.android')
        : t('midi.help.denied.siteInfo')
  } else if (failureKind === 'permission-dismissed') {
    helpText = t('midi.help.dismissed')
  } else if (failureKind === 'insecure-context') {
    helpText = t('midi.help.insecure')
  } else if (failureKind === 'addon-required-or-no-device') {
    helpText =
      info.family === 'firefox'
        ? t('midi.firefox.addon.help')
        : t('midi.help.denied.siteInfo')
  }

  const request = () => {
    setConfirming(false)
    void (status === 'idle' ? connect() : retry())
  }

  if (confirming) {
    return (
      <div className="midi-permission-confirm" role="group">
        <p>
          {t(
            info.family === 'firefox'
              ? 'midi.firefox.intro'
              : 'midi.connect.intro',
          )}
        </p>
        <button type="button" className="button-primary" onClick={request}>
          {t('midi.connect.accept')}
        </button>
        <button
          type="button"
          className="button-secondary"
          onClick={() => setConfirming(false)}
        >
          {t('midi.connect.cancel')}
        </button>
      </div>
    )
  }

  return (
    <div className="midi-permission-actions">
      <button
        type="button"
        className="button-primary"
        onClick={() => {
          if (status === 'idle') setConfirming(true)
          else request()
        }}
      >
        {status === 'idle'
          ? t(variant === 'status' ? 'midi.status.connect' : 'midi.diag.connect')
          : failureKind === 'addon-required-or-no-device' &&
              info.family === 'firefox'
            ? t('midi.firefox.rescan')
            : t(variant === 'status' ? 'midi.status.retry' : 'midi.diag.retry')}
      </button>
      {helpText !== null && (
        <aside className="notice" role="status">
          <p>{helpText}</p>
        </aside>
      )}
    </div>
  )
}
