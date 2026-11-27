# DIAGNOSTICO-MIDI — Reproducción de F7-004

Fecha: 2026-11-22. Objetivo: explicar por qué un fallo cualquiera de Web MIDI
se mostraba como «permiso denegado» y separar las causas que requieren una
corrección distinta. No se afirma una causa raíz única: el síntoma es común a
varias causas y depende del navegador y del estado del dispositivo.

## Método

- Chromium real de Playwright (binario 1255 disponible en caché, lanzado con
  `executablePath`) contra `dist/` servido por `vite preview` en `127.0.0.1:4173`,
  origen seguro (`window.isSecureContext === true`).
- Escenario A: contexto con `permissions: ['midi']`. Escenario B: contexto sin
  ese permiso. En ambos se pulsó «Conectar teclado MIDI» en el panel de
  diagnóstico de `#/ajustes`.
- Firefox y WebKit no están instalados en este host. Sus rechazos se simularon
  con `context.addInitScript` inyectando `navigator.requestMIDIAccess` que
  rechaza con `DOMException`, y la ausencia de API se simuló dejando la
  propiedad como `undefined`. **No es una prueba en esos navegadores reales.**
- Script de reproducción: `test-results/reproduce-midi.mjs` (temporal,
  ignorado por git).

## Observaciones

| Escenario | Estado del permiso | Resultado observable |
|---|---|---|
| A · Chromium con `permissions: ['midi']` | `concedido` | `requestMIDIAccess` rechaza con `SecurityError: Permission to use Web MIDI API was not granted.`; el panel muestra **«permiso denegado»** y un `alert` con el mensaje real |
| B · Chromium sin permiso concedido | `pendiente de conceder` | mismo rechazo y mismo texto |
| C · mensaje de Firefox (`SecurityError: WebMIDI requires a site permission add-on to activate`) | `pendiente de conceder` | **«permiso denegado»** más ayuda de Chrome, aunque el consejo correcto es conectar el teclado o instalar el complemento |
| D · `SecurityError: Permission denied` | `pendiente de conceder` | **«permiso denegado»**; aquí sí corresponde |
| E · `AbortError: Permission dismissed` | `pendiente de conceder` | **«permiso denegado»**, aunque el usuario solo descartó el diálogo |
| F · sin `requestMIDIAccess` | `—` | «sin soporte» y aviso correcto de Web MIDI no disponible; el texto no distingue Safari/iOS de un origen inseguro |
| G · Permissions API responde `denied` al montar | `denegado` | el efecto fija **«permiso denegado»** sin intentar conectar, incluso antes de cualquier gesto del usuario |

En A y B el mensaje `Permission to use Web MIDI API was not granted.` aparece
con el permiso concedido en el escenario A. Eso descarta, en este entorno
headless sin dispositivo, atribuir el fallo únicamente al permiso del sitio; el
host no expone un subsystem MIDI. **NO VERIFICADO** con teclado físico.

## Causa → síntoma → corrección

| Causa | Síntoma | Corrección (tarea) |
|---|---|---|
| Firefox sin complemento, sin dispositivo visible al pedir acceso o complemento rechazado; mensaje `WebMIDI requires a site permission add-on to activate` | «permiso denegado» + ayuda de Chrome | clasificar `addon-required-or-no-device`; primer consejo: encender y conectar el teclado en modo USB-MIDI o con driver, recargar y volver a pedir (F7-003, F7-007) |
| Permiso del sitio bloqueado en Chromium (`SecurityError`) | «permiso denegado» sin ruta de salida | `denied` solo para denegación real; ayuda con la ruta de configuración del navegador (F7-005, F7-006) |
| Diálogo de permiso descartado (`AbortError` / «dismissed») | «permiso denegado» | clasificar `permission-dismissed` como error con ayuda, no como denegación (F7-003, F7-005) |
| Permissions API responde `denied` al montar (o no existe en Firefox) | estado fijado a `denied` sin intentar conexión y sin gesto del usuario | no fijar el estado desde la API de permisos; pedir acceso solo ante un gesto y autoconectar solo con `granted` comprobado (F7-005) |
| API ausente: Safari/iOS, Firefox Android o contexto inseguro | «sin soporte» genérico; ayuda no específica por familia | detección por característica y textos por familia; explicar iOS y el contexto inseguro (F7-003, F7-005, F7-008, F7-010) |
| Regresión de F6-033/F6-034 (autoconexión, `focus`/`visibilitychange`, Permissions API) | no se pudo bisectear: el historial importado tiene un solo commit; la revisión del código confirma el efecto que fija `denied` | sustituir ese efecto por una sincronización que no bloquee el gesto del usuario (F7-005) |

## Hipótesis

- **H1 (Firefox, sin dispositivo visible):** verosímil según las fuentes de
  Mozilla y reproducible solo como mensaje simulado (escenario C). Sin teclado
  físico no se puede confirmar.
- **H2 (complemento rechazado / «No permitir nunca» / política / privada):**
  NO VERIFICADO en Firefox real; no se afirma.
- **H3 (Chromium bloqueado o descartado):** reproducible como mensaje simulado
  (D y E) y como estado `denied` al montar (G). El origen real del usuario se
  desconoce.
- **H4 (contexto inseguro por HTTP con IP):** NO VERIFICADO; todas las
  reproducciones se hicieron en `127.0.0.1`, que es seguro.
- **H5 (regresión propia):** revisada por lectura de código; `git bisect` no es
  posible con el historial disponible en esta copia del repositorio.
- **H6 (Windows, navegadores no basados en Chromium) — informe del usuario
  2026-11-27:** en Linux el permiso aparece con normalidad en todos los
  navegadores probados; en Windows, con navegadores no Chromium, el diálogo de
  conexión **nunca aparece**. **NO REPRODUCIDO** aquí (sin Windows ni teclado
  físico). La app ya decide la ayuda en Windows **por familia**: ruta verificada
  para Chromium, complemento de sitio para Firefox y derivados (Waterfox,
  LibreWolf, IceCat, Pale Moon, SeaMonkey), y aviso honesto para Safari/WebKit
  (la extensión verificada es solo macOS). No afirma una causa: puede depender
  del complemento, del controlador MIDI de Windows o del navegador. Conviene
  repetir con un teclado USB-MIDI y recoger `failure.name`/`failure.message`
  desde «Copiar informe de diagnóstico».

## Fuentes consultadas (2026-11-22)

- <https://developer.chrome.com/blog/web-midi-permission-prompt> — permiso para
  todo Web MIDI desde Chrome 124; denegación con `SecurityError`.
- <https://caniuse.com/webmidi> — Safari sin soporte incluso en 27.3/TP y en
  iOS; Firefox para Android sin soporte; Samsung Internet y Chrome Android con
  soporte; enlace a la extensión de terceros
  <https://triglavmodular.hu/mods/safari-webmidi/> (nombre, precio y estado se
  verifican en F7-008).
