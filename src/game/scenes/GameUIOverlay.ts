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
        console.log(playerStore.currentHealth);
        const numberOfHearts = Math.ceil(playerStore.currentHealth / 2);
        this.hearts = [];

        for (let i = 0; i < numberOfHearts; i++) {
            const heart = this.add
                .sprite(120 + i * 63, 20, "heart")
                .setScale(8)
                .setOrigin(0);
            this.hearts.push(heart);
        }
    }

    updateHealthUI() {
        if (playerStore.currentHealth === 0 || this.hearts.length === 0) {
            return;
        }

        // Reset all hearts to full
        this.hearts.forEach((heart, index) => {
            heart.setFrame(0); // Assuming 0 is the full heart frame
        });

        // Determine the number of full hearts and any remaining half heart
        const fullHearts = Math.floor(playerStore.currentHealth / 2);
        const isHalfHeart = playerStore.currentHealth % 2 === 1;

        // Update hearts animations based on current health
        for (let i = 0; i < this.hearts.length; i++) {
            if (i < fullHearts) {
                // Full heart
                this.hearts[i].setFrame(0); // Assuming 0 is the full heart frame
            } else if (i === fullHearts && isHalfHeart) {
                // Half heart
                this.hearts[i].play(HEALTH_ANIMATIONS.LOSE_SECOND_HALF);
            } else {
                // Empty heart
                this.hearts[i].play(HEALTH_ANIMATIONS.LOSE_FIRST_HALF);
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

