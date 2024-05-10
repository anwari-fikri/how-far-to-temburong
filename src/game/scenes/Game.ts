import { EventBus } from "../EventBus";
import { Scene } from "phaser";
import Player from "../classes/Player";
import PowerUps, { PowerUpType } from "../classes/PowerUps";
import playerStore from "../stores/PlayerStore";

export class Game extends Scene {
    private player: Player;
    private speedBoost: PowerUps;
    private speedBoost2: PowerUps;
    private background: Phaser.GameObjects.Image;

    constructor() {
        super("Game");
    }

    create() {
        this.background = this.add
            .image(400, 300, "bg-bridge")
            .setScrollFactor(1);
        this.cameras.main.setZoom(1.5);

        this.player = new Player(this, 100, 450, "dude");
        this.speedBoost = new PowerUps(
            this,
            400,
            450,
            "star",
            PowerUpType.SPEED_BOOST,
        );
        this.speedBoost2 = new PowerUps(
            this,
            0,
            450,
            "star",
            PowerUpType.SPEED_BOOST,
        );
        this.physics.add.collider(this.player, this.speedBoost, () => {
            playerStore.applySpeedBoost(this);
            this.speedBoost.destroy();
        });
        this.physics.add.collider(this.player, this.speedBoost2, () => {
            playerStore.applySpeedBoost(this);
            this.speedBoost2.destroy();
        });

        EventBus.emit("current-scene-ready", this);
    }

    update() {
        this.player.update();
    }

    changeScene() {
        this.scene.start("GameOver");
    }
}
