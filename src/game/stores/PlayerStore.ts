import { makeAutoObservable, action, observable } from "mobx";
import { PowerUpType } from "../classes/PowerUp";
import Enemies from "../classes/Enemies";

class PlayerStore {
    // Base Attributes
    baseHealth: number = 10;
    baseMovementSpeed: number = 300;
    baseAttackPower: number = 100;

    // Attributes
    currentHealth: number = this.baseHealth;
    currentMovementSpeed: number = this.baseMovementSpeed;
    currentAttackPower: number = this.baseAttackPower;

    // Power Ups
    isSpeedBoosted: boolean = false;
    speedBoostTimer: Phaser.Time.TimerEvent;

    isAttackBoosted: boolean = false;
    attackBoostTimer: Phaser.Time.TimerEvent;

    isTimeStopped: boolean = false;
    timeStopTimer: Phaser.Time.TimerEvent;

    isInvincibility: boolean = false;
    invincibilityTimer: Phaser.Time.TimerEvent;

    constructor() {
        makeAutoObservable(this, {
            currentHealth: observable,
            currentMovementSpeed: observable,
            currentAttackPower: observable,
            receiveDamage: action,
            applySpeedBoost: action,
            applyAttackBoost: action,
            applyNuke: action,
            applyTimeStop: action,
        });
    }

    async resetAttributes() {
        this.currentHealth = this.baseHealth;
        this.currentMovementSpeed = this.baseMovementSpeed;
        this.currentAttackPower = this.baseAttackPower;
    }

    async receiveDamage(attack: number) {
        if (!this.isInvincibility) {
            this.currentHealth = Math.max(0, this.currentHealth - attack);
        }
    }

    async healPlayer(health: number) {
        this.currentHealth += health;
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

            if (this.attackBoostTimer) {
                this.attackBoostTimer.remove();
            }

            this.attackBoostTimer = scene.time.delayedCall(5000, () => {
                this.removePowerUp(PowerUpType.ATTACK_BOOST);
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

    async applyTimeStop(scene: Phaser.Scene, enemies: Enemies) {
        /*
            If the player picks up a time stop power-up:
            - Stop enemies' movement for 5 seconds.
            - If the time stop power-up is already active, refresh the duration back to 5 seconds.
        */
        if (!this.isTimeStopped) {
            this.isTimeStopped = true;
            enemies.getTimeStopped();

            if (this.timeStopTimer) {
                this.timeStopTimer.remove();
            }
            this.timeStopTimer = scene.time.delayedCall(5000, () => {
                enemies.resumeMovement();
                this.removePowerUp(PowerUpType.TIME_STOP);
            });
        } else {
            this.timeStopTimer.reset({
                delay: 5000,
                callback: () => {
                    enemies.resumeMovement();
                    this.isTimeStopped = false;
                },
            });
        }
    }

    applyInvincibility(scene: Phaser.Scene) {
        /*
    If the player picks up a time stop power-up:
    - Stop enemies' movement for 5 seconds.
    - If the time stop power-up is already active, refresh the duration back to 5 seconds.
*/
        if (!this.isInvincibility) {
            this.isInvincibility = true;

            if (this.invincibilityTimer) {
                this.invincibilityTimer.remove();
            }

            this.invincibilityTimer = scene.time.delayedCall(5000, () => {
                this.removePowerUp(PowerUpType.INVINCIBILITY);
            });
        } else {
            this.invincibilityTimer.reset({
                delay: 5000,
                callback: () => this.removePowerUp(PowerUpType.INVINCIBILITY),
            });
        }
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
            case PowerUpType.TIME_STOP:
                this.isTimeStopped = false;
            case PowerUpType.INVINCIBILITY:
                this.isInvincibility = false;
                break;

            default:
                break;
        }
    }
}

const playerStore = new PlayerStore();
export default playerStore;

