import Player from "./Player";
import { Physics, Scene } from "phaser";

export class Zombie extends Physics.Arcade.Sprite {
    chaseSpeed: number;

    constructor(scene: Scene) {
        super(scene, 0, 0, "dude");

        scene.add.existing(this);
        scene.physics.add.existing(this);

        var radius = this.width / 3;
        this.setCircle(
            radius,
            -radius + 0.5 * this.width,
            -radius + 0.5 * this.height + 5,
        );

        this.setActive(false);
        this.setVisible(false);

        this.chaseSpeed = 40;
    }

    activateZombie() {
        this.setPosition(
            Phaser.Math.Between(0, this.scene.scale.width),
            Phaser.Math.Between(0, this.scene.scale.height),
        );
        this.setActive(true);
        this.setVisible(true);
        this.setTint(Phaser.Display.Color.RandomRGB().color);
    }

    die() {
        this.setActive(false);
        this.setVisible(false);
    }

    freeze() {
        this.chaseSpeed = 0;
    }

    unfreeze() {
        this.chaseSpeed = 40;
    }

    update(player: Player) {
        if (this.active) {
            this.scene.physics.moveToObject(this, player, this.chaseSpeed);
            if (this.scene.physics.overlap(this, player)) {
                this.setActive(false);
                this.setVisible(false);
                player.receiveDamage(0.1);
            }
        }
    }
}

