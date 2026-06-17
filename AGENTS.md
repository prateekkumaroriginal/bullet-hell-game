# AGENTS.md

- Don't start dev server. Assume it's already running.

## PRIORITY
- Performance first.
- Reliability first.
- Keep behavior predictable under load and during failures.
- If a tradeoff is required, choose correctness and robustness over short-term convenience.

## Project Intent

- This repo is for a bullet hell game built as a native desktop application.
- Use Electron for the desktop shell, React for the app UI, and Phaser for the actual game loop.
- This repository is a VERY EARLY WIP. Proposing sweeping changes that improve long-term maintainability is encouraged.

## Desktop App Direction

- Build as an Electron application, not a browser-only web app.
- Keep Electron main/preload code separate from React renderer code.
- Use secure Electron defaults: no unnecessary Node access in the renderer, prefer preload APIs for desktop integration.
- Phaser should run in the renderer process inside the React app.

## Constants

- Do not use magic numbers.
- Any numeric value that represents gameplay tuning, timing, sizing, physics, limits, spawn behavior, scoring, or UI layout behavior must be named in a constants/config file and imported where used.
- Inline numeric literals are acceptable only for structural values such as `0`, `1`, `-1`, loop increments, array indexes, and simple API values where a named constant would reduce clarity.

## Work Style

- Keep changes in short, reviewable iterations.
- Do not make large framework, architecture, or styling changes without a clear reason.
- Prefer making one useful slice work end to end over creating a broad unfinished scaffold.
- Preserve user changes. Do not revert unrelated files.
- Use typescript very aggressively.
- Do not change save schema versions unless explicitly requested.
- Do not add trailing commas.

## Teaching Style

- The author is learning Phaser and Electron while building this project.
- Explain relevant Phaser and Electron concepts in plain language as development progresses.
- Keep explanations practical and tied to the code being changed.
- Prefer short teaching notes over long theory.
- Explain why a pattern is used, what tradeoffs it has, and what the author should watch for when extending it later.

## UI & Shadcn

- Use shadcn cli for installing components. Don't create them.
- Use flex and gap as much as possible. Avoid margins at all. Only exceptions are shadcn components.
