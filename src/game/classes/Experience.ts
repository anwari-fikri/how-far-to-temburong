import { Physics } from "phaser";
import { Game } from "../scenes/Game";

export class Experience extends Physics.Arcade.Sprite {
    constructor(scene: Phaser.Scene) {
        super(scene, 0, 0, "experience");

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setActive(false);
        this.setVisible(false);
        this.setSize(20, 20);
        this.setDepth(43);
    }

    activateExp(x: number, y: number) {
        this.setPosition(x, y);
        this.setActive(true);
        this.setVisible(true);
    }

    update() {
        if (this.active && this.scene.physics.overlap(this, Game.player)) {
            this.handlePlayerCollision();
        }
    }

    handlePlayerCollision() {
        this.setActive(false);
        this.setVisible(false);
        this.expUp();
        Game.gameUI.createFloatingText(
            Game.player.x,
            Game.player.y,
            "+exp",
            "#00FF00",
        );
    }

    expUp() {
        Game.player.experience.experiencePoint += 1;
        if (
            Game.player.experience.experiencePoint >=
            Game.player.experience.nextLevel
        ) {
            Game.player.experience.levelCount += 1;
            Game.player.experience.experiencePoint = 0;
            Game.player.experience.nextLevel += 5;
            Game.gameUI.createLevelUpSelection();
            const levelUpSound = this.scene.sound.add("levelUp");
            levelUpSound.play();
        } else {
            const expSound = this.scene.sound.add("exp");
            expSound.play();
        }

        Game.player.emit("experience-changed");
    }
}
