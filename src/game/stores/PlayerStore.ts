import { makeAutoObservable, action, observable } from "mobx";
import { PowerUpType } from "../classes/PowerUp";
import Enemies from "../classes/Enemies";

class PlayerStore {
    baseMovementSpeed: number = 300;
    currentMovementSpeed: number = this.baseMovementSpeed;
    baseAttackPower: number = 100;
    currentAttackPower: number = this.baseAttackPower;

    // Power Ups
    isSpeedBoosted: boolean = false;
    speedBoostTimer: Phaser.Time.TimerEvent;

    isAttackBoosted: boolean = false;
    attackBoostTimer: Phaser.Time.TimerEvent;

    constructor() {
        makeAutoObservable(this, {
            currentMovementSpeed: observable,
            applySpeedBoost: action,
        });
    }

    async applySpeedBoost(scene: Phaser.Scene) {
        /*
            If the player picks up a speed boost:
            - Increase the player's movement speed.
            - If the speed boost is already active, resets the power-up timer.
        */
        if (!this.isSpeedBoosted) {
            this.isSpeedBoosted = true;
            this.currentMovementSpeed += this.baseMovementSpeed;

            if (this.speedBoostTimer) {
                this.speedBoostTimer.remove();
            }

            this.speedBoostTimer = scene.time.delayedCall(5000, () => {
                this.removePowerUp(PowerUpType.SPEED_BOOST);
            });
        } else {
            this.speedBoostTimer.reset({
                delay: 5000,
                callback: () => this.removePowerUp(PowerUpType.SPEED_BOOST),
            });
        }
    }

    async applyAttackBoost(scene: Phaser.Scene) {
        /*
            If the player picks up a attack boost:
            - Increase the player's attack power.
            - If the attack boost is already active, resets the power-up timer.
        */
        if (!this.isAttackBoosted) {
            this.isAttackBoosted = true;
            this.currentAttackPower += this.baseAttackPower;
            console.log(this.currentAttackPower);

            if (this.attackBoostTimer) {
                this.attackBoostTimer.remove();
            }

            this.attackBoostTimer = scene.time.delayedCall(5000, () => {
                this.removePowerUp(PowerUpType.ATTACK_BOOST);
                console.log(this.currentAttackPower);
            });
        } else {
            this.attackBoostTimer.reset({
                delay: 5000,
                callback: () => this.removePowerUp(PowerUpType.ATTACK_BOOST),
            });
        }
    }

    async applyNuke(enemies: Enemies) {
        enemies.getNuked();
    }

    async removePowerUp(powerUpType: PowerUpType) {
        switch (powerUpType) {
            case PowerUpType.SPEED_BOOST:
                this.isSpeedBoosted = false;
                this.currentMovementSpeed -= this.baseMovementSpeed;
                break;
            case PowerUpType.ATTACK_BOOST:
                this.isAttackBoosted = false;
                this.currentAttackPower -= this.baseAttackPower;
                break;
            default:
                break;
        }
    }
}

const playerStore = new PlayerStore();
export default playerStore;

