import { playerAnims } from "./CharAnims";
import Inventory from "./Inventory";
import PlayerControls from "./PlayerControls";
import { ZombieGroup } from "./ZombieGroup";

export default class Player extends Phaser.Physics.Arcade.Sprite {
    private controls: PlayerControls;

    private inventory: Inventory;

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
        super(scene, x, y, texture);
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.controls = new PlayerControls(scene, this);
        scene.cameras.main.startFollow(this, true);

        playerAnims(scene);
    }

    // Power Ups
    applyNuke(enemies: ZombieGroup) {
        enemies.getNuked();
    }

    update() {
        this.controls.update();
    }
}
