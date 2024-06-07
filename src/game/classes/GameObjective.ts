import { Game } from "../scenes/Game";

export function objectiveUI(scene: any) {
    scene.distanceComplete = false;
    scene.killComplete = false;
    scene.highestX = 0;

    scene.distanceText = scene.add
        .text(360, 16, "Distance: 0 / 1000", {
            fontSize: "8px",
            color: "#000000",
        })
        .setOrigin(0, 0)
        .setScrollFactor(0)
        .setDepth(100);
    scene.killText = scene.add
        .text(360, 36, "Kills: 0 / 10", {
            fontSize: "8px",
            color: "#000000",
        })
        .setOrigin(0, 0)
        .setScrollFactor(0)
        .setDepth(100);
}

export function stageObjective(scene: any) {
    // distance count
    scene.distanceText.setText("Distance: " + scene.highestX + " / 1000");

    if (scene.player.x > scene.highestX) {
        scene.highestX = Math.round(scene.player.x);
    }
    if (scene.highestX >= 1000) {
        scene.distanceComplete = true;
        // console.log("distance objective: ", distanceComplete);
    }

    // kill count
    scene.killText.setText("Kills: " + scene.player.killCount + " / 10");

    if (scene.player.killCount >= 10) {
        scene.killComplete = true;
        // console.log("kill objective: ", killComplete);
    }

    Game.totalKill = scene.player.killCount;
    Game.totalDistance = scene.highestX;
    Game.totalTime = scene.gameUI.elapsedTime;

    // time limit
    if (scene.distanceComplete && scene.killComplete) {
        if (scene.gameUI.elapsedTime < 60) {
            scene.scene.start("GameOver");
        }
    }

    if (scene.gameUI.elapsedTime == 60) {
        scene.scene.start("GameOver");
    }
}

function stage_1() {}
function stage_2() {}
function stage_3() {}
function stage_4() {}
