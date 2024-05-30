import { Physics, Scene } from "phaser";
import Player from "./Player";

interface WeaponProperties {
    name: string;
    texture: string;
    isMelee: boolean;
    meleeRange: "short" | "medium" | "long";
}

export const WEAPON_TYPE: Readonly<{ [key: string]: WeaponProperties }> = {
    // DAGGER: {
    //     name: "dagger",
    //     texture: "dagger",
    //     isMelee: true,
    //     meleeRange: "short",
    // },
    SWORD: {
        name: "sword",
        texture: "sword",
        isMelee: true,
        meleeRange: "medium",
    },
    // SPEAR: {
    //     name: "spear",
    //     texture: "spear",
    //     isMelee: true,
    //     meleeRange: "long",
    // },
} as const;

type WEAPON_TYPE = (typeof WEAPON_TYPE)[keyof typeof WEAPON_TYPE];

export default class Weapon extends Physics.Arcade.Sprite {
    isMelee: boolean;
    meleeRange: string;
    weaponType: WEAPON_TYPE;
    player: Player;
    facingLeft: boolean;

    constructor(scene: Scene, player: Player, weaponType: WEAPON_TYPE) {
        super(scene, player.x, player.y, weaponType.texture);

        scene.add.existing(this);
        scene.physics.add.existing(this);
        // this.setScale(0.5);
        // this.setOrigin(0.5, 0.5);

        this.isMelee = weaponType.isMelee;
        this.meleeRange = weaponType.meleeRange;
        this.weaponType = weaponType;
        this.player = player;
        this.facingLeft = true;

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
                start: 15,
                end: 17,
            }),
            frameRate: 10,
            repeat: 0,
        });
    }

    setupInput(scene: Scene) {
        scene.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
            if (pointer.leftButtonDown()) {
                this.toggleDirection();
                this.playAttackAnimation();
            }
        });
    }

    toggleDirection() {
        this.facingLeft = !this.facingLeft;
        this.flipX = this.facingLeft; // Flip the weapon sprite based on the facing direction
    }

    playAttackAnimation() {
        this.setActive(true);
        this.setVisible(true);
        this.enableBody(true, this.player.x, this.player.y, true, true);

        this.anims.play("sword-attack", true);

        this.once("animationcomplete", () => {
            this.setActive(false);
            this.setVisible(false);
            this.disableBody(true, true);
        });
    }

    update() {
        if (this.active) {
            const offsetX = this.facingLeft ? -30 : 30; // Adjust the offset value as needed
            this.setPosition(this.player.x + offsetX, this.player.y);
        }
        this.flipX;
    }
}

// public fireProjectile(
//     scene: Phaser.Scene,
//     targetX: number,
//     targetY: number,
// ): Phaser.Physics.Arcade.Sprite | null {
//     // Create a new projectile sprite
//     const projectile = scene.physics.add.sprite(
//         this.x,
//         this.y,
//         "projectileTexture",
//     );

//     // Set projectile properties
//     projectile.setDepth(1); // Adjust depth as needed

//     // Calculate direction vector
//     const directionX = targetX - this.x;
//     const directionY = targetY - this.y;

//     // Calculate distance to normalize the direction vector
//     const distance = Phaser.Math.Distance.Between(
//         this.x,
//         this.y,
//         targetX,
//         targetY,
//     );

//     // Define the speed of the projectile
//     const speed = 600; // Adjust this value to increase or decrease speed

//     // Normalize the direction vector and scale by speed
//     const velocityX = (directionX / distance) * speed;
//     const velocityY = (directionY / distance) * speed;

//     // Set the velocity of the projectile
//     projectile.setVelocity(velocityX, velocityY);

//     // Store target position in projectile's data
//     projectile.setData("targetX", targetX);
//     projectile.setData("targetY", targetY);

//     // Optionally, add collision logic or other behavior

//     return projectile;
// }

