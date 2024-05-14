export default class Enemy extends Phaser.Physics.Arcade.Sprite {
    private health: number;

    constructor(
        scene: Phaser.Scene,
        xPos: number,
        yPos: number,
        texture: string,
        health: number,
    ) {
        super(scene, xPos, yPos, texture);
        this.health = health;

        scene.add.existing(this);
        scene.physics.add.existing(this);
    }

    update() {}

    chase(player: Phaser.Physics.Arcade.Sprite) {
        this.scene.physics.moveToObject(this, player, 100);
    }
}
