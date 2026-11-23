/**
 * Selección recordada de las subpestañas.
 *
 * La ruta de la app ya conserva la página y la lección al recargar (está en el
 * hash), pero el índice de las subpestañas vivía solo en `useState`. Estas
 * funciones guardan ese índice en `localStorage` de forma tolerante: sin
 * almacenamiento o con datos corruptos se usa el valor por defecto.
 */

const PREFIX = 'pdc.tabs.v1.'

function storage(): Storage | null {
  try {
    return typeof localStorage === 'undefined' ? null : localStorage
  } catch {
    return null
  }
}

function clamp(index: number, count: number): number {
  if (count <= 0) return 0
  if (!Number.isInteger(index)) return 0
  return Math.min(Math.max(0, index), count - 1)
}

export function readTabSelection(
  key: string | undefined,
  count: number,
  fallback: number,
): number {
  const safeFallback = clamp(fallback, count)
  if (key === undefined) return safeFallback

  try {
    const raw = storage()?.getItem(`${PREFIX}${key}`)
    if (raw === null || raw === undefined) return safeFallback
    const parsed = Number.parseInt(raw, 10)
    return Number.isInteger(parsed) ? clamp(parsed, count) : safeFallback
  } catch {
    return safeFallback
  }
}

export function writeTabSelection(key: string | undefined, index: number): void {
  if (key === undefined) return
  try {
    storage()?.setItem(`${PREFIX}${key}`, String(index))
  } catch {
    // Sin localStorage la pestaña sigue funcionando durante la sesión.
  }
}
