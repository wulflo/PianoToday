# Dependencias de terceros — Piano Today

Generado desde `package-lock.json` (última modificación: 2026-11-22T06:07:17.138Z) para F7-020.

Para regenerar tras cambiar dependencias:

```bash
node scripts/generate-dependency-licenses.mjs
```

Este documento cubre **solo dependencias**. El inventario auditado de
producción, las muestras de audio y el contenido de terceros siguen en
`THIRD_PARTY_LICENSES.md`. Ante una discrepancia, prevalece el texto de
licencia incluido en el paquete original dentro de `node_modules/`.

## Resumen

| Concepto | Cantidad |
|---|---:|
| Paquetes únicos (nombre y versión) | 599 |
| Producción (directas y transitivas) | 42 |
| Desarrollo (directas y transitivas) | 557 |
| Identificadores de licencia distintos | 13 |

## Dependencias declaradas directamente

| Paquete | Versión | Licencia | Ámbito | Uso |
|---|---|---|---|---|
| @playwright/test | 1.65.0 | Apache-2.0 | desarrollo (directa) | Recorridos E2E multi-navegador |
| @testing-library/dom | 10.4.2 | MIT | desarrollo (directa) | Consultas de DOM en tests |
| @testing-library/jest-dom | 7.0.1 | MIT | desarrollo (directa) | Aserciones de DOM en tests |
| @testing-library/react | 16.3.3 | MIT | desarrollo (directa) | Render de componentes en tests |
| @testing-library/user-event | 14.6.8 | MIT | desarrollo (directa) | Interacción simulada en tests |
| @types/node | 26.6.6 | MIT | desarrollo (directa) | Tipos de Node para los scripts |
| @types/react | 19.3.0 | MIT | desarrollo (directa) | Tipos de React |
| @types/react-dom | 19.3.0 | MIT | desarrollo (directa) | Tipos de React DOM |
| @vitejs/plugin-react | 6.2.1 | MIT | desarrollo (directa) | Plugin de React para Vite |
| axe-core | 4.14.0 | MPL-2.0 | desarrollo (directa) | Auditoría de accesibilidad |
| dexie | 4.4.7 | Apache-2.0 | producción (directa) | IndexedDB y repositorios de progreso |
| fake-indexeddb | 6.2.8 | Apache-2.0 | desarrollo (directa) | IndexedDB simulada en tests |
| jscpd | 5.4.3 | MIT | desarrollo (directa) | Auditoría de duplicación de código |
| jsdom | 31.0.0 | MIT | desarrollo (directa) | Entorno DOM de los tests unitarios |
| license-checker | 25.0.1 | BSD-3-Clause | desarrollo (directa) | Auditoría de licencias de producción |
| react | 19.3.1 | MIT | producción (directa) | Interfaz de usuario |
| react-dom | 19.3.1 | MIT | producción (directa) | Renderizado de la interfaz |
| tonal | 6.5.1 | MIT | producción (directa) | Teoría musical y notación |
| tone | 15.1.22 | MIT | producción (directa) | Audio y metrónomo (carga diferida) |
| ts-fsrs | 6.0.0 | MIT | producción (directa) | Repetición espaciada |
| tsx | 4.23.15 | MIT | desarrollo (directa) | Ejecución de scripts TypeScript |
| typescript | 7.0.2 | Apache-2.0 | desarrollo (directa) | Typecheck del proyecto |
| vexflow | 5.0.0 | MIT | producción (directa) | Pentagrama y notación (carga diferida) |
| vite | 8.3.6 | MIT | desarrollo (directa) | Build y servidor de desarrollo |
| vite-plugin-pwa | 2.0.0 | MIT | desarrollo (directa) | Service worker y manifiesto PWA |
| vitest | 5.1.0 | MIT | desarrollo (directa) | Suite de tests unitarios |
| zod | 4.6.7 | MIT | producción (directa) | Validación de contenido y datos |

## Inventario completo

<!-- deps:start -->
| Paquete | Versión | Licencia | Ámbito | Procedencia |
|---|---|---|---|---|
| @adobe/css-tools | 4.5.0 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/@adobe/css-tools |
| @apideck/better-ajv-errors | 0.3.7 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/@apideck/better-ajv-errors |
| @babel/code-frame | 7.29.7 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/@babel/code-frame |
| @babel/compat-data | 7.29.7 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/@babel/compat-data |
| @babel/core | 7.29.13 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/@babel/core |
| @babel/generator | 7.29.14 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/@babel/generator |
| @babel/helper-annotate-as-pure | 7.29.7 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/@babel/helper-annotate-as-pure |
| @babel/helper-compilation-targets | 7.29.13 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/@babel/helper-compilation-targets |
| @babel/helper-create-class-features-plugin | 7.29.13 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/@babel/helper-create-class-features-plugin |
| @babel/helper-create-regexp-features-plugin | 7.29.14 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/@babel/helper-create-regexp-features-plugin |
| @babel/helper-define-polyfill-provider | 0.6.8 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/@babel/helper-define-polyfill-provider |
| @babel/helper-globals | 7.29.7 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/@babel/helper-globals |
| @babel/helper-member-expression-to-functions | 7.29.14 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/@babel/helper-member-expression-to-functions |
| @babel/helper-module-imports | 7.29.7 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/@babel/helper-module-imports |
| @babel/helper-module-transforms | 7.29.14 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/@babel/helper-module-transforms |
| @babel/helper-optimise-call-expression | 7.29.7 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/@babel/helper-optimise-call-expression |
| @babel/helper-plugin-utils | 7.29.7 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/@babel/helper-plugin-utils |
| @babel/helper-remap-async-to-generator | 7.29.7 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/@babel/helper-remap-async-to-generator |
| @babel/helper-replace-supers | 7.29.7 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/@babel/helper-replace-supers |
| @babel/helper-skip-transparent-expression-wrappers | 7.29.13 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/@babel/helper-skip-transparent-expression-wrappers |
| @babel/helper-string-parser | 7.29.14 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/@babel/helper-string-parser |
| @babel/helper-validator-identifier | 7.29.7 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/@babel/helper-validator-identifier |
| @babel/helper-validator-option | 7.29.7 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/@babel/helper-validator-option |
| @babel/helper-wrap-function | 7.29.14 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/@babel/helper-wrap-function |
| @babel/helpers | 7.29.14 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/@babel/helpers |
| @babel/parser | 7.29.14 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/@babel/parser |
| @babel/plugin-bugfix-firefox-class-in-computed-class-key | 7.29.7 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/@babel/plugin-bugfix-firefox-class-in-computed-class-key |
| @babel/plugin-bugfix-safari-class-field-initializer-scope | 7.29.7 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/@babel/plugin-bugfix-safari-class-field-initializer-scope |
| @babel/plugin-bugfix-safari-id-destructuring-collision-in-function-expression | 7.29.7 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/@babel/plugin-bugfix-safari-id-destructuring-collision-in-function-expression |
| @babel/plugin-bugfix-safari-rest-destructuring-rhs-array | 7.29.13 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/@babel/plugin-bugfix-safari-rest-destructuring-rhs-array |
| @babel/plugin-bugfix-v8-spread-parameters-in-optional-chaining | 7.29.7 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/@babel/plugin-bugfix-v8-spread-parameters-in-optional-chaining |
| @babel/plugin-bugfix-v8-static-class-fields-redefine-readonly | 7.29.7 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/@babel/plugin-bugfix-v8-static-class-fields-redefine-readonly |
| @babel/plugin-proposal-private-property-in-object | 7.21.0-placeholder-for-preset-env.2 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/@babel/plugin-proposal-private-property-in-object |
| @babel/plugin-syntax-import-assertions | 7.29.7 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/@babel/plugin-syntax-import-assertions |
| @babel/plugin-syntax-import-attributes | 7.29.7 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/@babel/plugin-syntax-import-attributes |
| @babel/plugin-syntax-unicode-sets-regex | 7.18.6 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/@babel/plugin-syntax-unicode-sets-regex |
| @babel/plugin-transform-arrow-functions | 7.29.7 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/@babel/plugin-transform-arrow-functions |
| @babel/plugin-transform-async-generator-functions | 7.29.7 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/@babel/plugin-transform-async-generator-functions |
| @babel/plugin-transform-async-to-generator | 7.29.7 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/@babel/plugin-transform-async-to-generator |
| @babel/plugin-transform-block-scoped-functions | 7.29.7 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/@babel/plugin-transform-block-scoped-functions |
| @babel/plugin-transform-block-scoping | 7.29.13 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/@babel/plugin-transform-block-scoping |
| @babel/plugin-transform-class-properties | 7.29.7 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/@babel/plugin-transform-class-properties |
| @babel/plugin-transform-class-static-block | 7.29.14 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/@babel/plugin-transform-class-static-block |
| @babel/plugin-transform-classes | 7.29.11 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/@babel/plugin-transform-classes |
| @babel/plugin-transform-computed-properties | 7.29.7 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/@babel/plugin-transform-computed-properties |
| @babel/plugin-transform-destructuring | 7.29.13 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/@babel/plugin-transform-destructuring |
| @babel/plugin-transform-dotall-regex | 7.29.7 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/@babel/plugin-transform-dotall-regex |
| @babel/plugin-transform-duplicate-keys | 7.29.7 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/@babel/plugin-transform-duplicate-keys |
| @babel/plugin-transform-duplicate-named-capturing-groups-regex | 7.29.7 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/@babel/plugin-transform-duplicate-named-capturing-groups-regex |
| @babel/plugin-transform-dynamic-import | 7.29.7 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/@babel/plugin-transform-dynamic-import |
| @babel/plugin-transform-explicit-resource-management | 7.29.7 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/@babel/plugin-transform-explicit-resource-management |
| @babel/plugin-transform-exponentiation-operator | 7.29.7 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/@babel/plugin-transform-exponentiation-operator |
| @babel/plugin-transform-export-namespace-from | 7.29.7 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/@babel/plugin-transform-export-namespace-from |
| @babel/plugin-transform-for-of | 7.29.13 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/@babel/plugin-transform-for-of |
| @babel/plugin-transform-function-name | 7.29.7 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/@babel/plugin-transform-function-name |
| @babel/plugin-transform-json-strings | 7.29.7 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/@babel/plugin-transform-json-strings |
| @babel/plugin-transform-literals | 7.29.7 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/@babel/plugin-transform-literals |
| @babel/plugin-transform-logical-assignment-operators | 7.29.7 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/@babel/plugin-transform-logical-assignment-operators |
| @babel/plugin-transform-member-expression-literals | 7.29.7 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/@babel/plugin-transform-member-expression-literals |
| @babel/plugin-transform-modules-amd | 7.29.14 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/@babel/plugin-transform-modules-amd |
| @babel/plugin-transform-modules-commonjs | 7.29.14 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/@babel/plugin-transform-modules-commonjs |
| @babel/plugin-transform-modules-systemjs | 7.29.8 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/@babel/plugin-transform-modules-systemjs |
| @babel/plugin-transform-modules-umd | 7.29.14 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/@babel/plugin-transform-modules-umd |
| @babel/plugin-transform-named-capturing-groups-regex | 7.29.7 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/@babel/plugin-transform-named-capturing-groups-regex |
| @babel/plugin-transform-new-target | 7.29.7 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/@babel/plugin-transform-new-target |
| @babel/plugin-transform-nullish-coalescing-operator | 7.29.7 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/@babel/plugin-transform-nullish-coalescing-operator |
| @babel/plugin-transform-numeric-separator | 7.29.7 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/@babel/plugin-transform-numeric-separator |
| @babel/plugin-transform-object-rest-spread | 7.29.7 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/@babel/plugin-transform-object-rest-spread |
| @babel/plugin-transform-object-super | 7.29.7 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/@babel/plugin-transform-object-super |
| @babel/plugin-transform-optional-catch-binding | 7.29.7 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/@babel/plugin-transform-optional-catch-binding |
| @babel/plugin-transform-optional-chaining | 7.29.7 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/@babel/plugin-transform-optional-chaining |
| @babel/plugin-transform-parameters | 7.29.7 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/@babel/plugin-transform-parameters |
| @babel/plugin-transform-private-methods | 7.29.7 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/@babel/plugin-transform-private-methods |
| @babel/plugin-transform-private-property-in-object | 7.29.7 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/@babel/plugin-transform-private-property-in-object |
| @babel/plugin-transform-property-literals | 7.29.7 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/@babel/plugin-transform-property-literals |
| @babel/plugin-transform-regenerator | 7.29.8 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/@babel/plugin-transform-regenerator |
| @babel/plugin-transform-regexp-modifiers | 7.29.7 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/@babel/plugin-transform-regexp-modifiers |
| @babel/plugin-transform-reserved-words | 7.29.7 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/@babel/plugin-transform-reserved-words |
| @babel/plugin-transform-shorthand-properties | 7.29.7 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/@babel/plugin-transform-shorthand-properties |
| @babel/plugin-transform-spread | 7.29.11 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/@babel/plugin-transform-spread |
| @babel/plugin-transform-sticky-regex | 7.29.7 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/@babel/plugin-transform-sticky-regex |
| @babel/plugin-transform-template-literals | 7.29.7 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/@babel/plugin-transform-template-literals |
| @babel/plugin-transform-typeof-symbol | 7.29.7 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/@babel/plugin-transform-typeof-symbol |
| @babel/plugin-transform-unicode-escapes | 7.29.7 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/@babel/plugin-transform-unicode-escapes |
| @babel/plugin-transform-unicode-property-regex | 7.29.7 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/@babel/plugin-transform-unicode-property-regex |
| @babel/plugin-transform-unicode-regex | 7.29.7 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/@babel/plugin-transform-unicode-regex |
| @babel/plugin-transform-unicode-sets-regex | 7.29.7 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/@babel/plugin-transform-unicode-sets-regex |
| @babel/preset-env | 7.29.14 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/@babel/preset-env |
| @babel/preset-modules | 0.1.6-no-external-plugins | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/@babel/preset-modules |
| @babel/runtime | 7.29.13 | MIT | producción (transitiva) | https://www.npmjs.com/package/@babel/runtime |
| @babel/template | 7.29.7 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/@babel/template |
| @babel/traverse | 7.29.14 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/@babel/traverse |
| @babel/types | 7.29.14 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/@babel/types |
| @esbuild/aix-ppc64 | 0.28.2 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/@esbuild/aix-ppc64 |
| @esbuild/android-arm | 0.28.2 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/@esbuild/android-arm |
| @esbuild/android-arm64 | 0.28.2 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/@esbuild/android-arm64 |
| @esbuild/android-x64 | 0.28.2 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/@esbuild/android-x64 |
| @esbuild/darwin-arm64 | 0.28.2 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/@esbuild/darwin-arm64 |
| @esbuild/darwin-x64 | 0.28.2 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/@esbuild/darwin-x64 |
| @esbuild/freebsd-arm64 | 0.28.2 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/@esbuild/freebsd-arm64 |
| @esbuild/freebsd-x64 | 0.28.2 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/@esbuild/freebsd-x64 |
| @esbuild/linux-arm | 0.28.2 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/@esbuild/linux-arm |
| @esbuild/linux-arm64 | 0.28.2 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/@esbuild/linux-arm64 |
| @esbuild/linux-ia32 | 0.28.2 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/@esbuild/linux-ia32 |
| @esbuild/linux-loong64 | 0.28.2 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/@esbuild/linux-loong64 |
| @esbuild/linux-mips64el | 0.28.2 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/@esbuild/linux-mips64el |
| @esbuild/linux-ppc64 | 0.28.2 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/@esbuild/linux-ppc64 |
| @esbuild/linux-riscv64 | 0.28.2 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/@esbuild/linux-riscv64 |
| @esbuild/linux-s390x | 0.28.2 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/@esbuild/linux-s390x |
| @esbuild/linux-x64 | 0.28.2 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/@esbuild/linux-x64 |
| @esbuild/netbsd-arm64 | 0.28.2 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/@esbuild/netbsd-arm64 |
| @esbuild/netbsd-x64 | 0.28.2 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/@esbuild/netbsd-x64 |
| @esbuild/openbsd-arm64 | 0.28.2 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/@esbuild/openbsd-arm64 |
| @esbuild/openbsd-x64 | 0.28.2 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/@esbuild/openbsd-x64 |
| @esbuild/openharmony-arm64 | 0.28.2 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/@esbuild/openharmony-arm64 |
| @esbuild/sunos-x64 | 0.28.2 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/@esbuild/sunos-x64 |
| @esbuild/win32-arm64 | 0.28.2 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/@esbuild/win32-arm64 |
| @esbuild/win32-ia32 | 0.28.2 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/@esbuild/win32-ia32 |
| @esbuild/win32-x64 | 0.28.2 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/@esbuild/win32-x64 |
| @exodus/bytes | 1.16.0 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/@exodus/bytes |
| @isaacs/nonrecursive-glob-match | 1.1.0 | BlueOak-1.0.0 | desarrollo (transitiva) | https://www.npmjs.com/package/@isaacs/nonrecursive-glob-match |
| @jridgewell/gen-mapping | 0.3.13 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/@jridgewell/gen-mapping |
| @jridgewell/remapping | 2.3.5 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/@jridgewell/remapping |
| @jridgewell/resolve-uri | 3.1.2 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/@jridgewell/resolve-uri |
| @jridgewell/source-map | 0.3.11 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/@jridgewell/source-map |
| @jridgewell/sourcemap-codec | 1.6.0 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/@jridgewell/sourcemap-codec |
| @jridgewell/trace-mapping | 0.3.31 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/@jridgewell/trace-mapping |
| @open-spaced-repetition/srs-kit | 1.0.0 | BSD-3-Clause | producción (transitiva) | https://www.npmjs.com/package/@open-spaced-repetition/srs-kit |
| @oxc-project/types | 0.156.0 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/@oxc-project/types |
| @playwright/test | 1.65.0 | Apache-2.0 | desarrollo (directa) | https://www.npmjs.com/package/@playwright/test |
| @rolldown/binding-android-arm-eabi | 1.2.16 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/@rolldown/binding-android-arm-eabi |
| @rolldown/binding-android-arm64 | 1.2.16 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/@rolldown/binding-android-arm64 |
| @rolldown/binding-darwin-arm64 | 1.2.16 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/@rolldown/binding-darwin-arm64 |
| @rolldown/binding-darwin-x64 | 1.2.16 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/@rolldown/binding-darwin-x64 |
| @rolldown/binding-freebsd-x64 | 1.2.16 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/@rolldown/binding-freebsd-x64 |
| @rolldown/binding-linux-arm-gnueabihf | 1.2.16 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/@rolldown/binding-linux-arm-gnueabihf |
| @rolldown/binding-linux-arm64-gnu | 1.2.16 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/@rolldown/binding-linux-arm64-gnu |
| @rolldown/binding-linux-arm64-musl | 1.2.16 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/@rolldown/binding-linux-arm64-musl |
| @rolldown/binding-linux-ppc64-gnu | 1.2.16 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/@rolldown/binding-linux-ppc64-gnu |
| @rolldown/binding-linux-s390x-gnu | 1.2.16 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/@rolldown/binding-linux-s390x-gnu |
| @rolldown/binding-linux-x64-gnu | 1.2.16 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/@rolldown/binding-linux-x64-gnu |
| @rolldown/binding-linux-x64-musl | 1.2.16 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/@rolldown/binding-linux-x64-musl |
| @rolldown/binding-openharmony-arm64 | 1.2.16 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/@rolldown/binding-openharmony-arm64 |
| @rolldown/binding-win32-arm64-msvc | 1.2.16 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/@rolldown/binding-win32-arm64-msvc |
| @rolldown/binding-win32-x64-msvc | 1.2.16 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/@rolldown/binding-win32-x64-msvc |
| @rolldown/pluginutils | 1.0.1 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/@rolldown/pluginutils |
| @rollup/plugin-babel | 6.1.0 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/@rollup/plugin-babel |
| @rollup/plugin-node-resolve | 16.0.3 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/@rollup/plugin-node-resolve |
| @rollup/plugin-replace | 6.0.3 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/@rollup/plugin-replace |
| @rollup/plugin-terser | 1.0.2 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/@rollup/plugin-terser |
| @rollup/pluginutils | 5.5.1 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/@rollup/pluginutils |
| @rollup/rollup-android-arm-eabi | 4.68.2 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/@rollup/rollup-android-arm-eabi |
| @rollup/rollup-android-arm64 | 4.68.2 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/@rollup/rollup-android-arm64 |
| @rollup/rollup-android-x64 | 4.68.2 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/@rollup/rollup-android-x64 |
| @rollup/rollup-darwin-arm64 | 4.68.2 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/@rollup/rollup-darwin-arm64 |
| @rollup/rollup-darwin-x64 | 4.68.2 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/@rollup/rollup-darwin-x64 |
| @rollup/rollup-freebsd-arm64 | 4.68.2 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/@rollup/rollup-freebsd-arm64 |
| @rollup/rollup-freebsd-x64 | 4.68.2 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/@rollup/rollup-freebsd-x64 |
| @rollup/rollup-linux-arm-gnueabihf | 4.68.2 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/@rollup/rollup-linux-arm-gnueabihf |
| @rollup/rollup-linux-arm-musleabihf | 4.68.2 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/@rollup/rollup-linux-arm-musleabihf |
| @rollup/rollup-linux-arm64-gnu | 4.68.2 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/@rollup/rollup-linux-arm64-gnu |
| @rollup/rollup-linux-arm64-musl | 4.68.2 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/@rollup/rollup-linux-arm64-musl |
| @rollup/rollup-linux-loong64-gnu | 4.68.2 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/@rollup/rollup-linux-loong64-gnu |
| @rollup/rollup-linux-loong64-musl | 4.68.2 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/@rollup/rollup-linux-loong64-musl |
| @rollup/rollup-linux-ppc64-gnu | 4.68.2 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/@rollup/rollup-linux-ppc64-gnu |
| @rollup/rollup-linux-ppc64-musl | 4.68.2 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/@rollup/rollup-linux-ppc64-musl |
| @rollup/rollup-linux-riscv64-gnu | 4.68.2 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/@rollup/rollup-linux-riscv64-gnu |
| @rollup/rollup-linux-riscv64-musl | 4.68.2 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/@rollup/rollup-linux-riscv64-musl |
| @rollup/rollup-linux-s390x-gnu | 4.68.2 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/@rollup/rollup-linux-s390x-gnu |
| @rollup/rollup-linux-x64-gnu | 4.68.2 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/@rollup/rollup-linux-x64-gnu |
| @rollup/rollup-linux-x64-musl | 4.68.2 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/@rollup/rollup-linux-x64-musl |
| @rollup/rollup-openbsd-x64 | 4.68.2 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/@rollup/rollup-openbsd-x64 |
| @rollup/rollup-openharmony-arm64 | 4.68.2 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/@rollup/rollup-openharmony-arm64 |
| @rollup/rollup-win32-arm64-msvc | 4.68.2 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/@rollup/rollup-win32-arm64-msvc |
| @rollup/rollup-win32-ia32-msvc | 4.68.2 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/@rollup/rollup-win32-ia32-msvc |
| @rollup/rollup-win32-x64-gnu | 4.68.2 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/@rollup/rollup-win32-x64-gnu |
| @rollup/rollup-win32-x64-msvc | 4.68.2 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/@rollup/rollup-win32-x64-msvc |
| @testing-library/dom | 10.4.2 | MIT | desarrollo (directa) | https://www.npmjs.com/package/@testing-library/dom |
| @testing-library/jest-dom | 7.0.1 | MIT | desarrollo (directa) | https://www.npmjs.com/package/@testing-library/jest-dom |
| @testing-library/react | 16.3.3 | MIT | desarrollo (directa) | https://www.npmjs.com/package/@testing-library/react |
| @testing-library/user-event | 14.6.8 | MIT | desarrollo (directa) | https://www.npmjs.com/package/@testing-library/user-event |
| @tonaljs/abc-notation | 4.9.3 | MIT | producción (transitiva) | https://www.npmjs.com/package/@tonaljs/abc-notation |
| @tonaljs/array | 4.8.6 | MIT | producción (transitiva) | https://www.npmjs.com/package/@tonaljs/array |
| @tonaljs/chord | 6.2.1 | MIT | producción (transitiva) | https://www.npmjs.com/package/@tonaljs/chord |
| @tonaljs/chord-detect | 4.9.3 | MIT | producción (transitiva) | https://www.npmjs.com/package/@tonaljs/chord-detect |
| @tonaljs/chord-type | 5.2.1 | MIT | producción (transitiva) | https://www.npmjs.com/package/@tonaljs/chord-type |
| @tonaljs/collection | 4.9.1 | MIT | producción (transitiva) | https://www.npmjs.com/package/@tonaljs/collection |
| @tonaljs/core | 5.0.4 | MIT | producción (transitiva) | https://www.npmjs.com/package/@tonaljs/core |
| @tonaljs/duration-value | 4.9.1 | MIT | producción (transitiva) | https://www.npmjs.com/package/@tonaljs/duration-value |
| @tonaljs/interval | 5.1.1 | MIT | producción (transitiva) | https://www.npmjs.com/package/@tonaljs/interval |
| @tonaljs/key | 4.11.4 | MIT | producción (transitiva) | https://www.npmjs.com/package/@tonaljs/key |
| @tonaljs/midi | 4.10.4 | MIT | producción (transitiva) | https://www.npmjs.com/package/@tonaljs/midi |
| @tonaljs/mode | 4.9.4 | MIT | producción (transitiva) | https://www.npmjs.com/package/@tonaljs/mode |
| @tonaljs/note | 4.12.3 | MIT | producción (transitiva) | https://www.npmjs.com/package/@tonaljs/note |
| @tonaljs/pcset | 4.10.3 | MIT | producción (transitiva) | https://www.npmjs.com/package/@tonaljs/pcset |
| @tonaljs/pitch | 5.0.3 | MIT | producción (transitiva) | https://www.npmjs.com/package/@tonaljs/pitch |
| @tonaljs/pitch-distance | 5.0.7 | MIT | producción (transitiva) | https://www.npmjs.com/package/@tonaljs/pitch-distance |
| @tonaljs/pitch-interval | 6.1.2 | MIT | producción (transitiva) | https://www.npmjs.com/package/@tonaljs/pitch-interval |
| @tonaljs/pitch-note | 6.1.2 | MIT | producción (transitiva) | https://www.npmjs.com/package/@tonaljs/pitch-note |
| @tonaljs/progression | 4.9.4 | MIT | producción (transitiva) | https://www.npmjs.com/package/@tonaljs/progression |
| @tonaljs/range | 4.9.4 | MIT | producción (transitiva) | https://www.npmjs.com/package/@tonaljs/range |
| @tonaljs/rhythm-pattern | 1.0.1 | MIT | producción (transitiva) | https://www.npmjs.com/package/@tonaljs/rhythm-pattern |
| @tonaljs/roman-numeral | 4.9.3 | MIT | producción (transitiva) | https://www.npmjs.com/package/@tonaljs/roman-numeral |
| @tonaljs/scale | 4.13.6 | MIT | producción (transitiva) | https://www.npmjs.com/package/@tonaljs/scale |
| @tonaljs/scale-type | 4.9.4 | MIT | producción (transitiva) | https://www.npmjs.com/package/@tonaljs/scale-type |
| @tonaljs/time-signature | 4.10.1 | MIT | producción (transitiva) | https://www.npmjs.com/package/@tonaljs/time-signature |
| @tonaljs/voice-leading | 5.1.4 | MIT | producción (transitiva) | https://www.npmjs.com/package/@tonaljs/voice-leading |
| @tonaljs/voicing | 5.1.5 | MIT | producción (transitiva) | https://www.npmjs.com/package/@tonaljs/voicing |
| @tonaljs/voicing-dictionary | 5.1.5 | MIT | producción (transitiva) | https://www.npmjs.com/package/@tonaljs/voicing-dictionary |
| @trickfilm400/rollup-plugin-off-main-thread | 3.0.0-pre1 | Apache-2.0 | desarrollo (transitiva) | https://www.npmjs.com/package/@trickfilm400/rollup-plugin-off-main-thread |
| @types/aria-query | 5.0.4 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/@types/aria-query |
| @types/chai | 5.2.3 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/@types/chai |
| @types/deep-eql | 4.0.2 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/@types/deep-eql |
| @types/estree | 1.0.10 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/@types/estree |
| @types/node | 26.6.6 | MIT | desarrollo (directa) | https://www.npmjs.com/package/@types/node |
| @types/react | 19.3.0 | MIT | desarrollo (directa) | https://www.npmjs.com/package/@types/react |
| @types/react-dom | 19.3.0 | MIT | desarrollo (directa) | https://www.npmjs.com/package/@types/react-dom |
| @types/resolve | 1.20.2 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/@types/resolve |
| @types/trusted-types | 2.0.7 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/@types/trusted-types |
| @typescript/typescript-aix-ppc64 | 7.0.2 | Apache-2.0 | desarrollo (transitiva) | https://www.npmjs.com/package/@typescript/typescript-aix-ppc64 |
| @typescript/typescript-darwin-arm64 | 7.0.2 | Apache-2.0 | desarrollo (transitiva) | https://www.npmjs.com/package/@typescript/typescript-darwin-arm64 |
| @typescript/typescript-darwin-x64 | 7.0.2 | Apache-2.0 | desarrollo (transitiva) | https://www.npmjs.com/package/@typescript/typescript-darwin-x64 |
| @typescript/typescript-freebsd-arm64 | 7.0.2 | Apache-2.0 | desarrollo (transitiva) | https://www.npmjs.com/package/@typescript/typescript-freebsd-arm64 |
| @typescript/typescript-freebsd-x64 | 7.0.2 | Apache-2.0 | desarrollo (transitiva) | https://www.npmjs.com/package/@typescript/typescript-freebsd-x64 |
| @typescript/typescript-linux-arm | 7.0.2 | Apache-2.0 | desarrollo (transitiva) | https://www.npmjs.com/package/@typescript/typescript-linux-arm |
| @typescript/typescript-linux-arm64 | 7.0.2 | Apache-2.0 | desarrollo (transitiva) | https://www.npmjs.com/package/@typescript/typescript-linux-arm64 |
| @typescript/typescript-linux-loong64 | 7.0.2 | Apache-2.0 | desarrollo (transitiva) | https://www.npmjs.com/package/@typescript/typescript-linux-loong64 |
| @typescript/typescript-linux-mips64el | 7.0.2 | Apache-2.0 | desarrollo (transitiva) | https://www.npmjs.com/package/@typescript/typescript-linux-mips64el |
| @typescript/typescript-linux-ppc64 | 7.0.2 | Apache-2.0 | desarrollo (transitiva) | https://www.npmjs.com/package/@typescript/typescript-linux-ppc64 |
| @typescript/typescript-linux-riscv64 | 7.0.2 | Apache-2.0 | desarrollo (transitiva) | https://www.npmjs.com/package/@typescript/typescript-linux-riscv64 |
| @typescript/typescript-linux-s390x | 7.0.2 | Apache-2.0 | desarrollo (transitiva) | https://www.npmjs.com/package/@typescript/typescript-linux-s390x |
| @typescript/typescript-linux-x64 | 7.0.2 | Apache-2.0 | desarrollo (transitiva) | https://www.npmjs.com/package/@typescript/typescript-linux-x64 |
| @typescript/typescript-netbsd-arm64 | 7.0.2 | Apache-2.0 | desarrollo (transitiva) | https://www.npmjs.com/package/@typescript/typescript-netbsd-arm64 |
| @typescript/typescript-netbsd-x64 | 7.0.2 | Apache-2.0 | desarrollo (transitiva) | https://www.npmjs.com/package/@typescript/typescript-netbsd-x64 |
| @typescript/typescript-openbsd-arm64 | 7.0.2 | Apache-2.0 | desarrollo (transitiva) | https://www.npmjs.com/package/@typescript/typescript-openbsd-arm64 |
| @typescript/typescript-openbsd-x64 | 7.0.2 | Apache-2.0 | desarrollo (transitiva) | https://www.npmjs.com/package/@typescript/typescript-openbsd-x64 |
| @typescript/typescript-sunos-x64 | 7.0.2 | Apache-2.0 | desarrollo (transitiva) | https://www.npmjs.com/package/@typescript/typescript-sunos-x64 |
| @typescript/typescript-win32-arm64 | 7.0.2 | Apache-2.0 | desarrollo (transitiva) | https://www.npmjs.com/package/@typescript/typescript-win32-arm64 |
| @typescript/typescript-win32-x64 | 7.0.2 | Apache-2.0 | desarrollo (transitiva) | https://www.npmjs.com/package/@typescript/typescript-win32-x64 |
| @vitejs/plugin-react | 6.2.1 | MIT | desarrollo (directa) | https://www.npmjs.com/package/@vitejs/plugin-react |
| @vitest/mocker | 5.1.0 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/@vitest/mocker |
| @vitest/spy | 5.1.0 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/@vitest/spy |
| abbrev | 1.1.1 | ISC | desarrollo (transitiva) | https://www.npmjs.com/package/abbrev |
| acorn | 8.19.0 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/acorn |
| ajv | 8.20.0 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/ajv |
| ansi-regex | 5.0.1 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/ansi-regex |
| ansi-styles | 3.2.1 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/ansi-styles |
| ansi-styles | 5.2.0 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/ansi-styles |
| aria-query | 5.3.0 | Apache-2.0 | desarrollo (transitiva) | https://www.npmjs.com/package/aria-query |
| array-buffer-byte-length | 1.0.2 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/array-buffer-byte-length |
| array-find-index | 1.0.2 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/array-find-index |
| arraybuffer.prototype.slice | 1.0.4 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/arraybuffer.prototype.slice |
| asap | 2.0.6 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/asap |
| assertion-error | 2.0.1 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/assertion-error |
| async | 3.2.6 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/async |
| async-function | 1.0.0 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/async-function |
| at-least-node | 1.0.0 | ISC | desarrollo (transitiva) | https://www.npmjs.com/package/at-least-node |
| automation-events | 7.1.19 | MIT | producción (transitiva) | https://www.npmjs.com/package/automation-events |
| available-typed-arrays | 1.0.7 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/available-typed-arrays |
| axe-core | 4.14.0 | MPL-2.0 | desarrollo (directa) | https://www.npmjs.com/package/axe-core |
| babel-plugin-polyfill-corejs2 | 0.4.17 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/babel-plugin-polyfill-corejs2 |
| babel-plugin-polyfill-corejs3 | 0.14.2 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/babel-plugin-polyfill-corejs3 |
| babel-plugin-polyfill-regenerator | 0.6.8 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/babel-plugin-polyfill-regenerator |
| balanced-match | 1.0.2 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/balanced-match |
| balanced-match | 4.0.4 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/balanced-match |
| baseline-browser-mapping | 2.11.36 | Apache-2.0 | desarrollo (transitiva) | https://www.npmjs.com/package/baseline-browser-mapping |
| bcp-47 | 2.1.2 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/bcp-47 |
| bcp-47-match | 2.0.3 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/bcp-47-match |
| brace-expansion | 1.1.22 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/brace-expansion |
| brace-expansion | 2.1.8 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/brace-expansion |
| brace-expansion | 5.0.13 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/brace-expansion |
| browserslist | 4.29.5 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/browserslist |
| buffer-from | 1.1.2 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/buffer-from |
| call-bind | 1.0.9 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/call-bind |
| call-bind-apply-helpers | 1.0.2 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/call-bind-apply-helpers |
| call-bound | 1.0.4 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/call-bound |
| caniuse-lite | 1.0.30001826 | CC-BY-4.0 | desarrollo (transitiva) | https://www.npmjs.com/package/caniuse-lite |
| chai | 6.3.0 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/chai |
| chalk | 2.4.2 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/chalk |
| color-convert | 1.9.3 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/color-convert |
| color-name | 1.1.3 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/color-name |
| commander | 2.20.3 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/commander |
| common-tags | 1.8.2 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/common-tags |
| concat-map | 0.0.1 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/concat-map |
| convert-source-map | 2.0.0 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/convert-source-map |
| core-js-compat | 3.51.0 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/core-js-compat |
| crypto-random-string | 2.0.0 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/crypto-random-string |
| css.escape | 1.5.1 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/css.escape |
| csstype | 3.2.3 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/csstype |
| data-urls | 8.0.0 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/data-urls |
| data-view-buffer | 1.0.2 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/data-view-buffer |
| data-view-byte-length | 1.0.2 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/data-view-byte-length |
| data-view-byte-offset | 1.0.1 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/data-view-byte-offset |
| debug | 3.2.7 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/debug |
| debug | 4.4.3 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/debug |
| debuglog | 1.0.1 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/debuglog |
| decimal.js | 10.6.0 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/decimal.js |
| deepmerge | 4.3.1 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/deepmerge |
| define-data-property | 1.1.4 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/define-data-property |
| define-properties | 1.2.1 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/define-properties |
| dequal | 2.0.3 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/dequal |
| detect-libc | 2.1.2 | Apache-2.0 | desarrollo (transitiva) | https://www.npmjs.com/package/detect-libc |
| dexie | 4.4.7 | Apache-2.0 | producción (directa) | https://www.npmjs.com/package/dexie |
| dezalgo | 1.0.4 | ISC | desarrollo (transitiva) | https://www.npmjs.com/package/dezalgo |
| dom-accessibility-api | 0.5.16 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/dom-accessibility-api |
| dom-accessibility-api | 0.6.3 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/dom-accessibility-api |
| dunder-proto | 1.0.1 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/dunder-proto |
| ejs | 3.1.10 | Apache-2.0 | desarrollo (transitiva) | https://www.npmjs.com/package/ejs |
| electron-to-chromium | 1.5.482 | ISC | desarrollo (transitiva) | https://www.npmjs.com/package/electron-to-chromium |
| entities | 9.0.0 | BSD-2-Clause | desarrollo (transitiva) | https://www.npmjs.com/package/entities |
| es-abstract | 1.24.2 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/es-abstract |
| es-abstract-get | 1.0.0 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/es-abstract-get |
| es-define-property | 1.0.1 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/es-define-property |
| es-errors | 1.3.0 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/es-errors |
| es-module-lexer | 2.3.2 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/es-module-lexer |
| es-object-atoms | 1.1.2 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/es-object-atoms |
| es-set-tostringtag | 2.1.0 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/es-set-tostringtag |
| es-to-primitive | 1.3.4 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/es-to-primitive |
| esbuild | 0.28.2 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/esbuild |
| escalade | 3.2.0 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/escalade |
| escape-string-regexp | 1.0.5 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/escape-string-regexp |
| estree-walker | 2.0.2 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/estree-walker |
| estree-walker | 3.0.3 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/estree-walker |
| esutils | 2.0.3 | BSD-2-Clause | desarrollo (transitiva) | https://www.npmjs.com/package/esutils |
| eta | 4.6.0 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/eta |
| expect-type | 1.4.0 | Apache-2.0 | desarrollo (transitiva) | https://www.npmjs.com/package/expect-type |
| fake-indexeddb | 6.2.8 | Apache-2.0 | desarrollo (directa) | https://www.npmjs.com/package/fake-indexeddb |
| fast-deep-equal | 3.1.3 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/fast-deep-equal |
| fast-json-stable-stringify | 2.1.0 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/fast-json-stable-stringify |
| fast-uri | 3.1.9 | BSD-3-Clause | desarrollo (transitiva) | https://www.npmjs.com/package/fast-uri |
| fdir | 6.5.0 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/fdir |
| filelist | 1.0.6 | Apache-2.0 | desarrollo (transitiva) | https://www.npmjs.com/package/filelist |
| for-each | 0.3.5 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/for-each |
| fs-extra | 9.1.0 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/fs-extra |
| fs.realpath | 1.0.0 | ISC | desarrollo (transitiva) | https://www.npmjs.com/package/fs.realpath |
| fsevents | 2.3.3 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/fsevents |
| function-bind | 1.1.2 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/function-bind |
| function.prototype.name | 1.2.0 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/function.prototype.name |
| functions-have-names | 1.2.3 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/functions-have-names |
| generator-function | 2.0.1 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/generator-function |
| gensync | 1.0.0-beta.2 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/gensync |
| get-intrinsic | 1.3.0 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/get-intrinsic |
| get-own-enumerable-property-symbols | 3.0.2 | ISC | desarrollo (transitiva) | https://www.npmjs.com/package/get-own-enumerable-property-symbols |
| get-proto | 1.0.1 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/get-proto |
| get-symbol-description | 1.1.0 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/get-symbol-description |
| glob | 14.0.6 | BlueOak-1.0.0 | desarrollo (transitiva) | https://www.npmjs.com/package/glob |
| glob | 7.2.3 | ISC | desarrollo (transitiva) | https://www.npmjs.com/package/glob |
| globalthis | 1.0.4 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/globalthis |
| gopd | 1.2.0 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/gopd |
| graceful-fs | 4.2.11 | ISC | desarrollo (transitiva) | https://www.npmjs.com/package/graceful-fs |
| has-bigints | 1.1.0 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/has-bigints |
| has-flag | 3.0.0 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/has-flag |
| has-property-descriptors | 1.0.2 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/has-property-descriptors |
| has-proto | 1.2.0 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/has-proto |
| has-symbols | 1.1.0 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/has-symbols |
| has-tostringtag | 1.0.2 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/has-tostringtag |
| hasown | 2.0.4 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/hasown |
| hosted-git-info | 2.8.9 | ISC | desarrollo (transitiva) | https://www.npmjs.com/package/hosted-git-info |
| html-encoding-sniffer | 7.0.0 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/html-encoding-sniffer |
| idb | 7.1.1 | ISC | desarrollo (transitiva) | https://www.npmjs.com/package/idb |
| indent-string | 4.0.0 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/indent-string |
| inflight | 1.0.6 | ISC | desarrollo (transitiva) | https://www.npmjs.com/package/inflight |
| inherits | 2.0.4 | ISC | desarrollo (transitiva) | https://www.npmjs.com/package/inherits |
| internal-slot | 1.1.0 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/internal-slot |
| is-alphabetical | 2.0.1 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/is-alphabetical |
| is-alphanumerical | 2.0.1 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/is-alphanumerical |
| is-array-buffer | 3.0.5 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/is-array-buffer |
| is-async-function | 2.1.1 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/is-async-function |
| is-bigint | 1.1.0 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/is-bigint |
| is-boolean-object | 1.2.2 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/is-boolean-object |
| is-callable | 1.2.7 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/is-callable |
| is-core-module | 2.18.0 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/is-core-module |
| is-data-view | 1.0.2 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/is-data-view |
| is-date-object | 1.1.0 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/is-date-object |
| is-decimal | 2.0.1 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/is-decimal |
| is-document.all | 1.0.0 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/is-document.all |
| is-finalizationregistry | 1.1.1 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/is-finalizationregistry |
| is-generator-function | 1.1.2 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/is-generator-function |
| is-map | 2.0.3 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/is-map |
| is-module | 1.0.0 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/is-module |
| is-negative-zero | 2.0.3 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/is-negative-zero |
| is-number-object | 1.1.1 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/is-number-object |
| is-obj | 1.0.1 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/is-obj |
| is-potential-custom-element-name | 1.0.1 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/is-potential-custom-element-name |
| is-regex | 1.2.1 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/is-regex |
| is-regexp | 1.0.0 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/is-regexp |
| is-set | 2.0.3 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/is-set |
| is-shared-array-buffer | 1.0.4 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/is-shared-array-buffer |
| is-stream | 2.0.1 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/is-stream |
| is-string | 1.1.1 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/is-string |
| is-symbol | 1.1.1 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/is-symbol |
| is-typed-array | 1.1.15 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/is-typed-array |
| is-weakmap | 2.0.2 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/is-weakmap |
| is-weakref | 1.1.1 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/is-weakref |
| is-weakset | 2.0.4 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/is-weakset |
| isarray | 2.0.5 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/isarray |
| jake | 10.9.4 | Apache-2.0 | desarrollo (transitiva) | https://www.npmjs.com/package/jake |
| js-tokens | 4.0.0 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/js-tokens |
| jscpd | 5.4.3 | MIT | desarrollo (directa) | https://www.npmjs.com/package/jscpd |
| jscpd-darwin-arm64 | 5.4.3 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/jscpd-darwin-arm64 |
| jscpd-darwin-x64 | 5.4.3 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/jscpd-darwin-x64 |
| jscpd-linux-arm64-gnu | 5.4.3 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/jscpd-linux-arm64-gnu |
| jscpd-linux-arm64-musl | 5.4.3 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/jscpd-linux-arm64-musl |
| jscpd-linux-x64-gnu | 5.4.3 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/jscpd-linux-x64-gnu |
| jscpd-linux-x64-musl | 5.4.3 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/jscpd-linux-x64-musl |
| jscpd-windows-arm64-msvc | 5.4.3 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/jscpd-windows-arm64-msvc |
| jscpd-windows-x64-msvc | 5.4.3 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/jscpd-windows-x64-msvc |
| jsdom | 31.0.0 | MIT | desarrollo (directa) | https://www.npmjs.com/package/jsdom |
| jsesc | 3.1.0 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/jsesc |
| json-parse-even-better-errors | 2.3.1 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/json-parse-even-better-errors |
| json-schema-traverse | 1.0.0 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/json-schema-traverse |
| json5 | 2.2.3 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/json5 |
| jsonfile | 6.2.1 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/jsonfile |
| jsonpointer | 5.0.1 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/jsonpointer |
| leven | 3.1.0 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/leven |
| license-checker | 25.0.1 | BSD-3-Clause | desarrollo (directa) | https://www.npmjs.com/package/license-checker |
| lightningcss | 1.33.0 | MPL-2.0 | desarrollo (transitiva) | https://www.npmjs.com/package/lightningcss |
| lightningcss-android-arm64 | 1.33.0 | MPL-2.0 | desarrollo (transitiva) | https://www.npmjs.com/package/lightningcss-android-arm64 |
| lightningcss-darwin-arm64 | 1.33.0 | MPL-2.0 | desarrollo (transitiva) | https://www.npmjs.com/package/lightningcss-darwin-arm64 |
| lightningcss-darwin-x64 | 1.33.0 | MPL-2.0 | desarrollo (transitiva) | https://www.npmjs.com/package/lightningcss-darwin-x64 |
| lightningcss-freebsd-x64 | 1.33.0 | MPL-2.0 | desarrollo (transitiva) | https://www.npmjs.com/package/lightningcss-freebsd-x64 |
| lightningcss-linux-arm-gnueabihf | 1.33.0 | MPL-2.0 | desarrollo (transitiva) | https://www.npmjs.com/package/lightningcss-linux-arm-gnueabihf |
| lightningcss-linux-arm64-gnu | 1.33.0 | MPL-2.0 | desarrollo (transitiva) | https://www.npmjs.com/package/lightningcss-linux-arm64-gnu |
| lightningcss-linux-arm64-musl | 1.33.0 | MPL-2.0 | desarrollo (transitiva) | https://www.npmjs.com/package/lightningcss-linux-arm64-musl |
| lightningcss-linux-x64-gnu | 1.33.0 | MPL-2.0 | desarrollo (transitiva) | https://www.npmjs.com/package/lightningcss-linux-x64-gnu |
| lightningcss-linux-x64-musl | 1.33.0 | MPL-2.0 | desarrollo (transitiva) | https://www.npmjs.com/package/lightningcss-linux-x64-musl |
| lightningcss-win32-arm64-msvc | 1.33.0 | MPL-2.0 | desarrollo (transitiva) | https://www.npmjs.com/package/lightningcss-win32-arm64-msvc |
| lightningcss-win32-x64-msvc | 1.33.0 | MPL-2.0 | desarrollo (transitiva) | https://www.npmjs.com/package/lightningcss-win32-x64-msvc |
| lodash.debounce | 4.0.8 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/lodash.debounce |
| lru-cache | 11.5.3 | BlueOak-1.0.0 | desarrollo (transitiva) | https://www.npmjs.com/package/lru-cache |
| lru-cache | 5.1.1 | ISC | desarrollo (transitiva) | https://www.npmjs.com/package/lru-cache |
| lz-string | 1.5.0 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/lz-string |
| magic-string | 0.30.21 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/magic-string |
| magic-string | 1.4.5 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/magic-string |
| math-intrinsics | 1.1.0 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/math-intrinsics |
| min-indent | 1.0.1 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/min-indent |
| minimatch | 11.0.8 | BlueOak-1.0.0 | desarrollo (transitiva) | https://www.npmjs.com/package/minimatch |
| minimatch | 3.1.5 | ISC | desarrollo (transitiva) | https://www.npmjs.com/package/minimatch |
| minimatch | 5.1.9 | ISC | desarrollo (transitiva) | https://www.npmjs.com/package/minimatch |
| minimist | 1.2.8 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/minimist |
| minipass | 7.1.3 | BlueOak-1.0.0 | desarrollo (transitiva) | https://www.npmjs.com/package/minipass |
| mkdirp | 0.5.6 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/mkdirp |
| ms | 2.1.3 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/ms |
| nanoid | 3.3.20 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/nanoid |
| node-releases | 2.0.63 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/node-releases |
| nopt | 4.0.3 | ISC | desarrollo (transitiva) | https://www.npmjs.com/package/nopt |
| normalize-package-data | 2.5.0 | BSD-2-Clause | desarrollo (transitiva) | https://www.npmjs.com/package/normalize-package-data |
| npm-normalize-package-bin | 1.0.1 | ISC | desarrollo (transitiva) | https://www.npmjs.com/package/npm-normalize-package-bin |
| object-inspect | 1.13.4 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/object-inspect |
| object-keys | 1.1.1 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/object-keys |
| object.assign | 4.1.7 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/object.assign |
| obug | 3.0.0 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/obug |
| once | 1.4.0 | ISC | desarrollo (transitiva) | https://www.npmjs.com/package/once |
| os-homedir | 1.0.2 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/os-homedir |
| os-tmpdir | 1.0.2 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/os-tmpdir |
| osenv | 0.1.5 | ISC | desarrollo (transitiva) | https://www.npmjs.com/package/osenv |
| own-keys | 1.0.2 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/own-keys |
| parse5 | 8.1.1 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/parse5 |
| parse5-parser-stream | 8.1.1 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/parse5-parser-stream |
| path-is-absolute | 1.0.1 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/path-is-absolute |
| path-parse | 1.0.7 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/path-parse |
| path-scurry | 3.0.0 | BlueOak-1.0.0 | desarrollo (transitiva) | https://www.npmjs.com/package/path-scurry |
| picocolors | 1.1.1 | ISC | desarrollo (transitiva) | https://www.npmjs.com/package/picocolors |
| picomatch | 4.0.7 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/picomatch |
| playwright | 1.65.0 | Apache-2.0 | desarrollo (transitiva) | https://www.npmjs.com/package/playwright |
| playwright-core | 1.65.0 | Apache-2.0 | desarrollo (transitiva) | https://www.npmjs.com/package/playwright-core |
| possible-typed-array-names | 1.1.0 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/possible-typed-array-names |
| postcss | 8.5.32 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/postcss |
| pretty-bytes | 5.6.0 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/pretty-bytes |
| pretty-bytes | 6.1.1 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/pretty-bytes |
| pretty-format | 27.5.1 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/pretty-format |
| punycode | 2.3.1 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/punycode |
| react | 19.3.1 | MIT | producción (directa) | https://www.npmjs.com/package/react |
| react-dom | 19.3.1 | MIT | producción (directa) | https://www.npmjs.com/package/react-dom |
| react-is | 17.0.2 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/react-is |
| read-installed | 4.0.3 | ISC | desarrollo (transitiva) | https://www.npmjs.com/package/read-installed |
| read-package-json | 2.1.2 | ISC | desarrollo (transitiva) | https://www.npmjs.com/package/read-package-json |
| readdir-scoped-modules | 1.1.0 | ISC | desarrollo (transitiva) | https://www.npmjs.com/package/readdir-scoped-modules |
| redent | 3.0.0 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/redent |
| reflect.getprototypeof | 1.0.10 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/reflect.getprototypeof |
| regenerate | 1.5.0 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/regenerate |
| regenerate-unicode-properties | 10.3.0 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/regenerate-unicode-properties |
| regexp.prototype.flags | 1.5.4 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/regexp.prototype.flags |
| regexpu-core | 6.5.4 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/regexpu-core |
| regjsgen | 0.8.0 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/regjsgen |
| regjsparser | 0.14.1 | BSD-2-Clause | desarrollo (transitiva) | https://www.npmjs.com/package/regjsparser |
| require-from-string | 2.0.2 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/require-from-string |
| resolve | 1.22.14 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/resolve |
| rolldown | 1.2.16 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/rolldown |
| rollup | 4.68.2 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/rollup |
| safe-array-concat | 1.1.4 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/safe-array-concat |
| safe-push-apply | 1.0.0 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/safe-push-apply |
| safe-regex-test | 1.1.0 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/safe-regex-test |
| saxes | 6.0.0 | ISC | desarrollo (transitiva) | https://www.npmjs.com/package/saxes |
| scheduler | 0.28.0 | MIT | producción (transitiva) | https://www.npmjs.com/package/scheduler |
| semver | 5.7.3 | ISC | desarrollo (transitiva) | https://www.npmjs.com/package/semver |
| semver | 6.3.2 | ISC | desarrollo (transitiva) | https://www.npmjs.com/package/semver |
| serialize-javascript | 7.1.4 | BSD-3-Clause | desarrollo (transitiva) | https://www.npmjs.com/package/serialize-javascript |
| set-function-length | 1.2.2 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/set-function-length |
| set-function-name | 2.0.2 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/set-function-name |
| set-proto | 1.0.0 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/set-proto |
| side-channel | 1.1.1 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/side-channel |
| side-channel-list | 1.0.1 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/side-channel-list |
| side-channel-map | 1.0.1 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/side-channel-map |
| side-channel-weakmap | 1.0.2 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/side-channel-weakmap |
| slide | 1.1.6 | ISC | desarrollo (transitiva) | https://www.npmjs.com/package/slide |
| smob | 1.6.2 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/smob |
| source-map | 0.6.1 | BSD-3-Clause | desarrollo (transitiva) | https://www.npmjs.com/package/source-map |
| source-map | 0.8.0 | BSD-3-Clause | desarrollo (transitiva) | https://www.npmjs.com/package/source-map |
| source-map-js | 1.2.2 | BSD-3-Clause | desarrollo (transitiva) | https://www.npmjs.com/package/source-map-js |
| source-map-support | 0.5.21 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/source-map-support |
| spdx-compare | 1.0.0 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/spdx-compare |
| spdx-correct | 3.2.0 | Apache-2.0 | desarrollo (transitiva) | https://www.npmjs.com/package/spdx-correct |
| spdx-exceptions | 2.5.0 | CC-BY-3.0 | desarrollo (transitiva) | https://www.npmjs.com/package/spdx-exceptions |
| spdx-expression-parse | 3.0.1 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/spdx-expression-parse |
| spdx-license-ids | 3.0.24 | CC0-1.0 | desarrollo (transitiva) | https://www.npmjs.com/package/spdx-license-ids |
| spdx-ranges | 2.1.1 | (MIT AND CC-BY-3.0) | desarrollo (transitiva) | https://www.npmjs.com/package/spdx-ranges |
| spdx-satisfies | 4.0.1 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/spdx-satisfies |
| standardized-audio-context | 25.3.77 | MIT | producción (transitiva) | https://www.npmjs.com/package/standardized-audio-context |
| std-env | 4.3.0 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/std-env |
| stop-iteration-iterator | 1.1.0 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/stop-iteration-iterator |
| string.prototype.matchall | 4.1.0 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/string.prototype.matchall |
| string.prototype.trim | 1.2.11 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/string.prototype.trim |
| string.prototype.trimend | 1.0.10 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/string.prototype.trimend |
| string.prototype.trimstart | 1.0.8 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/string.prototype.trimstart |
| stringify-object | 3.3.0 | BSD-2-Clause | desarrollo (transitiva) | https://www.npmjs.com/package/stringify-object |
| strip-comments | 2.0.1 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/strip-comments |
| strip-indent | 3.0.0 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/strip-indent |
| supports-color | 5.5.0 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/supports-color |
| supports-preserve-symlinks-flag | 1.0.0 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/supports-preserve-symlinks-flag |
| temp-dir | 2.0.0 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/temp-dir |
| tempy | 0.6.0 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/tempy |
| terser | 5.51.2 | BSD-2-Clause | desarrollo (transitiva) | https://www.npmjs.com/package/terser |
| tinybench | 6.2.3 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/tinybench |
| tinyexec | 1.3.1 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/tinyexec |
| tinyglobby | 0.2.17 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/tinyglobby |
| tldts | 7.4.19 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/tldts |
| tldts-core | 7.4.20 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/tldts-core |
| tonal | 6.5.1 | MIT | producción (directa) | https://www.npmjs.com/package/tonal |
| tone | 15.1.22 | MIT | producción (directa) | https://www.npmjs.com/package/tone |
| tough-cookie | 6.1.0 | BSD-3-Clause | desarrollo (transitiva) | https://www.npmjs.com/package/tough-cookie |
| tr46 | 7.0.0 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/tr46 |
| treeify | 1.1.0 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/treeify |
| ts-fsrs | 6.0.0 | MIT | producción (directa) | https://www.npmjs.com/package/ts-fsrs |
| tslib | 2.9.1 | 0BSD | producción (transitiva) | https://www.npmjs.com/package/tslib |
| tsx | 4.23.15 | MIT | desarrollo (directa) | https://www.npmjs.com/package/tsx |
| type-fest | 0.16.0 | (MIT OR CC0-1.0) | desarrollo (transitiva) | https://www.npmjs.com/package/type-fest |
| typed-array-buffer | 1.0.3 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/typed-array-buffer |
| typed-array-byte-length | 1.0.3 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/typed-array-byte-length |
| typed-array-byte-offset | 1.0.5 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/typed-array-byte-offset |
| typed-array-length | 1.0.8 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/typed-array-length |
| typescript | 7.0.2 | Apache-2.0 | desarrollo (directa) | https://www.npmjs.com/package/typescript |
| unbox-primitive | 1.1.0 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/unbox-primitive |
| undici | 8.12.4 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/undici |
| undici-types | 8.9.0 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/undici-types |
| unicode-canonical-property-names-ecmascript | 2.0.1 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/unicode-canonical-property-names-ecmascript |
| unicode-match-property-ecmascript | 2.0.0 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/unicode-match-property-ecmascript |
| unicode-match-property-value-ecmascript | 2.2.1 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/unicode-match-property-value-ecmascript |
| unicode-property-aliases-ecmascript | 2.2.0 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/unicode-property-aliases-ecmascript |
| unique-string | 2.0.0 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/unique-string |
| universalify | 2.0.1 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/universalify |
| upath | 1.2.0 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/upath |
| update-browserslist-db | 1.3.4 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/update-browserslist-db |
| util-extend | 1.0.3 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/util-extend |
| validate-npm-package-license | 3.0.4 | Apache-2.0 | desarrollo (transitiva) | https://www.npmjs.com/package/validate-npm-package-license |
| vexflow | 5.0.0 | MIT | producción (directa) | https://www.npmjs.com/package/vexflow |
| vite | 8.3.6 | MIT | desarrollo (directa) | https://www.npmjs.com/package/vite |
| vite-plugin-pwa | 2.0.0 | MIT | desarrollo (directa) | https://www.npmjs.com/package/vite-plugin-pwa |
| vitest | 5.1.0 | MIT | desarrollo (directa) | https://www.npmjs.com/package/vitest |
| w3c-xmlserializer | 6.0.0 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/w3c-xmlserializer |
| webidl-conversions | 8.0.1 | BSD-2-Clause | desarrollo (transitiva) | https://www.npmjs.com/package/webidl-conversions |
| whatwg-mimetype | 5.0.0 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/whatwg-mimetype |
| whatwg-url | 17.3.0 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/whatwg-url |
| which-boxed-primitive | 1.1.1 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/which-boxed-primitive |
| which-builtin-type | 1.2.1 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/which-builtin-type |
| which-collection | 1.0.2 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/which-collection |
| which-typed-array | 1.1.24 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/which-typed-array |
| why-is-node-running | 3.2.1 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/why-is-node-running |
| workbox-background-sync | 7.4.1 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/workbox-background-sync |
| workbox-broadcast-update | 7.4.1 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/workbox-broadcast-update |
| workbox-build | 7.4.1 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/workbox-build |
| workbox-cacheable-response | 7.4.1 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/workbox-cacheable-response |
| workbox-core | 7.4.1 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/workbox-core |
| workbox-expiration | 7.4.1 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/workbox-expiration |
| workbox-google-analytics | 7.4.1 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/workbox-google-analytics |
| workbox-navigation-preload | 7.4.1 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/workbox-navigation-preload |
| workbox-precaching | 7.4.1 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/workbox-precaching |
| workbox-range-requests | 7.4.1 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/workbox-range-requests |
| workbox-recipes | 7.4.1 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/workbox-recipes |
| workbox-routing | 7.4.1 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/workbox-routing |
| workbox-strategies | 7.4.1 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/workbox-strategies |
| workbox-streams | 7.4.1 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/workbox-streams |
| workbox-sw | 7.4.1 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/workbox-sw |
| workbox-window | 7.4.1 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/workbox-window |
| wrappy | 1.0.2 | ISC | desarrollo (transitiva) | https://www.npmjs.com/package/wrappy |
| xml-name-validator | 5.0.0 | Apache-2.0 | desarrollo (transitiva) | https://www.npmjs.com/package/xml-name-validator |
| xmlchars | 2.2.0 | MIT | desarrollo (transitiva) | https://www.npmjs.com/package/xmlchars |
| yallist | 3.1.1 | ISC | desarrollo (transitiva) | https://www.npmjs.com/package/yallist |
| zod | 4.6.7 | MIT | producción (directa) | https://www.npmjs.com/package/zod |
<!-- deps:end -->

## Resumen por licencia

<!-- licenses:start -->
| Licencia | Paquetes |
|---|---:|
| (MIT AND CC-BY-3.0) | 1 |
| (MIT OR CC0-1.0) | 1 |
| 0BSD | 1 |
| Apache-2.0 | 37 |
| BlueOak-1.0.0 | 6 |
| BSD-2-Clause | 7 |
| BSD-3-Clause | 8 |
| CC-BY-3.0 | 1 |
| CC-BY-4.0 | 1 |
| CC0-1.0 | 1 |
| ISC | 29 |
| MIT | 493 |
| MPL-2.0 | 13 |
<!-- licenses:end -->

Total: **599 paquetes**.

## Notas sobre licencias

- **MPL-2.0** (Mozilla Public License 2.0): aparece en `axe-core` y en la familia `lightningcss`. Es una licencia débil de copyleft: si se modifica el código fuente de esos paquetes, hay que publicar esas modificaciones. La app los usa sin modificarlos (auditoría y build), y sus textos están en `node_modules/<paquete>/LICENSE`.
- **CC-BY-4.0** (`caniuse-lite`) y **CC-BY-3.0** (`spdx-exceptions`): exigen atribución; se conserva el identificador de licencia y la procedencia de cada paquete en la tabla.
- **CC0-1.0** y **0BSD**: licencias permisivas de datos y código (`spdx-license-ids`, `tslib`).
- **UNKNOWN**: si aparece, el paquete no declara licencia en `package.json`. Hay que revisar su LICENSE antes de distribuirlo.

## Verificación

```bash
npm run audit:licenses   # licencias de producción contra THIRD_PARTY_LICENSES.md
npx vitest run tests/dependency-licenses.test.ts
```
