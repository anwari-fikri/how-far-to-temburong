import Player from "./Player";
import { Physics, Scene } from "phaser";

export class Zombie extends Physics.Arcade.Sprite {
    constructor(scene: Scene) {
        super(scene, 0, 0, "dude");

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setCircle(10);
        this.setActive(false);
        this.setVisible(false);
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

    update(player: Player) {
        if (this.active) {
            this.scene.physics.moveToObject(this, player, 20);
            if (this.scene.physics.overlap(this, player)) {
                this.setActive(false);
                this.setVisible(false);
            }
            // this.y += this.speed * 0.016; // Move the zombie downwards
            // if (this.y > this.scene.scale.height) {
            //     this.setActive(false);
            //     this.setVisible(false);
            // }
        }
    }
}

