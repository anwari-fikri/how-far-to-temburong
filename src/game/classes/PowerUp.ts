import Player from "./Player";
import playerStore from "../stores/PlayerStore";
import Enemies from "./Enemies";

export enum PowerUpType {
    SPEED_BOOST = "speed_boost",
    ATTACK_BOOST = "attack_boost",
    NUKE = "nuke",
    TIME_STOP = "time_stop",
    INVINCIBILITY = "invincibility",
}

export default class PowerUp extends Phaser.Physics.Arcade.Sprite {
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
}

