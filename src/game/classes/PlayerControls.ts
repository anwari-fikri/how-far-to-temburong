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

        if (this.keyA.isDown) {
            velocity.x = -this.player.currentMovementSpeed;
            this.player.anims.play("left", true);
            this.facing = "left";
        } else if (this.keyD.isDown) {
            velocity.x = this.player.currentMovementSpeed;
            this.player.anims.play("right", true);
            this.facing = "right";
        }

        if (this.keyW.isDown) {
            velocity.y = -this.player.currentMovementSpeed;
        } else if (this.keyS.isDown) {
            velocity.y = this.player.currentMovementSpeed;
            this.player.anims.play("turn");
        }

        this.player.setVelocity(velocity.x, velocity.y);
    }
}

