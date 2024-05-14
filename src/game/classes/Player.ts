import { playerAnims } from "./CharAnims";
import PlayerControls from "./PlayerControls";

export default class Player extends Phaser.Physics.Arcade.Sprite {
    private controls: PlayerControls;

    private baseMovementSpeed = 300;
    private baseHealth = 100;
    private health = this.baseHealth;

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
        super(scene, x, y, texture);
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.controls = new PlayerControls(scene, this);
        scene.cameras.main.startFollow(this, true);

        playerAnims(scene);
    }

    update() {
        this.controls.update();
    }

    getHealth() {
        return this.health;
    }

    receiveDamage(attack: number) {
        this.health -= attack;
    }
}
