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
        const spawnArea = {
            left: 0,
            right: this.scene.cameras.main.width,
            top: 0,
            bottom: this.scene.cameras.main.height,
        };

        const spawnSide = Phaser.Math.Between(0, 1); // return 0 or 1

        let spawnX: number;
        if (spawnSide === 0) {
            spawnX = spawnArea.left - this.displayWidth;
        } else {
            spawnX = spawnArea.right;
        }
        const spawnY = Phaser.Math.Between(spawnArea.top, spawnArea.bottom);

        this.alive(spawnX, spawnY);
    }

    alive(spawnX: number, spawnY: number) {
        this.setPosition(spawnX, spawnY);
        this.setActive(true);
        this.setVisible(true);
        this.setTint(Phaser.Display.Color.RandomRGB().color);
        this.enableBody();
    }

    die() {
        this.setActive(false);
        this.setVisible(false);
        this.disableBody(true, true);
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
                this.die();
                player.receiveDamage(0.1);
            }
        }
    }
}

