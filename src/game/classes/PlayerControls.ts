import { Game } from "../scenes/Game";
import Player from "./Player";

export default class PlayerControls {
    keyA!: Phaser.Input.Keyboard.Key;
    keyS!: Phaser.Input.Keyboard.Key;
    keyD!: Phaser.Input.Keyboard.Key;
    keyW!: Phaser.Input.Keyboard.Key;
    facing: "left" | "right";

    constructor(scene: Phaser.Scene) {
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

        this.facing = "left";
    }

    update() {
        // Player Movement
        const velocity = { x: 0, y: 0 };

        // Update movement based on input
        if (this.keyA.isDown) {
            velocity.x = -Game.player.currentMovementSpeed;
            if (!Game.player.isAttacking) {
                this.facing = "left";
            }
        } else if (this.keyD.isDown) {
            velocity.x = Game.player.currentMovementSpeed;
            if (!Game.player.isAttacking) {
                this.facing = "right";
            }
        }

        if (this.keyW.isDown) {
            velocity.y = -Game.player.currentMovementSpeed;
        } else if (this.keyS.isDown) {
            velocity.y = Game.player.currentMovementSpeed;
        }

        // Apply movement
        Game.player.setVelocity(velocity.x, velocity.y);

        // Update animation based on facing direction
        if (!Game.player.isAttacking) {
            if (velocity.x !== 0 || velocity.y !== 0) {
                Game.player.anims.play(this.facing, true);
            }
        } else {
            // Maintain current facing animation while attacking
            Game.player.anims.play(this.facing, true);
        }
    }
}

