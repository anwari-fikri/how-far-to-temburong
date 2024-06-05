import { EventBus } from "../EventBus";
import { Scene } from "phaser";
import playerStore from "../stores/PlayerStore";
import { Game } from "./Game";

export class GameOver extends Scene {
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    gameOverText: Phaser.GameObjects.Text;
    kill: Phaser.GameObjects.Text;
    distance: Phaser.GameObjects.Text;
    timePlay: Phaser.GameObjects.Text;

    constructor() {
        super("GameOver");
    }

    create() {
        this.camera = this.cameras.main;
        this.camera.setBackgroundColor(0xff0000);

        this.background = this.add.image(512, 384, "background");
        this.background.setAlpha(0);

        this.gameOverText = this.add
            .text(40, 0, "Game Over", {
                fontFamily: "Arial Black",
                fontSize: 64,
                color: "#ffffff",
                stroke: "#000000",
                strokeThickness: 8,
                align: "center",
            })
            .setOrigin(0, 0)
            .setDepth(100);

        this.kill = this.add
            .text(40, 100, "Kills: " + Game.totalKill, {
                fontSize: "36px",
                color: "#000000",
            })
            .setOrigin(0, 0)
            .setDepth(100);
        this.distance = this.add
            .text(40, 130, "Distance: " + Game.totalDistance, {
                fontSize: "36px",
                color: "#000000",
            })
            .setOrigin(0, 0)
            .setDepth(100);
        this.timePlay = this.add
            .text(40, 160, "time: " + Game.totalTime, {
                fontSize: "36px",
                color: "#000000",
            })
            .setOrigin(0, 0)
            .setDepth(100);

        EventBus.emit("current-scene-ready", this);
    }

    update() {
        const spaceKey = this.input.keyboard?.addKey(
            Phaser.Input.Keyboard.KeyCodes.SPACE,
        );
        spaceKey?.on("down", () => {
            playerStore.resetAttributes();
            this.scene.start("Game");
        });
    }
}
