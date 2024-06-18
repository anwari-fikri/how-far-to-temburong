import { Game } from "../scenes/Game";
import { CheckpointAndChapters } from "../scenes/CheckpointAndChapters";

export function objectiveUI(scene: any) {
    scene.distanceComplete = false;
    scene.killComplete = false;
    scene.highestX = 0;

    scene.distanceObjective = 0;
    scene.killObjective = 0;

    switch (Game.gameStage) {
        case 1:
            scene.distanceObjective = 50;
            scene.killObjective = 10;
            break;
        case 2:
            scene.distanceObjective = 70;
            scene.killObjective = 20;
            break;
        case 3:
            scene.distanceObjective = 80;
            scene.killObjective = 50;
            break;
        case 4:
            scene.distanceObjective = 80;
            scene.killObjective = 40;
            break;

        default:
            scene.distanceObjective = 1;
            scene.killObjective = 2;
            break;
    }

    scene.distanceText = scene.add
        .text(10, 60, "Distance: 0 / " + scene.distanceObjective, {
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
}

export function stageObjective(scene: any) {
    // distance count
    scene.distanceText.setText(
        "Distance: " + scene.highestX + " / " + scene.distanceObjective,
    );

    const playerX = Game.player.x / 100;

    if (playerX > scene.highestX) {
        scene.highestX = Math.round(playerX);
    }
    if (scene.highestX >= scene.distanceObjective) {
        scene.distanceComplete = true;
        // console.log("distance objective: ", distanceComplete);
    }

    // kill count
    scene.killText.setText(
        "Kills: " + Game.player.killCount + " / " + scene.killObjective,
    );

    if (Game.player.killCount >= scene.killObjective) {
        scene.killComplete = true;
        // console.log("kill objective: ", killComplete);
    }

    Game.totalKill = Game.player.killCount;
    Game.totalDistance = scene.highestX;
    Game.totalTime = scene.gameUI.elapsedTime;

    // time limit
    if (scene.distanceComplete && scene.killComplete) {
        if (scene.gameUI.elapsedTime < 60) {
            scene.scene.start("CheckpointAndChapters");
        }
    }

    if (scene.gameUI.elapsedTime == 60) {
        scene.scene.start("GameOver");
    }
}
