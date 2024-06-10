import { Scene } from "phaser";
import { EventBus } from "../EventBus";

export class PauseMenu extends Scene {
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    gameOverText: Phaser.GameObjects.Text;
    escKey: Phaser.Input.Keyboard.Key | undefined;
    volumeSlider: HTMLInputElement | undefined;

    constructor() {
        super("PauseMenu");
    }

    create() {
        this.camera = this.cameras.main;
        this.camera.setBackgroundColor(0xff0000);

        this.gameOverText = this.add
            .text(
                this.camera.width / 2,
                this.camera.height / 2 - 100,
                "Pause",
                {
                    fontFamily: "Arial Black",
                    fontSize: 64,
                    color: "#ffffff",
                    stroke: "#000000",
                    strokeThickness: 8,
                    align: "center",
                },
            )
            .setOrigin(0.5)
            .setDepth(100);

        this.createVolumeSlider();

        this.escKey = this.input.keyboard?.addKey(
            Phaser.Input.Keyboard.KeyCodes.ESC,
        );
        this.escKey?.on("down", () => {
            this.scene.resume("Game");
            this.scene.stop();
        });

        EventBus.emit("current-scene-ready", this);
    }

    createVolumeSlider() {
        this.volumeSlider = document.createElement("input");
        this.volumeSlider.type = "range";
        this.volumeSlider.min = "0";
        this.volumeSlider.max = "1";
        this.volumeSlider.step = "0.01";
        this.volumeSlider.value = this.sound.volume.toString(); // Set initial value
        this.volumeSlider.style.position = "absolute";
        this.volumeSlider.style.top = "50%";
        this.volumeSlider.style.left = "50%";
        this.volumeSlider.style.transform = "translate(-50%, -50%)";
        this.volumeSlider.style.zIndex = "1000"; // Make sure it is above other elements

        document.body.appendChild(this.volumeSlider);

        this.volumeSlider.addEventListener("input", (event) => {
            const target = event.target as HTMLInputElement;
            const newVolume = parseFloat(target.value);
            this.sound.volume = newVolume;
        });

        this.events.on(Phaser.Scenes.Events.SHUTDOWN, () => {
            if (
                this.volumeSlider &&
                document.body.contains(this.volumeSlider)
            ) {
                document.body.removeChild(this.volumeSlider);
            }
        });
    }
}
