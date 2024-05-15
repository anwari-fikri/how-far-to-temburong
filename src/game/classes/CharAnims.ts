export function playerAnims(scene: Phaser.Scene) {
    const player = "dude";

    // Check if the animation already exists before creating it
    if (!scene.anims.exists("left")) {
        scene.anims.create({
            key: "left",
            frames: scene.anims.generateFrameNumbers(player, {
                start: 3,
                end: 0,
            }),
            frameRate: 10,
            repeat: -1,
        });
    }

    // Check if the animation already exists before creating it
    if (!scene.anims.exists("turn")) {
        scene.anims.create({
            key: "turn",
            frames: [{ key: player, frame: 4 }],
            frameRate: 20,
        });
    }

    // Check if the animation already exists before creating it
    if (!scene.anims.exists("right")) {
        scene.anims.create({
            key: "right",
            frames: scene.anims.generateFrameNumbers(player, {
                start: 5,
                end: 8,
            }),
            frameRate: 10,
            repeat: -1,
        });
    }
}
