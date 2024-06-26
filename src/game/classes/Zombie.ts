import { Game } from "../scenes/Game";
import MeleeWeapon from "./MeleeWeapon";
import Player from "./Player";
import { Physics, Scene } from "phaser";
import RangedWeapon from "./RangedWeapon";
import { dropItem, dropRandomEncounterTrigger } from "./ItemDrop";

interface ZombieProperties {
    texture: string;
    baseHealth: number;
    attackPower: number;
    chaseSpeed: number;
    tint: number;
    animsKey: string;
    hitboxRadius: number;
    customSize: number;
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
        customSize: 1,
    },
    STRONG: {
        texture: "zombie",
        baseHealth: 200,
        attackPower: 10,
        chaseSpeed: 50,
        tint: 0xfff000,
        animsKey: "zombie",
        hitboxRadius: 10,
        customSize: 1.1,
    },
    MINI_BOSS: {
        texture: "fat_zombie",
        baseHealth: 1000,
        attackPower: 30,
        chaseSpeed: 30,
        tint: 0xffffff,
        animsKey: "fat-zombie",
        hitboxRadius: 12,
        customSize: 1.2,
    },
    SLIME_MINION: {
        texture: "slime_minion",
        baseHealth: 10,
        attackPower: 2,
        chaseSpeed: 35,
        tint: 0xffffff,
        animsKey: "slime-minion",
        hitboxRadius: 16,
        customSize: 0.5,
    },
    SLIME_BOSS: {
        texture: "slime_boss",
        baseHealth: 2500,
        attackPower: 30,
        chaseSpeed: 20,
        tint: 0xffffff,
        animsKey: "slime-boss",
        hitboxRadius: 16,
        customSize: 1.5,
    },
    MONKE_MINION: {
        texture: "monke_minion",
        baseHealth: 10,
        attackPower: 3,
        chaseSpeed: 45,
        tint: 0xffffff,
        animsKey: "monke-minion",
        hitboxRadius: 8,
        customSize: 1,
    },
    MONKE_BOSS: {
        texture: "monke_boss",
        baseHealth: 3000,
        attackPower: 35,
        chaseSpeed: 35,
        tint: 0xffffff,
        animsKey: "monke-boss",
        hitboxRadius: 16,
        customSize: 1,
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
    customSize: number;
    zombieType: ZombieType;

    isInIFrame: boolean = false;

    // From weapon skill
    isSlowed: boolean = false;
    isConfused: boolean = false;
    isOnFire: boolean = false;
    fireBonusInterval: number | NodeJS.Timeout | null;
    isFrozen: boolean = false;

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
        let spawnSide: number;

        if (
            zombieType !== ZOMBIE_TYPE.MONKE_BOSS &&
            zombieType !== ZOMBIE_TYPE.SLIME_BOSS
        ) {
            const weightedRandom = Phaser.Math.Between(0, 99);

            if (weightedRandom < 10) {
                spawnSide = 0; // 10% chance
            } else if (weightedRandom < 20) {
                spawnSide = 1; // 10% chance
            } else if (weightedRandom < 60) {
                spawnSide = 2; // 40% chance
            } else {
                spawnSide = 3; // 40% chance
            }
        } else {
            // Default spawn side if zombieType is a boss (can be adjusted as needed)
            spawnSide = 2; // Example default, spawning on the right top side
        }

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
        this.customSize = zombieType.customSize;
        this.zombieType = zombieType;

        // Weapon Skill
        this.isSlowed = false;
        this.isConfused = false;
        this.isOnFire = false;
        this.fireBonusInterval = null;
        this.isFrozen = false;

        this.setOrigin(0.5, 0.5);
        var radius = this.hitboxRadius;
        if (this.zombieType === ZOMBIE_TYPE.SLIME_BOSS) {
            this.setBodySize(70, 35);
            this.setOffset(15, 30);
        } else if (this.zombieType === ZOMBIE_TYPE.MONKE_BOSS) {
            this.setBodySize(55, 65);
            this.setOffset(20, 15);
        } else if (this.zombieType === ZOMBIE_TYPE.SLIME_MINION) {
            this.setCircle(
                radius,
                -radius + 0.5 * this.width,
                -radius + 0.8 * this.height,
            );
        } else {
            this.setCircle(
                radius,
                -radius + 0.5 * this.width,
                -radius + 0.5 * this.height,
            );
        }

        this.setScale(this.customSize, this.customSize);
        this.setTint(this.originalTint);

        switch (zombieType) {
            case ZOMBIE_TYPE.NORMAL:
                this.setTexture(ZOMBIE_TYPE.NORMAL.texture);
                break;
            case ZOMBIE_TYPE.STRONG:
                this.setTint(ZOMBIE_TYPE.STRONG.tint);
                break;
            case ZOMBIE_TYPE.MINI_BOSS:
                this.setTint(ZOMBIE_TYPE.MINI_BOSS.tint);
                break;
        }
        this.alive(spawnX, spawnY);
    }

    receiveDamage(amount: number, weapon?: MeleeWeapon | RangedWeapon) {
        amount = Math.round(amount);

        const randomChance = Math.random();

        if (!this.isInIFrame) {
            if (
                randomChance <=
                Game.player.weaponSkill.critChance.bonus / 100
            ) {
                amount = amount * 2;

                Game.gameUI.createFloatingText(
                    this.x,
                    this.y,
                    "CRIT",
                    "#d4af37",
                    "8px",
                    true,
                );
            }
            const weaponSkillSlow = Game.player.weaponSkill.slow;
            if (!this.isSlowed) {
                if (weaponSkillSlow.level > 0) {
                    this.isSlowed = true;

                    Game.gameUI.createFloatingText(
                        this.x,
                        this.y,
                        "slowed",
                        "#00FFFF",
                    );
                }
            }

            const weaponSkillConfuse = Game.player.weaponSkill.confuse;
            if (!this.isConfused) {
                if (weaponSkillConfuse.level > 0) {
                    const randomChance = Math.random();

                    if (randomChance <= weaponSkillConfuse.bonus / 100) {
                        this.isConfused = true;

                        setTimeout(() => {
                            this.isConfused = false;
                        }, 800); // 0.8 seconds

                        Game.gameUI.createFloatingText(
                            this.x,
                            this.y,
                            "confused",
                            "#FFFF00",
                        );
                    }
                }
            }

            const weaponSkillFreeze = Game.player.weaponSkill.freeze;
            if (!this.isFrozen) {
                if (weaponSkillFreeze.level > 0) {
                    const randomChance = Math.random();

                    if (randomChance <= weaponSkillFreeze.bonus / 100) {
                        this.isFrozen = true;

                        setTimeout(() => {
                            this.isFrozen = false;
                        }, 2000); // 1 second

                        Game.gameUI.createFloatingText(
                            this.x,
                            this.y,
                            "frozen",
                            "#ADD8E6",
                        );
                    }
                }
            }

            const weaponSkillFire = Game.player.weaponSkill.fire;
            if (!this.isOnFire) {
                if (weaponSkillFire.level > 0) {
                    this.isOnFire = true;

                    Game.gameUI.createFloatingText(
                        this.x,
                        this.y,
                        "burn",
                        "#FFBF00",
                        "8px",
                        true,
                    );
                }
            }

            if (weapon && !Game.player.isTimeStopped) {
                if (
                    this.zombieType !== ZOMBIE_TYPE.MONKE_BOSS &&
                    this.zombieType !== ZOMBIE_TYPE.SLIME_BOSS
                ) {
                    this.applyKnockback(weapon);
                }
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

            let color = "#FFFFFF";
            let fontSize = "8px";
            if (amount < 50) {
                color = "#FFFFFF"; // White
                fontSize = "8px";
            } else if (amount < 100) {
                color = "#7c3f00"; // Brown
                fontSize = "10px";
            } else {
                color = "#FFD700"; // Gold
                fontSize = "12px";
            }

            Game.gameUI.createFloatingText(
                this.x,
                this.y,
                String(amount),
                color,
                fontSize,
            );
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
        this.clearFireBonusInterval();
        if (!isDeSpawn) {
            if (
                this.zombieType !== ZOMBIE_TYPE.SLIME_MINION &&
                this.zombieType !== ZOMBIE_TYPE.MONKE_MINION
            ) {
                Game.player.killCount += 1;
            }
        }

        this.zombieType === ZOMBIE_TYPE.MINI_BOSS
            ? dropRandomEncounterTrigger(this)
            : dropItem(this, 15);

        this.chaseSpeed = 0;
        this.disableBody(true, false); // Disable physics but keep the object visible for the animation

        this.scene.tweens
            .add({
                targets: this,
                alpha: { from: 1, to: 0 },
                ease: "Power1",
                duration: 1000,
                onComplete: () => {
                    // this.setActive(false);
                    // this.setVisible(false);
                    // this.disableBody(true, true);
                    this.setAlpha(1);
                    this.destroy();
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

    startFireDamage() {
        this.fireBonusInterval = setInterval(() => {
            this.applyFireDamage();
        }, 250);
    }

    applyFireDamage() {
        const fireBonus = Game.player.weaponSkill.fire.bonus / 4;
        Game.gameUI.createFloatingText(
            this.x,
            this.y,
            String(Math.floor(fireBonus)),
            "#FFBF00",
        );
        this.currentHealth -= fireBonus;
        if (this.currentHealth <= 0) {
            this.isOnFire = false;
            this.clearFireBonusInterval();
            this.die();
            Game.soundManager.zombieDeathSound.play();
        }
    }

    clearFireBonusInterval() {
        if (this.fireBonusInterval !== null) {
            clearInterval(this.fireBonusInterval as number);
            this.fireBonusInterval = null;
        }
    }

    fallingSlime(
        this: any,
        startX: number,
        startY: number,
        targetX: number,
        targetY: number,
        duration: number,
    ) {
        this.falling = this.physics.add.sprite(
            startX,
            startY,
            "objectImageS",
            2,
        );
        this.falling.body.setImmovable(true);
        this.falling.setDepth(20);

        this.tweens.add({
            targets: this.falling,
            y: targetY,
            x: targetX,
            duration: duration,
            ease: "Linear",
            onComplete: () => {
                this.falling.setTexture("objectImageS", 1);
            },
        });
        this.physics.add.collider(Game.player, this.falling);
    }

    update(player: Player) {
        if (this.active) {
            if (this.isSlowed && !Game.player.isTimeStopped) {
                const slowBonus = Game.player.weaponSkill.slow.bonus / 100;
                this.chaseSpeed = this.originalChaseSpeed * (1 - slowBonus);
            }
            if (this.isOnFire && this.fireBonusInterval === null) {
                this.startFireDamage();
            } else if (!this.isOnFire) {
                this.clearFireBonusInterval();
            }

            this.scene.physics.moveToObject(
                this,
                player,
                this.isConfused ? -this.chaseSpeed : this.chaseSpeed,
            );
            this.checkDistanceToPlayer(player);

            if (!Game.player.isTimeStopped) {
                this.isFrozen ? this.freeze() : this.unfreeze();
                if (!this.isFrozen) {
                    const direction = player.x - this.x;
                    if (this.isConfused ? direction < 0 : direction > 0) {
                        this.anims.play(`${this.animsKey}-walk-right`, true);
                    } else {
                        this.anims.play(`${this.animsKey}-walk-left`, true);
                    }

                    // Player X Zombie
                    if (this.scene.physics.collide(this, player)) {
                        player.receiveDamage(this.attackPower, this);
                    }
                }
            }

            // Melee X Zombie
            if (
                this.scene.physics.overlap(
                    this,
                    Game.player.inventory.meleeWeapon,
                )
            ) {
                Game.player.emit("weaponSkillLevelUp");
                const randomValue = 0.95 + Math.random() * 0.05;
                this.receiveDamage(
                    (Game.player.inventory.meleeWeapon.attackPower +
                        Game.player.bonusAttackPower) *
                        randomValue,
                    Game.player.inventory.meleeWeapon,
                );

                if (this.currentHealth <= 0) {
                    this.die();

                    if (this.zombieType === ZOMBIE_TYPE.SLIME_BOSS) {
                        Game.soundManager.slimebossDeathSound.play();
                    } else if (this.zombieType === ZOMBIE_TYPE.SLIME_MINION) {
                        Game.soundManager.minislimeDeathSound.play();
                    } else if (this.zombieType === ZOMBIE_TYPE.MONKE_BOSS) {
                        Game.soundManager.monkeybossDeathSound.play();
                    } else if (this.zombieType === ZOMBIE_TYPE.MONKE_MINION) {
                        Game.soundManager.minimonkeyDeathSound.play();
                    } else {
                        Game.soundManager.zombieDeathSound.play();
                    }
                }
            }
        }
    }
}

