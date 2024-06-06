import { Scene } from "phaser";
import Player, { PLAYER_CONST } from "./Player";

export class GameUI {
    scene: Scene;
    elapsedTime: number = 0;
    healthBar: Phaser.GameObjects.Graphics;
    calendar: Phaser.GameObjects.Group;
    player: Player;
    startTime: number;

    constructor(scene: Scene, player: Player) {
        this.scene = scene;
        this.player = player;

        this.createAndUpdateHealthBar();
        this.createCalendar(1);
        // this.createElapsedTime();
    }

    createElapsedTime() {
        const formatTime = (time: number) => {
            const minutes = Math.floor(time / 60);
            const seconds = Math.floor(time % 60);
            const formattedMinutes = String(minutes).padStart(2, "0");
            const formattedSeconds = String(seconds).padStart(2, "0");
            return `${formattedMinutes}:${formattedSeconds}`;
        };

        const elapsedTimeText = this.scene.add
            .text(300, 25, formatTime(this.elapsedTime), {
                fontSize: "16px",
                color: "#ffffff",
            })
            .setScrollFactor(0)
            .setDepth(40);

        this.scene.time.addEvent({
            delay: 1000,
            loop: true,
            callback: () => {
                this.elapsedTime++;
                elapsedTimeText.setText(formatTime(this.elapsedTime));
            },
            callbackScope: this,
        });
    }

    createAndUpdateHealthBar() {
        this.healthBar = this.scene.add.graphics();
        this.healthBar.setScrollFactor(0);

        const updateHealthBar = () => {
            const healthPercentage =
                this.player.currentHealth / PLAYER_CONST.BASE_HEALTH;
            this.healthBar.clear();
            this.healthBar.fillStyle(0xff0000);
            this.healthBar.fillRect(60, 11, 150 * healthPercentage, 15);
            this.healthBar.lineStyle(1, 0xffffff);
            this.healthBar.strokeRect(60, 11, 150, 15);
            this.healthBar.setDepth(40);
        };

        updateHealthBar();

        this.player.on("health-changed", updateHealthBar);
    }

    createCalendar(day: number) {
        const calendarX: number = 10;
        const calendarY: number = 10;
        const scale: number = 2;
        const textFontSize = 12;

        this.calendar = this.scene.add.group();

        const calendarImage = this.scene.add
            .image(calendarX, calendarY, "calendar")
            .setOrigin(0, 0)
            .setScale(scale, scale)
            .setScrollFactor(0);

        const dayText = this.scene.add
            .text(
                calendarX + (calendarImage.width / 2) * scale,
                calendarY + (calendarImage.height / 2) * scale,
                "Day",
                {
                    fontSize: `${textFontSize}px`,
                    color: "#000000",
                },
            )
            .setOrigin(0.5, 0.5)
            .setScrollFactor(0);

        const dayNumberText = this.scene.add
            .text(
                calendarX + (calendarImage.width / 2) * scale,
                calendarY + (calendarImage.height / 2) * scale + textFontSize,
                String(day),
                {
                    fontSize: `${textFontSize}px`,
                    color: "#000000",
                },
            )
            .setOrigin(0.5, 0.5)
            .setScrollFactor(0);

        this.calendar.add(calendarImage);
        this.calendar.add(dayText);
        this.calendar.add(dayNumberText);
        this.calendar.setDepth(40);
    }

    update() {}
}

