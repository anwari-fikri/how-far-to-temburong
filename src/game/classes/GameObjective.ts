import { Game } from "../scenes/Game";
import { CheckpointAndChapters } from "../scenes/CheckpointAndChapters";
import { objectiveComplete } from "../scenes/Objectives";

export function objectiveUI(scene: any) {
    scene.distanceComplete = false;
    scene.killComplete = false;
    scene.highestX = 0;

    scene.distanceObjective = 0;
    scene.killObjective = 0;

    switch (Game.gameStage) {
        case 1:
            scene.distanceObjective = 500;
            scene.killObjective = 10;
            break;
        case 2:
            if (Game.bossStage) {
                scene.distanceObjective = 1;
                scene.killObjective = 1;
            } else {
                scene.distanceObjective = 700;
                scene.killObjective = 20;
            }
            break;
        case 3:
            scene.distanceObjective = 1;
            scene.killObjective = 1;
            break;
        case 4:
            if (Game.gameStage) {
                scene.distanceObjective = 1;
                scene.killObjective = 1;
            } else {
                scene.distanceObjective = 800;
                scene.killObjective = 40;
            }
            break;

        default:
            scene.distanceObjective = 1;
            scene.killObjective = 2;
            break;
    }

    if (!Game.bossStage) {
        scene.distanceText = scene.add
            .text(10, 60, "Distance: 0m / " + scene.distanceObjective + "m", {
                fontSize: "12px",
                color: "#000000",
                fontFamily: "Press Start 2P",
            })
            .setOrigin(0, 0)
            .setScrollFactor(0)
            .setDepth(100);
        scene.killText = scene.add
            .text(10, 74, "Kills: 0 / " + scene.killObjective, {
                fontSize: "12px",
                color: "#000000",
                fontFamily: "Press Start 2P",
            })
            .setOrigin(0, 0)
            .setScrollFactor(0)
            .setDepth(100);
    } else {
        scene.killText = scene.add
            .text(10, 74, "Kill the boss", {
                fontSize: "12px",
                color: "#000000",
                fontFamily: "Press Start 2P",
            })
            .setOrigin(0, 0)
            .setScrollFactor(0)
            .setDepth(100);
    }
}

export function stageObjective(scene: any) {
    if (!Game.bossStage) {
        // distance count
        scene.distanceText.setText(
            "Distance: " +
                scene.highestX +
                "m / " +
                scene.distanceObjective +
                "m",
        );

        // kill count
        scene.killText.setText(
            "Kills: " + Game.player.killCount + " / " + scene.killObjective,
        );
    }

    // distance count
    const playerX = Game.player.x / 10;

    if (playerX > scene.highestX) {
        scene.highestX = Math.round(playerX);
    }
    if (scene.highestX >= scene.distanceObjective) {
        scene.distanceComplete = true;
    }

    // kill count
    if (Game.player.killCount >= scene.killObjective) {
        scene.killComplete = true;
    }

    Game.totalKill = Game.player.killCount;
    Game.totalDistance = scene.highestX;
    Game.totalTime = Game.gameUI.elapsedTime;

    // time limit
    if (scene.distanceComplete && scene.killComplete) {
        if (Game.gameUI.elapsedTime < 60) {
            if (
                (!Game.bossStage && Game.gameStage == 2) ||
                (!Game.bossStage && Game.gameStage == 4)
            ) {
                Game.bossStage = true;
                scene.scene.start("BossScene");
                scene.sound.stopAll();
            } else {
                Game.bossStage = false;
                objectiveComplete(scene);
                scene.sound.stopAll();
            }
        }
    }

    if (Game.gameUI.elapsedTime == 60) {
        scene.scene.start("GameOver");
        const playerDeathSound = scene.sound.add("playerDeath");
        playerDeathSound.play();
    }
}

