import { useEffect, useMemo, useState } from 'react'
import { blockedMessageKey, getMidiBrowserInfo } from '../midi/browser'
import {
  getMidiPermissionState,
  type MidiPermissionState,
} from '../midi/detect'
import { useSettings } from '../state/settings'

/**
 * Aviso sobre el soporte MIDI del navegador.
 *
 * Safari (y algunos navegadores móviles) no implementan Web MIDI. El aviso lo
 * explica y recuerda que la autoevaluación manual sigue disponible: la app
 * nunca depende de MIDI para funcionar.
 */
export function MidiSupportNotice() {
  const { t } = useSettings()
  const [state, setState] = useState<MidiPermissionState | null>(null)
  const family = useMemo(() => getMidiBrowserInfo().family, [])

  useEffect(() => {
    let active = true
    getMidiPermissionState().then((next) => {
      if (active) setState(next)
    })
    return () => {
      active = false
    }
  }, [])

  if (state === null) return null

  const message =
    state === 'unsupported'
      ? t('midi.unsupported')
      : state === 'denied'
        ? t(blockedMessageKey(family))
        : t('midi.available')

  return (
    <aside className="notice" role="status">
      <p>{message}</p>
    </aside>
  )
}
