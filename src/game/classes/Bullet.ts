import { Physics } from "phaser";
import Player from "./Player";
import { Game } from "../scenes/Game";

export default class Bullet extends Physics.Arcade.Sprite {
    currentBulletSpeed: number;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, "bullet_sheet"); // Use the texture atlas or sprite sheet

        this.currentBulletSpeed =
            Game.player.inventory.rangedWeapon.weaponType.bulletSpeed;

        this.setActive(false);
        this.setVisible(false);
        this.setDepth(20);

        if (!scene.anims.exists("pistol_bullet")) {
            scene.anims.create({
                key: "pistol_bullet",
                frames: scene.anims.generateFrameNames("bullet_sheet", {
                    start: 0,
                    end: 2,
                }),
                frameRate: 12,
                repeat: 0,
            });
        }
    }

    fire(player: Player) {
        this.currentBulletSpeed =
            Game.player.inventory.rangedWeapon.weaponType.bulletSpeed;
        this.setActive(true);
        this.setVisible(true);
        this.enableBody();

        this.play("pistol_bullet", true);

        if (player.controls.facing === "left") {
            this.setPosition(player.x - 10, player.y - 2);
            this.setVelocityX(-this.currentBulletSpeed);
        } else {
            this.setPosition(player.x + 10, player.y - 2);
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

