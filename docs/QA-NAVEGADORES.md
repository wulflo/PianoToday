# QA en navegadores — F6-027 / F7-011

Fecha de la última corrida: 2026-11-22. Entorno: Linux, Node 26.13.x,
Playwright 1.65 con `@playwright/test` 1.65.0.

## Matriz

| Navegador | Motor | Versión | Estado | Notas |
|---|---|---|---|---|
| Chrome / Chromium | Chromium | Playwright `chromium-1254` (Chrome for Testing 158) | ✅ 8/8 E2E | Incluye los dos recorridos nuevos de permiso MIDI (con permiso concedido y con rechazo simulado) |
| Microsoft Edge | Chromium | Mismo motor que Chrome | ✅ por equivalencia | No hay Edge nativo en Linux; no se probó la interfaz de permisos de Edge (no se encontró fuente verificable de `edge://…`) |
| Brave / Opera / Vivaldi / Samsung Internet | Chromium | — | ⚠️ no ejecutados | Rutas `brave://…` y `opera://…` verificadas en documentación; `vivaldi://…` no; el flujo se cubre por equivalencia de motor y con mocks |
| Firefox | Gecko | Playwright `firefox-1572` (Firefox 159) | ✅ 7/7 E2E | Incluye el recorrido del mensaje del complemento MIDI con mock |
| Safari | WebKit | Playwright `webkit-2388` (WebKit 27.2) | ❌ no ejecutable | Faltan `libicudata.so.74`, `libicui18n.so.74`, `libicuuc.so.74` y WPE; `install-deps` requiere root. `PLAYWRIGHT_SKIP_VALIDATE_HOST_REQUIREMENTS=1` no basta: `MiniBrowser` falla al cargar la librería |

Comandos ejecutados el 2026-11-22:

```bash
npx playwright install chromium firefox webkit
npx playwright test --project=chromium          # 8 passed, 2 skipped
npx playwright test --project=firefox           # 7 passed, 3 skipped
PLAYWRIGHT_SKIP_VALIDATE_HOST_REQUIREMENTS=1 npx playwright test --project=webkit  # 10 failed: host
```

## Qué cubren los E2E de F7-011

- `e2e/midi-permissions.spec.ts`: en Chromium, autoconexión con permiso
  concedido y ayuda visible con rechazo `SecurityError`; en Firefox, el
  `SecurityError` del complemento muestra el consejo de conectar el teclado y
  el botón «Volver a buscar dispositivos»; en WebKit, la guía de la extensión y
  el fallback manual (este último **no ejecutado** por el problema de host).
- Los cinco recorridos anteriores siguen en verde en Chromium y Firefox:
  lección → ejercicio → repaso, M3-M4, M5-M6, repertorio y PWA offline.

## Incidencias registradas

1. **WebKit/Safari no ejecutable en este host.** El error exacto es
   `MiniBrowser: error while loading shared libraries: libicudata.so.74`.
   La cobertura de WebKit en F7 es solo con mocks unitarios y de componente;
   **NO VERIFICADO** en WebKit real ni en Safari de macOS.
2. **MIDI físico y audio real** no se pueden validar: no hay teclado conectado.
   La lógica MIDI está cubierta por tests con mensajes simulados y el audio por
   manifiesto y presupuesto.
3. **PWA en Firefox** funciona sin conexión tras la primera carga, igual que en
   Chromium.
4. **Playwright con permisos:** conceder solo `midi` en Chromium headless no
   garantiza que `requestMIDIAccess()` resuelva; el E2E usa un acceso simulado
   para comprobar la autoconexión y comprueba el rechazo con un mock.

## Pendiente

- Safari real en macOS y las pruebas en iOS/Android (F6-028, F6-029 y P3-P5 de
  `docs/PRUEBAS-MANUALES.md`).
- Repetir la matriz en Edge, Brave, Opera, Vivaldi y Samsung Internet reales.
- Comprobar con el Yamaha PSR-373 el diagnóstico y el flujo del complemento.
