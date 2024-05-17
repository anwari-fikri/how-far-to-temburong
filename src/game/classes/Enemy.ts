import Player from "./Player";
import playerStore from "../stores/PlayerStore";

export default class Enemy extends Phaser.Physics.Arcade.Sprite {
    private isAlive: boolean = true;

    private health: number;
    private label: Phaser.GameObjects.Text;

    private attackPower: number;
    private canAttack: boolean = true;
    private attackCoolDownTimer: Phaser.Time.TimerEvent | null = null;

    private chaseSpeed: number = 100;

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

        this.setDisplaySize(50, 50);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setCollideWorldBounds(true);

        // Create a text object and position it above the sprite
        this.label = scene.add
            .text(xPos, yPos - this.height / 2 - 10, String(this.health), {
                fontSize: "16px",
                color: "#fff",
                align: "center",
            })
            .setOrigin(0.5, 1);
    }

    update(player: Player) {
        this.chase(player);

        if (this.isAlive) {
            this.performAttack(player);

            if (this.health <= 0) {
                this.animateDeath();
            } else {
                this.health -= 1;
            }
        }

        this.label.setPosition(this.x, this.y - this.height / 2 - 10);
        this.label.setText(String(this.health));
    }

    animateDeath() {
        const DEATH_ANIMATION_TIMER = 0.5;
        const CORPSE_UPTIME = 10;
        const SECOND = 1000;

        if (!this.isAlive) return;
        this.isAlive = false;

        this.setChaseSpeed(0);
        this.scene.tweens.add({
            targets: this,
            alpha: 0.2,
            duration: DEATH_ANIMATION_TIMER * SECOND,
            ease: Phaser.Math.Easing.Linear,
            onComplete: () => {
                this.setTexture("corpse");
                this.setDisplaySize(50, 50);
                this.setAlpha(1);
                this.scene.tweens.add({
                    targets: this,
                    alpha: 0,
                    duration: CORPSE_UPTIME * SECOND,
                    ease: Phaser.Math.Easing.Quintic.In,
                });

                if (this.scene && this.scene.sys.isActive()) {
                    this.scene.time.delayedCall(CORPSE_UPTIME * SECOND, () => {
                        this.label.destroy();
                        this.destroy();
                    });
                }
            },
        });
    }

    setChaseSpeed(chaseSpeed: number) {
        this.chaseSpeed = chaseSpeed;
    }

    chase(player: Player) {
        // console.log(this.chaseSpeed);
        this.scene.physics.moveToObject(this, player, this.chaseSpeed);
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
