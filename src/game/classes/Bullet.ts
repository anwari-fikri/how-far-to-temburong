// weapon/bullet.ts
import { Physics } from "phaser";

export default class Bullet extends Physics.Arcade.Sprite {
    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, "projectileTexture"); // Assuming "bullet" is the key for your bullet texture
        this.setActive(false);
        this.setVisible(false);
    }

    fire(x: number, y: number) {
        this.setPosition(x, y);
        this.setActive(true);
        this.setVisible(true);
        this.setVelocityX(-300);
    }

    preUpdate(time: number, delta: number) {
        super.preUpdate(time, delta);

        if (this.y <= -50) {
            this.setActive(false);
            this.setVisible(false);
        }
    }
}

