export function playerAnims(scene: Phaser.Scene) {
    const player = "soldier";

    if (!scene.anims.exists("left")) {
        scene.anims.create({
            key: "left",
            frames: scene.anims.generateFrameNumbers(player, {
                start: 1,
                end: 0,
            }),
            frameRate: 3,
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
            frameRate: 3,
            repeat: 0,
        });
    }

    // ZOMBIE
    if (!scene.anims.exists("zombie-walk-right")) {
        scene.anims.create({
            key: "zombie-walk-right",
            frames: scene.anims.generateFrameNumbers("zombie", {
                start: 0,
                end: 7,
            }),
            frameRate: 10,
            repeat: 1,
        });
    }

    if (!scene.anims.exists("zombie-walk-left")) {
        scene.anims.create({
            key: "zombie-walk-left",
            frames: scene.anims.generateFrameNumbers("zombie", {
                start: 8,
                end: 15,
            }),
            frameRate: 10,
            repeat: 1,
        });
    }

    // FAT ZOMBIE
    if (!scene.anims.exists("fat-zombie-walk-right")) {
        scene.anims.create({
            key: "fat-zombie-walk-right",
            frames: scene.anims.generateFrameNumbers("fat_zombie", {
                start: 0,
                end: 3,
            }),
            frameRate: 4,
            repeat: 1,
        });
    }

    if (!scene.anims.exists("fat-zombie-walk-left")) {
        scene.anims.create({
            key: "fat-zombie-walk-left",
            frames: scene.anims.generateFrameNumbers("fat_zombie", {
                start: 4,
                end: 7,
            }),
            frameRate: 4,
            repeat: 1,
        });
    }

    // SLIME BOSS
    if (!scene.anims.exists("slime-boss-walk-right")) {
        scene.anims.create({
            key: "slime-boss-walk-right",
            frames: scene.anims.generateFrameNumbers("slime_boss", {
                start: 11,
                end: 7,
            }),
            frameRate: 7,
            repeat: 1,
        });
    }

    if (!scene.anims.exists("slime-boss-walk-left")) {
        scene.anims.create({
            key: "slime-boss-walk-left",
            frames: scene.anims.generateFrameNumbers("slime_boss", {
                start: 6,
                end: 0,
            }),
            frameRate: 7,
            repeat: 1,
        });
    }

    // MONKE BOSS
    if (!scene.anims.exists("monke-boss-walk-right")) {
        scene.anims.create({
            key: "monke-boss-walk-right",
            frames: scene.anims.generateFrameNumbers("monke_boss", {
                start: 4,
                end: 7,
            }),
            frameRate: 4,
            repeat: 1,
        });
    }

    if (!scene.anims.exists("monke-boss-walk-left")) {
        scene.anims.create({
            key: "monke-boss-walk-left",
            frames: scene.anims.generateFrameNumbers("monke_boss", {
                start: 3,
                end: 0,
            }),
            frameRate: 4,
            repeat: 1,
        });
    }

    // SLIME MINION
    if (!scene.anims.exists("slime-minion-walk-right")) {
        scene.anims.create({
            key: "slime-minion-walk-right",
            frames: scene.anims.generateFrameNumbers("slime_minion", {
                start: 11,
                end: 7,
            }),
            frameRate: 7,
            repeat: 1,
        });
    }

    if (!scene.anims.exists("slime-minion-walk-left")) {
        scene.anims.create({
            key: "slime-minion-walk-left",
            frames: scene.anims.generateFrameNumbers("slime_minion", {
                start: 6,
                end: 0,
            }),
            frameRate: 7,
            repeat: 1,
        });
    }

    // MONKE MINION
    if (!scene.anims.exists("monke-minion-walk-right")) {
        scene.anims.create({
            key: "monke-minion-walk-right",
            frames: scene.anims.generateFrameNumbers("monke_minion", {
                start: 0,
                end: 7,
            }),
            frameRate: 8,
            repeat: 1,
        });
    }

    if (!scene.anims.exists("monke-minion-walk-left")) {
        scene.anims.create({
            key: "monke-minion-walk-left",
            frames: scene.anims.generateFrameNumbers("monke_minion", {
                start: 8,
                end: 15,
            }),
            frameRate: 8,
            repeat: 1,
        });
    }
}
