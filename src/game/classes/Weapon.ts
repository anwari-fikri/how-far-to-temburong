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
}

