# Contributing to Piano Today

Thank you for wanting to contribute. This document summarizes **what you can
contribute, under which license, and how to sign it off**. It is short on
purpose: if something is unclear, open an issue before sending the change.

## 1. Before touching anything

- Read `docs/GUIA-CAMBIOS.md`: the project works **checklist first**.
- Every new task is recorded in `docs/CHECKLIST.md` (ID, acceptance criteria,
  dependencies, and whether it needs network access) **before** it is
  implemented.
- One change, one atomic commit; one commit, one hash in the checklist.
- Nothing is marked as done without `npm run typecheck`, `npm test`, and
  `npm run build` passing.

## 2. Origin and license of your contribution

Every contribution declares **where it comes from** and **which license it enters
under**. By submitting a change you accept that:

| Type of contribution | Inbound license |
|---|---|
| Code, tooling, tests, documentation, and configuration | **MIT** (see `LICENSE`) |
| Lessons, exercises, modules, and skills (`content/**`) | **CC BY-SA 4.0** (see `LICENSE-CONTENT`) |
| Technical studies and original melodies marked `cc0-1.0` in their metadata | **CC0 1.0** |

The license of every versioned file is declared in `REUSE.toml`, and the legal
texts live in `LICENSES/`. If you add a file that does not fit the existing
annotations, update `REUSE.toml` (and `LICENSES/` if needed) and leave
`npm run audit:reuse` passing.

### DCO sign-off (mandatory)

All commits are signed with the [Developer Certificate of Origin 1.1][dco]. This
certifies that you have the right to contribute what you contribute. Use
`git commit -s` to add the line:

```text
Signed-off-by: First Last <email@example.com>
```

The sign-off must match the commit author. A PR without a sign-off cannot be
merged. The full DCO text is available at <https://developercertificate.org/>.

[dco]: https://developercertificate.org/

## 3. What you must NOT contribute

**Pasting third-party material is forbidden.** Specifically:

- **Text**: paragraphs copied from books, methods, blogs, wikis, or other
  people's notes. Write the explanation in your own words.
- **Audio**: recordings, samples, or sound banks from third parties. The app uses
  Salamander Grand Piano samples with their attribution; do not add others.
- **Scores**: modern editions, arrangements, fingerings, or transcriptions from
  third parties. Only public-domain works **with your own transcription,
  arrangement, and fingering** are accepted (ADR-011 in `docs/DECISIONES.md`).
- **Images, fonts, or icons** without a compatible license and attribution.

If you are unsure about the status of a work, do not add it: open an issue and it
will be verified first. The conservative criterion is that a work is in the
public domain if the composer died **more than 100 years ago** or if it is an old
anonymous traditional melody.

### Repertoire content

Every new piece needs its metadata in `content/repertoire/` with composer, dates,
source consulted, verification date, license, transcriber, and visible
attribution. Public-domain transcriptions are also recorded in
`docs/LICENCIAS.md`. `npm run validate:content` is the gate: it does not only
validate the schema, it also requires the license.

## 4. Workflow

1. Record the task in `docs/CHECKLIST.md` and mark it `[~]`.
2. Implement it in a scoped change, without unrelated refactors.
3. Verify:

   ```bash
   npm run typecheck
   npm test
   npm run build
   ```

   Depending on the change, also run: `npm run validate:content`,
   `npm run budget`, `npm run audit:audio`, `npm run audit:licenses`,
   `npm run audit:code`, `npm run audit:text`, or `npm run audit:reuse`.
4. Commit with a sign-off (`git commit -s`) and include the task ID in the
   message.
5. Close the task in `docs/CHECKLIST.md` with `- Commit: <hash>`, add the entry
   to `docs/LOG.md`, and update the resume point.

If a decision changes the architecture, add an ADR to `docs/DECISIONES.md`. No
`push`, tags, or releases are made without explicit authorization.

## 5. Style

- Strict TypeScript; code and messages are in Spanish, like the rest of the
  project.
- Visible texts are added to the ES/EN dictionaries in
  `src/state/settings.tsx`.
- Local content is preferred: the app must not require network access at
  runtime.
- Respect the accessibility already covered (keyboard navigation, text
  alternatives, AA contrast, reduced motion).

## 6. Project license

Piano Today is distributed under **MIT** (code) and **CC BY-SA 4.0** (content),
with original studies and melodies marked as **CC0 1.0**. By contributing you
agree to release your contribution under those same licenses.
