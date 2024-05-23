import Player from "./Player";
import playerStore from "../stores/PlayerStore";
import Enemies from "./Enemies";
import { Physics } from "phaser";
import { ZombieGroup } from "./ZombieGroup";

export enum PowerUpType {
    SPEED_BOOST = "speed_boost",
    ATTACK_BOOST = "attack_boost",
    NUKE = "nuke",
    TIME_STOP = "time_stop",
    INVINCIBILITY = "invincibility",
}

export default class PowerUp extends Physics.Arcade.Sprite {
    powerUpType: PowerUpType;

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
        this.setDisplaySize(25, 25);

        this.setActive(false);
        this.setVisible(false);
    }

    activatePowerUp(x: number, y: number) {
        this.setPosition(x, y);
        this.setActive(true);
        this.setVisible(true);
    }

    getPowerUpType() {
        return this.powerUpType;
    }

    update(player: Player, enemies: ZombieGroup) {
        if (this.active && this.scene.physics.overlap(this, player)) {
            this.setActive(false);
            this.setVisible(false);
            player.applyPowerUp(this.powerUpType, enemies);
        }
    }
}

