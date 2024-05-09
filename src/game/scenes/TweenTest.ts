import { useRef } from "react";
import { EventBus } from "../EventBus";
import { Scene } from "phaser";
import { IRefPhaserGame } from "../PhaserGame";

export class TweenTest extends Scene {
    background: Phaser.GameObjects.Image;
    minatoAqua: Phaser.GameObjects.Image;
    image: Phaser.GameObjects.Image;

    constructor() {
        super("TweenTest");
    }

    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        this.image = this.add.image(width / 2, height / 2, "minatoAqua2");
        this.image.setScale(
            Math.min(
                width / (this.image.width * 2),
                height / (this.image.height * 2)
            )
        );

        this.tweens.add({
            targets: this.image,
            duration: 500 + Math.random() * 1000,
            alpha: 0,
            yoyo: true,
            repeat: -1,
        });

        this.createButton(width / 2 + 30, height * 0.95 - 30, "⬆️", () =>
            this.moveUp()
        );
        this.createButton(width / 2 + 30, height * 0.95, "⬇️", () =>
            this.moveDown()
        );
        this.createButton(width / 2, height * 0.95, "⬅️", () =>
            this.moveLeft()
        );
        this.createButton(width / 2 + 60, height * 0.95, "➡️", () =>
            this.moveRight()
        );
        this.createButton(width / 2, height * 0.9, "➖", () =>
            this.resizeSmaller()
        );
        this.createButton(width / 2 + 30, height * 0.9, "➕", () =>
            this.resizeLarger()
        );
        this.createButton(width / 2, height * 0.8, "⟲", () =>
            this.rotateLeft()
        );
        this.createButton(width / 2 + 30, height * 0.8, "⟳", () =>
            this.rotateRight()
        );

        EventBus.emit("current-scene-ready", this);
    }

    createButton(x: number, y: number, text: string, onClick: () => void) {
        return this.add
            .text(x, y, text, {
                color: "#fff",
                backgroundColor: "#000",
            })
            .setInteractive()
            .on("pointerdown", onClick);
    }

    moveLeft() {
        this.image.x -= 10;
    }

    moveRight() {
        this.image.x += 10;
    }

    moveUp() {
        this.image.y -= 10;
    }

    moveDown() {
        this.image.y += 10;
    }

    resizeLarger() {
        const scale = this.image.scaleX * 1.1; // Increase by 10%
        this.image.setScale(scale);
    }

    resizeSmaller() {
        const scale = this.image.scaleX * 0.9; // Reduce by 10%
        this.image.setScale(scale);
    }

    rotateLeft() {
        this.image.angle -= 10;
    }

    rotateRight() {
        this.image.angle += 10;
    }

    changeScene() {
        this.scene.start("PlayerCamera");
    }
}

