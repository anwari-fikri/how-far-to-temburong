import { playerAnims } from "./CharAnims";
import Inventory from "./Inventory";
import PlayerControls from "./PlayerControls";
import { PowerUpType } from "./PowerUp";
import { ZombieGroup } from "./ZombieGroup";

export enum PLAYER_CONST {
    BASE_HEALTH = 100,
    BASE_MOVEMENT_SPEED = 200,
    BASE_ATTACK = 10,
}

enum POWERUP_DURATION {
    SECOND = 1000,
    SPEED_BOOST = 5 * SECOND,
    ATTACK_BOOST = 5 * SECOND,
    TIME_STOP = 5 * SECOND,
}

export default class Player extends Phaser.Physics.Arcade.Sprite {
    private controls: PlayerControls;

    // Stats
    currentHealth: number;
    currentMovementSpeed: number;
    currentAttackPower: number;

    // PowerUps
    isSpeedBoosted: boolean;
    speedBoostTimer: Phaser.Time.TimerEvent;
    isAttackBoosted: boolean;
    attackBoostTimer: Phaser.Time.TimerEvent;
    isTimeStopped: boolean;
    timeStopTimer: Phaser.Time.TimerEvent;
    isInvincibility: boolean;
    invincibilityTimer: Phaser.Time.TimerEvent;

    //facing direction
    facing: "left" | "right";

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
        super(scene, x, y, texture);
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.controls = new PlayerControls(scene, this);
        scene.cameras.main.startFollow(this, true);

        //facing direction
        this.facing = "left";

        // Stats Init
        this.resetAttributes();

        // PowerUps
        this.isSpeedBoosted = false;
        this.isAttackBoosted = false;
        this.isTimeStopped = false;
        this.isInvincibility = false;

        playerAnims(scene);
    }

    receiveDamage(attack: number) {
        if (!this.isInvincibility) {
            this.currentHealth = Math.max(0, this.currentHealth - attack);
        }
        console.log(this.currentHealth);
        this.currentHealth -= attack;
        this.emit("health-changed");
    }

    resetAttributes() {
        this.currentHealth = PLAYER_CONST.BASE_HEALTH;
        this.currentMovementSpeed = PLAYER_CONST.BASE_MOVEMENT_SPEED;
        this.currentAttackPower = PLAYER_CONST.BASE_ATTACK;
    }

    // Power Ups
    /* STATUS EFFECT
        If the player picks up a power-up:
        - apply effect for 5 seconds.
        - while the effect of the power-up is already active, refresh the duration back to 5 seconds.
    */

    applyPowerUp(powerUpType: PowerUpType, enemies: ZombieGroup): void {
        console.log(powerUpType);
        switch (powerUpType) {
            case PowerUpType.SPEED_BOOST:
                this.applySpeedBoost(PLAYER_CONST.BASE_MOVEMENT_SPEED);
                break;
            case PowerUpType.ATTACK_BOOST:
                this.applyAttackBoost(PLAYER_CONST.BASE_ATTACK);
                break;
            case PowerUpType.NUKE:
                this.applyNuke(enemies);
                break;
            case PowerUpType.TIME_STOP:
                this.applyTimeStop(enemies);
                break;
            case PowerUpType.INVINCIBILITY:
                this.applyInvincibility();
                break;
        }
        console.log(this.currentAttackPower);
    }

    applyNuke(enemies: ZombieGroup) {
        enemies.getNuked();
    }

    applySpeedBoost(value: number) {
        if (!this.isSpeedBoosted) {
            this.isSpeedBoosted = true;
            this.currentMovementSpeed += value;

            if (this.speedBoostTimer) {
                this.speedBoostTimer.remove();
            }

            this.speedBoostTimer = this.scene.time.delayedCall(
                POWERUP_DURATION.SPEED_BOOST,
                () => {
                    this.isSpeedBoosted = false;
                    this.currentMovementSpeed -= value!;
                },
            );
        } else {
            this.speedBoostTimer.reset({
                delay: POWERUP_DURATION.SPEED_BOOST,
                callback: () => {
                    this.isSpeedBoosted = false;
                    this.currentMovementSpeed -= value!;
                },
            });
        }
    }

    async applyAttackBoost(value: number) {
        if (!this.isAttackBoosted) {
            this.isAttackBoosted = true;
            this.currentAttackPower += value;

            if (this.attackBoostTimer) {
                this.attackBoostTimer.remove();
            }

            this.attackBoostTimer = this.scene.time.delayedCall(
                POWERUP_DURATION.ATTACK_BOOST,
                () => {
                    this.isAttackBoosted = false;
                    this.currentAttackPower -= value!;
                },
            );
        } else {
            this.attackBoostTimer.reset({
                delay: POWERUP_DURATION.ATTACK_BOOST,
                callback: () => {
                    this.isAttackBoosted = false;
                    this.currentAttackPower -= value!;
                },
            });
        }
    }

    applyTimeStop(enemies: ZombieGroup) {
        if (!this.isTimeStopped) {
            this.isTimeStopped = true;
            enemies.getFreezed(this.isTimeStopped);

            if (this.timeStopTimer) {
                this.timeStopTimer.remove();
            }
            this.timeStopTimer = this.scene.time.delayedCall(
                POWERUP_DURATION.TIME_STOP,
                () => {
                    this.isTimeStopped = false;
                    enemies!.getFreezed(this.isTimeStopped);
                },
            );
        } else {
            this.timeStopTimer.reset({
                delay: POWERUP_DURATION.TIME_STOP,
                callback: () => {
                    this.isTimeStopped = false;
                    enemies!.getFreezed(this.isTimeStopped);
                },
            });
        }
    }

    applyInvincibility() {
        if (!this.isInvincibility) {
            this.isInvincibility = true;

            if (this.invincibilityTimer) {
                this.invincibilityTimer.remove();
            }

            this.invincibilityTimer = this.scene.time.delayedCall(5000, () => {
                this.isInvincibility = false;
            });
        } else {
            this.invincibilityTimer.reset({
                delay: 5000,
                callback: () => (this.isInvincibility = false),
            });
        }
    }

    update() {
        this.controls.update();
    }
}
