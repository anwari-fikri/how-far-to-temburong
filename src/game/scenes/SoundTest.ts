import { EventBus } from "../EventBus";
import { Scene } from "phaser";

export class SoundTest extends Scene {
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    slash1: Phaser.Sound.BaseSound;
    isPlaying: boolean = false; // Flag to track if audio is playing

    constructor() {
        super("SoundTest");
    }

    create() {
        var slashConfig = {
            mute: false,
            volume: 0.2,
            rate: 1,
            detune: 0,
            seek: 0,
            loop: false,
            delay: 0,
        };
        this.slash1 = this.sound.add("slash1", slashConfig);

        // Bind playAudio to the current instance
        this.playAudio = this.playAudio.bind(this);

        this.input.on("pointerdown", this.playAudio);

        EventBus.emit("current-scene-ready", this);
    }

    playAudio = () => {
        // Check if audio is already playing
        if (!this.isPlaying) {
            console.log("SLASH");
            this.slash1.play();

            // Set isPlaying to true
            this.isPlaying = true;

            // Listen for audio complete event
            this.slash1.once(Phaser.Sound.Events.COMPLETE, () => {
                // Reset isPlaying to false after audio completes
                this.isPlaying = false;
            });
        }
    };

    changeScene() {
        this.scene.start("TweenTest");
    }
}

