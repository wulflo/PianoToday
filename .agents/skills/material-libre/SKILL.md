---
name: Material libre
description: Verificar que el código, el contenido pedagógico, las partituras del repertorio, las muestras de audio y las dependencias de Piano Today sean libres y estén trazados —licencias MIT/CC BY-SA/CC0/PD, fichas de dominio público, créditos y auditorías REUSE—; usar al añadir una pieza, un ejercicio, samples o dependencias, o al revisar garantías de licencia.
---

# Material libre — Piano Today

Propósito: responder «¿podemos publicar esto?» con evidencia de la licencia real y del camino que la demuestra. **Revisa y reporta**; no cambies contenido ni licencias salvo petición explícita.

> Origen: creada para Piano Today siguiendo el formato de `.agents/skills` de SinNotas. Complementa `estructure` (dónde está cada ficha) y no sustituye a la auditoría de contenido (`npm run validate:content`).

## 1. Regímenes vigentes (no inventar otros)

| Ámbito | Régimen | Fuente de verdad |
| --- | --- | --- |
| Código, tests, configuración, docs | MIT | `LICENSE`, `package.json`, `REUSE.toml` (`path=["**"]`, `precedence="aggregate"`) |
| Contenido pedagógico (módulos, lecciones, ejercicios, habilidades) | CC BY-SA 4.0 | `LICENSE-CONTENT`, `REUSE.toml` (`content/**`), `src/schemas/content.ts` (`contentLicense`) |
| Estudios técnicos y piezas originales | CC0 1.0 | `LICENSE-CONTENT`, `REUSE.toml` (`content/repertoire/studies.*.json`, `content/repertoire/original-*.json`) |
| Obras transcritas de dominio público | Obra PD + transcripción/digitación propia | `docs/LICENCIAS.md` (ADR-011), `src/repertoire/public-domain.ts` |
| Muestras de piano | CC BY 3.0 (Salamander Grand Piano, Alexander Holm) | `assets/audio/manifest.json`, `docs/LICENCIAS.md`, `THIRD_PARTY_LICENSES.md` |
| Dependencias de producción | Allowlist MIT, Apache-2.0, BSD-3-Clause, 0BSD, ISC, CC0, Unlicense, BlueOak | `scripts/lib/license-audit.ts`, `docs/DEPENDENCIAS-LICENCIAS.md` |

 Los textos legales versionados están en `LICENSES/` (MIT, CC-BY-SA-4.0, CC0-1.0) y `tests/reuse.test.ts` exige correspondencia bidireccional con `REUSE.toml`.

## 2. Invariantes que deben cumplirse

1. **Una pieza del repertorio sin ficha no se publica**: `RepertoirePieceSchema` (`src/schemas/repertoire.ts`) exige `license` y al menos una partitura (`right`/`left`/`both`).
2. **Dominio público verificable**: en `src/schemas/license.ts`, `MIN_PUBLIC_DOMAIN_YEARS = 100`; si `license === "public-domain"` y el compositor no es `anonymousTraditional`, hace falta `deathYear` y `currentYear - deathYear > 100` (estricto). `LicenseFicheSchema` exige además `source`, `transcriptionAuthor`, `transcriptionDate`, `attribution`, `verifiedBy` y `verifiedOn`.
3. **El registro de candidatos manda**: `src/repertoire/public-domain.ts` publica `PUBLIC_DOMAIN_CANDIDATES` y `DISCARDED_CANDIDATES` con `source`, `sourceUrl` y `verifiedOn`. Una ficha nueva debe apoyarse en un candidato verificado; `docs/LICENCIAS.md:113-128` describe el flujo.
4. **Adaptaciones declaradas**: provenir de una edición moderna (arreglos Alfred/Bastien/Suzuki, armonizaciones actuales, ediciones revisadas) invalida la presunción de PD; se documenta en `notes` o se descarta.
5. **Audio con hash**: `assets/audio/manifest.json` declara `expectedSamples: 30`; cada muestra lleva `bytes`, `sha256`, `author`, `source`, `license`, `licenseUrl`, `modifications` y `sourceUrl`. `src/audio/sampler.ts` (`readSampleManifest`, `audioCredits`) genera los créditos de la interfaz desde ahí.
6. **Sin límites de derechos en el código**: ADR-046 prohíbe encabezados `Copyright`, `SPDX-License-Identifier`, `GPL` o `licensed under` en fuentes; las licencias van en `REUSE.toml` (ver `npm run audit:code`).
7. **Dependencias permitidas**: toda dependencia de producción debe estar en la allowlist y aparecer en `THIRD_PARTY_LICENSES.md`; las de desarrollo con licencias restrictivas (p. ej. MPL-2.0) no deben filtrarse a runtime.
8. **Créditos visibles**: `#/atribuciones` (`src/pages/AttributionsPage.tsx`) debe mostrar la ficha de cada pieza y los créditos derivados del manifiesto de audio; los textos pasan por `useSettings().t(...)` (ES/EN).

## 3. Verificación automática

```bash
npm run validate:content       # esquemas Zod: fichas,>100 años, transcriptionAuthor; también corre en build
npm run audit:audio            # 30 samples, allowlist de licencias, bytes + SHA-256
npm run audit:licenses         # allowlist de producción y cruce con THIRD_PARTY_LICENSES.md
npm run audit:code             # sin cabeceras de copyright/SPDX en el código
npm run audit                  # agregado: audio + licenses + code + text → docs/AUDITORIA.md
npm test -- tests/licenses.test.ts tests/public-domain.test.ts tests/licencias-doc.test.ts \
  tests/reuse.test.ts tests/verify-audio.test.ts tests/attributions-credits.test.tsx
npm run typecheck && npm test && npm run build && git diff --check
```

Con red o herramientas externas, marcadas como tales: `npm run audit:reuse` (`uvx reuse lint`), `npm run licenses:dependencies` (regenera `docs/DEPENDENCIAS-LICENCIAS.md`), `node scripts/fetch-samples.mjs --dry-run`. `npm run audit:text` necesita `refs/` (ignorado): si falta, informa `NO VERIFICABLE` y **no** lo reportes como éxito.

## 4. Cómo revisar una incorporación nueva

1. Identificar el tipo: ¿código, lección/ejercicio, pieza, muestra de audio o dependencia?
2. Localizar la declaración de licencia con `grep -RIn` (`license`, `licenseUrl`, `sourceUrl`, `verifiedOn`, `REUSE.toml`). Confirmar que la licencia declarada coincide con la fuente original, no con una copia intermedia.
3. Comprobar la ficha completa y ejecutar el comando del paso 3 que corresponda. Si la pieza es PD, cotejar con `PUBLIC_DOMAIN_CANDIDATES` y con la tabla de `docs/LICENCIAS.md` (debe coincidir archivo a archivo).
4. Verificar en la app: `#/atribuciones` muestra autor, licencia enlazada, fuente y modificaciones; el footer no contradice `LICENSE-CONTENT`.
5. Reportar cada hallazgo como `ruta:línea · evidencia · clasificación`, con `error` (publicación no segura), `warning` (crédito o trazabilidad incompleta) o `note` (precisión documental). No cambiar fichas ni textos legales sin petición.

## 5. Deudas conocidas (confirmar antes de dar algo por bueno)

- `src/state/settings.tsx`: el footer anuncia «Contenido CC BY-SA 4.0» mientras `app.credits.code` dice «contenido original bajo CC0 1.0»; la distinción correcta es CC BY-SA por defecto y CC0 solo en estudios/originales.
- `THIRD_PARTY_LICENSES.md`: enlace a `#/creditos`, ruta inexistente (la real es `#/atribuciones`).
- `LICENSES/` no incluye el texto de CC BY 3.0 pese a las 30 muestras; hoy se referencia por URL.
- `REUSE.toml` cubre `content/**` pero no declara explícitamente `public/audio/samples/*.mp3` ni `assets/audio/manifest.json` como CC BY 3.0; `audit:reuse` no corre en el agregado.
- El gate de build valida la ficha, pero no comprueba en runtime que una pieza `public-domain` esté en la lista verificada.
- `docs/RESUME.md` conserva la URL antigua `wulflo.github.io/piano-learning/` y `LICENSE-CONTENT` tiene un placeholder de URL de proyecto.

## Referencias rápidas

| Qué | Dónde |
| --- | --- |
| Fichas y tabla de piezas | `docs/LICENCIAS.md`, `content/repertoire/*.json` |
| Registro PD y descartes | `src/repertoire/public-domain.ts` |
| Esquemas de licencia y contenido | `src/schemas/license.ts`, `src/schemas/repertoire.ts`, `src/schemas/content.ts` |
| Audio y créditos | `assets/audio/manifest.json`, `src/audio/sampler.ts`, `src/pages/AttributionsPage.tsx` |
| Auditorías | `scripts/audit-all.ts`, `scripts/lib/license-audit.ts`, `scripts/verify-audio.mjs`, `docs/AUDITORIA.md` |
| Mapa técnico | skill `estructure` → `references/Estructure.md` |
