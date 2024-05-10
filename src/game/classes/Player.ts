import { playerAnims } from "./CharAnims";
import PlayerControls from "./PlayerControls";

export default class Player extends Phaser.Physics.Arcade.Sprite {
    private controls: PlayerControls;

    private basePlayerSpeed = 300; // Move player speed to class level
    private playerSpeed = this.basePlayerSpeed;

    // Power Ups
    private isSpeedBoosted: boolean;
    private speedBoostTimer: Phaser.Time.TimerEvent; // Define timer event variable

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

    applySpeedBoost() {
        /*
            If the player picks up a speed boost:
            - Increase the player's movement speed.
            - If the speed boost is already active, resets the power-up timer.
        */
        if (!this.isSpeedBoosted) {
            this.isSpeedBoosted = true;
            this.playerSpeed += this.basePlayerSpeed;

            if (this.speedBoostTimer) {
                this.speedBoostTimer.remove();
            }

            this.speedBoostTimer = this.scene.time.delayedCall(5000, () => {
                this.removeSpeedBoost();
            });
        } else {
            this.speedBoostTimer.reset({
                delay: 5000,
                callback: () => this.removeSpeedBoost(),
            });
        }
    }

    private removeSpeedBoost() {
        this.isSpeedBoosted = false;
        this.playerSpeed -= this.basePlayerSpeed;
    }
}
