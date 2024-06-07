import { Game } from "../scenes/Game";

export function objectiveUI(scene: any) {
    scene.distanceComplete = false;
    scene.killComplete = false;
    scene.highestX = 0;

    scene.distanceText = scene.add
        .text(10, 60, "Distance: 0 / 1000", {
            fontSize: "12px",
            color: "#000000",
            fontFamily: "Press Start 2P",
        })
        .setOrigin(0, 0)
        .setScrollFactor(0)
        .setDepth(100);
    scene.killText = scene.add
        .text(10, 74, "Kills: 0 / 10", {
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
    scene.distanceText.setText("Distance: " + scene.highestX + " / 1000");

    if (Game.player.x > scene.highestX) {
        scene.highestX = Math.round(Game.player.x);
    }
    if (scene.highestX >= 1000) {
        scene.distanceComplete = true;
        // console.log("distance objective: ", distanceComplete);
    }

    // kill count
    scene.killText.setText("Kills: " + Game.player.killCount + " / 10");

    if (Game.player.killCount >= 10) {
        scene.killComplete = true;
        // console.log("kill objective: ", killComplete);
    }

    Game.totalKill = Game.player.killCount;
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

