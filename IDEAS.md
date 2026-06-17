# Ideas

## Pop-ups

- Add pop-ups for controls, first-time enemy introductions, skill pickups and major mechanics.
- Keep pop-ups data-driven so new entries can be added without wiring custom UI each time.
- Support pause-on-popup for important entries and non-pausing toast-style hints for minor tips.
- Track which pop-up ids have already been shown so they do not repeat every run unless reset.

## Audio

- Add background music for runs, menus and stage completion.
- Add sound effects for shooting, enemy hits, enemy death, player damage, skill pickup, level up and stage clear.
- Keep audio behind a small audio system instead of scattering direct `this.sound.play(...)` calls everywhere.
- Add mute and separate music/SFX volume controls.
- Remember that Phaser's sound manager is shared across scenes, so looping music should be started, stopped and cleaned up intentionally.

## Info Section

- Add an info section for discovered enemies and unlocked skills.
- Show enemy behavior hints, health/danger flavor and first-seen status.
- Show learned skills, stack count, upgrade effects and possible future unlocks.
- This could become a Codex, Intel, Archive or Bestiary screen.

## More Skills

- Mobility skills: dash, blink, speed burst.
- Defense skills: shield, parry pulse, temporary invulnerability.
- Damage skills: split shot, orbiting blade, chain lightning.
- Control skills: slow field, knockback wave, bullet clear.
- Risk/reward skills: more damage at low health, cursed pickup, overheat mode.

## Wave And Stage Pacing

- Keep the current `WaveController` approach for now.
- Stage definitions should continue to own authored wave structure.
- Wave definitions should own spawn groups, delays and spawn cooldowns.
- Enemies should own behavior after they exist, such as movement and attack cooldowns.
- Do not add a separate adaptive `WaveDirector` yet. It would mostly duplicate the existing controller until the game has more enemy variety and pacing needs.
- Consider richer wave definitions later for spawn locations, elite variants, boss waves, pressure caps or special events.

## Other Polish Ideas

- Add enemy telegraphs before dangerous attacks.
- Add a pause/settings menu with controls and volume options.
- Add hit feedback: flash, screen shake, short slowdown on big moments.
- Add a run summary screen with time survived, kills, damage taken, skills chosen and enemies discovered.
- Add accessibility options for reduced screen shake, bullet contrast and separate audio levels.
