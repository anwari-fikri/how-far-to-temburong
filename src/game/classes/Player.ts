import { playerAnims } from "./CharAnims";

export default class Player extends Phaser.Physics.Arcade.Sprite {
    private keyA!: Phaser.Input.Keyboard.Key;
    private keyS!: Phaser.Input.Keyboard.Key;
    private keyD!: Phaser.Input.Keyboard.Key;
    private keyW!: Phaser.Input.Keyboard.Key;

    private playerSpeed = 300; // Move player speed to class level

    // Power Ups
    private isSpeedBoosted: boolean;

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
        super(scene, x, y, texture);
        scene.add.existing(this);
        scene.physics.add.existing(this);

        // Power Up States
        this.isSpeedBoosted = false;

        if (scene.input && scene.input.keyboard) {
            this.keyA = scene.input.keyboard.addKey(
                Phaser.Input.Keyboard.KeyCodes.A,
            );
            this.keyS = scene.input.keyboard.addKey(
                Phaser.Input.Keyboard.KeyCodes.S,
            );
            this.keyD = scene.input.keyboard.addKey(
                Phaser.Input.Keyboard.KeyCodes.D,
            );
            this.keyW = scene.input.keyboard.addKey(
                Phaser.Input.Keyboard.KeyCodes.W,
            );
        }

        scene.cameras.main.startFollow(this, true);

        playerAnims(scene);
    }

    update() {
        // Player Movement
        const velocity = { x: 0, y: 0 };

        if (this.keyA.isDown) {
            velocity.x = -this.playerSpeed;
            this.anims.play("left", true);
        } else if (this.keyD.isDown) {
            velocity.x = this.playerSpeed;
            this.anims.play("right", true);
        }

        if (this.keyW.isDown) {
            velocity.y = -this.playerSpeed;
        } else if (this.keyS.isDown) {
            velocity.y = this.playerSpeed;
            this.anims.play("turn");
        }

        this.setVelocity(velocity.x, velocity.y);
    }

    applySpeedBoost() {
        this.isSpeedBoosted = true;
        this.playerSpeed *= 2;
        console.log("SPEEEEEEED BOOST");
    }
}
