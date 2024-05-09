import { EventBus } from "../EventBus";
import { Scene } from "phaser";
import { createPlayer, updatePlayer } from "../classes/Player";

export class Game extends Scene {
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    gameText: Phaser.GameObjects.Text;

    constructor() {
        super("Game");
    }

    create() {
        this.add.image(400, 300, "bg-bridge").setScrollFactor(1);
        this.cameras.main.setZoom(1.5);

        createPlayer(this);

        EventBus.emit("current-scene-ready", this);
    }

    update() {
        updatePlayer(this);
    }

    changeScene() {
        this.scene.start("GameOver");
    }
}
