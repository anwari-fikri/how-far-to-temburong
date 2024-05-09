import { EventBus } from "../EventBus";
import { Scene } from "phaser";
import { score } from "../score";
import { autorun, makeObservable } from "mobx";

export class MobXObservable extends Scene {
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    gameText: Phaser.GameObjects.Text;

    constructor() {
        super("Game");
        makeObservable(this);
    }

    create() {
        this.input.on("pointerdown", this.addCoin);

        this.gameText = this.add.text(512, 384, String(score.coins), {
            fontFamily: "Arial Black",
            fontSize: 38,
            color: "#ffffff",
            stroke: "#000000",
            strokeThickness: 8,
            align: "center",
        });

        autorun(() => (this.gameText.text = String(score.coins)));

        EventBus.emit("current-scene-ready", this);
    }

    addCoin = () => {
        console.log("ADD COIN!!");
        score.updateCoins(score.coins + 1);
    };

    changeScene() {
        this.scene.start("GameOver");
    }
}

