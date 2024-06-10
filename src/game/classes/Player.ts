import { playerAnims } from "./CharAnims";
import Inventory from "./Inventory";
import MeleeWeapon, { WEAPON_TYPE } from "./MeleeWeapon";
import PlayerControls from "./PlayerControls";
import { PowerUpType } from "./PowerUp";
import RangedWeapon, { RANGED_WEAPON_TYPE } from "./RangedWeapon";
import { ZombieGroup } from "./ZombieGroup";

export enum PLAYER_CONST {
    BASE_HEALTH = 100,
    BASE_MOVEMENT_SPEED = 200,
    BASE_ATTACK = 25,
}

export enum POWERUP_DURATION {
    SECOND = 1000,
    SPEED_BOOST = 10 * SECOND,
    ATTACK_BOOST = 10 * SECOND,
    TIME_STOP = 10 * SECOND,
    INVINCIBILITY = 10 * SECOND,
}

export default class Player extends Phaser.Physics.Arcade.Sprite {
    controls: PlayerControls;
    inventory: Inventory;
    isAttacking: boolean = false;
    isInIFrame: boolean = false;

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

    killCount: number = 0;

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
        super(scene, x, y, texture);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setOrigin(0.5, 0.5);
        var radius = 5;
        this.setCircle(
            radius,
            -radius + 0.5 * this.width,
            -radius + 0.5 * this.height,
        );
        this.setDepth(20);

        this.controls = new PlayerControls(scene, this);
        playerAnims(scene);
        this.inventory = new Inventory();
        this.inventory.replaceMeleeWeapon(
            new MeleeWeapon(scene, this, WEAPON_TYPE.SWORD),
        );
        this.inventory.replaceRangedWeapon(
            new RangedWeapon(scene, this, RANGED_WEAPON_TYPE.PISTOL),
        );
        scene.cameras.main.startFollow(this, true);

        // Stats Init
        this.resetAttributes();

        // PowerUps
        this.isSpeedBoosted = false;
        this.isAttackBoosted = false;
        this.isTimeStopped = false;
        this.isInvincibility = false;
    }

    receiveDamage(value: number) {
        if (!this.isInIFrame) {
            if (!this.isInvincibility) {
                this.currentHealth = Math.max(0, this.currentHealth - value);
            }

            console.log(this.currentHealth);
            this.currentHealth -= value;
            this.setIFrame(500);
            this.emit("health-changed");

            const playerDamage = this.scene.sound.add("playerHurt");
            playerDamage.play();
        }
    }

    setIFrame(duration: number) {
        this.isInIFrame = true;
        this.scene.time.delayedCall(duration, () => {
            this.isInIFrame = false;
        });
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
        switch (powerUpType) {
            case PowerUpType.SPEED_BOOST:
                this.applySpeedBoost(PLAYER_CONST.BASE_MOVEMENT_SPEED);
                let speedBoostSound = this.scene.sound.add("speedUp");
                speedBoostSound.play();
                break;
            case PowerUpType.ATTACK_BOOST:
                this.applyAttackBoost(PLAYER_CONST.BASE_ATTACK);
                let attackBoostSound = this.scene.sound.add("attackUp");
                attackBoostSound.play();
                break;
            case PowerUpType.NUKE:
                this.applyNuke(enemies);
                let nukeSound = this.scene.sound.add("nuke");
                nukeSound.play();
                break;
            case PowerUpType.TIME_STOP:
                this.applyTimeStop(enemies);
                let timeStopSound = this.scene.sound.add("timeStop");
                timeStopSound.play();
                break;
            case PowerUpType.INVINCIBILITY:
                this.applyInvincibility();
                let invincibilitySound = this.scene.sound.add("invincibility");
                invincibilitySound.play();
                break;
        }
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

            this.invincibilityTimer = this.scene.time.delayedCall(
                POWERUP_DURATION.INVINCIBILITY,
                () => {
                    this.isInvincibility = false;
                },
            );
        } else {
            this.invincibilityTimer.reset({
                delay: POWERUP_DURATION.INVINCIBILITY,
                callback: () => (this.isInvincibility = false),
            });
        }
    }

    update() {
        this.controls.update();
        this.inventory.update();
    }
}
