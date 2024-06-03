import { Physics } from "phaser";
import Player from "./Player";

export default class Bullet extends Physics.Arcade.Sprite {
    bulletSpeed: number = 1000;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, "projectileTexture");
        this.setActive(false);
        this.setVisible(false);
    }

    fire(player: Player) {
        this.setPosition(player.x, player.y);
        this.setActive(true);
        this.setVisible(true);
        this.enableBody();

        player.controls.facing === "left"
            ? this.setVelocityX(-this.bulletSpeed)
            : this.setVelocityX(this.bulletSpeed);
    }

    die() {
        this.setActive(false);
        this.setVisible(false);
        this.disableBody(true, true);
    }

    preUpdate(time: number, delta: number) {
        super.preUpdate(time, delta);

        if (this.y <= -50) {
            this.setActive(false);
            this.setVisible(false);
        }
    }
}
