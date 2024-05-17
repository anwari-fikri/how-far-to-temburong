import { Scene } from "phaser";
import { EventBus } from "../EventBus";
import playerStore from "../stores/PlayerStore";
import { autorun, makeObservable } from "mobx";
import { HEALTH_ANIMATIONS, healthAnims } from "../classes/UIAnims";

export class GameUIOverlay extends Scene {
    private hearts: Phaser.GameObjects.Sprite[] = [];

    getHearts() {
        return this.hearts;
    }

    constructor() {
        super("GameUIOverlay");
        makeObservable(this);
    }

    create() {
        this.cameras.main.setZoom(1);

        this.createCalendar(1);
        this.createPlayerHealth();
        this.updateHealthUI();

        // Emit an event to notify that the current scene is ready
        EventBus.emit("current-scene-ready", this);

        autorun(() => {
            this.updateHealthUI();
        });
    }

    update() {}

    createPlayerHealth() {
        healthAnims(this);
        this.hearts = [];

        for (let i = 0; i < playerStore.currentHealth; i++) {
            const heart = this.add
                .sprite(120 + i * 63, 20, "heart")
                .setScale(8)
                .setOrigin(0);
            this.hearts.push(heart);
        }
    }

    updateHealthUI() {
        if (this.hearts.length === 0) {
            return;
        }

        for (let i = 0; i < this.hearts.length; i++) {
            if (i < playerStore.currentHealth) {
                this.hearts[i].setFrame(0);
            } else {
                this.hearts[playerStore.currentHealth].play(
                    HEALTH_ANIMATIONS.LOSE_HEART,
                );
            }
        }
    }

    createCalendar(day: number) {
        const calendarX: number = 20;
        const calendarY: number = 20;
        const scale: number = 0.2;

        const calendar = this.add.group();

        const calendarImage = this.add
            .image(calendarX, calendarY, "calendar")
            .setOrigin(0, 0)
            .setScale(scale, scale);

        const dayText = this.add
            .text(
                calendarX + (calendarImage.width / 2) * scale,
                calendarY + (calendarImage.height / 2) * scale,
                "Day",
                {
                    fontSize: "20px",
                    color: "#000000",
                },
            )
            .setOrigin(0.5, 0.5);
        const dayNumberText = this.add
            .text(
                calendarX + (calendarImage.width / 2) * scale,
                calendarY + (calendarImage.height / 2) * scale + 24,
                String(day),
                {
                    fontSize: "20px",
                    color: "#000000",
                },
            )
            .setOrigin(0.5, 0.5);

        calendar.add(calendarImage);
        calendar.add(dayText);
        calendar.add(dayNumberText);
    }
}

