import type { Notation } from '../notation'
import { midiNameWithOctave } from '../notation'
import { midiOf, type Pitch } from '../theory/pitch'
import { createHighlightPlanner } from './highlight'
import { verticalExtent } from './layout'
import { pitchToVexKey, type StaffDuration } from './vex'

export interface StaffMeasure {
  /** Identificador estable para tests y eventos. */
  id?: string
  /** Una nota o varias para un acorde. */
  pitches: Pitch[]
  duration?: StaffDuration
  highlighted?: boolean
  /** Marca `Ped.` debajo de la nota cuando empieza una resonancia. */
  pedalPress?: boolean
  /** Marca `*` debajo de la nota cuando se levanta el pedal. */
  pedalRelease?: boolean
  /** Cifrado que se dibuja encima de la nota. */
  chordSymbol?: string
  /** Número de dedo que se dibuja debajo de la nota. */
  finger?: number
  /** Varios dedos para un acorde, en el mismo orden que las alturas. */
  fingers?: readonly number[]
  /** Traza una barra de compás inmediatamente antes de esta nota. */
  barline?: boolean
}

export interface RenderStaffOptions {
  measures: StaffMeasure[]
  clef?: 'treble' | 'bass'
  keySignature?: string
  timeSignature?: string
  width?: number
  height?: number
  notation?: Notation
  activeNotes?: ReadonlyArray<number>
  /**
   * Ids de los eventos que están sonando. Si se indican, solo se resaltan esas
   * ocurrencias aunque la altura se repita en la partitura.
   */
  activeIds?: ReadonlyArray<string>
  /** Dibuja los números de dedo; se respeta la preferencia del usuario. */
  showFingering?: boolean
  onNoteClick?: (payload: { index: number; midis: number[]; id?: string }) => void
}

export interface RenderedStaffNote {
  index: number
  id?: string
  midis: number[]
  highlighted: boolean
  element?: SVGElement
}

export interface RenderedStaff {
  notes: RenderedStaffNote[]
  /** Altura real usada; puede superar la pedida para que entren las notas extremas. */
  height: number
  /** Ancho real del SVG; puede superar el pedido si el contenido no entra. */
  width: number
}

const NOTE_COLOR = '#1d1f23'
const FINGER_FONT_SIZE = 9
const BARLINE_OFFSET = 10
/** Separación mínima desde el principio de la pauta para no tapar la armadura. */
const BARLINE_MIN_X = 20
const STAVE_Y = 34
const EDGE_MARGIN = 8
/** Margen exterior izquierdo y derecho del SVG respecto al pentagrama. */
const STAVE_SIDE_MARGIN = 10

/**
 * Dibuja un pentagrama en `container` y devuelve las referencias a las notas.
 * VexFlow se importa dinámicamente para que quede en un chunk separado.
 */
export async function renderStaff(
  container: HTMLDivElement,
  options: RenderStaffOptions,
): Promise<RenderedStaff> {
  const {
    measures,
    clef = 'treble',
    keySignature = 'C',
    timeSignature = '4/4',
    width = 640,
    height = 180,
    notation = 'c',
    activeNotes = [],
    activeIds = [],
    showFingering = true,
    onNoteClick,
  } = options

  const VF = await import('vexflow')
  container.replaceChildren()

  const extent = verticalExtent(
    VF,
    measures.map((measure) => ({
      keys: measure.pitches.map(pitchToVexKey),
      duration: measure.duration ?? 'q',
      chordSymbol: measure.chordSymbol !== undefined,
      pedal: Boolean(measure.pedalPress || measure.pedalRelease),
      finger:
        showFingering &&
        (measure.finger !== undefined || (measure.fingers?.length ?? 0) > 0),
    })),
    clef,
  )
  const minHeight = Math.max(150, Math.round(height))
  const staveY = STAVE_Y + Math.max(0, EDGE_MARGIN - (STAVE_Y + extent.top))
  const renderHeight = Math.max(minHeight, staveY + extent.bottom + EDGE_MARGIN)

  const planner = createHighlightPlanner(
    measures.map((measure) => ({
      id: measure.id,
      midis: measure.pitches.map(midiOf),
    })),
    activeNotes,
    activeIds,
  )
  const highlightedFlags: boolean[] = []
  const vexNotes = measures.map((measure, index) => {
    const note = new VF.StaveNote({
      keys: measure.pitches.map(pitchToVexKey),
      duration: measure.duration ?? 'q',
      clef,
    })
    note.setAttribute('id', `pdc-note-${index}`)
    const midis = measure.pitches.map(midiOf)
    const active = planner.shouldHighlight({ id: measure.id, midis })
    const highlighted = Boolean(measure.highlighted) || active
    highlightedFlags.push(highlighted)
    note.addClass('vf-staff-note')
    if (measure.pedalPress) {
      const mark = new VF.Annotation('Ped.')
      mark.setVerticalJustification(VF.Annotation.VerticalJustify.BOTTOM)
      note.addModifier(mark)
    }
    if (measure.pedalRelease) {
      const mark = new VF.Annotation('*')
      mark.setVerticalJustification(VF.Annotation.VerticalJustify.BOTTOM)
      note.addModifier(mark)
    }
    if (measure.chordSymbol) {
      const symbol = new VF.ChordSymbol()
      symbol.addText(measure.chordSymbol)
      note.addModifier(symbol, 0)
    }
    const fingerLabels =
      measure.fingers ??
      (measure.finger === undefined ? [] : [measure.finger])
    if (showFingering && fingerLabels.length > 0) {
      const finger = new VF.Annotation(fingerLabels.join('·'))
      finger.setVerticalJustification(VF.Annotation.VerticalJustify.BOTTOM)
      finger.setFont('Arial', FINGER_FONT_SIZE)
      note.addModifier(finger)
    }
    return note
  })

  const voice =
    measures.length === 0 ? null : new VF.Voice(timeSignature).setStrict(false)
  if (voice !== null) {
    voice.addTickables(vexNotes)
    VF.Accidental.applyAccidentals([voice], keySignature)
  }

  const requestedWidth = Math.max(280, Math.round(width))
  const stave = new VF.Stave(
    STAVE_SIDE_MARGIN,
    staveY,
    requestedWidth - STAVE_SIDE_MARGIN * 2,
  )
  stave.addClef(clef)
  if (keySignature !== 'C') stave.addKeySignature(keySignature)
  stave.addTimeSignature(timeSignature)

  // Si el contenido no cabe en el ancho pedido, el SVG crece. El componente
  // permite desplazamiento horizontal para verlo completo.
  let renderWidth = requestedWidth
  if (voice !== null) {
    const noteStart = stave.getNoteStartX() - STAVE_SIDE_MARGIN
    const minTotal = new VF.Formatter()
      .joinVoices([voice])
      .preCalculateMinTotalWidth([voice])
    if (Number.isFinite(minTotal) && minTotal > 0) {
      renderWidth = Math.max(
        requestedWidth,
        Math.ceil(
          noteStart +
            minTotal +
            STAVE_SIDE_MARGIN * 2 +
            EDGE_MARGIN * 2,
        ),
      )
    }
  }
  if (renderWidth !== requestedWidth) {
    stave.setWidth(renderWidth - STAVE_SIDE_MARGIN * 2)
  }

  const renderer = new VF.Renderer(container, VF.Renderer.Backends.SVG)
  renderer.resize(renderWidth, renderHeight)
  const context = renderer.getContext()
  stave.setContext(context).draw()

  const staveElement = container.querySelector('.vf-stave')
  if (staveElement !== null) {
    staveElement.setAttribute('data-staff-stave', '')
    staveElement.setAttribute('data-stave-x', String(STAVE_SIDE_MARGIN))
    staveElement.setAttribute(
      'data-stave-width',
      String(renderWidth - STAVE_SIDE_MARGIN * 2),
    )
  }

  if (voice === null) {
    return { notes: [], height: renderHeight, width: renderWidth }
  }

  new VF.Formatter().joinVoices([voice]).formatToStave([voice], stave, {
    alignRests: false,
  })
  voice.draw(context, stave)

  // El contenido guarda el compás de cada evento, pero VexFlow dibuja una sola
  // pauta: sin estas barras la división en compases es casi invisible.
  // Los divisores de compás se agrupan en su propio vector, separado de los
  // grupos `vf-stavenote`: así el mástil de una nota nunca se confunde con una
  // barra de tiempo, aunque compartan orientación vertical.
  const svgElement = container.querySelector('svg')
  const barlineGroup = svgElement?.ownerDocument.createElementNS(
    'http://www.w3.org/2000/svg',
    'g',
  )
  if (svgElement !== null && barlineGroup !== undefined) {
    barlineGroup.setAttribute('class', 'vf-barlines')
    barlineGroup.setAttribute('data-staff-barlines', '')
    svgElement.appendChild(barlineGroup)
  }

  const rectsBefore = container.querySelectorAll('svg rect').length
  for (const [index, measure] of measures.entries()) {
    if (measure.barline !== true) continue
    // `getAbsoluteX()` es el centro de la nota, pero la caja de un accidental
    // empieza ~10 px antes: restar un offset fijo dibujaba la barra encima del
    // sostenido/bemol. Se coloca en el centro del hueco entre la caja de la
    // última nota del compás anterior y la de la primera del nuevo.
    const previousBox = vexNotes[index - 1]?.getBoundingBox()
    const currentBox = vexNotes[index]?.getBoundingBox()
    const currentLeft =
      currentBox?.getX() ??
      (vexNotes[index]?.getAbsoluteX() ?? BARLINE_MIN_X)
    const x =
      previousBox === undefined
        ? Math.max(BARLINE_MIN_X, currentLeft - BARLINE_OFFSET)
        : Math.max(
            BARLINE_MIN_X,
            (previousBox.getX() + previousBox.getW() + currentLeft) / 2,
          )
    new VF.Barline(VF.Barline.type.SINGLE).drawVerticalBar(stave, x)
  }
  const barlines = container.querySelectorAll('svg rect')
  for (let index = rectsBefore; index < barlines.length; index += 1) {
    const barline = barlines[index]
    barline.setAttribute('data-staff-barline', '')
    barlineGroup?.appendChild(barline)
  }

  const references: RenderedStaffNote[] = []
  vexNotes.forEach((note, index) => {
    const measure = measures[index]
    const element = container.querySelector(
      `#vf-pdc-note-${index}`,
    ) as SVGElement | null
    const midis = measure.pitches.map(midiOf)
    if (element) {
      element.setAttribute('data-staff-note', String(index))
      element.setAttribute('data-midi', midis.join(','))
      element.setAttribute('data-highlighted', String(highlightedFlags[index]))
      // Todas las piezas de la nota quedan marcadas como un único vector.
      for (const part of element.querySelectorAll('.vf-stem, .vf-notehead')) {
        part.setAttribute(
          'data-note-part',
          part.classList.contains('vf-stem') ? 'stem' : 'head',
        )
      }
      for (const stem of element.querySelectorAll('.vf-stem path')) {
        stem.setAttribute('data-note-stem', '')
      }
      element.setAttribute('data-x', note.getAbsoluteX().toFixed(2))
      const box = note.getBoundingBox()
      if (box !== undefined) {
        element.setAttribute('data-box-x', box.getX().toFixed(2))
        element.setAttribute('data-box-width', box.getW().toFixed(2))
      }
      element.setAttribute('tabindex', '0')
      element.setAttribute('role', 'button')
      element.setAttribute(
        'aria-label',
        measure.pitches
          .map((pitch) => midiNameWithOctave(midiOf(pitch), notation))
          .join(', '),
      )
      const activate = () => onNoteClick?.({ index, midis, id: measure.id })
      element.addEventListener('click', activate)
      element.addEventListener('keydown', (event) => {
        const keyboardEvent = event as KeyboardEvent
        if (keyboardEvent.key === 'Enter' || keyboardEvent.key === ' ') {
          keyboardEvent.preventDefault()
          activate()
        }
      })
    }
    references.push({
      index,
      id: measure.id,
      midis,
      highlighted: highlightedFlags[index],
      element: element ?? undefined,
    })
  })

  return { notes: references, height: renderHeight, width: renderWidth }
}

export function describeStaffNotes(
  measures: StaffMeasure[],
  notation: Notation = 'c',
): string {
  return measures
    .map((measure) =>
      measure.pitches.map((pitch) => midiNameWithOctave(midiOf(pitch), notation)).join(' + '),
    )
    .join(' · ')
}

export const NOTE_COLOR_FALLBACK = NOTE_COLOR
