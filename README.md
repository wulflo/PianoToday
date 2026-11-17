# Piano Today

A static web app for learning music theory and piano/keyboard from scratch, with
short lessons, interactive exercises, spaced repetition, and practice on a real
keyboard or on the on-screen keyboard. It works without a backend and without
accounts: your progress lives in the browser (IndexedDB) and can be exported and
imported.

**Live demo:** <https://wulflo.github.io/PianoToday>

## Who it is for

- **Complete beginners** who want to learn to read music and play piano from
  zero, without prior training.
- **Self-taught learners** who need a structured path, short sessions, and
  objective feedback.
- **Teachers** looking for original exercises and repertoire with documented
  licenses.
- **Returning players** who want to review theory, sight-reading, and technique.

You do not need to read music before starting: the course introduces the staff
gradually. Lessons are short on purpose; practicing 15 minutes on several days
works better than one long session once a week.

## What it is useful for

- Building a daily practice habit with guided sessions and spaced review.
- Learning to read notes, rhythm, intervals, scales, chords, and harmony.
- Practicing with objective feedback on notes, timing, and evenness.
- Playing and studying repertoire with separate hands, tempo control, and loops.
- Tracking progress and exporting it to keep a personal backup.
- Supporting self-study or classroom work without creating accounts.

## What it includes

- **9 modules and 79 lessons**: from orientation and the first notes to
  technique, styles, sight-reading, lead sheets, and improvisation.
- **720 exercises** with correction, graduated hints, and audio.
- **67 skills** trained with spaced repetition (FSRS).
- **28 repertoire pieces**: public-domain transcriptions, original studies, and
  CC0 melodies, with license information and a per-hand player.
- **Interactive keyboard**, VexFlow staff notation, and an audio engine with
  piano samples (Salamander) plus synthesis as a fallback.
- **Installable PWA** with shell precaching and offline operation.
- **Optional MIDI** (Web MIDI): keyboard detection, tempo, rhythm, and objective
  feedback. Without MIDI, manual self-assessment remains available.
- **Accessibility**: keyboard navigation, skip link, text alternatives for
  notation/audio, AA contrast, and reduced motion.

## How to use it

### Online demo

Open <https://wulflo.github.io/piano-learning/> in a current browser. No account
or installation is required. The first visit needs a connection; after that the
app can work offline.

### Install it as an app (PWA)

Use the browser's install action to add Piano Today to your device. On iOS, open
**Share → Add to Home Screen** and tap the screen once to enable audio. The
installed app keeps working offline and updates only when the banner asks for it;
it never force-reloads.

### Local development

Clone the repository, install the exact dependencies from the lockfile, and run
the development server (see [Requirements and commands](#requirements-and-commands)).

### With a MIDI keyboard

Connect a Web MIDI-compatible keyboard (Chrome, Edge, or another Chromium-based
browser). The app asks for permission only when a device is connected and uses
MIDI for note, tempo, and rhythm feedback. If Web MIDI is unavailable, everything
still works with manual self-assessment.

## How to learn

1. Open the app and go through the **Course** in order. Each lesson provides
   objectives, a short explanation, examples, and a keyboard task.
2. Practice with the **on-screen keyboard** or connect a MIDI keyboard.
3. Use **Practice** for a daily session and **Review** for what the spaced
   repetition system suggests.
4. Play pieces in **Repertoire**; adjust hands, measures, tempo, and looping.
5. Check **Progress** and export your progress from **Settings**.

## Requirements and commands

Requires **Node.js ≥ 22.12**.

```bash
npm ci            # install the exact dependencies from the lockfile
npm run dev       # development server
npm run typecheck
npm test
npm run validate:content
npm run build
npm run budget    # build + initial-JS budget and code splitting
npm run estado    # full verification + docs/ESTADO.md
```

Local development runs at `/`. To publish under `/<repo-name>/`, set
`VITE_BASE`; the GitHub Pages workflow configures it automatically.

## PWA and offline use

The app registers a service worker that precaches the shell (HTML, JS, CSS, and
icons) and caches audio samples at runtime. The first visit needs a connection;
after that the app can be opened without a network and updated when the banner
indicates it (it never force-reloads). On iOS, install it from **Share → Add to
Home Screen** and tap the screen once to enable audio.

## MIDI and browsers

Web MIDI is available in Chrome, Edge, and Chromium-based browsers. Firefox and
Safari may not offer it: in that case the app shows a notice and everything keeps
working with manual self-assessment. Permission is requested only when a device
is connected. Note on/off messages, channels, and system/realtime messages are
normalized; there are profiles for common devices such as the Yamaha PSR-373.

## Limitations

- **It does not replace a teacher.** The app corrects notes, tempo, and
  evenness, and suggests review, but it does not evaluate posture, relaxation,
  tone, or musicality with the nuance of a human ear.
- **MIDI feedback depends on the device and latency.** Results vary with the
  keyboard, its drivers, and the browser.
- **Manual self-assessment is still required** when no MIDI device is available.
- **Some browser features are optional.** Web MIDI is not available everywhere;
  the app degrades gracefully but cannot provide objective MIDI feedback there.
- **Manual testing on iOS and Android remains pending** (F6-028/F6-029) because
  physical devices are not available in the current environment.
- **Content is pedagogical and original.** Sources are documented in
  `docs/LICENCIAS.md` and `THIRD_PARTY_LICENSES.md`.

If you experience pain, persistent tension, or doubts about technique, consult a
teacher.

## Accessibility

The test suite includes axe checks on the main routes, keyboard tests, and
contrast calculations. Scores expose a text summary per hand, and the player
announces hands, measures, and tempo. If you find a barrier, open an issue with
the route and the browser you used.

## Contributing

Before changing code, read `CONTRIBUTING.md` (origin, license, and DCO sign-off)
and follow the protocol in `docs/GUIA-CAMBIOS.md` and `docs/CHECKLIST.md`: one
task, acceptance criteria, and a green verification. Changes must leave
`npm run estado` green and update `docs/LOG.md` and the resume point. For new
content, respect the license schema and add the source.

## Deploying to GitHub Pages

The `.github/workflows/deploy-pages.yml` workflow checks types and tests, builds
`dist/` with the correct `base`, and publishes the artifact. It runs on a push to
`main` or manually from **Actions**.

To enable it for the first time:

1. Create the repository on GitHub and push the `main` branch.
2. In the repository: **Settings → Pages → Build and deployment → Source:
   GitHub Actions**.
3. If the workflow did not start by itself, open **Actions → Deploy a GitHub
   Pages → Run workflow**.
4. The published URL appears in the `github-pages` deployment environment.

It can also be enabled through the API:

```bash
gh api -X POST repos/OWNER/REPO/pages -f build_type=workflow
```

GitHub Pages in private repositories requires a plan that allows it; in a public
repository nothing else is needed.

## Project documentation

- `CONTRIBUTING.md`: origin, license, and DCO sign-off for contributions.
- `docs/GUIA-CAMBIOS.md`: how to make any change with a checklist first.
- `docs/CHECKLIST.md`: single source of truth for progress.
- `docs/RESUME.md`: how to resume work from scratch.
- `docs/LOG.md`: chronological log.
- `docs/DECISIONES.md`: architecture decisions.
- `docs/ENTORNO.md`: versions, licenses, and assets.
- `docs/QA-NAVEGADORES.md`: browser QA matrix (F6-027).
- `docs/LICENCIAS.md`: public-domain verification and repertoire sources.
- `docs/ESTADO.md`: generated by `npm run estado`.
- `CHANGELOG.md`: changes by phase.

## Project status

Phases 0 through 6 are closed (tags `fase-0` to `fase-6`, with GitHub releases).
The demo is published at <https://wulflo.github.io/piano-learning/> and the live
smoke test covers routes, repertoire, audio with real samples, export/import, and
offline use. Verified details are in `docs/CHECKLIST.md`. Known limitation:
manual testing on iOS and Android (F6-028/F6-029) remains pending because
physical devices are not available.

## Licenses

- Code: MIT (`LICENSE`).
- Original content: CC BY-SA 4.0 (`LICENSE-CONTENT`); original exercises and
  pieces are CC0.
- Third-party assets and samples: `THIRD_PARTY_LICENSES.md`.
