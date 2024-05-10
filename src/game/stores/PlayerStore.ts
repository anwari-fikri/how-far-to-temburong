import { makeAutoObservable, action, observable } from "mobx";

class PlayerStore {
    baseMovementSpeed: number = 300;
    currentMovementSpeed: number = this.baseMovementSpeed;

    // Power Ups
    isSpeedBoosted: boolean = false;
    speedBoostTimer: Phaser.Time.TimerEvent;

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
                this.removeSpeedBoost();
            });
        } else {
            this.speedBoostTimer.reset({
                delay: 5000,
                callback: () => this.removeSpeedBoost(),
            });
        }
    }

    async removeSpeedBoost() {
        this.isSpeedBoosted = false;
        this.currentMovementSpeed -= this.baseMovementSpeed;
    }
}

const playerStore = new PlayerStore();
export default playerStore;

