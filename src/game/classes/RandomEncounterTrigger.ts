import { Physics } from "phaser";
import { Game } from "../scenes/Game";

export default class RandomEncounterTrigger extends Physics.Arcade.Sprite {
    constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
        super(scene, x, y, texture);

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setActive(false);
        this.setVisible(false);
        this.setDepth(40);
        this.activateTrigger(Game.player.x + 100, Game.player.y);
    }

    activateTrigger(x: number, y: number) {
        this.setPosition(x, y);
        this.setActive(true);
        this.setVisible(true);
    }

    update() {
        if (this.active && this.scene.physics.overlap(this, Game.player)) {
            this.setActive(false);
            this.setVisible(false);

            this.scene.sound.pauseAll();
            this.scene.scene.pause();
            const encounter = this.scene.sound.add("encounter");
            encounter.play();
            this.scene.scene.launch("RandomEncounterTest");
        }
    }
}
