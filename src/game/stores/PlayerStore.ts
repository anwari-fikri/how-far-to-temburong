import { makeAutoObservable, action, observable } from "mobx";
import { PowerUpType } from "../classes/PowerUp";
import Enemies from "../classes/Enemies";

class PlayerStore {
    // Base Attributes
    baseHealth = 100;
    baseMovementSpeed = 300;
    baseAttackPower = 100;

    // Attributes
    currentHealth = this.baseHealth;
    currentMovementSpeed = this.baseMovementSpeed;
    currentAttackPower = this.baseAttackPower;

    // Power Ups
    isSpeedBoosted = false;
    speedBoostTimer: Phaser.Time.TimerEvent | null = null;

    isAttackBoosted = false;
    attackBoostTimer: Phaser.Time.TimerEvent | null = null;

    isTimeStopped = false;
    timeStopTimer: Phaser.Time.TimerEvent | null = null;

    isInvincibility = false;
    invincibilityTimer: Phaser.Time.TimerEvent | null = null;

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
            applyInvincibility: action,
            removePowerUp: action,
            resetAttributes: action,
        });
    }

    resetAttributes() {
        this.currentHealth = this.baseHealth;
        this.currentMovementSpeed = this.baseMovementSpeed;
        this.currentAttackPower = this.baseAttackPower;
    }

    receiveDamage(attack: number) {
        if (!this.isInvincibility) {
            this.currentHealth -= attack;
        }
        console.log(this.currentHealth);
    }

    applySpeedBoost(scene: Phaser.Scene) {
        if (!this.isSpeedBoosted) {
            this.isSpeedBoosted = true;
            this.currentMovementSpeed += this.baseMovementSpeed;

            this.resetTimer(this.speedBoostTimer);
            this.speedBoostTimer = scene.time.delayedCall(5000, () => {
                this.removePowerUp(PowerUpType.SPEED_BOOST);
            });
        } else {
            this.resetTimer(this.speedBoostTimer, 5000, () =>
                this.removePowerUp(PowerUpType.SPEED_BOOST),
            );
        }
    }

    applyAttackBoost(scene: Phaser.Scene) {
        if (!this.isAttackBoosted) {
            this.isAttackBoosted = true;
            this.currentAttackPower += this.baseAttackPower;

            this.resetTimer(this.attackBoostTimer);
            this.attackBoostTimer = scene.time.delayedCall(5000, () => {
                this.removePowerUp(PowerUpType.ATTACK_BOOST);
            });
        } else {
            this.resetTimer(this.attackBoostTimer, 5000, () =>
                this.removePowerUp(PowerUpType.ATTACK_BOOST),
            );
        }
    }

    applyNuke(enemies: Enemies) {
        enemies.getNuked();
    }

    applyTimeStop(scene: Phaser.Scene, enemies: Enemies) {
        if (!this.isTimeStopped) {
            this.isTimeStopped = true;
            enemies.getTimeStopped();

            this.resetTimer(this.timeStopTimer);
            this.timeStopTimer = scene.time.delayedCall(5000, () => {
                enemies.resumeMovement();
                this.removePowerUp(PowerUpType.TIME_STOP);
            });
        } else {
            this.resetTimer(this.timeStopTimer, 5000, () => {
                enemies.resumeMovement();
                this.isTimeStopped = false;
            });
        }
    }

    applyInvincibility(scene: Phaser.Scene) {
        if (!this.isInvincibility) {
            this.isInvincibility = true;

            this.resetTimer(this.invincibilityTimer);
            this.invincibilityTimer = scene.time.delayedCall(5000, () => {
                this.removePowerUp(PowerUpType.INVINCIBILITY);
            });
        } else {
            this.resetTimer(this.invincibilityTimer, 5000, () =>
                this.removePowerUp(PowerUpType.INVINCIBILITY),
            );
        }
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
                break;
            case PowerUpType.INVINCIBILITY:
                this.isInvincibility = false;
                break;
            default:
                break;
        }
    }

    private resetTimer(
        timer: Phaser.Time.TimerEvent | null,
        delay = 5000,
        callback: () => void = () => {},
    ) {
        if (timer) {
            timer.remove();
        }
        timer = new Phaser.Time.TimerEvent({
            delay,
            callback,
            callbackScope: this,
        });
    }
}

const playerStore = new PlayerStore();
export default playerStore;

