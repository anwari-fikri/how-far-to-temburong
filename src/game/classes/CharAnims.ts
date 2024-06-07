export function playerAnims(scene: Phaser.Scene) {
    const player = "soldier";

    if (!scene.anims.exists("left")) {
        scene.anims.create({
            key: "left",
            frames: scene.anims.generateFrameNumbers(player, {
                start: 1,
                end: 0,
            }),
            frameRate: 8,
            repeat: 0,
        });
    }

    if (!scene.anims.exists("right")) {
        scene.anims.create({
            key: "right",
            frames: scene.anims.generateFrameNumbers(player, {
                start: 6,
                end: 7,
            }),
            frameRate: 8,
            repeat: 0,
        });
    }

    // ZOMBIE
    if (!scene.anims.exists("walk-right")) {
        scene.anims.create({
            key: "walk-right",
            frames: scene.anims.generateFrameNumbers("zombie", {
                start: 0,
                end: 7,
            }),
            frameRate: 10,
            repeat: 1,
        });
    }

    if (!scene.anims.exists("walk-left")) {
        scene.anims.create({
            key: "walk-left",
            frames: scene.anims.generateFrameNumbers("zombie", {
                start: 8,
                end: 15,
            }),
            frameRate: 10,
            repeat: 1,
        });
    }
}
