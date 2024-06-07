import { Physics } from "phaser";
import Player from "./Player";

const pistolBulletSpeed: number = 600;

export default class Bullet extends Physics.Arcade.Sprite {
    currentBulletSpeed: number = pistolBulletSpeed;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, "bullet_sheet"); // Use the texture atlas or sprite sheet

        this.setActive(false);
        this.setVisible(false);

        if (!scene.anims.exists("pistol_bullet")) {
            scene.anims.create({
                key: "pistol_bullet",
                frames: scene.anims.generateFrameNames("bullet_sheet", {
                    start: 0,
                    end: 1,
                }),
                frameRate: 10,
                repeat: 0,
            });
        }
    }

    fire(player: Player) {
        this.currentBulletSpeed = pistolBulletSpeed;
        this.setPosition(player.x, player.y);
        this.setActive(true);
        this.setVisible(true);
        this.enableBody();

        this.play("pistol_bullet", true);

        if (player.controls.facing === "left") {
            this.setVelocityX(-this.currentBulletSpeed);
        } else {
            this.setVelocityX(this.currentBulletSpeed);
        }
    }

    checkRecycleBullet(player: Player) {
        const deSpawnDistance: number = this.scene.cameras.main.width * 4;
        if (player) {
            const distance = Phaser.Math.Distance.Between(
                this.x,
                this.y,
                player.x,
                player.y,
            );
            if (distance > deSpawnDistance) {
                this.die();
            }
        } else {
            this.die();
        }
    }

    die() {
        this.currentBulletSpeed = 0;
        this.setActive(false);
        this.setVisible(false);
        this.disableBody(true, true);
    }

    update(player: Player) {
        if (this.active) {
            this.checkRecycleBullet(player);
        }
    }
}

