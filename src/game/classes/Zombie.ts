import { Game } from "../scenes/Game";
import MeleeWeapon from "./MeleeWeapon";
import Player from "./Player";
import { Physics, Scene } from "phaser";
import RangedWeapon from "./RangedWeapon";
import { dropItem } from "./ItemDrop";

interface ZombieProperties {
    texture: string;
    baseHealth: number;
    attackPower: number;
    chaseSpeed: number;
    tint: number;
    animsKey: string;
    hitboxRadius: number;
}

export const ZOMBIE_TYPE: Readonly<{ [key: string]: ZombieProperties }> = {
    NORMAL: {
        texture: "zombie",
        baseHealth: 100,
        attackPower: 5,
        chaseSpeed: 50,
        tint: 0xffffff,
        animsKey: "zombie",
        hitboxRadius: 10,
    },
    STRONG: {
        texture: "zombie",
        baseHealth: 200,
        attackPower: 10,
        chaseSpeed: 50,
        tint: 0x00ffff,
        animsKey: "zombie",
        hitboxRadius: 12,
    },
    MINI_BOSS: {
        texture: "fat_zombie",
        baseHealth: 1000,
        attackPower: 30,
        chaseSpeed: 30,
        tint: 0xffffff,
        animsKey: "fat-zombie",
        hitboxRadius: 10,
    },
} as const;

type ZombieType = (typeof ZOMBIE_TYPE)[keyof typeof ZOMBIE_TYPE];

export class Zombie extends Physics.Arcade.Sprite {
    currentHealth: number;
    attackPower: number;
    originalChaseSpeed: number;
    chaseSpeed: number;
    originalTint: number;
    animsKey: string;
    hitboxRadius: number;

    isInIFrame: boolean = false;
    isTimeStop: boolean = false;

    constructor(scene: Scene) {
        super(scene, 0, 0, "zombie");

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setActive(false);
        this.setVisible(false);
        this.disableBody(true, true);
        this.setDepth(22);
    }

    activateZombie(player: Player, zombieType: ZombieType) {
        const spawnMargin = 50; // Margin to ensure spawning outside the visible area
        const playerX = player.x;
        const playerY = player.y;
        const camera = this.scene.cameras.main;

        let spawnX: number = 0;
        let spawnY: number = 0;

        const spawnSide = Phaser.Math.Between(0, 3);
        switch (spawnSide) {
            case 0: // Left top side
                spawnX = playerX - camera.width - spawnMargin;
                spawnY = Phaser.Math.Between(380, 480);
                break;
            case 1: // Left bot side
                spawnX = playerX - camera.width + spawnMargin;
                spawnY = Phaser.Math.Between(550, 630);
                break;
            case 2: // Right top side
                spawnX = playerX + camera.width + spawnMargin;
                spawnY = Phaser.Math.Between(380, 480);
                break;
            case 3: // Right bot side
                spawnX = playerX + camera.width - spawnMargin;
                spawnY = Phaser.Math.Between(550, 630);
                break;
        }

        // Set the zombie's position and activate it
        this.setTexture(zombieType.texture);
        this.currentHealth = zombieType.baseHealth;
        this.attackPower = zombieType.attackPower;
        this.originalChaseSpeed = zombieType.chaseSpeed;
        this.chaseSpeed = zombieType.chaseSpeed;
        this.originalTint = zombieType.tint;
        this.animsKey = zombieType.animsKey;
        this.hitboxRadius = zombieType.hitboxRadius;

        this.setOrigin(0.5, 0.5);
        var radius = this.hitboxRadius;
        this.setCircle(
            radius,
            -radius + 0.5 * this.width,
            -radius + 0.5 * this.height,
        );

        switch (zombieType) {
            case ZOMBIE_TYPE.NORMAL:
                this.setTexture(ZOMBIE_TYPE.NORMAL.texture);
                break;
            case ZOMBIE_TYPE.STRONG:
                this.setTint(ZOMBIE_TYPE.STRONG.tint); // Strong zombies tinted green
                break;
            case ZOMBIE_TYPE.MINI_BOSS:
                this.setTint(ZOMBIE_TYPE.MINI_BOSS.tint); // Mini-boss zombies tinted yellow
                break;
        }
        this.alive(spawnX, spawnY);
    }

    receiveDamage(amount: number, weapon?: MeleeWeapon | RangedWeapon) {
        if (!this.isInIFrame) {
            if (weapon) {
                this.applyKnockback(weapon);
            }
            this.currentHealth -= amount;
            if (weapon instanceof MeleeWeapon) {
                this.setIFrame(weapon.attackCooldown);
            }
            if (weapon instanceof RangedWeapon) {
                this.setIFrame(0);
            }

            this.scene.tweens.add({
                targets: this,
                tint: 0xff0000,
                duration: 50,
                onComplete: () => {
                    this.scene.tweens.add({
                        targets: this,
                        tint: this.originalTint,
                        duration: 100,
                        delay: 100,
                    });
                },
            });

            // show damage numbers
            const xDeviation = Phaser.Math.Between(-10, 10); // Random x deviation between -10 and 10
            const yDeviation = Phaser.Math.Between(-10, -30); // Random y deviation between -10 and -30

            let color = "#FFFFFF";
            let fontSize = "8px";
            if (amount < 50) {
                color = "#FFFFFF"; // White
                fontSize = "8px";
            } else if (amount < 100) {
                color = "#FF0000"; // Red
                fontSize = "10px";
            } else {
                color = "#FFD700"; // Gold
                fontSize = "12px";
            }

            const damageText = this.scene.add
                .text(this.x + xDeviation, this.y - 10, `${amount}`, {
                    fontFamily: "Arial",
                    fontSize: fontSize,
                    color: color,
                    stroke: "#000000",
                    strokeThickness: 2,
                })
                .setOrigin(0.5)
                .setDepth(40);

            // Apply upward floating animation with random deviation
            this.scene.tweens.add({
                targets: damageText,
                x: damageText.x + xDeviation,
                y: damageText.y + yDeviation,
                alpha: 0,
                duration: 1000,
                onComplete: () => {
                    damageText.destroy();
                },
            });
        }
    }

    applyKnockback(weapon: MeleeWeapon | RangedWeapon) {
        const knockbackPower = 1500;
        const angle = Phaser.Math.Angle.Between(
            weapon.x,
            weapon.y,
            this.x,
            this.y,
        );
        const knockbackVelocity = this.scene.physics.velocityFromRotation(
            angle,
            knockbackPower,
        );

        this.setVelocity(knockbackVelocity.x, knockbackVelocity.y);

        // Optionally, reset velocity after a short delay
        this.scene.time.delayedCall(200, () => {
            this.setVelocity(0, 0);
        });
    }

    setIFrame(duration: number) {
        this.isInIFrame = true;
        this.scene.time.delayedCall(duration, () => {
            this.isInIFrame = false;
        });
    }

    alive(spawnX: number, spawnY: number) {
        this.setPosition(spawnX, spawnY);
        this.setActive(true);
        this.setVisible(true);
        this.enableBody();
    }

    die(isDeSpawn: boolean = false) {
        if (!isDeSpawn) {
            Game.player.killCount += 1;
            dropItem(this);
        }

        this.chaseSpeed = 0;
        this.disableBody(true, false); // Disable physics but keep the object visible for the animation

        this.scene.tweens
            .add({
                targets: this,
                alpha: { from: 1, to: 0 },
                ease: "Power1",
                duration: 1000,
                onComplete: () => {
                    this.setActive(false);
                    this.setVisible(false);
                    this.disableBody(true, true);
                    this.setAlpha(1);
                },
            })
            .play();
    }

    checkDistanceToPlayer(player: Player) {
        const deSpawnDistance: number = this.scene.cameras.main.width * 4;
        if (player) {
            const distance = Phaser.Math.Distance.Between(
                this.x,
                this.y,
                player.x,
                player.y,
            );
            if (distance > deSpawnDistance) {
                this.die(true);
            }
        }
    }

    freeze() {
        this.chaseSpeed = 0;
    }

    unfreeze() {
        this.chaseSpeed = this.originalChaseSpeed;
    }

    update(player: Player) {
        if (this.active) {
            this.scene.physics.moveToObject(this, player, this.chaseSpeed);
            this.checkDistanceToPlayer(player);

            if (!Game.player.isTimeStopped) {
                const direction = player.x - this.x;
                if (direction > 0) {
                    this.anims.play(`${this.animsKey}-walk-right`, true);
                } else {
                    this.anims.play(`${this.animsKey}-walk-left`, true);
                }

                // Player X Zombie
                if (this.scene.physics.collide(this, player)) {
                    player.receiveDamage(this.attackPower, this);
                }
            }

            // Melee X Zombie
            if (
                this.scene.physics.overlap(this, player.inventory.meleeWeapon)
            ) {
                console.log(this.currentHealth);
                this.receiveDamage(
                    player.currentAttackPower,
                    player.inventory.meleeWeapon,
                );
                if (this.currentHealth <= 0) {
                    this.die();
                    const zombieDeath = this.scene.sound.add("zombieDeath");
                    zombieDeath.play();
                }
            }
        }
    }
}

