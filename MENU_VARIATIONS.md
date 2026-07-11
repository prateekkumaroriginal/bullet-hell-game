# Main-menu variation guide

The main menu has five real layouts. They share the existing gameplay actions, save handling, keyboard navigation, and reduced-motion behavior, but each uses a different spatial interaction grammar.

## Selection

- The numbered switcher is visible at the bottom of the menu. Click a slot or press `1` through `5`.
- In any renderer build, select a named variation with the query parameter `?menu=<id>`:
  - `spaceport`
  - `salvage`
  - `anomaly`
  - `warfront`
  - `temple`
- The default is `spaceport`. The query parameter is replaced in-place when a switcher button is selected, so it does not reload the Phaser game.

## Directions

| Slot | Variation | Interaction premise |
| --- | --- | --- |
| 01 | Spaceport Nightlife Mission Board | Actions sit as neon launch stops around a tilted city circuit, with the primary launch control crossing the route. |
| 02 | Salvage Rig Locker Room | Actions form a two-by-two industrial control bank, with offset plates that feel like physical rig hardware. |
| 03 | Deep-Space Anomaly Lab | Actions orbit the title at four signal points, turning the menu into a radial instrument. |
| 04 | Planetary Siege Warfront | Actions become a single staggered order strip, like a field command sequence rather than a menu stack. |
| 05 | Astral Synth Temple | Actions mark four gates around a rectangular threshold, creating a symmetric ceremonial control frame. |

## Key files

- `src/renderer/src/components/game/screens/MainMenuScreen.tsx` owns continue-save resolution, URL syncing, and number-key variation selection.
- `src/renderer/src/components/game/screens/MainMenuVariations.tsx` contains the five compositions and numbered switcher.
- `src/renderer/src/components/game/screens/main-menu-variations.css` contains the spatial layouts, named custom-property tokens, focus states, responsive rules, and reduced-motion fallback.
- `src/renderer/src/game/config/menu-variation-config.ts` defines the typed ids, query/key mapping, asset URLs, themes, and motion constants.
- `src/renderer/src/components/game/screens/ScreenPrimitives.tsx` preserves the existing arrow-key navigation for action buttons.

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
