export function playerAnims(scene: any) {
    const player = "dude";

    scene.anims.create({
        key: "left",
        frames: scene.anims.generateFrameNumbers(player, {
            start: 3,
            end: 0,
        }),
        frameRate: 10,
        repeat: -1,
    });

    scene.anims.create({
        key: "turn",
        frames: [{ key: player, frame: 4 }],
        frameRate: 20,
    });

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
