import { playerAnims } from "./CharAnims";
import Inventory from "./Inventory";
import PlayerControls from "./PlayerControls";
import { PowerUpType } from "./PowerUp";
import { ZombieGroup } from "./ZombieGroup";

export default class Player extends Phaser.Physics.Arcade.Sprite {
    private controls: PlayerControls;
    private inventory: Inventory;

    // Stats
    baseMovementSpeed: number;
    currentMovementSpeed: number;
    baseAttackPower: number;
    currentAttackPower: number;

    // PowerUps
    isSpeedBoosted: boolean;
    speedBoostTimer: Phaser.Time.TimerEvent;
    isAttackBoosted: boolean;
    attackBoostTimer: Phaser.Time.TimerEvent;
    isTimeStopped: boolean;
    timeStopTimer: Phaser.Time.TimerEvent;

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
        super(scene, x, y, texture);
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.controls = new PlayerControls(scene, this);
        scene.cameras.main.startFollow(this, true);

        // Stats
        this.baseMovementSpeed = 200;
        this.currentMovementSpeed = this.baseMovementSpeed;
        this.baseAttackPower = 10;
        this.currentAttackPower = this.baseAttackPower;

        // PowerUps
        this.isSpeedBoosted = false;
        this.isAttackBoosted = false;
        this.isTimeStopped = false;

        playerAnims(scene);
    }

    applyPowerUp(powerUpType: PowerUpType, enemies: ZombieGroup): void {
        console.log(powerUpType);
        switch (powerUpType) {
            case PowerUpType.SPEED_BOOST:
                this.applySpeedBoost();
                break;
            case PowerUpType.ATTACK_BOOST:
                this.applyAttackBoost();
                break;
            case PowerUpType.NUKE:
                this.applyNuke(enemies);
                break;
            case PowerUpType.TIME_STOP:
                this.applyTimeStop(enemies);
                break;
            // case PowerUpType.INVINCIBILITY:
            //     this.applyInvincibility();
            //     break;
        }
        console.log(this.currentAttackPower);
    }

    removePowerUp(powerUpType: PowerUpType) {
        switch (powerUpType) {
            case PowerUpType.SPEED_BOOST:
                this.isSpeedBoosted = false;
                this.currentMovementSpeed -= this.baseMovementSpeed;
                break;
            case PowerUpType.ATTACK_BOOST:
                this.isAttackBoosted = false;
                this.currentAttackPower -= this.baseAttackPower;
                break;
            case PowerUpType.TIME_STOP:
                this.isTimeStopped = false;
            // case PowerUpType.INVINCIBILITY:
            //     this.isInvincibility = false;
            //     break;

            default:
                break;
        }
    }

    // Power Ups
    applyNuke(enemies: ZombieGroup) {
        enemies.getNuked();
    }

    applySpeedBoost() {
        if (!this.isSpeedBoosted) {
            this.isSpeedBoosted = true;
            this.currentMovementSpeed += this.baseMovementSpeed;

            if (this.speedBoostTimer) {
                this.speedBoostTimer.remove();
            }

            this.speedBoostTimer = this.scene.time.delayedCall(5000, () => {
                this.removePowerUp(PowerUpType.SPEED_BOOST);
            });
        } else {
            this.speedBoostTimer.reset({
                delay: 5000,
                callback: () => this.removePowerUp(PowerUpType.SPEED_BOOST),
            });
        }
    }

    async applyAttackBoost() {
        /*
            If the player picks up a attack boost:
            - Increase the player's attack power.
            - If the attack boost is already active, resets the power-up timer.
        */
        if (!this.isAttackBoosted) {
            this.isAttackBoosted = true;
            this.currentAttackPower += this.baseAttackPower;

            if (this.attackBoostTimer) {
                this.attackBoostTimer.remove();
            }

            this.attackBoostTimer = this.scene.time.delayedCall(5000, () => {
                this.removePowerUp(PowerUpType.ATTACK_BOOST);
            });
        } else {
            this.attackBoostTimer.reset({
                delay: 5000,
                callback: () => this.removePowerUp(PowerUpType.ATTACK_BOOST),
            });
        }
    }

    applyTimeStop(enemies: ZombieGroup) {
        /*
            If the player picks up a time stop power-up:
            - Stop enemies' movement for 5 seconds.
            - If the time stop power-up is already active, refresh the duration back to 5 seconds.
        */
        if (!this.isTimeStopped) {
            this.isTimeStopped = true;
            enemies.getFreezed(this.isTimeStopped);

            if (this.timeStopTimer) {
                this.timeStopTimer.remove();
            }
            this.timeStopTimer = this.scene.time.delayedCall(5000, () => {
                this.removePowerUp(PowerUpType.TIME_STOP);
                enemies.getFreezed(this.isTimeStopped); // isTimeStopped = false here
            });
        } else {
            this.timeStopTimer.reset({
                delay: 5000,
                callback: () => {
                    enemies.getFreezed(this.isTimeStopped);
                    this.isTimeStopped = false;
                },
            });
        }
    }

    update() {
        this.controls.update();
    }
}
