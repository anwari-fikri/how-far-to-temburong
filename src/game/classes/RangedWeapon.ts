import { Physics, Scene } from "phaser";
import Player from "./Player";
import Bullet from "./Bullet";

interface WeaponProperties {
    name: string;
    texture: string;
    attackRange: "short" | "medium" | "long";
    attackCooldown: number; // Milliseconds
}

export const RANGED_WEAPON_TYPE: Readonly<{ [key: string]: WeaponProperties }> =
    {
        GUN: {
            name: "gun",
            texture: "guns_sheet",
            attackRange: "medium",
            attackCooldown: 100,
        },
    } as const;

type RANGED_WEAPON_TYPE =
    (typeof RANGED_WEAPON_TYPE)[keyof typeof RANGED_WEAPON_TYPE];

export default class RangedWeapon extends Physics.Arcade.Sprite {
    isSelected: boolean = false;
    player: Player;
    weaponType: RANGED_WEAPON_TYPE;
    attackRange: string;
    attackCooldown: number;
    lastAttackTime: number;
    bullets: Phaser.Physics.Arcade.Group;

    constructor(scene: Scene, player: Player, weaponType: RANGED_WEAPON_TYPE) {
        super(scene, player.x, player.y, weaponType.texture);

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.player = player;
        this.weaponType = weaponType;
        this.attackRange = weaponType.attackRange;
        this.attackCooldown = weaponType.attackCooldown;
        this.lastAttackTime = 0;

        this.setActive(false);
        this.setVisible(false);
        this.disableBody(true, true);
        this.setBodySize(50, 50);

        this.createAnimations(scene);
        this.setupInput(scene);

        // Create a bullet group with Bullet class
        this.bullets = scene.physics.add.group({
            classType: Bullet,
            maxSize: 100,
            runChildUpdate: true,
        });
    }

    createAnimations(scene: Scene) {
        scene.anims.create({
            key: "gun-attack",
            frames: scene.anims.generateFrameNames(this.weaponType.texture, {
                start: 0,
                end: 0,
            }),
            frameRate: 10,
            repeat: 3,
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
                    attackSound.play();
                }
            }
        });
    }

    playAttackAnimation() {
        this.setActive(true);
        this.setVisible(true);

        if (this.weaponType === RANGED_WEAPON_TYPE.GUN) {
            this.anims.play("gun-attack", true);
            this.fireBullet();
        }

        this.once("animationcomplete", () => {
            this.setActive(false);
            this.setVisible(false);
            this.player.isAttacking = false;
        });
    }

    fireBullet() {
        const bullet = this.bullets.get() as Bullet;

        if (bullet) {
            bullet.fire(this.player);
        }
    }

    update() {
        this.player.inventory.selectedHandSlot === 2
            ? (this.isSelected = true)
            : (this.isSelected = false);

        if (this.isSelected) {
            if (this.active) {
                const offsetX =
                    this.player.controls.facing === "left" ? -30 : 30;
                this.setPosition(this.player.x + offsetX, this.player.y);
                this.flipX = this.player.controls.facing === "left";

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
        }
    }
}

