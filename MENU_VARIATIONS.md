# Main-menu variation guide

The game has exactly five main-menu compositions. They all use the existing gameplay actions for continue, stage selection, archive access, and quitting, but they intentionally differ in spatial grammar and control geometry. The visible content contract is strict: game title, background art, actual action buttons, and numbered variation-switch buttons only.

## Preview selection

Use the numbered `01`–`05` switch buttons in the lower-right corner of the main menu. They update the typed `menu` query parameter with `history.replaceState`, so switching is URL-synced without a page reload.

The same resolver can be driven locally without the selector:

```text
?menu=retro
?menu=command
?menu=smuggler
?menu=squad
?menu=rogue
```

The `VITE_MAIN_MENU_VARIANT` environment variable is the fallback named switch. In PowerShell, for example:

```powershell
$env:VITE_MAIN_MENU_VARIANT = "command"
pnpm dev
```

Valid ids are defined in `src/renderer/src/game/config/main-menu-config.ts`. The default is `retro`. The development-only selector is omitted from production builds.

## The five directions

| Id | Variation | Design premise | Primary affordance |
| --- | --- | --- | --- |
| `retro` | Retro CRT Arcade Attract Mode | An action cabinet caught in a high-energy demo loop | Central circular PLAY control flanked by arcade buttons and a cartridge-like CONTINUE rail |
| `command` | Militarized Command Map | A tactical operations room that turns the menu into a sortie order | Four action nodes plotted into a rotated 3×3 tactical cluster |
| `smuggler` | Smuggler's Cargo Manifest | A compact contraband ledger where every action feels one scan away | Loose, angled cargo tags that spill across the action field |
| `squad` | Holographic Squad Roster | A character-forward briefing room for a one-ship strike team | Formation grid with ARCHIVE at the rear, PLAY at the nose, and side controls as wing nodes |
| `rogue` | Rogue AI Breach Terminal | A controlled security intrusion with a legible terminal shell | Two-row breach console with long CONTINUE/ARCHIVE rails and a central command pair |

## Implementation map

- `src/renderer/src/components/game/screens/MainMenuScreen.tsx` keeps save resolution and gameplay actions in one place.
- `src/renderer/src/components/game/screens/MainMenuVariants.tsx` is the typed five-way component registry.
- `src/renderer/src/components/game/screens/main-menu/` contains the shared keyboard-safe primitives and the five independent layouts.
- `src/renderer/src/components/game/screens/main-menu/main-menu.css` contains the scoped layout, focus, responsive, motion, and reduced-motion styling.
- `src/renderer/src/game/config/main-menu-config.ts` owns the variant ids, resolver, metadata, and generated asset URLs.
- `src/renderer/src/components/game/GameScreens.tsx` skips the old generic backdrop for the main menu so each variation can own its generated plate.

## Original background plates

Each variation uses one original generated image as a direct `<img>` element. CSS supplies only placement, tint, and readable overlay treatment.

- `assets/menu/retro-arcade.png`
- `assets/menu/command-map.png`
- `assets/menu/smuggler-cargo.png`
- `assets/menu/squad-roster.png`
- `assets/menu/rogue-terminal.png`

Only the active variant is requested by the browser at runtime. The other plates are packaged by the renderer build so switching does not require a network request.

## Verification

Dependency setup was completed offline without modifying the malformed tracked `pnpm-lock.yaml`:

```text
pnpm install --force --lockfile=false --optional=true --offline
```

Passed:

```text
pnpm typecheck
pnpm build
```

The build completed the Electron main, preload, and renderer bundles. The renderer transformed 1,967 modules and emitted all five menu plates plus `main-menu.css`. No dev server was started. Visual QA was limited to implementation inspection and the production build because the task explicitly prohibits launching a dev server.

The menu controls are native buttons with visible `:focus-visible` states, mouse hover states, Enter/Space activation, and Arrow/WASD navigation within each menu action list. `prefers-reduced-motion: reduce` collapses the decorative animations and transitions.

The minimal-content audit finds one visible heading (`VOID STRIKE`), the four actual action buttons when applicable, and the five numbered variation buttons. No stage names, descriptions, status readouts, badges, or decorative text are rendered.

Follow-up token audit and verification:

- 450 non-structural layout, type, position, and motion declarations are centralized as named `--main-menu-*` tokens.
- The targeted stylesheet audit reports `0` remaining non-tokenized declarations; PostCSS parsing passes.
- `pnpm typecheck` passes after the token pass.
- `pnpm build` passes after the token pass and emits the five menu plates and scoped CSS.

Final cleanup verification:

- `pnpm-lock.yaml` was restored to the exact `HEAD` content and is unmodified.
- Radar ring insets, clip-path offsets, hologram inset, caret alignment, and reduced-motion transition duration are all named `--main-menu-*` tokens.
- `pnpm typecheck` and `pnpm build` pass after the cleanup.

Interaction redesign verification:

- `pnpm typecheck` passes after the five spatial grammar layouts were rebuilt.
- `pnpm build` passes after the rebuild and emits the renderer bundle and all five background plates.
- No development server was launched.
