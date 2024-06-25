import { Scene } from "phaser";
import { EventBus } from "../EventBus";
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
    @keyframes fade-in-out {
        0%, 100% { opacity: 1; }
        50% { opacity: 0; }
    }

    @keyframes pulse {
        0% {
            box-shadow: 0 0 20px red;
        }
        100% {
            box-shadow: 0 0 80px red;
        }
    }

    @keyframes flash {
        0%, 99% {
            opacity: 1;
        }
        100% {
            opacity: 0;
        }
    }

    @keyframes glitch {
        0%, 100% {
            transform: translate(0);
        }
        25% {
            transform: translate(2px, -2px);
        }
        50% {
            transform: translate(-2px, 2px);
        }
        75% {
            transform: translate(2px, 2px);
        }
    }

    @keyframes flash-text {
        0%, 100% { opacity: 1; }
        50% { opacity: 0; }
    }

    .glow {
        animation: pulse 1.5s infinite alternate, flash 0.5s infinite alternate, glitch 1s infinite;
    }

    .flash-text {
        font-size: 48px;
        color: red;
        font-family: 'Press Start 2P', sans-serif;
        text-align: center;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        animation: flash-text 1s infinite;
        z-index: 15;
    
    }
    
    `;
    document.head.appendChild(style);
}

export class BossScene extends Scene {
    constructor() {
        super("BossScene");
    }

    preload() {
        this.load.audio("bossOne", "assets/audio/stage_boss_scene1.mp3");
        this.load.audio("bossTwo", "assets/audio/stage_boss_scene2.mp3");
    }

    create() {
        loadGoogleFont();
        addGlobalStyles();

        this.cameras.main.setBackgroundColor("#000000");

        EventBus.emit("current-scene-ready", this);

        setTimeout(() => {
            switch (Game.gameStage) {
                case 2:
                    this.bossOneScene();
                    break;
                case 4:
                    this.bossTwoScene();
                    break;
            }
        }, 1000);
    }

    bossOneScene() {
        this.cleanup();
        const bossOneMusic = this.sound.add("bossOne", { loop: true });
        bossOneMusic.play();
        Game.soundManager.dialougeSound.play();

        const screenDiv = document.createElement("div");
        screenDiv.id = "bossOneScene";
        screenDiv.classList.add("glitch-bg");
        screenDiv.style.position = "fixed";
        screenDiv.style.top = "50%";
        screenDiv.style.left = "50%";
        screenDiv.style.transform = "translate(-50%, -50%)";
        screenDiv.style.backgroundImage = 'url("assets/Intro/bossOne.png")';
        screenDiv.style.backgroundSize = "78% 100%";
        screenDiv.style.backgroundRepeat = "no-repeat";
        screenDiv.style.backgroundPosition = "center";
        screenDiv.style.width = "100%";
        screenDiv.style.height = "100%";
        screenDiv.style.border = "none";
        screenDiv.style.boxShadow = "none";
        screenDiv.style.zIndex = "1"; // Ensure the screenDiv is in the background
        screenDiv.style.animation = "fade-in-out 2s infinite";
        document.body.appendChild(screenDiv);

        const dialogueDiv = document.createElement("div");
        dialogueDiv.id = "dialogueBossOne";
        dialogueDiv.style.position = "absolute";
        dialogueDiv.style.left = "240px";
        dialogueDiv.style.top = "65px";
        dialogueDiv.style.fontFamily = '"Press Start 2P", sans-serif';
        dialogueDiv.style.fontSize = "15px";
        dialogueDiv.style.color = "black";
        dialogueDiv.style.width = "50%";
        dialogueDiv.style.background = "white";
        dialogueDiv.style.padding = "10px";
        dialogueDiv.style.border = "4px solid black";
        dialogueDiv.style.boxShadow = "6px 6px 0 black, 12px 12px 0 black";
        dialogueDiv.style.imageRendering = "pixelated";
        dialogueDiv.style.zIndex = "5"; // Ensure the dialogue is above the image
        dialogueDiv.classList.add("glow"); // Add the glow class for pulsating effect

        // Create and style the vignette overlay
        const vignetteOverlay = document.createElement("div");
        vignetteOverlay.style.position = "absolute";
        vignetteOverlay.style.top = "0";
        vignetteOverlay.style.left = "0";
        vignetteOverlay.style.width = "100%";
        vignetteOverlay.style.height = "100%";
        vignetteOverlay.style.pointerEvents = "none";
        vignetteOverlay.style.zIndex = "10"; // Make sure it is above other elements
        vignetteOverlay.style.background =
            "radial-gradient(circle, rgba(0, 0, 0, 0) 10%, rgba(0, 0, 0, 0.5) 100%)";
        screenDiv.appendChild(vignetteOverlay);

        // Create the warning text
        const warningText = document.createElement("div");
        warningText.classList.add("flash-text");
        warningText.textContent = "DANGER!!!";
        screenDiv.appendChild(warningText);

        const dialogueText = document.createElement("div");
        dialogueText.id = "dialogueText";
        dialogueDiv.appendChild(dialogueText);

        const buttonContainer = document.createElement("div");
        buttonContainer.id = "buttonContainer";
        buttonContainer.style.textAlign = "end";
        buttonContainer.style.marginTop = "10px";
        dialogueDiv.appendChild(buttonContainer);

        document.body.appendChild(dialogueDiv);

        new Typed("#dialogueText", {
            strings: [
                "Halfway across the Temburong Bridge, the structure trembles beneath your feet. From the depths below, a massive, writhing blob of slime emerges, blocking your path. The Giant Slime, born from the dark waters, spreads across the bridge, determined to stop you from going any further!.",
            ],
            typeSpeed: 15,
            showCursor: false,
            onComplete: () => {
                Game.soundManager.dialougeSound.stop();

                const continueButton = document.createElement("button");
                continueButton.textContent = "continue!";
                continueButton.style.padding = "8px 15px";
                continueButton.style.background = "#FFD700"; // Bright color
                continueButton.style.color = "black"; // Contrast color for text
                continueButton.style.fontFamily =
                    '"Press Start 2P", Arial, sans-serif';
                continueButton.style.fontSize = "12px";
                continueButton.style.border = "none";
                continueButton.style.cursor = "pointer";
                continueButton.classList.add("glow"); // Add the glow class for pulsating effect
                continueButton.style.zIndex = "100";
                continueButton.addEventListener("click", () => {
                    bossOneMusic.stop();
                    this.cleanup();
                    this.startMainGame();
                });
                buttonContainer.appendChild(continueButton);
            },
        });
    }

    bossTwoScene() {
        this.cleanup();

        const screenDiv = document.createElement("div");
        screenDiv.id = "bossTwoScene";
        screenDiv.classList.add("glitch-bg");
        screenDiv.style.position = "fixed";
        screenDiv.style.top = "50%";
        screenDiv.style.left = "50%";
        screenDiv.style.transform = "translate(-50%, -50%)";
        screenDiv.style.backgroundImage = 'url("assets/Intro/bossTwo.png")';
        screenDiv.style.backgroundSize = "78% 100%";
        screenDiv.style.backgroundRepeat = "no-repeat";
        screenDiv.style.backgroundPosition = "center";
        screenDiv.style.width = "100%";
        screenDiv.style.height = "100%";
        screenDiv.style.border = "none";
        screenDiv.style.boxShadow = "none";
        screenDiv.style.zIndex = "1"; // Ensure the screenDiv is in the background
        screenDiv.style.animation = "fade-in-out 2s infinite";
        document.body.appendChild(screenDiv);

        // Create and style the vignette overlay
        const vignetteOverlay = document.createElement("div");
        vignetteOverlay.style.position = "absolute";
        vignetteOverlay.style.top = "0";
        vignetteOverlay.style.left = "0";
        vignetteOverlay.style.width = "100%";
        vignetteOverlay.style.height = "100%";
        vignetteOverlay.style.pointerEvents = "none";
        vignetteOverlay.style.zIndex = "10"; // Make sure it is above other elements
        vignetteOverlay.style.background =
            "radial-gradient(circle, rgba(0, 0, 0, 0) 10%, rgba(0, 0, 0, 0.5) 100%)";
        screenDiv.appendChild(vignetteOverlay);

        // Create the warning text
        const warningText = document.createElement("div");
        warningText.classList.add("flash-text");
        warningText.textContent = "CAUTION!!!";
        screenDiv.appendChild(warningText);

        const dialogueDiv = document.createElement("div");
        dialogueDiv.id = "dialogueBossTwo";
        dialogueDiv.style.position = "absolute";
        dialogueDiv.style.left = "240px";
        dialogueDiv.style.top = "65px";
        dialogueDiv.style.fontFamily = '"Press Start 2P", sans-serif';
        dialogueDiv.style.fontSize = "15px";
        dialogueDiv.style.color = "black";
        dialogueDiv.style.width = "50%";
        dialogueDiv.style.background = "white";
        dialogueDiv.style.padding = "10px";
        dialogueDiv.style.border = "4px solid black";
        dialogueDiv.style.boxShadow = "6px 6px 0 black, 12px 12px 0 black";
        dialogueDiv.style.imageRendering = "pixelated";
        dialogueDiv.style.zIndex = "5"; // Ensure the dialogue is above the image
        dialogueDiv.classList.add("glow"); // Add the glow class for pulsating effect

        const dialogueText = document.createElement("div");
        dialogueText.id = "dialogueText";
        dialogueDiv.appendChild(dialogueText);

        const buttonContainer = document.createElement("div");
        buttonContainer.id = "buttonContainer";
        buttonContainer.style.textAlign = "end";
        buttonContainer.style.marginTop = "10px";
        dialogueDiv.appendChild(buttonContainer);

        document.body.appendChild(dialogueDiv);

        new Typed("#dialogueText", {
            strings: [
                "After crossing the damaged section of the bridge, you enter the dense, foreboding forest. The air is thick with the scent of decay. Suddenly, you hear heavy footsteps and the snap of branches. A massive gorilla, its flesh rotting and eyes glowing with a sinister light, appears. This Gorilla Zombie Suddenly charges at you with relentless fury!.",
            ],
            typeSpeed: 15,
            showCursor: false,
            onComplete: () => {
                const continueButton = document.createElement("button");
                continueButton.textContent = "continue!";
                continueButton.style.padding = "8px 15px";
                continueButton.style.background = "#FFD700"; // Bright color
                continueButton.style.color = "black"; // Contrast color for text
                continueButton.style.fontFamily =
                    '"Press Start 2P", Arial, sans-serif';
                continueButton.style.fontSize = "12px";
                continueButton.style.border = "none";
                continueButton.style.cursor = "pointer";
                continueButton.classList.add("glow"); // Add the glow class for pulsating effect
                continueButton.style.zIndex = "100";
                continueButton.addEventListener("click", () => {
                    this.cleanup();
                    this.startMainGame();
                });
                buttonContainer.appendChild(continueButton);
            },
        });
    }

    startMainGame() {
        this.cleanup();
        Game.player.weaponSkill.loadWeaponSkillState();
        Game.player.experience.loadExperienceState();
        this.scene.start("Game");
    }

    cleanup() {
        const elementsToRemove = [
            "bossOneScene",
            "bossTwoScene",
            "dialogueBossOne",
            "dialogueBossTwo",
        ];
        elementsToRemove.forEach((id) => {
            const element = document.getElementById(id);
            if (element) {
                document.body.removeChild(element);
            }
        });
    }
}
