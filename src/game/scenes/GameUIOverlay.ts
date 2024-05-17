import { GameObjects, Scene } from "phaser";
import { EventBus } from "../EventBus";

export class GameUIOverlay extends Scene {
    constructor() {
        super("GameUIOverlay");
    }

    create() {
        this.cameras.main.setZoom(1);

        this.createCalendar(1);

        // Emit an event to notify that the current scene is ready
        EventBus.emit("current-scene-ready", this);
    }

    update() {}

    createCalendar(day: number) {
        const calendarX = 20;
        const calendarY = 20;
        const scale = 0.2;

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

