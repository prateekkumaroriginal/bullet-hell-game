# Improvements Roadmap

### 1. Restart-Safe Cleanup

- [ ] Standardize controller lifecycle with a small shared interface:
  - `update(delta)`
  - `destroy()`
- [ ] Make every event subscription return or store a cleanup function.
- [ ] Ensure scene restart, game over, and returning to menu leave no timers, listeners, or pooled objects active.

### 2. Formalize Gameplay State

- [ ] Add explicit gameplay/session state models instead of keeping state spread across controllers.
- [ ] Create a `GameSessionState` model for run-level state such as playing, paused, game over, level complete, selected level, and current wave.
- [ ] Keep Phaser as the source of truth for real-time simulation state.
- [ ] Keep Zustand as the source of truth for React app/UI state.

### 3. Expand Typed Gameplay Events

- [ ] Add events for game/session flow:
  - `game:started`
  - `game:paused`
  - `game:resumed`
  - `game:over`
  - `level:complete`
- [ ] Add events for combat feedback:
  - `player:damaged`
  - `enemy:damaged`
  - `enemy:killed`
  - `weapon:fired`
- [ ] Keep gameplay systems emitting gameplay facts, not writing directly to UI state.

### 4. Pure Logic Tests

- [ ] Add a lightweight test runner.
- [ ] Test wave progression without rendering Phaser.
- [ ] Test player damage and invulnerability timing.
- [ ] Test config validation.
- [ ] Test gameplay event payload behavior where practical.

### 5. Enemy Archetypes

- [ ] Introduce data-driven enemy definitions.
- [ ] Include tuning per enemy type:
  - radius
  - speed
  - health
  - contact damage
  - score value
  - visual style
  - behavior type
- [ ] Update waves to spawn enemy archetypes instead of only generic enemies.

### 6. Object Pooling Rule

- [ ] Continue using pools for any high-frequency objects:
  - enemy bullets
  - particles
  - damage numbers
  - pickups
  - hit effects
- [ ] Avoid allocating/destructing many Phaser game objects during active combat.

### 7. Spatial Queries For Combat

- [ ] Replace nested bullet-enemy collision checks when enemy and bullet counts grow.
- [ ] Start with a simple spatial hash/grid broad phase.
- [ ] Re-evaluate Phaser Arcade Physics if collision needs become more complex.

### 8. React Update Discipline

- [ ] Keep React updates event-driven rather than frame-driven.
- [ ] Use Zustand selectors for narrow subscriptions.
- [ ] Avoid publishing unchanged values from gameplay systems.
- [ ] Add a quick audit whenever new HUD state is introduced.

### 9. Screens And App Flow

- [ ] Add React-owned screen routing for:
  - main menu
  - pause
  - game over
  - level selection
  - settings
- [ ] Keep gameplay scene lifecycle separate from React screen lifecycle.
- [ ] Define how React commands Phaser to start, pause, resume, and restart runs.

### 10. Settings Persistence

- [ ] Add settings state to Zustand.
- [ ] Persist settings such as volume, fullscreen, and input preferences.
- [ ] Keep persisted settings separate from per-run gameplay state.
