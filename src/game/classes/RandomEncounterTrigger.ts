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

            this.scene.scene.pause();
            this.scene.scene.launch("RandomEncounterTest");
        }
    }
}
