# Main-menu variation guide

The main menu has five typed, structurally different presentations. The visible
surface intentionally contains only the game title, generated background art,
actual action buttons, and five numbered variation buttons. All five use the
same `CONTINUE`, `PLAY`, `ARCHIVE`, and `QUIT` behavior; only the composition
and visual language change.

## Selection

The default is `flight-deck`.

Use the query string in a local Electron URL to select one menu:

```text
?menuVariant=flight-deck
?menuVariant=black-market
?menuVariant=derelict-station
?menuVariant=shipyard
?menuVariant=orbital-elevator
```

The compact `MENU VARIANTS` switcher is always visible in the top-right corner
of the main menu. A named build switch is also supported through
`VITE_MAIN_MENU_VARIANT` and is validated against the same typed variant list.

## The five directions

| Variant | Premise | Primary composition | Motion / interaction language |
| --- | --- | --- | --- |
| Starship Flight Deck | Immersive pilot cockpit preflight | Cross-shaped cockpit control bank with the primary sortie control at its center | Instrument-bank focus movement and restrained reticle motion |
| Black-market Bounty Terminal | Gritty illicit contract board | Four contract seals orbit the title as a decisive physical selection field | Seal hover/focus and target-lock motion |
| Derelict Station Distress Broadcast | Investigative intercepted transmission | Fractured broadcast fragments scatter the action controls across an irregular grid | Signal-fragment drift and clipped focus traces |
| Neon Shipyard Launch Bay | Physical launch preparation | A gantry-like launch surface gives the primary sortie control a full runway | Launch-line sweep and oversized release affordance |
| Orbital Elevator Clearance | Corporate security bureaucracy under pressure | Staggered horizontal clearance gates turn each action into an access checkpoint | Gate progression and restrained authorization motion |

## Key files

- `src/renderer/src/game/config/main-menu-config.ts` owns the typed variants,
  background URLs, and query selection.
- `src/renderer/src/components/game/screens/MainMenuScreen.tsx` owns save
  resolution, shared gameplay actions, and variant routing.
- `src/renderer/src/components/game/screens/main-menu/` contains the five
  independent menu implementations and their small shared primitives.
- `src/renderer/src/styles/main-menu.css` contains responsive layout, a named
  `--main-menu-*` dimension/timing token layer, focus treatment, cheap CSS
  motion, and reduced-motion behavior.
- `assets/menu/` contains the five original generated backgrounds.

## Verification

Run without starting a dev server:

```text
pnpm typecheck
pnpm build
```

Both passed for this implementation. The repository lockfile currently has
two YAML documents, so local dependency setup used `pnpm install
--lockfile=false`; the existing lockfile was not changed.
