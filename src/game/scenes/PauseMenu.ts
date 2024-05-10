import { Scene } from "phaser";
import { EventBus } from "../EventBus";

export class PauseMenu extends Scene {
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    gameOverText: Phaser.GameObjects.Text;
    escKey: Phaser.Input.Keyboard.Key | undefined;

    constructor() {
        super("PauseMenu");
    }

    create() {
        this.camera = this.cameras.main;
        this.camera.setBackgroundColor(0xff0000);

        this.gameOverText = this.add
            .text(512, 384, "Pause", {
                fontFamily: "Arial Black",
                fontSize: 64,
                color: "#ffffff",
                stroke: "#000000",
                strokeThickness: 8,
                align: "center",
            })
            .setOrigin(0.5)
            .setDepth(100);

        this.escKey = this.input.keyboard?.addKey(
            Phaser.Input.Keyboard.KeyCodes.ESC
        );
        this.escKey?.on("down", () => {
            this.scene.resume("Game");
            this.scene.stop();
        });

        EventBus.emit("current-scene-ready", this);
    }
}
