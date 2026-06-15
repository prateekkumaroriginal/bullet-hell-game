import Phaser from "phaser";
import {
  EXPERIENCE_ORB_ATTRACT_RADIUS,
  EXPERIENCE_ORB_ATTRACT_SPEED,
  EXPERIENCE_ORB_COLLECT_RADIUS,
  EXPERIENCE_ORB_FILL_COLOR,
  EXPERIENCE_ORB_IDLE_DRIFT_DURATION_MS,
  EXPERIENCE_ORB_IDLE_DRIFT_SPEED,
  EXPERIENCE_ORB_POOL_SIZE,
  EXPERIENCE_ORB_RADIUS,
  EXPERIENCE_ORB_STROKE_COLOR,
  EXPERIENCE_ORB_STROKE_WIDTH,
} from "../config/experience-config";
import { type SkillRuntimeModifiers } from "../config/skill-config";
import { MILLISECONDS_PER_SECOND } from "../config/time-config";
import { type GameplayController } from "./GameplayController";
import { type PlayerController } from "./PlayerController";
import { type PlayerProgressionController } from "./PlayerProgressionController";

type ExperienceOrb = {
  view: Phaser.GameObjects.Arc;
  poolIndex: number;
  x: number;
  y: number;
  value: number;
  driftVelocityX: number;
  driftVelocityY: number;
  driftRemainingMs: number;
};

type SpawnExperienceOrbInput = {
  x: number;
  y: number;
  value: number;
};

export class ExperienceOrbPool implements GameplayController {
  private readonly orbs: ExperienceOrb[];
  private readonly activeOrbs: ExperienceOrb[] = [];
  private readonly freeOrbIndexes: number[] = [];
  private readonly movementDirection = new Phaser.Math.Vector2();

  constructor(
    private readonly scene: Phaser.Scene,
    private readonly getSkillModifiers: () => SkillRuntimeModifiers,
  ) {
    this.orbs = Array.from({ length: EXPERIENCE_ORB_POOL_SIZE }, (_, index) =>
      this.createOrb(index),
    );

    for (const orb of this.orbs) {
      this.freeOrbIndexes.push(orb.poolIndex);
    }
  }

  update(delta: number): void {
    const deltaSeconds = delta / MILLISECONDS_PER_SECOND;

    for (const orb of this.activeOrbs) {
      if (orb.driftRemainingMs <= 0) {
        continue;
      }

      orb.driftRemainingMs = Math.max(0, orb.driftRemainingMs - delta);
      orb.x += orb.driftVelocityX * deltaSeconds;
      orb.y += orb.driftVelocityY * deltaSeconds;
      orb.view.setPosition(orb.x, orb.y);
    }
  }

  spawn(input: SpawnExperienceOrbInput): void {
    const orbIndex = this.freeOrbIndexes.pop();

    if (orbIndex === undefined) {
      return;
    }

    const orb = this.orbs[orbIndex];
    const driftAngle = Phaser.Math.Angle.Random();

    orb.x = input.x;
    orb.y = input.y;
    orb.value = input.value;
    orb.driftVelocityX = Math.cos(driftAngle) * EXPERIENCE_ORB_IDLE_DRIFT_SPEED;
    orb.driftVelocityY = Math.sin(driftAngle) * EXPERIENCE_ORB_IDLE_DRIFT_SPEED;
    orb.driftRemainingMs = EXPERIENCE_ORB_IDLE_DRIFT_DURATION_MS;
    orb.view.setPosition(orb.x, orb.y);
    orb.view.setActive(true);
    orb.view.setVisible(true);
    this.activeOrbs.push(orb);
  }

  resolvePlayerCollection(
    playerController: PlayerController,
    progressionController: PlayerProgressionController,
    delta: number,
  ): void {
    const player = playerController.gameObject;
    const skillModifiers = this.getSkillModifiers();
    const collectRadius =
      EXPERIENCE_ORB_COLLECT_RADIUS +
      skillModifiers.experienceCollectRadiusBonus;
    const attractRadius =
      EXPERIENCE_ORB_ATTRACT_RADIUS +
      skillModifiers.experienceAttractRadiusBonus;
    const collectDistanceSquared = collectRadius * collectRadius;
    const attractDistanceSquared = attractRadius * attractRadius;
    const deltaSeconds = delta / MILLISECONDS_PER_SECOND;

    for (let orbIndex = this.activeOrbs.length - 1; orbIndex >= 0; orbIndex -= 1) {
      const orb = this.activeOrbs[orbIndex];
      const distanceSquared = Phaser.Math.Distance.Squared(
        orb.x,
        orb.y,
        player.x,
        player.y,
      );

      if (distanceSquared <= collectDistanceSquared) {
        progressionController.addExperience(orb.value);
        this.deactivateActiveOrb(orbIndex);
        continue;
      }

      if (distanceSquared > attractDistanceSquared) {
        continue;
      }

      this.movementDirection.set(player.x - orb.x, player.y - orb.y);

      if (this.movementDirection.lengthSq() === 0) {
        continue;
      }

      this.movementDirection.normalize();
      orb.x += this.movementDirection.x * EXPERIENCE_ORB_ATTRACT_SPEED * deltaSeconds;
      orb.y += this.movementDirection.y * EXPERIENCE_ORB_ATTRACT_SPEED * deltaSeconds;
      orb.view.setPosition(orb.x, orb.y);
    }
  }

  destroy(): void {
    for (const orb of this.orbs) {
      orb.view.destroy();
    }

    this.activeOrbs.length = 0;
    this.freeOrbIndexes.length = 0;
  }

  private createOrb(poolIndex: number): ExperienceOrb {
    const view = this.scene.add.circle(
      0,
      0,
      EXPERIENCE_ORB_RADIUS,
      EXPERIENCE_ORB_FILL_COLOR,
    );

    view.setStrokeStyle(EXPERIENCE_ORB_STROKE_WIDTH, EXPERIENCE_ORB_STROKE_COLOR);
    view.setActive(false);
    view.setVisible(false);

    return {
      view,
      poolIndex,
      x: 0,
      y: 0,
      value: 0,
      driftVelocityX: 0,
      driftVelocityY: 0,
      driftRemainingMs: 0,
    };
  }

  private deactivateActiveOrb(activeOrbIndex: number): void {
    const orb = this.activeOrbs[activeOrbIndex];
    const lastActiveOrb = this.activeOrbs.pop();

    if (lastActiveOrb && lastActiveOrb !== orb) {
      this.activeOrbs[activeOrbIndex] = lastActiveOrb;
    }

    orb.x = 0;
    orb.y = 0;
    orb.value = 0;
    orb.driftVelocityX = 0;
    orb.driftVelocityY = 0;
    orb.driftRemainingMs = 0;
    orb.view.setPosition(orb.x, orb.y);
    orb.view.setActive(false);
    orb.view.setVisible(false);
    this.freeOrbIndexes.push(orb.poolIndex);
  }
}
