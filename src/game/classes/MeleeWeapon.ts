import { Physics, Scene } from "phaser";
import Player from "./Player";

interface WeaponProperties {
    name: string;
    icon: string;
    texture: string;
    attackPower: number;
    attackRange: "short" | "medium" | "long";
    attackCooldown: number; // Milliseconds
    hitbox: { width: number; height: number };
}

export const WEAPON_TYPE: Readonly<{ [key: string]: WeaponProperties }> = {
    SWORD: {
        name: "sword",
        icon: "sword_icon",
        texture: "sword_attack",
        attackPower: 50,
        attackRange: "medium",
        attackCooldown: 400,
        hitbox: { width: 20, height: 25 },
    },
} as const;

export type WEAPON_TYPE = (typeof WEAPON_TYPE)[keyof typeof WEAPON_TYPE];

export default class MeleeWeapon extends Physics.Arcade.Sprite {
    isSelected: boolean = false;
    player: Player;
    weaponType: WEAPON_TYPE;
    attackPower: number;
    attackRange: string;
    attackCooldown: number;
    lastAttackTime: number;
    hitbox: { width: number; height: number };

    constructor(scene: Scene, player: Player, weaponType: WEAPON_TYPE) {
        super(scene, player.x, player.y, weaponType.texture);

        scene.add.existing(this);

        scene.physics.add.existing(this);

        this.player = player;
        this.weaponType = weaponType;
        this.attackPower = this.weaponType.attackPower;
        this.attackRange = weaponType.attackRange;
        this.attackCooldown = weaponType.attackCooldown;
        this.hitbox = weaponType.hitbox;
        this.lastAttackTime = 0;

        this.setActive(false);
        this.setVisible(false);
        this.disableBody(true, true);
        this.setBodySize(this.hitbox.width, this.hitbox.height);
        this.setDepth(21);

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
            frameRate: 32,
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
                    const attackSound = scene.sound.add("mediumAttack");
                    attackSound.play();
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
                        this.player.controls.facing === "right"
                            ? 20
                            : -20 - this.hitbox.width;
                    const centerX = this.width / 2;
                    const centerY = this.height / 2;

                    this.setOffset(
                        centerX + offsetX,
                        centerY - this.hitbox.height + 5,
                    );
                    this.setPosition(this.player.x + 0, this.player.y);
                    this.flipX = this.player.controls.facing === "right";
                }
            } else {
                this.setVisible(true);
                this.setFrame(0);
                this.setPosition(this.player.x, this.player.y);
                this.flipX = this.player.controls.facing === "right";
            }
        } else {
            this.setVisible(false);
        }
    }
}
