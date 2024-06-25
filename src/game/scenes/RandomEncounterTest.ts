import { Scene } from "phaser";
import { EventBus } from "../EventBus";
import { Scenario } from "../classes/Scenario";
import Typed from "typed.js";
import { Game } from "./Game";

function loadGoogleFont() {
    const link = document.createElement("link");
    link.href =
        "https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
}

function addGlobalStyles() {
    const style = document.createElement("style");
    style.textContent = `
      
        @keyframes hover-shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
            20%, 40%, 60%, 80% { transform: translateX(2px); }
        }
        .selection-button {
            background: black;
            padding: 20px;
            border: 2px solid black;
            box-shadow: 2px 2px 0 black, 8px 8px 0 black;
            image-rendering: pixelated;
            cursor: pointer;
            transition: background 0.2s, color 0.2s;
        }
        .selection-button:hover {
            background: white;
            color: black;
            animation: hover-shake 0.5s;
        }
        
    `;
    document.head.appendChild(style);
}

export class RandomEncounterTest extends Scene {
    effectRate: any;
    effectCategory: any;
    effectCondition: any;
    constructor() {
        super("RandomEncounterTest");
    }

    preload() {
        this.load.audio("dialouge", "audio/dialouge.mp3");
        this.load.audio("button", "assets/audio/intro_menuButton.mp3");
        this.load.json("scenarios", "assets/scenarios.json");
    }

    createFirstScene(scenario: any) {
        const menuButtonSound = this.sound.add("button");
        const dialougeSound = this.sound.add("dialouge");
        const scaleFactorX = 0.98;
        const scaleFactorY = 0.98;
        const bgImage = this.add.image(
            this.cameras.main.centerX,
            this.cameras.main.centerY,
            scenario.getBackgroundImage(),
        );
        bgImage.setOrigin(0.5, 0.5);
        bgImage.setScale(scaleFactorX, scaleFactorY);

        const titleDiv = document.createElement("div");
        titleDiv.id = "title";
        titleDiv.style.position = "absolute";
        titleDiv.style.left = "260px";
        titleDiv.style.top = "50px";
        titleDiv.style.fontFamily = '"Press Start 2P", sans-serif';
        titleDiv.style.fontSize = "15px";
        titleDiv.style.color = "black";
        titleDiv.style.width = this.cameras.main.width - 20 + "px";
        titleDiv.style.background = "white";
        titleDiv.style.padding = "10px";
        titleDiv.style.border = "4px solid black";
        titleDiv.style.boxShadow = "6px 6px 0 black, 12px 12px 0 black";
        titleDiv.style.imageRendering = "pixelated";
        document.body.appendChild(titleDiv);

        dialougeSound.play();
        new Typed("#title", {
            strings: [scenario.getScenarioText()],
            typeSpeed: 15,
            showCursor: false,
            onComplete: () => {
                dialougeSound.stop();
            },
        });

        const selectionContainerDiv = document.createElement("div");
        selectionContainerDiv.id = "selection-container";
        selectionContainerDiv.style.position = "absolute";
        selectionContainerDiv.style.top = "75%";
        selectionContainerDiv.style.left = "50%";
        selectionContainerDiv.style.transform = "translate(-50%, -50%)";
        selectionContainerDiv.style.fontFamily =
            '"Press Start 2P", Arial, sans-serif';
        selectionContainerDiv.style.fontSize = "12px";
        selectionContainerDiv.style.color = "white";
        selectionContainerDiv.style.width = this.cameras.main.width - 20 + "px";
        document.body.appendChild(selectionContainerDiv);

        const selections = scenario.getSelectionState();
        selections.forEach((selection: any, index: any) => {
            const choice = selection.choice;
            const selectionDiv = document.createElement("div");
            selectionDiv.className = "selection-button";
            selectionDiv.style.marginTop = "10px";
            selectionDiv.textContent = choice;
            selectionDiv.addEventListener("click", () => {
                menuButtonSound.play();
                this.createSecondScene(selection.answer, selection.reward);
                this.effectRate = selection.effect.rate;
                this.effectCategory = selection.effect.category;
                this.effectCondition = selection.success;
            });
            selectionContainerDiv.appendChild(selectionDiv);
        });
    }

    createSecondScene(answer: any, reward: any) {
        const dialougeSound = this.sound.add("dialouge");
        const blackBg = document.createElement("div");
        blackBg.id = "black-bg";
        blackBg.style.position = "fixed";
        blackBg.style.top = "0";
        blackBg.style.left = "0";
        blackBg.style.width = "100%";
        blackBg.style.height = "100%";
        blackBg.style.backgroundColor = "black";
        document.body.appendChild(blackBg);


        const answerDiv = document.createElement("div");
        answerDiv.id = "answer";
        answerDiv.style.position = "fixed";
        answerDiv.style.top = "50%";
        answerDiv.style.left = "50%";
        answerDiv.style.transform = "translate(-50%, -50%)";
        answerDiv.style.fontFamily = '"Press Start 2P", sans-serif';
        answerDiv.style.fontSize = "15px";
        answerDiv.style.color = "white";
        answerDiv.style.width = "fit-content";
        answerDiv.style.background = "rgba(0, 0, 0, 0.8)";
        answerDiv.style.padding = "10px";
        answerDiv.style.border = "4px solid white";
        answerDiv.style.boxShadow = "8px 8px 0 white";
        answerDiv.style.imageRendering = "pixelated";
        document.body.appendChild(answerDiv);

        dialougeSound.stop();
        dialougeSound.play();
        new Typed("#answer", {
            strings: [`${answer}`, `Outcome: ${reward}`],
            typeSpeed: 15,
            showCursor: false,
            onComplete: () => {
                this.encounterEffect();
                dialougeSound.stop();
                setTimeout(() => {
                    this.scene.resume("Game");
                    this.scene.stop();
                    this.sound.resumeAll();
                }, 2000);
            },
        });
    }

    encounterEffect() {
        console.log(Game.player.currentHealth);
        switch (this.effectCategory) {
            case "health":
                console.log("health debuff");
                if (this.effectCondition) {
                    Game.player.heal(this.effectRate);
                } else {
                    Game.player.receiveDamage(
                        Game.player.currentHealth * this.effectRate,
                    );
                }
                break;
            case "speed":
                console.log("speed debuff");
                const amount =
                    Game.player.currentMovementSpeed * this.effectRate;
                Game.player.currentMovementSpeed -= amount;
                break;
            case "spawn":
                // malas usai spawn... nanti sja
                console.log("spawn debuff");
                break;
        }
    }

    create() {
        loadGoogleFont();
        addGlobalStyles();

        const scenariosData = this.cache.json.get("scenarios");
        const scenarios = scenariosData.scenarios.map(
            (data: any) =>
                new Scenario(data.text, data.selections, data.backgroundImage),
        );

        const randomIndex = Phaser.Math.Between(0, scenarios.length - 1);
        const myScenario = scenarios[randomIndex];
        this.createFirstScene(myScenario);

        EventBus.emit("current-scene-ready", this);

        this.events.on("shutdown", this.cleanup, this);
    }

    cleanup() {
        const elementsToRemove = [
            "title",
            "selection-container",
            "answer",
            "black-bg",
        ];

        elementsToRemove.forEach((id) => {
            const element = document.getElementById(id);
            if (element) {
                document.body.removeChild(element);
            }
        });
    }
}
