<div align="center">

# 🎹 Piano Today

**Theory, piano and practice — from zero, without a teacher, accounts or a backend.**

Short lessons, an interactive keyboard and staff, spaced repetition and a real
MIDI keyboard when you have one. Your progress stays in your browser and you can
export or import it whenever you want.

[![Demo](https://img.shields.io/badge/🌐_Demo-GitHub_Pages-2f5d50?style=flat-square)](https://wulflo.github.io/PianoToday/)
![Node](https://img.shields.io/badge/Node-≥22.12-8a4f37?style=flat-square)
![PWA](https://img.shields.io/badge/PWA-offline_ready-2f6b3b?style=flat-square)
![License](https://img.shields.io/badge/Code-MIT-2f5d50?style=flat-square)

**[Try the live demo →](https://wulflo.github.io/PianoToday/)**

</div>

---

## 🧭 On this page

[Who it is for](#who-it-is-for) · [What it includes](#what-it-includes) ·
[Quick start](#quick-start) · [How to learn](#how-to-learn) ·
[Commands](#requirements-and-commands) · [MIDI and browsers](#midi-and-browsers) ·
[Limitations](#limitations) · [Documentation](#project-documentation) ·
[Status](#project-status)

---

## 🎯 Who it is for

| | |
|---|---|
| 🌱 **Complete beginners** | Learn to read music and play from scratch, no prior training needed. |
| 🧠 **Self-taught learners** | A structured path, short sessions and objective feedback. |
| 🍎 **Teachers** | Original exercises and repertoire with documented licenses. |
| 🔁 **Returning players** | Refresh theory, sight-reading and technique at your own pace. |

You do not need to read music before starting: the staff is introduced gradually.
Lessons are short on purpose — fifteen minutes on several days beats one long
session once a week.

> 💡 **Practice tip:** the course suggests a daily queue; a little, often, is the
> fastest way in.

---

## ✨ What it includes

| Area | What you get |
|---|---|
| 📚 **Course** | 9 modules · 79 lessons · 720 exercises · 67 skills |
| 🎼 **Repertoire** | 28 public-domain pieces, original studies and CC0 melodies, with per-hand player |
| 🎹 **Instruments** | Interactive keyboard, VexFlow staff, Salamander piano samples with synthesis fallback |
| 🔁 **Practice** | Guided daily sessions, progressive metronome and FSRS spaced review |
| 🎧 **MIDI** | Note, tempo and rhythm feedback from a real keyboard — optional |
| 📴 **PWA** | Installable, precached shell and offline operation |
| ♿ **Accessibility** | Keyboard navigation, skip link, text alternatives, AA contrast, reduced motion |

---

## 🚀 Quick start

### Online

Open the [live demo](https://wulflo.github.io/PianoToday/) in a current browser.
No sign-up, no install. The first visit needs a connection; after that the app
works offline.

### Install it as an app

Use your browser's install action. On iOS: **Share → Add to Home Screen**, then
tap the screen once to enable audio. Updates arrive via a banner and never
force a reload.

### Local development

```bash
npm ci        # exact dependencies from the lockfile
npm run dev   # development server at http://localhost:5173
```

See [Requirements and commands](#requirements-and-commands) for the full list.

### With a MIDI keyboard

Connect a Web MIDI-compatible keyboard and press **Connect MIDI keyboard**. The
app explains what it will ask for before requesting permission, and shows
browser-specific help if it is blocked. No MIDI? Manual self-assessment keeps
everything usable.

---

## 🧭 How to learn

1. Follow the **Course** in order: objectives, a short explanation, examples and
   a keyboard task per lesson.
2. Practise on the **on-screen keyboard** or connect your MIDI keyboard.
3. Use **Practice** for a daily session and **Review** for your spaced queue.
4. Explore **Repertoire**: switch hands, change tempo, loop a passage.
5. Check **Progress** and export a backup from **Settings**.

---

## 🛠 Requirements and commands

Requires **Node.js ≥ 22.12**.

```bash
npm ci                     # install the exact dependencies from the lockfile
npm run dev                # development server
npm run typecheck          # TypeScript, no emit
npm test                   # Vitest suite (axe checks included)
npm run validate:content   # lesson/exercise schemas and licenses
npm run build              # validated production build
npm run budget             # initial-JS budget and code splitting
npm run estado             # full verification + docs/ESTADO.md
npm run audit              # offline license, code and originality audits
npm run licenses:dependencies  # regenerate the dependency license inventory
npm run test:e2e           # Playwright, Chromium project
```

Local development runs at `/`. To publish under `/<repo-name>/`, set `VITE_BASE`;
the GitHub Pages workflow does it automatically.

---

## 📴 PWA and offline use

The service worker precaches the shell (HTML, JS, CSS and icons) and caches audio
samples at runtime. After the first visit the app opens without a network and
updates only when the banner asks for it. On iOS, install it from **Share → Add
to Home Screen** and tap once to enable audio.

---

## 🌐 MIDI and browsers

| Browser family | Web MIDI | What the app shows |
|---|---|---|
| Chrome, Edge, Brave, Opera, Vivaldi, Samsung Internet, Chrome Android | ✅ | Pre-permission explanation, blocked/dismissed help with verified settings paths |
| Firefox desktop | ✅ with a site permission add-on | Two-dialog explanation; connect the keyboard first, then "Look for devices again" |
| Safari macOS | ❌ native (third-party extension available) | Optional guide to a third-party extension, plus the full manual fallback |
| iOS / iPadOS | ❌ in every browser | Clear notice and manual self-assessment |
| Firefox Android | ❌ | Clear notice and manual self-assessment |

Permission is requested only after a user gesture. The **MIDI diagnostics** panel
shows the browser, secure context, permission state and the real error name and
message, with a **Copy diagnostic report** button (plain text, no personal data).
Notes, channels and system/realtime messages are normalized, with profiles such
as the Yamaha PSR-373.

---

## ⚠️ Limitations

- **It does not replace a teacher.** Notes, tempo and evenness can be checked;
  posture, tension and musicality need a human ear.
- **MIDI depends on the device, driver and browser.** Latency and port visibility
  vary; physical MIDI is still pending manual confirmation. On Windows, non-
  Chromium browsers may never show the permission dialog (reported; Linux is
  unaffected); the app shows specific guidance and manual self-assessment
  remains available.
- **Manual self-assessment is required** when no MIDI device is available.
- **Some browsers have no Web MIDI.** The app degrades gracefully but cannot give
  objective MIDI feedback there.
- **Manual testing on iOS and Android remains pending** (F6-028/F6-029): no
  physical devices in this environment.
- **Content is pedagogical and original.** Sources are in `docs/LICENCIAS.md`;
  dependency licenses are in `THIRD_PARTY_LICENSES.md` and
  `docs/DEPENDENCIAS-LICENCIAS.md`.

> 🩺 If you feel pain, persistent tension or doubts about technique, ask a teacher.

---

## ♿ Accessibility

The suite includes axe checks on the main routes, keyboard navigation tests and
WCAG contrast calculations. Scores expose a text summary per hand, and the player
announces hands, measures and tempo. If you find a barrier, open an issue with the
route and the browser you used.

---

## 🤝 Contributing

Read `CONTRIBUTING.md` (origin, license and DCO sign-off), then follow the
checklist-first protocol in `docs/GUIA-CAMBIOS.md` and `docs/CHECKLIST.md`: one
task, acceptance criteria and a green verification. Keep `npm run estado` green
and update `docs/LOG.md` and the resume point. New content must respect the
license schema and include its source.

---

## 🚀 Deploying to GitHub Pages

`.github/workflows/deploy-pages.yml` checks types and tests, builds `dist/` with
the correct base and publishes the artifact. It runs on a push to `main` or
manually from **Actions → Deploy a GitHub Pages → Run workflow**.

First-time setup:

1. Create the repository and push `main`.
2. **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. If it did not start by itself, run the workflow manually.
4. The URL appears in the `github-pages` deployment environment.

It can also be enabled with `gh api -X POST repos/OWNER/REPO/pages -f build_type=workflow`.
GitHub Pages in private repositories needs a plan that allows it.

---

## 📖 Project documentation

| Document | What it explains |
|---|---|
| `CONTRIBUTING.md` | Origin, license and DCO sign-off |
| `docs/GUIA-CAMBIOS.md` | How to change anything with a checklist first |
| `docs/CHECKLIST.md` | Single source of truth for progress |
| `docs/RESUME.md` | How to resume from scratch |
| `docs/LOG.md` | Chronological log |
| `docs/DECISIONES.md` | Architecture decisions (ADR-001 … ADR-050) |
| `docs/ENTORNO.md` | Versions, licenses and assets |
| `docs/QA-NAVEGADORES.md` | Browser QA matrix |
| `docs/DIAGNOSTICO-MIDI.md` | Web MIDI reproduction and cause → symptom → fix table |
| `docs/DEPENDENCIAS-LICENCIAS.md` | Every dependency with license, scope and source |
| `docs/LICENCIAS.md` | Public-domain verification and repertoire sources |
| `docs/ESTADO.md` | Generated by `npm run estado` |
| `CHANGELOG.md` | Changes by phase |

---

## 📊 Project status

Phases **0 to 7 are closed** (local tags `fase-0` to `fase-6`; no tag for F7).
F7 hardened Web MIDI across browsers and refreshed the visual design.

- **263 test files / 1847 tests** green, including axe checks.
- **277,59 kB gzip** of initial JS (budget: 300 kB) and 843 deferred chunks.
- E2E: 8/8 in Chromium and 7/7 in Firefox; 36 visual-QA captures.
- The demo is published at **<https://wulflo.github.io/PianoToday/>**.
- Known limitation: manual testing on iOS and Android (F6-028/F6-029) is still
  pending; WebKit could not run in this host.

---

## 📄 Licenses

- Code: MIT (`LICENSE`).
- Original content: CC BY-SA 4.0 (`LICENSE-CONTENT`); original exercises and
  pieces are CC0.
- Samples and third-party assets: `THIRD_PARTY_LICENSES.md`.
- All dependencies: `docs/DEPENDENCIAS-LICENCIAS.md` (generated with
  `npm run licenses:dependencies`).

---

<div align="center">

**Made for slow, steady practice. 🎹**

</div>
