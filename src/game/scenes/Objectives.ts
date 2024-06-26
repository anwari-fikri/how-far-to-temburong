import { Scene } from "phaser";
import { EventBus } from "../EventBus";
import Typed from "typed.js";
import { Game } from "./Game";

export function loadGoogleFont() {
    const link = document.createElement("link");
    link.href =
        "https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
}

const objectives = [
    `Complete the objectives to finish this level! Kill 10 zombies and travel 500m.`,
    "Complete the objectives to finish this level! Kill 20 zombies and travel 700m.",
    "Complete the objectives to finish this level! Kill 35 zombies and travel 800m.",
    "Complete the objectives to finish this level! Kill 40 zombies and travel 800m.",
];

const bossObj = [
    "Complete the objectives to finish this level! Kill the Boss.",
];

export function Objectives(scene: any) {
    scene.scene.pause("Game");

    const dialogueSound = scene.sound.add("dialouge");
    dialogueSound.play({ loop: true });

    const screenDiv = document.createElement("div");
    screenDiv.id = "ObjectiveScreen";
    screenDiv.style.position = "fixed";
    screenDiv.style.top = "50%";
    screenDiv.style.left = "50%";
    screenDiv.style.transform = "translate(-50%, -50%)";
    screenDiv.style.width = "100%";
    screenDiv.style.height = "100%";
    screenDiv.style.opacity = "1";
    screenDiv.style.zIndex = "1";
    document.body.appendChild(screenDiv);

    const ObjectivesDiv = document.createElement("div");
    ObjectivesDiv.id = "ObjectivesDiv";
    ObjectivesDiv.style.position = "absolute";
    ObjectivesDiv.style.right = "18%";
    ObjectivesDiv.style.top = "72%";
    ObjectivesDiv.style.fontFamily = '"Press Start 2P", sans-serif';
    ObjectivesDiv.style.fontSize = "15px";
    ObjectivesDiv.style.color = "black";
    ObjectivesDiv.style.width = "45%";
    ObjectivesDiv.style.background = "white";
    ObjectivesDiv.style.padding = "10px";
    ObjectivesDiv.style.border = "4px solid black";
    ObjectivesDiv.style.boxShadow = "6px 6px 0 black, 12px 12px 0 black";
    ObjectivesDiv.style.imageRendering = "pixelated";
    ObjectivesDiv.style.zIndex = "5";

    const objectiveText = document.createElement("div");
    objectiveText.id = "objectiveText";
    ObjectivesDiv.appendChild(objectiveText);

    const buttonContainer = document.createElement("div");
    buttonContainer.id = "buttonContainer";
    buttonContainer.style.textAlign = "end";
    buttonContainer.style.marginTop = "10px";
    ObjectivesDiv.appendChild(buttonContainer);

    document.body.appendChild(ObjectivesDiv);

    const currentStage = Game.gameStage;
    let objectiveString = "";

    if (Game.bossStage) {
        objectiveString = bossObj[0];
    } else {
        objectiveString = objectives[(currentStage - 1) % objectives.length];
    }

    new Typed("#objectiveText", {
        strings: [objectiveString],
        typeSpeed: 15,
        showCursor: false,
        onComplete: () => {
            dialogueSound.stop();
            const continueButton = document.createElement("button");
            continueButton.textContent = "continue!";
            continueButton.style.padding = "8px 15px";
            continueButton.style.background = "black";
            continueButton.style.color = "white";
            continueButton.style.fontFamily =
                '"Press Start 2P", Arial, sans-serif';
            continueButton.style.fontSize = "12px";
            continueButton.style.border = "none";
            continueButton.style.cursor = "pointer";
            continueButton.classList.add("continue-button");
            continueButton.style.zIndex = "100";
            continueButton.addEventListener("click", () => {
                startMainGame(scene);
            });
            buttonContainer.appendChild(continueButton);
        },
    });
}

export function objectiveComplete(scene: any) {
    scene.scene.pause("Game");

    const dialogueSound = scene.sound.add("dialouge");
    dialogueSound.play({ loop: true });

    const screenDiv = document.createElement("div");
    screenDiv.id = "objectiveCompleteScreen";
    screenDiv.style.position = "fixed";
    screenDiv.style.top = "50%";
    screenDiv.style.left = "50%";
    screenDiv.style.transform = "translate(-50%, -50%)";
    screenDiv.style.width = "100%";
    screenDiv.style.height = "100%";
    screenDiv.style.opacity = "1";
    screenDiv.style.zIndex = "1";
    document.body.appendChild(screenDiv);

    const objectiveComplete = document.createElement("div");
    objectiveComplete.id = "objectiveComplete";
    objectiveComplete.style.position = "absolute";
    objectiveComplete.style.right = "18%";
    objectiveComplete.style.top = "72%";
    objectiveComplete.style.fontFamily = '"Press Start 2P", sans-serif';
    objectiveComplete.style.fontSize = "15px";
    objectiveComplete.style.color = "black";
    objectiveComplete.style.width = "50%";
    objectiveComplete.style.background = "white";
    objectiveComplete.style.padding = "10px";
    objectiveComplete.style.border = "4px solid black";
    objectiveComplete.style.boxShadow = "6px 6px 0 black, 12px 12px 0 black";
    objectiveComplete.style.imageRendering = "pixelated";
    objectiveComplete.style.zIndex = "5";

    const objectiveText = document.createElement("div");
    objectiveText.id = "objectiveText";
    objectiveComplete.appendChild(objectiveText);

    const buttonContainer = document.createElement("div");
    buttonContainer.id = "buttonContainer";
    buttonContainer.style.textAlign = "end";
    buttonContainer.style.marginTop = "10px";
    objectiveComplete.appendChild(buttonContainer);

    document.body.appendChild(objectiveComplete);

    new Typed("#objectiveText", {
        strings: ["Objective Complete!"],
        typeSpeed: 15,
        showCursor: false,
        onComplete: () => {
            dialogueSound.stop();
            const continueButton = document.createElement("button");
            continueButton.textContent = "continue!";
            continueButton.style.padding = "8px 15px";
            continueButton.style.background = "black";
            continueButton.style.color = "white";
            continueButton.style.fontFamily =
                '"Press Start 2P", Arial, sans-serif';
            continueButton.style.fontSize = "12px";
            continueButton.style.border = "none";
            continueButton.style.cursor = "pointer";
            continueButton.classList.add("continue-button");
            continueButton.style.zIndex = "100";
            continueButton.addEventListener("click", () => {
                startCheckpoint(scene);
            });
            buttonContainer.appendChild(continueButton);
        },
    });
}

export function startMainGame(scene: any) {
    cleanup();
    scene.scene.resume("Game");
}

export function startCheckpoint(scene: any) {
    cleanup();
    if (Game.isSceneLoaded) {
        Game.player.experience.saveExperienceState();
        Game.player.weaponSkill.saveWeaponSkillState();
    }
    scene.scene.start("CheckpointAndChapters");
}

export function cleanup() {
    const elementsToRemove = [
        "ObjectiveScreen",
        "ObjectivesDiv",
        "objectiveCompleteScreen",
        "objectiveComplete",
    ];
    elementsToRemove.forEach((id) => {
        const element = document.getElementById(id);
        if (element) {
            document.body.removeChild(element);
        }
    });
}
