import { DataManagementPanel } from '../components/DataManagementPanel'
import { MidiDiagnostics } from '../components/MidiDiagnostics'
import { MidiSupportNotice } from '../components/MidiSupportNotice'
import { SettingsPanel } from '../components/SettingsPanel'
import { Tabs } from '../components/Tabs'
import { TeacherNotice } from '../components/TeacherNotice'
import { useSettings } from '../state/settings'

/**
 * Pantalla de ajustes completa.
 *
 * Reúne las preferencias de estudio (notación, idioma, tema, volumen, tempo,
 * repaso y teclas), el diagnóstico MIDI y la gestión de datos (exportar,
 * importar y restablecer). Cada bloque vive en una subpestaña para que la
 * página no sea excesivamente larga. Los ajustes se guardan en `localStorage`
 * y en la tabla `settings` de Dexie; la exportación los incluye y el reseteo
 * vuelve a los valores por defecto.
 */
export function SettingsPage() {
  const { t } = useSettings()

  return (
    <main className="page" aria-labelledby="settings-page-title">
      <section className="hero">
        <p className="eyebrow">{t('settings.eyebrow')}</p>
        <h1 id="settings-page-title">{t('settings.title')}</h1>
        <p className="lede">{t('settings.lead')}</p>
      </section>

      <Tabs
        label={t('tabs.settings.label')}
        persistKey="settings"
        items={[
          {
            id: 'preferences',
            label: t('tabs.settings.preferences'),
            content: (
              <>
                <SettingsPanel labelledBy="settings-page-title" />
                <TeacherNotice titleId="settings-teacher-title" />
              </>
            ),
          },
          {
            id: 'midi',
            label: t('tabs.settings.midi'),
            content: (
              <>
                <MidiSupportNotice />
                <MidiDiagnostics />
              </>
            ),
          },
          {
            id: 'data',
            label: t('tabs.settings.data'),
            content: <DataManagementPanel />,
          },
        ]}
      />
    </main>
  )
}
