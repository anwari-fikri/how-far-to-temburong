import Player from "./Player";

export default class PlayerControls {
    keyA!: Phaser.Input.Keyboard.Key;
    keyS!: Phaser.Input.Keyboard.Key;
    keyD!: Phaser.Input.Keyboard.Key;
    keyW!: Phaser.Input.Keyboard.Key;
    player: Player;
    facing: "left" | "right";

    constructor(scene: Phaser.Scene, player: Player) {
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

        this.player = player;
        this.facing = "left";
    }

    update() {
        // Player Movement
        const velocity = { x: 0, y: 0 };

        // Update movement based on input
        if (this.keyA.isDown) {
            velocity.x = -this.player.currentMovementSpeed;
            if (!this.player.isAttacking) {
                this.facing = "left";
            }
        } else if (this.keyD.isDown) {
            velocity.x = this.player.currentMovementSpeed;
            if (!this.player.isAttacking) {
                this.facing = "right";
            }
        }

        if (this.keyW.isDown) {
            velocity.y = -this.player.currentMovementSpeed;
        } else if (this.keyS.isDown) {
            velocity.y = this.player.currentMovementSpeed;
        }

        // Apply movement
        this.player.setVelocity(velocity.x, velocity.y);

        // Update animation based on facing direction
        if (!this.player.isAttacking) {
            if (velocity.x !== 0 || velocity.y !== 0) {
                this.player.anims.play(this.facing, true);
            }
        } else {
            // Maintain current facing animation while attacking
            this.player.anims.play(this.facing, true);
        }
    }
}
