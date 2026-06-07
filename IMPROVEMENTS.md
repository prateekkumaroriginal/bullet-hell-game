# Improvements

This repo is still early, so these notes focus on foundation choices that will matter once bullet counts, enemy behavior, weapons, and desktop polish grow.

## 1. Make Update Order Explicit

`GameScene` currently forwards updates manually. As systems grow, update order will become gameplay-critical.

Prefer keeping a clear order such as:

```txt
input
player
weapons
projectiles
collisions
effects
ui
```

This helps prevent one-frame-late behavior and makes future debugging easier. The implementation can stay simple at first; the important part is making the order intentional and documented in code.

## 2. Split Aiming From Weapon Firing

`WeaponController` currently owns aiming, aim-guide rendering, fire timing, and bullet spawning. That is acceptable now, but it is the next system likely to grow too broad.

Before adding multiple weapons or firing modes, consider splitting it:

```txt
AimController
- pointer direction
- aim guide rendering

WeaponController
- cooldown
- fire behavior
- projectile spawning
```

This keeps visual aiming separate from weapon rules and makes upgrades, alternate weapons, controller input, and aim assist easier to add later.

## 3. Define Collision Categories Early

Before adding enemies, decide the collision model:

```txt
Player
PlayerBullets
Enemies
EnemyBullets
Pickups
Arena
```

Enemy bullets and player bullets often need different behavior, rendering, collision rules, ownership, and pooling. Defining these categories early prevents a vague all-purpose bullet system from becoming difficult to untangle.

## Recommended Next Cleanup

Before adding larger gameplay systems, prioritize:

1. Split `WeaponController` into aiming and weapon-firing responsibilities before adding multiple weapons.
