import { describe, expect, it } from 'vitest'
import { validateContentBundle } from '../src/content/validate'
import { loadContentFromDisk } from '../scripts/lib/load-content'

/**
 * Auditoría de completitud pedagógica: el esquema valida campos, pero no
 * comprueba que la demo, la digitación o las pistas de ejecución estén presentes.
 * Estas invariantes se añadieron tras revisar las 79 lecciones (F8-004).
 */
async function realBundle() {
  const raw = await loadContentFromDisk()
  const result = validateContentBundle(raw)
  if (!result.bundle) throw new Error('El contenido real debería validar')
  return result.bundle
}

describe('F8-004 — Completitud pedagógica de las lecciones', () => {
  it('todas las lecciones publicadas tienen demo y digitación en la tarea', async () => {
    const bundle = await realBundle()
    for (const lesson of bundle.lessons) {
      const task = lesson.keyboardTask
      expect(task?.demoScore, `${lesson.id}: demoScore`).toBeDefined()
      expect(task?.fingeringEs, `${lesson.id}: fingeringEs`).toBeTruthy()
      expect(task?.fingeringEn, `${lesson.id}: fingeringEn`).toBeTruthy()
      const events = task?.demoScore?.events.length ?? 0
      expect(events, `${lesson.id}: eventos de la demo`).toBeGreaterThan(0)
      if (lesson.moduleId === 'M2') {
        expect(events, `${lesson.id}: demo derivada de las teclas`).toBe(
          task?.keys.length,
        )
      }
    }
  })

  it('m2-12 deja de ser la lección más débil: partitura y ejercicios', async () => {
    const bundle = await realBundle()
    const lesson = bundle.lessons.find((item) => item.id === 'lesson.m2-12')
    expect(lesson?.exerciseIds?.length).toBeGreaterThanOrEqual(3)
    expect(lesson?.sections.some((section) => section.kind === 'score')).toBe(true)
    expect(
      lesson?.sections.some((section) => section.kind === 'callout'),
    ).toBe(true)
  })

  it('las secciones enriquecidas aportan una pista o regla concreta', async () => {
    const bundle = await realBundle()
    const bodies = new Map<string, { es: string; en: string }>()
    for (const lesson of bundle.lessons) {
      for (const section of lesson.sections) {
        bodies.set(section.id, {
          es: section.bodyEs ?? '',
          en: section.bodyEn ?? '',
        })
      }
    }
    expect(bodies.get('sec.m0-01.demo')?.es).toContain('dos negras')
    expect(bodies.get('sec.m0-02.keyboard')?.es).toContain('Si4 y Do5')
    expect(bodies.get('sec.m2-02.score')?.es).toContain('Mi-Fa y Si-Do')
    expect(bodies.get('sec.m2-07.exercises')?.es).toContain('IV es Fa')
    expect(bodies.get('sec.m2-09.score')?.es).toContain('Faltan Fa y Si')
    expect(bodies.get('sec.m2-11.score')?.es).toContain('impresionismo')
    expect(bodies.get('sec.m2-12.thumb-warning')?.es).toContain('tensiona')
    expect(bodies.get('sec.m3-05.intro')?.es).toBeDefined()
  })
})
