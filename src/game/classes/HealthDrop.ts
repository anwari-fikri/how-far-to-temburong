import { Physics, Scene } from "phaser";
import { Game } from "../scenes/Game";

export default class HealthDrop extends Physics.Arcade.Sprite {
    constructor(scene: Scene, x: number, y: number) {
        super(scene, x, y, "health_drop");

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setActive(true);
        this.setVisible(true);
        this.setSize(20, 20);
        this.setDepth(43);
    }

    update() {
        if (this.active && this.scene.physics.overlap(this, Game.player)) {
            this.setActive(false);
            this.setVisible(false);
            Game.player.heal(5);

            Game.gameUI.createFloatingText(
                Game.player.x,
                Game.player.y,
                "+hp",
                "#00ff00",
            );
        }
    }
}

