import { EventBus } from "../EventBus";
import { Scene } from "phaser";

export class PlayerCamera extends Scene {
    player: Phaser.Physics.Arcade.Image;
    keyA!: Phaser.Input.Keyboard.Key;
    keyS!: Phaser.Input.Keyboard.Key;
    keyD!: Phaser.Input.Keyboard.Key;
    keyW!: Phaser.Input.Keyboard.Key;
    zoomInButton!: Phaser.GameObjects.Text;
    zoomOutButton!: Phaser.GameObjects.Text;

    constructor() {
        super("PlayerCamera");
    }

    create() {
        this.cameras.main.setBounds(0, 0, 1920 * 2, 1080 * 2);
        this.physics.world.setBounds(0, 0, 1920 * 2, 1080 * 2);

        this.add.image(0, 0, "minatoAqua").setOrigin(0);

        this.player = this.physics.add.image(400, 300, "minatoAqua2");
        this.player.setCollideWorldBounds(true);
        const scaleX = 0.2;
        const scaleY = 0.2;
        this.player.setScale(scaleX, scaleY);

        this.initKeys();

        // Create zoom buttons
        this.createZoomButtons();

        this.cameras.main.startFollow(this.player, true, 0.05, 0.05);

        EventBus.emit("current-scene-ready", this);
    }

    update() {
        if (this.keyA?.isDown) {
            this.player.setVelocityX(-500);
        } else if (this.keyD?.isDown) {
            this.player.setVelocityX(500);
        } else {
            this.player.setVelocityX(0);
        }

        if (this.keyW?.isDown) {
            this.player.setVelocityY(-500);
        } else if (this.keyS?.isDown) {
            this.player.setVelocityY(500);
        } else {
            this.player.setVelocityY(0);
        }
    }

    changeScene() {
        this.scene.start("MainMenu");
    }

    private initKeys() {
        if (this.input.keyboard) {
            this.keyA = this.input.keyboard.addKey(
                Phaser.Input.Keyboard.KeyCodes.A
            );
            this.keyS = this.input.keyboard.addKey(
                Phaser.Input.Keyboard.KeyCodes.S
            );
            this.keyD = this.input.keyboard.addKey(
                Phaser.Input.Keyboard.KeyCodes.D
            );
            this.keyW = this.input.keyboard.addKey(
                Phaser.Input.Keyboard.KeyCodes.W
            );
        } else {
            console.error("Keyboard input is not available.");
        }
    }

    private createZoomButtons() {
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;

        // Zoom in button
        this.zoomInButton = this.add
            .text(30, 30, "+", {
                color: "#ffffff",
                backgroundColor: "#000000",
                padding: { x: 10, y: 5 },
            })
            .setInteractive()
            .on("pointerdown", () => {
                this.cameras.main.zoom += 0.1;
            });

        // Zoom out button
        this.zoomOutButton = this.add
            .text(30, 60, "-", {
                color: "#ffffff",
                backgroundColor: "#000000",
                padding: { x: 10, y: 5 },
            })
            .setInteractive()
            .on("pointerdown", () => {
                this.cameras.main.zoom -= 0.1;
            });
    }
}

