export default class Enemy extends Phaser.Physics.Arcade.Sprite {
    private player: Phaser.Physics.Arcade.Sprite;

    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        texture: string,
        player: Phaser.Physics.Arcade.Sprite,
    ) {
        super(scene, x, y, texture);
        this.player = player;
        scene.add.existing(this);
        scene.physics.add.existing(this);
    }

    update() {
        this.enemyFollows();
    }

    private enemyFollows() {
        // Move the enemy towards the player
        this.scene.physics.moveToObject(this, this.player, 100);
    }
}
