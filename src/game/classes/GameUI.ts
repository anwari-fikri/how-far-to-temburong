import { Scene } from "phaser";
import { PLAYER_CONST } from "./Player";
import { Game } from "../scenes/Game";
import { POWERUP_DURATION, PowerUpType } from "./PowerUp";
import { ZOMBIE_TYPE, Zombie } from "./Zombie";

export default class GameUI {
    scene: Scene;
    activePowerUps: Phaser.GameObjects.Group;
    elapsedTime: number = 0;
    healthBar: Phaser.GameObjects.Graphics;
    calendar: Phaser.GameObjects.Group;
    startTime: number;
    expBar: Phaser.GameObjects.Graphics;
    levelCount: Phaser.GameObjects.Text;
    indicator: Phaser.GameObjects.Graphics;

    constructor(scene: Scene) {
        this.scene = scene;

        this.createAndUpdateHealthBar();
        this.createCalendar(Game.gameStage);
        this.createPowerUpStatus();
        // this.createElapsedTime();
        this.createInventory();
        this.createExpBar();
        // this.createLevelUpSelection();
        this.createLevelCount();
        this.createIndicator();
    }

    createLevelUpSelection() {
        // Pause the game scene
        this.scene.scene.pause("Game");

        // Start the level-up overlay scene
        this.scene.scene.launch("WeaponSkillUpgrade");
    }

    createExpBar() {
        this.expBar = this.scene.add.graphics();
        this.expBar.setScrollFactor(0);

        const updateExpBar = () => {
            const expPercentage =
                Game.player.experience.experiencePoint /
                Game.player.experience.nextLevel;
            this.expBar.clear();
            this.expBar.fillStyle(0x98fb98);
            this.expBar.fillRect(0, 0, 480 * expPercentage, 5);

            this.expBar.lineStyle(1, 0xffffff);
            this.expBar.strokeRect(-1, -1, 482, 5);
            this.expBar.setDepth(40);
        };

        updateExpBar();

        Game.player.on("experience-changed", updateExpBar);
    }

    createFloatingText(
        x: number,
        y: number,
        text: string,
        textColor: string = "#FFFFFF",
        fontSize: string = "8px",
        priority: boolean = false,
    ) {
        const xDeviation = Phaser.Math.Between(-10, 10); // Random x deviation between -10 and 10
        const yDeviation = Phaser.Math.Between(-10, -30); // Random y deviation between -10 and -30

        const damageText = this.scene.add
            .text(x + xDeviation, y - 10, text, {
                fontFamily: "Arial",
                fontSize: fontSize,
                color: textColor,
                stroke: "#000000",
                strokeThickness: 2,
            })
            .setOrigin(0.5)
            .setDepth(priority ? 41 : 40);

        // Apply upward floating animation with random deviation
        this.scene.tweens.add({
            targets: damageText,
            x: damageText.x + xDeviation,
            y: damageText.y + yDeviation,
            alpha: 0,
            duration: 1000,
            onComplete: () => {
                damageText.destroy();
            },
        });
    }

    createInventory() {
        const createSlot = (x: number, y: number, depth: number) => {
            return this.scene.add
                .sprite(x, y, "inventory-slot", 0)
                .setOrigin(1, 0)
                .setScrollFactor(0)
                .setDepth(depth);
        };

        const createWeapon = (
            x: number,
            y: number,
            icon: string,
            depth: number,
        ) => {
            return this.scene.add
                .sprite(x, y, icon)
                .setOrigin(0.5, 0)
                .setScrollFactor(0)
                .setDepth(depth);
        };

        const leftSlot = createSlot(470 - 30, 15, 40); // -30 (-32 to be exact) is width of sprite
        const rightSlot = createSlot(470, 15, 40);

        const meleeWeapon = createWeapon(
            leftSlot.x - 16,
            15,
            Game.player.inventory.meleeWeapon.weaponType.icon,
            41,
        );
        const rangedWeapon = createWeapon(
            rightSlot.x - 16,
            15,
            Game.player.inventory.rangedWeapon.weaponType.icon,
            41,
        );

        const updateHandSlot = () => {
            const isSelectedLeft = Game.player.inventory.selectedHandSlot === 1;
            leftSlot.setFrame(isSelectedLeft ? 1 : 0);
            rightSlot.setFrame(isSelectedLeft ? 0 : 1);
        };

        updateHandSlot();
        Game.player.on("handslot-changed", updateHandSlot);
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

    createPowerUpStatus() {
        this.activePowerUps = this.scene.add.group();

        const powerUpTypes = [
            {
                key: PowerUpType.SPEED_BOOST,
                isActive: Game.player.isSpeedBoosted,
                timer: Game.player.speedBoostTimer,
                icon: PowerUpType.SPEED_BOOST,
                duration: POWERUP_DURATION.SPEED_BOOST,
            },
            {
                key: PowerUpType.ATTACK_BOOST,
                isActive: Game.player.isAttackBoosted,
                timer: Game.player.attackBoostTimer,
                icon: PowerUpType.ATTACK_BOOST,
                duration: POWERUP_DURATION.ATTACK_BOOST,
            },
            {
                key: PowerUpType.TIME_STOP,
                isActive: Game.player.isTimeStopped,
                timer: Game.player.timeStopTimer,
                icon: PowerUpType.TIME_STOP,
                duration: POWERUP_DURATION.TIME_STOP,
            },
            {
                key: PowerUpType.INVINCIBILITY,
                isActive: Game.player.isInvincibility,
                timer: Game.player.invincibilityTimer,
                icon: PowerUpType.INVINCIBILITY,
                duration: POWERUP_DURATION.INVINCIBILITY,
            },
        ];

        // Filter the active power-ups
        const activePowerUps = powerUpTypes.filter(
            (powerUp) => powerUp.isActive,
        );
        // Add active power-up icons
        activePowerUps.forEach((powerUp, index) => {
            const icon = this.scene.add
                .sprite(60 + index * 20, 30, powerUp.icon)
                .setOrigin(0, 0)
                .setScrollFactor(0)
                .setScale(0.5)
                .setDepth(40);

            this.activePowerUps.add(icon);

            const remainingTime = powerUp.timer.getRemainingSeconds();
            if (remainingTime < 2) {
                if (
                    Math.floor(
                        this.scene.time.now / (500 + (remainingTime / 4) * 500),
                    ) %
                        2 ===
                    0
                ) {
                    icon.setAlpha(0);
                }
            }
        });
    }

    createLevelCount() {
        this.levelCount = this.scene.add.text(
            220,
            11,
            `Level ${String(Game.player.experience.levelCount)}`,
        );
        this.levelCount.setScrollFactor(0).setDepth(40);

        const updateLevel = () => {
            this.levelCount.setText(
                `Level ${String(Game.player.experience.levelCount)}`,
            );
        };

        // Register the update function to the "experience-changed" event
        Game.player.on("experience-changed", updateLevel);
    }

    createAndUpdateHealthBar() {
        this.healthBar = this.scene.add.graphics();
        this.healthBar.setScrollFactor(0);

        const updateHealthBar = () => {
            const healthPercentage =
                Game.player.currentHealth / PLAYER_CONST.BASE_HEALTH;
            this.healthBar.clear();
            this.healthBar.fillStyle(0xd0312d);
            this.healthBar.fillRect(60, 11, 150 * healthPercentage, 15);
            this.healthBar.lineStyle(1, 0xffffff);
            this.healthBar.strokeRect(60, 11, 150, 15);
            this.healthBar.setDepth(40);
        };

        updateHealthBar();

        Game.player.on("health-changed", updateHealthBar);
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

    createIndicator() {
        this.indicator = this.scene.add.graphics();
        this.indicator.fillStyle(0xff0000, 1);
        this.indicator.fillTriangle(0, 0, 20, 10, 0, 20);
        this.indicator.setDepth(10);
        this.indicator.setVisible(false);
    }

    updateIndicator() {
        const worldView = this.scene.cameras.main.worldView;
        const playerX = Game.player.x;
        const playerY = Game.player.y;

        let indicatorVisible = false;
        let indicatorX;
        let indicatorY;
        let flipX = false;

        Game.zombies.children.iterate(
            (zombie: Phaser.GameObjects.GameObject) => {
                if (zombie instanceof Zombie) {
                    if (
                        zombie.zombieType === ZOMBIE_TYPE.MONKE_BOSS ||
                        zombie.zombieType === ZOMBIE_TYPE.SLIME_BOSS
                    ) {
                        const isOnScreen =
                            this.scene.cameras.main.worldView.contains(
                                zombie.x,
                                zombie.y,
                            );

                        if (!isOnScreen) {
                            indicatorVisible = true;

                            if (zombie.x < playerX) {
                                indicatorX = worldView.x + 25;
                                flipX = true;
                            } else {
                                indicatorX = worldView.x + worldView.width - 25;
                                flipX = false;
                            }

                            indicatorY = Phaser.Math.Clamp(
                                zombie.y,
                                worldView.y,
                                worldView.y + worldView.height,
                            );
                        }
                    }
                }
                return true;
            },
        );

        if (indicatorVisible) {
            this.indicator.setVisible(true);
            this.indicator.setPosition(indicatorX, indicatorY);
            this.indicator.setScale(flipX ? -1 : 1, 1);
        } else {
            this.indicator.setVisible(false);
        }
    }

    update() {
        this.activePowerUps.clear(true, true);
        this.createPowerUpStatus();
        this.updateIndicator();
    }
}
