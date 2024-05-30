import { Scene } from "phaser";

export const WEAPON_TYPE = {
    DAGGER: {
        name: "dagger",
        texture: "dagger",
        meleeRange: "short",
        isMelee: true,
    },
    SWORD: {
        name: "sword",
        texture: "sword",
        meleeRange: "medium",
        isMelee: true,
    },
    SPEAR: {
        name: "spear",
        texture: "spear",
        meleeRange: "long",
        isMelee: true,
    },
} as const;

type WEAPON_TYPE = (typeof WEAPON_TYPE)[keyof typeof WEAPON_TYPE];

export default class Weapon extends Phaser.Physics.Arcade.Sprite {
    isMelee: boolean;
    meleeRange: string;
    weaponType: WEAPON_TYPE;

    constructor(scene: Scene, x: number, y: number, weaponType: WEAPON_TYPE) {
        super(scene, x, y, weaponType.texture);
        this.setScale(0.5);
        this.setOrigin(0.5, 0.5);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setActive(false);
        this.setVisible(false);
        this.disableBody(true, true);

        this.isMelee = weaponType.isMelee;
        this.meleeRange = weaponType.meleeRange;
        this.weaponType = weaponType;
    }

    getMeleeRange(): string {
        return this.meleeRange;
    }

    getIsMelee(): boolean {
        return this.isMelee;
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
}
