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

    // if (!scene.anims.exists("turn")) {
    //     scene.anims.create({
    //         key: "turn",
    //         frames: [{ key: player, frame: 4 }],
    //         frameRate: 20,
    //     });
    // }

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
}
