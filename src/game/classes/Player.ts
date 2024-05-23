import { playerAnims } from "./CharAnims";
import Inventory from "./Inventory";
import PlayerControls from "./PlayerControls";
import { PowerUpType } from "./PowerUp";
import { ZombieGroup } from "./ZombieGroup";

export default class Player extends Phaser.Physics.Arcade.Sprite {
    private controls: PlayerControls;
    private inventory: Inventory;

    // Stats
    currentMovementSpeed: number;
    baseMovementSpeed: number;

    // PowerUps
    isSpeedBoosted: boolean;
    speedBoostTimer: Phaser.Time.TimerEvent;

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
        super(scene, x, y, texture);
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.controls = new PlayerControls(scene, this);
        scene.cameras.main.startFollow(this, true);

        // Stats
        this.baseMovementSpeed = 200;
        this.currentMovementSpeed = this.baseMovementSpeed;

        // PowerUps
        this.isSpeedBoosted = false;

        playerAnims(scene);
    }

    applyPowerUp(powerUpType: PowerUpType, enemies: ZombieGroup): void {
        console.log(powerUpType);
        switch (powerUpType) {
            case PowerUpType.SPEED_BOOST:
                this.applySpeedBoost();
                break;
            // case PowerUpType.ATTACK_BOOST:
            //     this.applyAttackBoost();
            //     break;
            case PowerUpType.NUKE:
                this.applyNuke(enemies);
                break;
            // case PowerUpType.TIME_STOP:
            //     this.applyTimeStop();
            //     break;
            // case PowerUpType.INVINCIBILITY:
            //     this.applyInvincibility();
            //     break;
        }
    }

    removePowerUp(powerUpType: PowerUpType) {
        switch (powerUpType) {
            case PowerUpType.SPEED_BOOST:
                this.isSpeedBoosted = false;
                this.currentMovementSpeed -= this.baseMovementSpeed;
                break;
            // case PowerUpType.ATTACK_BOOST:
            //     this.isAttackBoosted = false;
            //     this.currentAttackPower -= this.baseAttackPower;
            //     break;
            // case PowerUpType.TIME_STOP:
            //     this.isTimeStopped = false;
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

    update() {
        this.controls.update();
    }
}
