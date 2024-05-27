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

        this.chaseSpeed = 20;
    }

    activateZombie(player: Player) {
        const spawnMargin = 50; // Margin to ensure spawning outside the visible area
        const playerX = player.x;
        const playerY = player.y;
        const camera = this.scene.cameras.main;

        let spawnX: number = 0;
        let spawnY: number = 0;

        // Randomly choose a side to spawn (left, right, top, bottom)
        const spawnSide = Phaser.Math.Between(0, 1);

        switch (spawnSide) {
            case 0: // Left side
                spawnX = playerX - camera.width / 2 - spawnMargin;
                spawnY = Phaser.Math.Between(
                    playerY - camera.height / 2,
                    playerY + camera.height / 2,
                );
                break;
            case 1: // Right side
                spawnX = playerX + camera.width / 2 + spawnMargin;
                spawnY = Phaser.Math.Between(
                    playerY - camera.height / 2,
                    playerY + camera.height / 2,
                );
                break;
        }

        // Set the zombie's position and activate it
        this.setPosition(spawnX, spawnY);
        this.setActive(true);
        this.setVisible(true);
        this.setTint(Phaser.Display.Color.RandomRGB().color);
        this.enableBody();
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

