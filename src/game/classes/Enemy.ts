import Player from "./Player";
import playerStore from "../stores/PlayerStore";

export default class Enemy extends Phaser.Physics.Arcade.Sprite {
    private health: number;

    private attackPower: number;
    private canAttack: boolean = true;
    private attackCoolDownTimer: Phaser.Time.TimerEvent | null = null;

    constructor(
        scene: Phaser.Scene,
        xPos: number,
        yPos: number,
        texture: string,
        health: number,
        attackPower: number,
    ) {
        super(scene, xPos, yPos, texture);
        this.health = health;
        this.attackPower = attackPower;

        scene.add.existing(this);
        scene.physics.add.existing(this);
    }

    update(player: Player) {
        this.chase(player);
        this.performAttack(player);
    }

    chase(player: Player) {
        this.scene.physics.moveToObject(this, player, 100);
    }

    performAttack(player: Player) {
        this.scene.physics.add.overlap(player, this, () => {
            if (this.canAttack) {
                playerStore.receiveDamage(this.attackPower);
                this.canAttack = false;

                if (this.attackCoolDownTimer) {
                    this.attackCoolDownTimer.remove();
                }

                this.attackCoolDownTimer = this.scene.time.delayedCall(
                    1000,
                    () => {
                        this.canAttack = true;
                    },
                );
            }
        });
    }

    performGetNuked() {
        this.destroy();
    }
}
