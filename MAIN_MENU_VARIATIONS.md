# Main-menu variation guide

The main menu has five typed, structurally different presentations. All five
use the same `CONTINUE`, `PLAY`, `ARCHIVE`, and `QUIT` behavior; only the
labels, composition, and visual language change.

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
| Starship Flight Deck | Immersive pilot cockpit preflight | Three-column instrument console with radar, telemetry, and flight commands | Radar sweep, instrument readouts, cockpit-style command cards |
| Black-market Bounty Terminal | Gritty illicit contract board | Command rail plus a large target dossier with threat meter and amber deploy control | Terminal scanline, monospaced data, decisive contract acceptance |
| Derelict Station Distress Broadcast | Investigative intercepted transmission | Letterboxed broadcast window, narrative quote, signal waveform, and evidence actions | Signal pulse, waveform breathing, cinematic trace/reconnect language |
| Neon Shipyard Launch Bay | Physical launch preparation | Oversized launch-readiness panel beside systems check and dock manifest | Readiness ring, systems checklist, release-to-sortie affordance |
| Orbital Elevator Clearance | Corporate security bureaucracy under pressure | Clearance seal beside a bright access dossier and protocol checklist | Sequential authorization rows, restrained red security state, compliance actions |

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
