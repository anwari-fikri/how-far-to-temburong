import Player from "./Player";

export enum PowerUpType {
    SPEED_BOOST = "speed_boost",
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
    }

    // Define method to apply power-up effects based on type
    applyEffectToPlayer(player: Player) {
        switch (this.powerUpType) {
            case PowerUpType.SPEED_BOOST:
                player.applySpeedBoost();
                break;
            default:
                break;
        }
    }
}

