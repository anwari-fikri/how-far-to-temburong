import { EventBus } from "../EventBus";
import { Scene } from "phaser";
import Player from "../classes/Player";

export class Game extends Scene {
    private player: Player;
    private background: Phaser.GameObjects.Image;
    private gameText: Phaser.GameObjects.Text;

    constructor() {
        super("Game");
    }

    create() {
        this.background = this.add
            .image(400, 300, "bg-bridge")
            .setScrollFactor(1);
        this.cameras.main.setZoom(1.5);

        this.player = new Player(this);

        EventBus.emit("current-scene-ready", this);
    }

    update() {
        this.player.update();
    }

    changeScene() {
        this.scene.start("GameOver");
    }
}
