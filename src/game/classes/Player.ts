import { playerAnims } from "./CharAnims";
import PlayerControls from "./PlayerControls";

export default class Player extends Phaser.Physics.Arcade.Sprite {
    private controls: PlayerControls;

    private basePlayerSpeed = 300;
    private playerSpeed = this.basePlayerSpeed;

    // Power Ups
    private isSpeedBoosted: boolean;
    private speedBoostTimer: Phaser.Time.TimerEvent;

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
        super(scene, x, y, texture);
        scene.add.existing(this);
        scene.physics.add.existing(this);

        // Power Up States
        this.isSpeedBoosted = false;

        this.controls = new PlayerControls(scene, this);

        scene.cameras.main.startFollow(this, true);

        playerAnims(scene);
    }

    update() {
        this.controls.update();
    }
}
