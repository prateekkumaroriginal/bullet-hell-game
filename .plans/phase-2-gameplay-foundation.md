# Phase 2: Gameplay Foundation

## Optimization Points

### Bullet Pool Lookup

Replace the current inactive-bullet lookup with a free-list, queue, or ring-buffer approach so spawning does not scan the whole pool as bullet counts grow.

### Scene Responsibility Split

Keep `GameScene` as an orchestrator and move focused behavior into smaller systems/controllers, such as player movement, weapon firing, arena rendering, and bullet management.

### Per-Frame Allocation

Reduce avoidable allocations in hot paths such as `update()`, movement calculation, aiming, and bullet spawning by reusing vectors and other temporary objects where practical.
