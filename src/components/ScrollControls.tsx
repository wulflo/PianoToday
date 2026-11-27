/**
 * F8-008 — Atajos de desplazamiento al inicio y al final de la página.
 *
 * Botones fijos en la esquina inferior izquierda. No cambian la ruta ni el
 * estado de la app: solo llaman a `window.scrollTo` con el comportamiento
 * suave salvo que el sistema pida movimiento reducido.
 */
import { useSettings } from '../state/settings'

function prefersReducedMotion(): boolean {
  return (
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

export function ScrollControls() {
  const { t } = useSettings()

  const goTo = (bottom: boolean) => {
    window.scrollTo({
      top: bottom ? document.documentElement.scrollHeight : 0,
      behavior: prefersReducedMotion() ? 'auto' : 'smooth',
    })
  }

  return (
    <div className="scroll-controls" role="group" aria-label={t('scroll.group')}>
      <button
        type="button"
        className="scroll-control"
        aria-label={t('scroll.top')}
        title={t('scroll.top')}
        onClick={() => goTo(false)}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path
            d="M6 14l6-6 6 6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      <button
        type="button"
        className="scroll-control"
        aria-label={t('scroll.bottom')}
        title={t('scroll.bottom')}
        onClick={() => goTo(true)}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path
            d="M6 10l6 6 6-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  )
}
