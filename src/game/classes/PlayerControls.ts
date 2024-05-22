import Player from "./Player";
import playerStore from "../stores/PlayerStore";
import { makeObservable } from "mobx";

export default class PlayerControls {
    private keyA!: Phaser.Input.Keyboard.Key;
    private keyS!: Phaser.Input.Keyboard.Key;
    private keyD!: Phaser.Input.Keyboard.Key;
    private keyW!: Phaser.Input.Keyboard.Key;

    constructor(
        scene: Phaser.Scene,
        private player: Player,
    ) {
        makeObservable(this);
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
    }

    update() {
        // Player Movement
        const velocity = { x: 0, y: 0 };

        if (this.keyA.isDown) {
            velocity.x = -playerStore.currentMovementSpeed;
            this.player.anims.play("left", true);
        } else if (this.keyD.isDown) {
            velocity.x = playerStore.currentMovementSpeed;
            this.player.anims.play("right", true);
        }

        if (this.keyW.isDown) {
            velocity.y = -playerStore.currentMovementSpeed;
        } else if (this.keyS.isDown) {
            velocity.y = playerStore.currentMovementSpeed;
            this.player.anims.play("turn");
        }

        this.player.setVelocity(velocity.x, velocity.y);
    }
}
