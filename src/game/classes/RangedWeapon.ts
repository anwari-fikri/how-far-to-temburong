import { Physics, Scene } from "phaser";
import Player from "./Player";
import Bullet from "./Bullet";
import { WeaponSkill } from "./WeaponSkill";
import { Game } from "../scenes/Game";

interface WeaponProperties {
    name: string;
    icon: string;
    texture: string;
    attackPower: number;
    attackRange: "short" | "medium" | "long";
    attackCooldown: number; // Milliseconds
    bulletSpeed: number;
}

export const RANGED_WEAPON_TYPE: Readonly<{ [key: string]: WeaponProperties }> =
    {
        PISTOL: {
            name: "pistol",
            icon: "pistol_icon",
            texture: "pistol",
            attackPower: 20,
            attackRange: "medium",
            attackCooldown: 150,
            bulletSpeed: 600,
        },
    } as const;

export type RANGED_WEAPON_TYPE =
    (typeof RANGED_WEAPON_TYPE)[keyof typeof RANGED_WEAPON_TYPE];

export default class RangedWeapon extends Physics.Arcade.Sprite {
    isSelected: boolean = false;
    player: Player;
    weaponType: RANGED_WEAPON_TYPE;
    attackPower: number;
    attackRange: string;
    attackCooldown: number;
    lastAttackTime: number;
    bullets: Phaser.Physics.Arcade.Group;
    weaponSkill: WeaponSkill;

    constructor(scene: Scene, player: Player, weaponType: RANGED_WEAPON_TYPE) {
        super(scene, player.x, player.y, weaponType.texture);

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.weaponSkill = new WeaponSkill();

        this.player = player;
        this.weaponType = weaponType;
        this.attackPower =
            this.weaponType.attackPower + this.weaponSkill.atk.bonus;
        this.attackRange = weaponType.attackRange;
        this.attackCooldown = weaponType.attackCooldown;
        this.lastAttackTime = 0;

        this.setActive(false);
        this.setVisible(false);
        this.disableBody(true, true);
        this.setDepth(21);

        this.createAnimations(scene);
        this.setupInput(scene);

        // Create a bullet group with Bullet class
        this.bullets = scene.physics.add.group({
            classType: Bullet,
            maxSize: 100,
            runChildUpdate: true,
        });
    }

    updateWeaponSkill() {
        const check = () => {
            this.attackPower =
                this.weaponType.attackPower + this.weaponSkill.atk.bonus;
        };
        Game.player.on("weaponSkillLevelUp", check);
    }

    createAnimations(scene: Scene) {
        scene.anims.create({
            key: "pistol-attack",
            frames: scene.anims.generateFrameNames(this.weaponType.texture, {
                start: 0,
                end: 0,
            }),
            frameRate: 20,
            repeat: 0,
        });
    }

    setupInput(scene: Scene) {
        scene.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
            if (pointer.leftButtonDown() && this.isSelected) {
                const currentTime = scene.time.now;
                if (currentTime - this.lastAttackTime >= this.attackCooldown) {
                    this.lastAttackTime = currentTime;
                    this.player.isAttacking = true;
                    this.playAttackAnimation();
                    const attackSound = scene.sound.add("gunAttack");
                    attackSound.play({ volume: 0.3 });
                }
            }
        });
    }

    playAttackAnimation() {
        this.setActive(true);
        this.setVisible(true);

        if (this.weaponType === RANGED_WEAPON_TYPE.PISTOL) {
            this.anims.play("pistol-attack", true);
            this.fireBullet();
        }

        this.once("animationcomplete", () => {
            this.setActive(false);
            this.setVisible(false);
            this.disableBody(true, true);
            this.player.isAttacking = false;
        });
    }

    fireBullet() {
        const bullet = this.bullets.get() as Bullet;

        if (bullet) {
            bullet.fire(this.player);
        }
        return bullet;
    }

    update() {
        this.player.inventory.selectedHandSlot === 2
            ? (this.isSelected = true)
            : (this.isSelected = false);

        if (this.isSelected) {
            this.setVisible(true);
            this.setFrame(0);
            this.setPosition(this.player.x, this.player.y);
            this.flipX = this.player.controls.facing === "right";

            if (this.active) {
                // Update bullets
                this.bullets.children.iterate(
                    (bullet: Phaser.GameObjects.GameObject) => {
                        if (bullet instanceof Bullet) {
                            bullet.update(this.player);
                        }
                        return true;
                    },
                );
            }
        } else {
            this.setVisible(false);
        }
    }
}

