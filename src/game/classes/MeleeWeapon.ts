import { Physics, Scene } from "phaser";
import Player from "./Player";

interface WeaponProperties {
    name: string;
    texture: string;
    attackRange: "short" | "medium" | "long";
    attackCooldown: number; // Milliseconds
}

export const WEAPON_TYPE: Readonly<{ [key: string]: WeaponProperties }> = {
    SWORD: {
        name: "sword",
        texture: "sword_attack",
        attackRange: "medium",
        attackCooldown: 800,
    },
} as const;

type WEAPON_TYPE = (typeof WEAPON_TYPE)[keyof typeof WEAPON_TYPE];

export default class MeleeWeapon extends Physics.Arcade.Sprite {
    isSelected: boolean = false;
    player: Player;
    weaponType: WEAPON_TYPE;
    attackRange: string;
    attackCooldown: number;
    lastAttackTime: number;

    constructor(scene: Scene, player: Player, weaponType: WEAPON_TYPE) {
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
    }

    createAnimations(scene: Scene) {
        scene.anims.create({
            key: "sword-attack",
            frames: scene.anims.generateFrameNumbers(this.weaponType.texture, {
                start: 1,
                end: 6,
            }),
            frameRate: 16,
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
                }
            }
        });
    }

    playAttackAnimation() {
        this.setActive(true);
        this.setVisible(true);
        this.enableBody(true, this.player.x, this.player.y, true, true);

        if (this.weaponType === WEAPON_TYPE.SWORD) {
            this.anims.play("sword-attack", true);
        }

        this.once("animationcomplete", () => {
            this.setActive(false);
            this.setVisible(false);
            this.disableBody(true, true);
            this.player.isAttacking = false;
        });
    }

    update() {
        this.player.inventory.selectedHandSlot === 1
            ? (this.isSelected = true)
            : (this.isSelected = false);

        if (this.isSelected) {
            if (this.player.isAttacking) {
                if (this.active) {
                    const offsetX =
                        this.player.controls.facing === "right" ? 30 : -30;
                    this.setPosition(this.player.x + offsetX, this.player.y);
                    this.flipX = this.player.controls.facing === "right";
                }
            } else {
                this.setVisible(true);
                this.setFrame(0);
                const offsetX =
                    this.player.controls.facing === "right" ? 30 : -30;
                this.setPosition(this.player.x + offsetX, this.player.y);
                this.flipX = this.player.controls.facing === "right";
            }
        } else {
            this.setVisible(false);
        }
    }
}
