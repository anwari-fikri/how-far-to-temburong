import { Game } from "../scenes/Game";
import { playerAnims } from "./CharAnims";
import Inventory from "./Inventory";
import MeleeWeapon, { WEAPON_TYPE } from "./MeleeWeapon";
import PlayerControls from "./PlayerControls";
import { POWERUP_DURATION, PowerUpType } from "./PowerUp";
import RangedWeapon, { RANGED_WEAPON_TYPE } from "./RangedWeapon";
import { Zombie } from "./Zombie";
import { ZombieGroup } from "./ZombieGroup";

export enum PLAYER_CONST {
    BASE_HEALTH = 100,
    BASE_MOVEMENT_SPEED = 150,
    BONUS_ATTACK = 0,
}

export default class Player extends Phaser.Physics.Arcade.Sprite {
    controls: PlayerControls;
    inventory: Inventory;
    isAttacking: boolean = false;
    isInIFrame: boolean = false;

    // Stats
    currentHealth: number;
    currentMovementSpeed: number;
    bonusAttackPower: number;

    // PowerUps
    isSpeedBoosted: boolean;
    speedBoostTimer: Phaser.Time.TimerEvent;
    isAttackBoosted: boolean;
    attackBoostTimer: Phaser.Time.TimerEvent;
    isTimeStopped: boolean;
    timeStopTimer: Phaser.Time.TimerEvent;
    isInvincibility: boolean;
    invincibilityTimer: Phaser.Time.TimerEvent;

    // Debuff
    isOnSlimeTile: boolean;
    originalMovementSpeed: number;

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

        this.controls = new PlayerControls(scene);
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

    receiveDamage(amount: number, zombie: Zombie) {
        if (!this.isInIFrame) {
            if (!this.isInvincibility) {
                this.currentHealth = Math.max(0, this.currentHealth - amount);
                if (zombie) {
                    this.applyKnockback(zombie);
                }

                // Flicker red when hit
                this.scene.tweens.add({
                    targets: this,
                    tint: 0xff0000,
                    duration: 50,
                    onComplete: () => {
                        this.scene.tweens.add({
                            targets: this,
                            tint: 0xffffff,
                            duration: 100,
                            delay: 100,
                        });
                    },
                });

                // Show damage numbers
                const xDeviation = Phaser.Math.Between(-10, 10); // Random x deviation between -10 and 10
                const yDeviation = Phaser.Math.Between(-10, -30); // Random y deviation between -10 and -30

                let color = "#FFFFFF";
                let fontSize = "8px";
                if (amount < 50) {
                    color = "#FFFFFF"; // White
                    fontSize = "8px";
                } else if (amount < 100) {
                    color = "#FF0000"; // Red
                    fontSize = "10px";
                } else {
                    color = "#FFD700"; // Gold
                    fontSize = "12px";
                }

                const damageText = this.scene.add
                    .text(this.x + xDeviation, this.y - 10, `${amount}`, {
                        fontFamily: "Arial",
                        fontSize: fontSize,
                        color: color,
                        stroke: "#000000",
                        strokeThickness: 2,
                    })
                    .setOrigin(0.5)
                    .setDepth(40);

                // Apply upward floating animation with random deviation
                this.scene.tweens.add({
                    targets: damageText,
                    x: damageText.x + xDeviation,
                    y: damageText.y + yDeviation,
                    alpha: 0,
                    duration: 1000,
                    onComplete: () => {
                        damageText.destroy();
                    },
                });

                this.currentHealth -= amount;
                this.setIFrame(500);
                this.emit("health-changed");

                const playerDamage = this.scene.sound.add("playerHurt");
                playerDamage.play();
            }
        }
    }

    applyKnockback(zombie: Zombie) {
        const knockbackPower = 1000;
        const angle = Phaser.Math.Angle.Between(
            zombie.x,
            zombie.y,
            this.x,
            this.y,
        );
        const knockbackVelocity = this.scene.physics.velocityFromRotation(
            angle,
            knockbackPower,
        );

        zombie.setVelocity(-knockbackVelocity.x, -knockbackVelocity.y);

        // Optionally, reset velocity after a short delay
        this.scene.time.delayedCall(200, () => {
            zombie.setVelocity(0, 0);
        });
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
        this.bonusAttackPower = PLAYER_CONST.BONUS_ATTACK;
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
                this.applySpeedBoost(PLAYER_CONST.BASE_MOVEMENT_SPEED / 2);
                let speedBoostSound = this.scene.sound.add("speedUp");
                speedBoostSound.play();
                break;
            case PowerUpType.ATTACK_BOOST:
                this.applyAttackBoost(50);
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
            this.bonusAttackPower += value;

            if (this.attackBoostTimer) {
                this.attackBoostTimer.remove();
            }

            this.attackBoostTimer = this.scene.time.delayedCall(
                POWERUP_DURATION.ATTACK_BOOST,
                () => {
                    this.isAttackBoosted = false;
                    this.bonusAttackPower -= value!;
                },
            );
        } else {
            this.attackBoostTimer.reset({
                delay: POWERUP_DURATION.ATTACK_BOOST,
                callback: () => {
                    this.isAttackBoosted = false;
                    this.bonusAttackPower -= value!;
                },
            });
        }
    }

    applyTimeStop(enemies: ZombieGroup) {
        if (!Game.player.isTimeStopped) {
            Game.player.isTimeStopped = true;
            enemies.getFreezed();

            if (this.timeStopTimer) {
                this.timeStopTimer.remove();
            }
            this.timeStopTimer = this.scene.time.delayedCall(
                POWERUP_DURATION.TIME_STOP,
                () => {
                    Game.player.isTimeStopped = false;
                    enemies!.getFreezed();
                },
            );
        } else {
            this.timeStopTimer.reset({
                delay: POWERUP_DURATION.TIME_STOP,
                callback: () => {
                    Game.player.isTimeStopped = false;
                    enemies!.getFreezed();
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
