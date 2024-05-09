import { playerAnims } from "./CharAnims";

export default class Player {
    private player: Phaser.Physics.Arcade.Sprite;
    private keyA!: Phaser.Input.Keyboard.Key;
    private keyS!: Phaser.Input.Keyboard.Key;
    private keyD!: Phaser.Input.Keyboard.Key;
    private keyW!: Phaser.Input.Keyboard.Key;

    private playerSpeed = 300; // Move player speed to class level

    constructor(scene: Phaser.Scene) {
        this.player = scene.physics.add.sprite(100, 450, "dude");

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

        scene.cameras.main.startFollow(this.player, true);

        playerAnims(scene);
    }

    update() {
        const velocity = { x: 0, y: 0 };

        if (this.keyA.isDown) {
            velocity.x = -this.playerSpeed;
            this.player.anims.play("left", true);
        } else if (this.keyD.isDown) {
            velocity.x = this.playerSpeed;
            this.player.anims.play("right", true);
        }

        if (this.keyW.isDown) {
            velocity.y = -this.playerSpeed;
        } else if (this.keyS.isDown) {
            velocity.y = this.playerSpeed;
            this.player.anims.play("turn");
        }

        this.player.setVelocity(velocity.x, velocity.y);
    }
}
