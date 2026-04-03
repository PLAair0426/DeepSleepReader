# DeepSleepReader Patched Bundle

This repository tracks an unpacked, editable DeepSleepReader application bundle plus the QA assets used to validate it.

## What Is Included

- `resources/app/dist`
  Frontend bundle with the patched reader, settings, search, research, and notebook workbench pages.
- `resources/app/dist-electron`
  Electron main-process and preload code, including the notebook storage/API implementation.
- `.codex-qa`
  Extraction helper, fixtures, and regression/smoke tests.
- `resources/app/package.json`
  Dependency manifest from the extracted application bundle.

## What Is Excluded

- The packaged Windows runtime (`DeepSleepReader.exe`, Electron DLLs, `.pak` files).
- The original packed archive backup (`resources/app.asar.original`).
- Local test user data, SQLite databases, and logs generated during QA.
- `resources/app/node_modules`.

## Key Features In This Snapshot

- DeepSeek-default AI preset settings with common domestic/international presets.
- Clear OCR-unavailable customer messaging for the current build.
- Stabilized TXT/Markdown text selection flow.
- Fixed PDF reader plugin crash.
- NotebookLM-style `笔记本` workbench:
  - notebook CRUD
  - multi-document membership
  - saved question threads
  - citations and fact-check panels
  - auto-created summary/outline/overview/concept artifacts with unavailable-state UX

## Verification

Run these from the repo root after wiring the app runtime as needed:

```powershell
node --test .codex-qa/tests/ai-settings-presets.test.cjs
node --test .codex-qa/tests/customer-qa-smoke.test.cjs
node --test .codex-qa/tests/notebooks-smoke.test.cjs
```
