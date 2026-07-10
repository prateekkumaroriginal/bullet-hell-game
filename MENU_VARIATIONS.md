# Main-menu variation guide

The main menu has five real layouts. They share the existing gameplay actions, save handling, keyboard navigation, and reduced-motion behavior, but each uses a different composition and visual metaphor.

## Selection

- In development, the `DEV DECK / 1–5` control is visible at the bottom of the menu. Click a slot or press `1` through `5`.
- In any renderer build, select a named variation with the query parameter `?menu=<id>`:
  - `spaceport`
  - `salvage`
  - `anomaly`
  - `warfront`
  - `temple`
- The default is `spaceport`. The query parameter is replaced in-place when a development deck slot is selected, so it does not reload the Phaser game.

## Directions

| Slot | Variation | Design premise |
| --- | --- | --- |
| 01 | Spaceport Nightlife Mission Board | A magenta/cyan city-night gig board: oversized `NEON RUNNER` hero type, live contract card, and social-hub utility actions. |
| 02 | Salvage Rig Locker Room | A blue-collar prep bay: equipment manifest, ship-on-maintenance-stage, systems checklist, and repair-bay status language. |
| 03 | Deep-Space Anomaly Lab | A cold observatory readout: centered rotating signal core, scientific measurements, unresolved anomaly copy, and contact/observation actions. |
| 04 | Planetary Siege Warfront | A red/blue conflict bulletin: poster-scale `DEFEND ORBIT` typography, mission roster rows, and an urgent offensive launch rail. |
| 05 | Astral Synth Temple | A restrained cyber-mystic threshold: centered ceremonial title, concentric synth halo, vertical rite actions, and refined serif typography. |

## Key files

- `src/renderer/src/components/game/screens/MainMenuScreen.tsx` owns continue-save resolution and typed variation selection.
- `src/renderer/src/components/game/screens/MainMenuVariations.tsx` contains the five distinct React compositions and shared preview deck.
- `src/renderer/src/components/game/screens/main-menu-variations.css` contains the variant-specific layouts, named custom-property tokens, focus states, responsive rules, and reduced-motion fallback.
- `src/renderer/src/game/config/menu-variation-config.ts` defines the typed ids, query/key mapping, asset URLs, themes, and motion constants.
- `src/renderer/src/components/game/screens/ScreenPrimitives.tsx` adds the optional full-page content class while preserving existing menu keyboard navigation.

## Original background assets

The five generated source images are packaged directly and only the selected variation mounts its image element:

- `assets/menu/spaceport-nightlife.png`
- `assets/menu/salvage-rig.png`
- `assets/menu/anomaly-lab.png`
- `assets/menu/warfront.png`
- `assets/menu/astral-synth-temple.png`

The five PNGs add approximately 10.8 MiB to the static asset payload. They are intentionally not replaced with runtime filters or procedural CSS backgrounds.

## Verification

- `pnpm typecheck` — passed
- `pnpm build` — passed; Electron main, preload, renderer, CSS, and all five menu assets emitted
- `git diff --check` — passed
- No development server was started

The isolated worktree did not have `node_modules`; dependencies were installed with `pnpm install --lockfile=false --force --include=optional --prefer-offline` because the existing lockfile contains two YAML documents. The tracked lockfile and package manifest were left unchanged.
