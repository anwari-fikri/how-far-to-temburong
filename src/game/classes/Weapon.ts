export default class Weapon extends Phaser.Physics.Arcade.Sprite {
    private isMelee: boolean;

    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        texture: string,
        isMelee: boolean,
    ) {
        super(scene, x, y, texture);
        this.setScale(0.5);
        this.setOrigin(0.5, 0.5);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.isMelee = isMelee;
    }

    public getIsMelee(): boolean {
        return this.isMelee;
    }

    public fireProjectile(
        scene: Phaser.Scene,
        targetX: number,
        targetY: number,
    ): Phaser.Physics.Arcade.Sprite | null {
        // Create a new projectile sprite
        const projectile = scene.physics.add.sprite(
            this.x,
            this.y,
            "projectileTexture",
        );

        // Set projectile properties
        projectile.setDepth(1); // Adjust depth as needed

        // Calculate direction vector
        const directionX = targetX - this.x;
        const directionY = targetY - this.y;

        // Calculate distance to normalize the direction vector
        const distance = Phaser.Math.Distance.Between(
            this.x,
            this.y,
            targetX,
            targetY,
        );

        // Define the speed of the projectile
        const speed = 600; // Adjust this value to increase or decrease speed

        // Normalize the direction vector and scale by speed
        const velocityX = (directionX / distance) * speed;
        const velocityY = (directionY / distance) * speed;

        // Set the velocity of the projectile
        projectile.setVelocity(velocityX, velocityY);

        // Store target position in projectile's data
        projectile.setData("targetX", targetX);
        projectile.setData("targetY", targetY);

        // Optionally, add collision logic or other behavior

        return projectile;
    }
}
