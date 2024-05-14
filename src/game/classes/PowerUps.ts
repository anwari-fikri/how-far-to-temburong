import Player from "./Player";
import playerStore from "../stores/PlayerStore";

export enum PowerUpType {
    SPEED_BOOST = "speed_boost",
    ATTACK_BOOST = "attack_boost",
    NUKE = "nuke",
}

export default class PowerUps extends Phaser.Physics.Arcade.Sprite {
    private powerUpType: PowerUpType;

    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        texture: string,
        powerUpType: PowerUpType,
    ) {
        super(scene, x, y, texture);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.powerUpType = powerUpType;

        this.setDisplaySize(50, 50);
    }

    getPowerUpType() {
        return this.powerUpType;
    }

    // Define method to apply power-up effects based on type
    applyEffectToPlayer() {
        switch (this.powerUpType) {
            case PowerUpType.SPEED_BOOST:
                playerStore.applySpeedBoost(this.scene);
                break;
            case PowerUpType.ATTACK_BOOST:
                playerStore.applyAttackBoost(this.scene);
                break;
            case PowerUpType.NUKE:
                playerStore.applyAttackBoost(this.scene);
                break;
            default:
                break;
        }
    }
}

