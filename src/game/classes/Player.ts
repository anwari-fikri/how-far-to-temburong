import { playerAnims } from "./CharAnims";

const player = "dude";
const velocity = 0;
const playerSpeed = 300;

export function createPlayer(scene: any) {
    scene.player = scene.physics.add.sprite(100, 450, player);

    if (scene.input && scene.input.keyboard) {
        scene.cursors = scene.input.keyboard.createCursorKeys();
    }

    scene.cameras.main.startFollow(scene.player, true);

    playerAnims(scene);

    scene.escKey = scene.input.keyboard?.addKey(
        Phaser.Input.Keyboard.KeyCodes.ESC
    );
}

export function updatePlayer(scene: any) {
    scene.player.setVelocity(velocity);

    if (scene.cursors.left.isDown) {
        scene.player.setVelocityX(-playerSpeed);
        scene.player.anims.play("left", true);
    } else if (scene.cursors.right.isDown) {
        scene.player.setVelocityX(playerSpeed);
        scene.player.anims.play("right", true);
    }

    if (scene.cursors.up.isDown) {
        scene.player.setVelocityY(-playerSpeed);
    } else if (scene.cursors.down.isDown) {
        scene.player.setVelocityY(playerSpeed);
        scene.player.anims.play("turn");
    }
}
