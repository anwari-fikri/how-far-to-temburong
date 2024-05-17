export const HEALTH_ANIMATIONS = {
    LOSE_FIRST_HALF: "LOSE_FIRST_HALF",
    LOSE_SECOND_HALF: "LOSE_SECOND_HALF",
} as const;

export function healthAnims(scene: Phaser.Scene) {
    scene.anims.create({
        key: HEALTH_ANIMATIONS.LOSE_FIRST_HALF,
        frames: scene.anims.generateFrameNumbers("heart", { start: 0, end: 2 }),
        frameRate: 10,
    });

    scene.anims.create({
        key: HEALTH_ANIMATIONS.LOSE_SECOND_HALF,
        frames: scene.anims.generateFrameNumbers("heart", { start: 2, end: 4 }),
        frameRate: 10,
    });
}

