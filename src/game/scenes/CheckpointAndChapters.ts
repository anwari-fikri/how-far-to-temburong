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
    @keyframes fade-in {
        0% { opacity: 0; }
        100% { opacity: 1; }
    }

    @keyframes fade-out {
        0% { opacity: 1; }
        100% { opacity: 0; }
    }
    @keyframes hover-shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
        20%, 40%, 60%, 80% { transform: translateX(2px); }
    }
    .selection-button:hover {  
        animation: hover-shake 0.5s;
    }
    .char-image {
        width: 200px;
        margin: 0 10px;
        cursor: pointer;
        // transition: transform 0.3s ease-in-out;
    }

    .char-image:hover {
        background-color: rgba(255, 255, 255, 0.1); 
    }

    .char-image.highlight {
        background-color: rgba(255, 255, 255, 0.35); /* Adjust the alpha value to change opacity */
    }    

    .weapon-image:hover {
        animation: hover-shake 0.4s;
    }    
    
    `;
    document.head.appendChild(style);
}

export class CheckpointAndChapters extends Scene {
    static selectedMeleeWeapon: any;
    static selectedRangedWeapon: any;
    static selectedCharacter: any;

    constructor() {
        super("CheckpointAndChapters");
    }

    preload() {}

    create() {
        loadGoogleFont();
        addGlobalStyles();

        this.cameras.main.setBackgroundColor("#000000");

        EventBus.emit("current-scene-ready", this);

        setTimeout(() => {
            switch (Game.gameStage) {
                case 0:
                    this.chapterOneScreen();
                    break;
                case 1:
                    this.checkpointOneScreen();
                    break;
                case 2:
                    this.checkpointTwoScreen();
                    break;
                case 3:
                    this.checkpointThreeScreen();
                    break;
                case 4:
                    this.thankYouForPlayingScreen();
                    break;
            }
        }, 1000);
    }
    // -------------------------------------------------------------- CHAPTERS ---------------------------------------------------------------------------

    chapterOneScreen() {
        this.cleanup();

        const screenDiv = document.createElement("div");
        screenDiv.id = "chapterOne";
        screenDiv.style.position = "fixed";
        screenDiv.style.top = "45%";
        screenDiv.style.left = "50%";
        screenDiv.style.transform = "translate(-50%, -50%)";
        screenDiv.style.backgroundImage = 'url("assets/Intro/chapter1.png")';
        screenDiv.style.backgroundSize = "cover";
        screenDiv.style.backgroundRepeat = "no-repeat";
        screenDiv.style.backgroundPosition = "center";
        screenDiv.style.width = "30%";
        screenDiv.style.height = "30%";
        screenDiv.style.border = "none";
        screenDiv.style.boxShadow = "none";
        screenDiv.style.opacity = "0";
        document.body.appendChild(screenDiv);

        screenDiv.style.animation = "fade-in 3s forwards";

        const secondImage = document.createElement("div");
        secondImage.style.position = "fixed";
        secondImage.style.top = "55%";
        secondImage.style.left = "50%";
        secondImage.style.transform = "translate(-50%, -50%)";
        secondImage.style.backgroundImage =
            'url("assets/Intro/chapter1Title.png")';
        secondImage.style.backgroundSize = "cover";
        secondImage.style.backgroundRepeat = "no-repeat";
        secondImage.style.backgroundPosition = "center";
        secondImage.style.width = "30%";
        secondImage.style.height = "30%";
        secondImage.style.border = "none";
        secondImage.style.boxShadow = "none";
        secondImage.style.opacity = "0";
        document.body.appendChild(secondImage);

        setTimeout(() => {
            secondImage.style.animation = "fade-in 3s forwards"; // Fade in the second image after 1 seconds
        }, 2000); // Delay the fade-in of the second image by 2 seconds

        setTimeout(() => {
            screenDiv.style.animation = "fade-out 1s forwards";
            secondImage.style.animation = "fade-out 1s forwards"; // Fade in the second image after 1 seconds
        }, 5000); // Delay the fade-out of the first image by 5 seconds

        setTimeout(() => {
            this.cleanup();
            this.chapterOneContinuation();
        }, 6000); // Clean up and proceed after 5 seconds
    }

    chapterTwoScreen() {
        this.cleanup();

        const screenDiv = document.createElement("div");
        screenDiv.id = "chapterTwo";
        screenDiv.style.position = "fixed";
        screenDiv.style.top = "45%";
        screenDiv.style.left = "50%";
        screenDiv.style.transform = "translate(-50%, -50%)";
        screenDiv.style.backgroundImage = 'url("assets/Intro/chapter2.png")';
        screenDiv.style.backgroundSize = "cover";
        screenDiv.style.backgroundRepeat = "no-repeat";
        screenDiv.style.backgroundPosition = "center";
        screenDiv.style.width = "30%";
        screenDiv.style.height = "30%";
        screenDiv.style.border = "none";
        screenDiv.style.boxShadow = "none";
        screenDiv.style.opacity = "0";
        document.body.appendChild(screenDiv);

        screenDiv.style.animation = "fade-in 3s forwards";

        const secondImage = document.createElement("div");
        secondImage.style.position = "fixed";
        secondImage.style.top = "55%";
        secondImage.style.left = "50%";
        secondImage.style.transform = "translate(-50%, -50%)";
        secondImage.style.backgroundImage =
            'url("assets/Intro/chapter2Title.png")'; // Adjust the path to your second image
        secondImage.style.backgroundSize = "cover";
        secondImage.style.backgroundRepeat = "no-repeat";
        secondImage.style.backgroundPosition = "center";
        secondImage.style.width = "30%";
        secondImage.style.height = "30%";
        secondImage.style.border = "none";
        secondImage.style.boxShadow = "none";
        secondImage.style.opacity = "0";
        document.body.appendChild(secondImage);

        setTimeout(() => {
            secondImage.style.animation = "fade-in 3s forwards"; // Fade in the second image after 1 seconds
        }, 2000); // Delay the fade-in of the second image by 2 seconds

        setTimeout(() => {
            screenDiv.style.animation = "fade-out 1s forwards";
            secondImage.style.animation = "fade-out 1s forwards"; // Fade in the second image after 1 seconds
        }, 5000); // Delay the fade-out of the first image by 5 seconds

        setTimeout(() => {
            this.cleanup();
            this.chapterTwoContinuation();
        }, 6000); // Clean up and proceed after 5 seconds
    }

    chapterThreeScreen() {
        this.cleanup();

        const screenDiv = document.createElement("div");
        screenDiv.id = "chapterThree";
        screenDiv.style.position = "fixed";
        screenDiv.style.top = "45%";
        screenDiv.style.left = "50%";
        screenDiv.style.transform = "translate(-50%, -50%)";
        screenDiv.style.backgroundImage = 'url("assets/Intro/chapter3.png")';
        screenDiv.style.backgroundSize = "cover";
        screenDiv.style.backgroundRepeat = "no-repeat";
        screenDiv.style.backgroundPosition = "center";
        screenDiv.style.width = "30%";
        screenDiv.style.height = "30%";
        screenDiv.style.border = "none";
        screenDiv.style.boxShadow = "none";
        screenDiv.style.opacity = "0";
        document.body.appendChild(screenDiv);

        screenDiv.style.animation = "fade-in 3s forwards";

        const secondImage = document.createElement("div");
        secondImage.style.position = "fixed";
        secondImage.style.top = "55%";
        secondImage.style.left = "50%";
        secondImage.style.transform = "translate(-50%, -50%)";
        secondImage.style.backgroundImage =
            'url("assets/Intro/chapter3Title.png")'; // Adjust the path to your second image
        secondImage.style.backgroundSize = "cover";
        secondImage.style.backgroundRepeat = "no-repeat";
        secondImage.style.backgroundPosition = "center";
        secondImage.style.width = "30%";
        secondImage.style.height = "30%";
        secondImage.style.border = "none";
        secondImage.style.boxShadow = "none";
        secondImage.style.opacity = "0";
        document.body.appendChild(secondImage);

        setTimeout(() => {
            secondImage.style.animation = "fade-in 3s forwards"; // Fade in the second image after 1 seconds
        }, 2000); // Delay the fade-in of the second image by 2 seconds

        setTimeout(() => {
            screenDiv.style.animation = "fade-out 1s forwards";
            secondImage.style.animation = "fade-out 1s forwards"; // Fade in the second image after 1 seconds
        }, 5000); // Delay the fade-out of the first image by 5 seconds

        setTimeout(() => {
            this.cleanup();
            this.chapterThreeContinuation();
        }, 6000); // Clean up and proceed after 5 seconds
    }

    chapterFourScreen() {
        this.cleanup();

        const screenDiv = document.createElement("div");
        screenDiv.id = "chapterFour";
        screenDiv.style.position = "fixed";
        screenDiv.style.top = "45%";
        screenDiv.style.left = "50%";
        screenDiv.style.transform = "translate(-50%, -50%)";
        screenDiv.style.backgroundImage = 'url("assets/Intro/chapter4.png")';
        screenDiv.style.backgroundSize = "cover";
        screenDiv.style.backgroundRepeat = "no-repeat";
        screenDiv.style.backgroundPosition = "center";
        screenDiv.style.width = "30%";
        screenDiv.style.height = "30%";
        screenDiv.style.border = "none";
        screenDiv.style.boxShadow = "none";
        screenDiv.style.opacity = "0";
        document.body.appendChild(screenDiv);

        screenDiv.style.animation = "fade-in 3s forwards";

        const secondImage = document.createElement("div");
        secondImage.style.position = "fixed";
        secondImage.style.top = "55%";
        secondImage.style.left = "50%";
        secondImage.style.transform = "translate(-50%, -50%)";
        secondImage.style.backgroundImage =
            'url("assets/Intro/chapter4Title.png")'; // Adjust the path to your second image
        secondImage.style.backgroundSize = "cover";
        secondImage.style.backgroundRepeat = "no-repeat";
        secondImage.style.backgroundPosition = "center";
        secondImage.style.width = "30%";
        secondImage.style.height = "30%";
        secondImage.style.border = "none";
        secondImage.style.boxShadow = "none";
        secondImage.style.opacity = "0";
        document.body.appendChild(secondImage);

        setTimeout(() => {
            secondImage.style.animation = "fade-in 3s forwards"; // Fade in the second image after 1 seconds
        }, 2000); // Delay the fade-in of the second image by 2 seconds

        setTimeout(() => {
            screenDiv.style.animation = "fade-out 1s forwards";
            secondImage.style.animation = "fade-out 1s forwards"; // Fade in the second image after 1 seconds
        }, 5000); // Delay the fade-out of the first image by 5 seconds

        setTimeout(() => {
            this.cleanup();
            this.chapterFourContinuation();
        }, 6000); // Clean up and proceed after 5 seconds
    }

    chapterFinaleScreen() {
        this.cleanup();

        const screenDiv = document.createElement("div");
        screenDiv.id = "chapterFinale";
        screenDiv.style.position = "fixed";
        screenDiv.style.top = "45%";
        screenDiv.style.left = "50%";
        screenDiv.style.transform = "translate(-50%, -50%)";
        screenDiv.style.backgroundImage =
            'url("assets/Intro/chapterFinale.png")';
        screenDiv.style.backgroundSize = "cover";
        screenDiv.style.backgroundRepeat = "no-repeat";
        screenDiv.style.backgroundPosition = "center";
        screenDiv.style.width = "30%";
        screenDiv.style.height = "30%";
        screenDiv.style.border = "none";
        screenDiv.style.boxShadow = "none";
        screenDiv.style.opacity = "0";
        document.body.appendChild(screenDiv);

        screenDiv.style.animation = "fade-in 3s forwards";

        const secondImage = document.createElement("div");
        secondImage.style.position = "fixed";
        secondImage.style.top = "55%";
        secondImage.style.left = "50%";
        secondImage.style.transform = "translate(-50%, -50%)";
        secondImage.style.backgroundImage =
            'url("assets/Intro/chapterFinaleTitle.png")'; // Adjust the path to your second image
        secondImage.style.backgroundSize = "cover";
        secondImage.style.backgroundRepeat = "no-repeat";
        secondImage.style.backgroundPosition = "center";
        secondImage.style.width = "30%";
        secondImage.style.height = "30%";
        secondImage.style.border = "none";
        secondImage.style.boxShadow = "none";
        secondImage.style.opacity = "0";
        document.body.appendChild(secondImage);

        setTimeout(() => {
            secondImage.style.animation = "fade-in 3s forwards"; // Fade in the second image after 1 seconds
        }, 2000); // Delay the fade-in of the second image by 2 seconds

        setTimeout(() => {
            screenDiv.style.animation = "fade-out 1s forwards";
            secondImage.style.animation = "fade-out 1s forwards"; // Fade in the second image after 1 seconds
        }, 5000); // Delay the fade-out of the first image by 5 seconds

        setTimeout(() => {
            this.cleanup();
            this.chapterFinaleContinuation();
        }, 6000); // Clean up and proceed after 5 seconds
    }

    // -------------------------------------------------------------- CHAPTERS CONTINUATION ---------------------------------------------------------------------------

    chapterOneContinuation() {
        Game.gameStage++;
        this.cleanup();

        const screenDiv = document.createElement("div");
        screenDiv.id = "chapterOneContinuation";
        screenDiv.style.position = "fixed";
        screenDiv.style.top = "50%";
        screenDiv.style.left = "50%";
        screenDiv.style.transform = "translate(-50%, -50%)";
        screenDiv.style.backgroundImage = 'url("assets/Intro/chapter1Bg.png")';
        screenDiv.style.backgroundSize = "78% 100%";
        screenDiv.style.backgroundRepeat = "no-repeat";
        screenDiv.style.backgroundPosition = "center";
        screenDiv.style.width = "100%";
        screenDiv.style.height = "100%";
        screenDiv.style.border = "none";
        screenDiv.style.boxShadow = "none";
        screenDiv.style.opacity = "0";
        screenDiv.style.zIndex = "1"; // Ensure the screenDiv is in the background
        document.body.appendChild(screenDiv);

        const dialogueDiv = document.createElement("div");
        dialogueDiv.id = "dialogueChapterOne";
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
                "Two years have passed since the attacks began, The situation in Brunei Muara has worsened day by day. I'm hopeful that Temburong is as safe as the rumors suggest. Great, the bridge is closed off! My journey is about to take an unexpected turn…",
            ],
            typeSpeed: 15,
            showCursor: false,
            onComplete: () => {
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
                    this.cleanup();
                    this.startMainGame();
                });
                buttonContainer.appendChild(continueButton);
            },
        });

        screenDiv.style.animation = "fade-in 1s forwards";
    }

    chapterTwoContinuation() {
        Game.gameStage++;
        this.cleanup();

        const screenDiv = document.createElement("div");
        screenDiv.id = "chapterTwoContinuation";
        screenDiv.style.position = "fixed";
        screenDiv.style.top = "50%";
        screenDiv.style.left = "50%";
        screenDiv.style.transform = "translate(-50%, -50%)";
        screenDiv.style.backgroundImage = 'url("assets/Intro/chapter2Bg.png")';
        screenDiv.style.backgroundSize = "78% 100%";
        screenDiv.style.backgroundRepeat = "no-repeat";
        screenDiv.style.backgroundPosition = "center";
        screenDiv.style.width = "100%";
        screenDiv.style.height = "100%";
        screenDiv.style.border = "none";
        screenDiv.style.boxShadow = "none";
        screenDiv.style.opacity = "0";
        screenDiv.style.zIndex = "1"; // Ensure the screenDiv is in the background
        document.body.appendChild(screenDiv);

        const dialogueDiv = document.createElement("div");
        dialogueDiv.id = "dialogueChapterTwo";
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
                "The bridge is blocked by cars and debris. Something big is coming, and the air is filled with tension. A tough fight is just ahead. With danger looming, every step feels heavier.",
            ],
            typeSpeed: 15,
            showCursor: false,
            onComplete: () => {
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
                    this.cleanup();
                    this.startMainGame();
                });
                buttonContainer.appendChild(continueButton);
            },
        });

        screenDiv.style.animation = "fade-in 1s forwards";
    }

    chapterThreeContinuation() {
        Game.gameStage++;
        this.cleanup();

        const screenDiv = document.createElement("div");
        screenDiv.id = "chapterThreeContinuation";
        screenDiv.style.position = "fixed";
        screenDiv.style.top = "50%";
        screenDiv.style.left = "50%";
        screenDiv.style.transform = "translate(-50%, -50%)";
        screenDiv.style.backgroundImage = 'url("assets/Intro/chapter3Bg.png")';
        screenDiv.style.backgroundSize = "78% 100%";
        screenDiv.style.backgroundRepeat = "no-repeat";
        screenDiv.style.backgroundPosition = "center";
        screenDiv.style.width = "100%";
        screenDiv.style.height = "100%";
        screenDiv.style.border = "none";
        screenDiv.style.boxShadow = "none";
        screenDiv.style.opacity = "0";
        screenDiv.style.zIndex = "1"; // Ensure the screenDiv is in the background
        document.body.appendChild(screenDiv);

        const dialogueDiv = document.createElement("div");
        dialogueDiv.id = "dialogueChapterThree";
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
                "After defeating the boss, the journey moves into a dark forest area. The path is filled with secrets, and each step uncovers more mysteries. The truth is hidden in the shadows, waiting to be revealed",
            ],
            typeSpeed: 15,
            showCursor: false,
            onComplete: () => {
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
                    this.cleanup();
                    this.startMainGame();
                });
                buttonContainer.appendChild(continueButton);
            },
        });

        screenDiv.style.animation = "fade-in 1s forwards";
    }

    chapterFourContinuation() {
        Game.gameStage++;
        this.cleanup();

        const screenDiv = document.createElement("div");
        screenDiv.id = "chapterFourContinuation";
        screenDiv.style.position = "fixed";
        screenDiv.style.top = "50%";
        screenDiv.style.left = "50%";
        screenDiv.style.transform = "translate(-50%, -50%)";
        screenDiv.style.backgroundImage = 'url("assets/Intro/chapter4Bg.png")';
        screenDiv.style.backgroundSize = "78% 100%";
        screenDiv.style.backgroundRepeat = "no-repeat";
        screenDiv.style.backgroundPosition = "center";
        screenDiv.style.width = "100%";
        screenDiv.style.height = "100%";
        screenDiv.style.border = "none";
        screenDiv.style.boxShadow = "none";
        screenDiv.style.opacity = "0";
        screenDiv.style.zIndex = "1"; // Ensure the screenDiv is in the background
        document.body.appendChild(screenDiv);

        const dialogueDiv = document.createElement("div");
        dialogueDiv.id = "dialogueChapterFour";
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
                "This part of the bridge is blocked by gates and barriers. Temburong is close, but the way is tough. The final stretch is full of challenges. Each obstacle feels like a test of endurance and willpower.",
            ],
            typeSpeed: 15,
            showCursor: false,
            onComplete: () => {
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
                    this.cleanup();
                    this.startMainGame();
                });
                buttonContainer.appendChild(continueButton);
            },
        });

        screenDiv.style.animation = "fade-in 1s forwards";
        screenDiv.style.animation = "fade-out 1s forwards";
    }

    chapterFinaleContinuation() {
        this.cleanup();

        const dialogues = [
            "wajid: Whoa, what are you doing out here?",
            "I'm heading to Temburong. Heard it's safe there.",
            "wajid: Wait, Did you come from the other side of the bridge?",
            "Yes, I've come from Brunei Muara.",
            "wajid: Really? I thought everyone there was infected. Are you infected?",
            "No, there are survivors. And no, I'm not infected.",
            "wajid: Good to hear. Must've been quite a journey.",
            "Yeah, it was… hey can I ask you something?",
            "wajid: Sure, go ahead.",
            "How far to Temburong?",
            "wajid: Haha, don't worry son. You've made it. Welcome to Temburong, you are safe now",
        ];

        let currentDialogue = 0;

        const screenDiv = document.createElement("div");
        screenDiv.id = "chapterFinaleContinuation";
        screenDiv.style.position = "fixed";
        screenDiv.style.top = "50%";
        screenDiv.style.left = "50%";
        screenDiv.style.transform = "translate(-50%, -50%)";
        screenDiv.style.backgroundImage =
            'url("assets/Intro/chapterFInaleBg.gif")';
        screenDiv.style.backgroundSize = "78% 100%";
        screenDiv.style.backgroundRepeat = "no-repeat";
        screenDiv.style.backgroundPosition = "center";
        screenDiv.style.width = "100%";
        screenDiv.style.height = "100%";
        screenDiv.style.border = "none";
        screenDiv.style.boxShadow = "none";
        screenDiv.style.opacity = "0";
        screenDiv.style.zIndex = "1"; // Ensure the screenDiv is in the background
        document.body.appendChild(screenDiv);

        const dialogueDiv = document.createElement("div");
        dialogueDiv.id = "dialogueChapterFinale";
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

        const dialogueText = document.createElement("div");
        dialogueText.id = "dialogueText";
        dialogueDiv.appendChild(dialogueText);

        document.body.appendChild(dialogueDiv);

        const showNextDialogue = () => {
            if (currentDialogue < dialogues.length) {
                new Typed("#dialogueText", {
                    strings: [dialogues[currentDialogue]],
                    typeSpeed: 15,
                    showCursor: false,
                    onComplete: () => {
                        setTimeout(() => {
                            currentDialogue++;
                            showNextDialogue();
                        }, 1000); // 1000 milliseconds delay between dialogues
                    },
                });
            } else {
                this.cleanup();
                this.thankYouForPlayingScreen();
            }
        };

        showNextDialogue();

        screenDiv.style.animation = "fade-in 1s forwards";
    }
    thankYouForPlayingScreen() {
        this.cleanup();
    
        const endText = document.createElement("div");
        endText.textContent = "THE END";
        endText.style.position = "fixed";
        endText.style.top = "65%";
        endText.style.left = "50%";
        endText.style.transform = "translate(-50%, -50%)";
        endText.style.fontFamily = '"Press Start 2P", Arial, sans-serif';
        endText.style.fontSize = "36px";
        endText.style.color = "#ffffff";
        endText.style.textAlign = "center";
        endText.style.opacity = "0"; // Initially hidden
        endText.style.animation = "fade-in 2s forwards";
    
        const thankYouText = document.createElement("div");
        thankYouText.textContent = "THANK YOU FOR PLAYING";
        thankYouText.style.position = "fixed";
        thankYouText.style.top = "55%";
        thankYouText.style.left = "50%";
        thankYouText.style.transform = "translate(-50%, -50%)";
        thankYouText.style.fontFamily = '"Press Start 2P", Arial, sans-serif';
        thankYouText.style.fontSize = "24px";
        thankYouText.style.color = "#ffffff";
        thankYouText.style.textAlign = "center";
        thankYouText.style.opacity = "0"; // Initially hidden
        thankYouText.style.animation = "fade-in 2s forwards";
    
        const gameLogo = document.createElement("img");
        gameLogo.src = "assets/Intro/gameTitle2.png"; // Replace with the actual path to your game logo image
        gameLogo.style.position = "fixed";
        gameLogo.style.top = "25%";
        gameLogo.style.left = "50%";
        gameLogo.style.transform = "translateX(-50%)";
        gameLogo.style.width = "300px"; // Adjust the width as needed
        gameLogo.style.height = "auto"; // Maintain aspect ratio
        gameLogo.style.opacity = "0"; // Initially hidden
        gameLogo.style.animation = "fade-in 2s forwards";
    
        document.body.appendChild(endText);
        document.body.appendChild(thankYouText);
        document.body.appendChild(gameLogo);
    
        // Fade out elements after 5 seconds
        setTimeout(() => {
            endText.style.animation = "fade-out 2s forwards";
            thankYouText.style.animation = "fade-out 2s forwards";
            gameLogo.style.animation = "fade-out 2s forwards";
        }, 5000); // 5000 milliseconds = 5 seconds
    
        // Redirect to main menu after 7 seconds
        setTimeout(() => {
            this.cleanup();
            this.goToMenu();
        }, 7000); // 7000 milliseconds = 7 seconds
    }
    
    
    // -------------------------------------------------------------- CHECKPOINTS ---------------------------------------------------------------------------

    checkpointOneScreen() {
        this.cleanup();

        const screenDiv = document.createElement("div");
        screenDiv.id = "checkpointOne";
        screenDiv.style.position = "fixed";
        screenDiv.style.top = "50%";
        screenDiv.style.left = "50%";
        screenDiv.style.transform = "translate(-50%, -50%)";
        screenDiv.style.backgroundImage = 'url("assets/Intro/campfire.gif")';
        screenDiv.style.backgroundSize = "50% 100%";
        screenDiv.style.backgroundRepeat = "no-repeat";
        screenDiv.style.backgroundPosition = "center";
        screenDiv.style.width = "100%";
        screenDiv.style.height = "100%";
        screenDiv.style.border = "none";
        screenDiv.style.boxShadow = "none";
        screenDiv.style.opacity = "0";
        screenDiv.style.zIndex = "1"; // Ensure the screenDiv is in the background
        document.body.appendChild(screenDiv);

        const checkpointTextDiv = document.createElement("div");
        checkpointTextDiv.id = "checkpointText";
        checkpointTextDiv.style.position = "absolute";
        checkpointTextDiv.style.top = "50%";
        checkpointTextDiv.style.left = "50%";
        checkpointTextDiv.style.transform = "translate(-50%, -50%)";
        checkpointTextDiv.style.fontFamily = '"Press Start 2P", sans-serif';
        checkpointTextDiv.style.fontSize = "30px";
        checkpointTextDiv.style.color = "white";
        checkpointTextDiv.style.background = "none"; // Transparent background
        checkpointTextDiv.style.padding = "10px 20px";
        checkpointTextDiv.style.borderRadius = "10px";
        checkpointTextDiv.style.textAlign = "center";
        checkpointTextDiv.style.zIndex = "10"; // Ensure the text is above the image
        checkpointTextDiv.textContent = "CHECKPOINT";
        screenDiv.appendChild(checkpointTextDiv);

        const dialogueDiv = document.createElement("div");
        dialogueDiv.id = "dialogueCheckpointOne";
        dialogueDiv.style.position = "absolute";
        dialogueDiv.style.left = "240px";
        dialogueDiv.style.top = "65px";
        dialogueDiv.style.fontFamily = '"Press Start 2P", sans-serif';
        dialogueDiv.style.fontSize = "15px";
        dialogueDiv.style.color = "black";
        dialogueDiv.style.width = "50%";
        dialogueDiv.style.background = "white";
        dialogueDiv.style.padding = "10px";
        dialogueDiv.style.border = "4px solid #17434b";
        dialogueDiv.style.boxShadow = "6px 6px 0 #17434b, 12px 12px 0 #17434b";
        dialogueDiv.style.imageRendering = "pixelated";
        dialogueDiv.style.zIndex = "5"; // Ensure the dialogue is above the image

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
                "Time to recharge these zombie-fighting muscles and dream of a world where 'brainstorming' doesn't involve actual brains. Rest up, hero, because tomorrow the undead won't stand a chance against your refreshed and fearless self. Sweet dreams of a brain-free battle!",
            ],
            typeSpeed: 15,
            showCursor: false,
            onComplete: () => {
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
                    this.cleanup();
                    this.chapterTwoScreen();
                });
                buttonContainer.appendChild(continueButton);
            },
        });

        screenDiv.style.animation = "fade-in 1s forwards";
    }

    checkpointTwoScreen() {
        this.cleanup();

        const screenDiv = document.createElement("div");
        screenDiv.id = "checkpointTwo";
        screenDiv.style.position = "fixed";
        screenDiv.style.top = "50%";
        screenDiv.style.left = "50%";
        screenDiv.style.transform = "translate(-50%, -50%)";
        screenDiv.style.backgroundImage = 'url("assets/Intro/campfire.gif")';
        screenDiv.style.backgroundSize = "50% 100%";
        screenDiv.style.backgroundRepeat = "no-repeat";
        screenDiv.style.backgroundPosition = "center";
        screenDiv.style.width = "100%";
        screenDiv.style.height = "100%";
        screenDiv.style.border = "none";
        screenDiv.style.boxShadow = "none";
        screenDiv.style.opacity = "0";
        screenDiv.style.zIndex = "1"; // Ensure the screenDiv is in the background
        document.body.appendChild(screenDiv);

        const checkpointTextDiv = document.createElement("div");
        checkpointTextDiv.id = "checkpointText";
        checkpointTextDiv.style.position = "absolute";
        checkpointTextDiv.style.top = "50%";
        checkpointTextDiv.style.left = "50%";
        checkpointTextDiv.style.transform = "translate(-50%, -50%)";
        checkpointTextDiv.style.fontFamily = '"Press Start 2P", sans-serif';
        checkpointTextDiv.style.fontSize = "30px";
        checkpointTextDiv.style.color = "white";
        checkpointTextDiv.style.background = "none"; // Transparent background
        checkpointTextDiv.style.padding = "10px 20px";
        checkpointTextDiv.style.borderRadius = "10px";
        checkpointTextDiv.style.textAlign = "center";
        checkpointTextDiv.style.zIndex = "10"; // Ensure the text is above the image
        checkpointTextDiv.textContent = "CHECKPOINT";
        screenDiv.appendChild(checkpointTextDiv);

        const dialogueDiv = document.createElement("div");
        dialogueDiv.id = "dialogueCheckpointTwo";
        dialogueDiv.style.position = "absolute";
        dialogueDiv.style.left = "240px";
        dialogueDiv.style.top = "65px";
        dialogueDiv.style.fontFamily = '"Press Start 2P", sans-serif';
        dialogueDiv.style.fontSize = "15px";
        dialogueDiv.style.color = "black";
        dialogueDiv.style.width = "50%";
        dialogueDiv.style.background = "white";
        dialogueDiv.style.padding = "10px";
        dialogueDiv.style.border = "4px solid #17434b";
        dialogueDiv.style.boxShadow = "6px 6px 0 #17434b, 12px 12px 0 #17434b";
        dialogueDiv.style.imageRendering = "pixelated";
        dialogueDiv.style.zIndex = "5"; // Ensure the dialogue is above the image

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
                "Imagine rewriting history books: 'The Great Zombie Uprising of 2022.' Maybe they'll name a bridge after me. Hopefully, not because I'm a victime. Here's to making history, one zombie at a time!",
            ],
            typeSpeed: 15,
            showCursor: false,
            onComplete: () => {
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
                    this.cleanup();
                    this.chapterThreeScreen();
                });
                buttonContainer.appendChild(continueButton);
            },
        });

        screenDiv.style.animation = "fade-in 1s forwards";
    }

    checkpointThreeScreen() {
        this.cleanup();

        const screenDiv = document.createElement("div");
        screenDiv.id = "checkpointThree";
        screenDiv.style.position = "fixed";
        screenDiv.style.top = "50%";
        screenDiv.style.left = "50%";
        screenDiv.style.transform = "translate(-50%, -50%)";
        screenDiv.style.backgroundImage = 'url("assets/Intro/campfire.gif")';
        screenDiv.style.backgroundSize = "50% 100%";
        screenDiv.style.backgroundRepeat = "no-repeat";
        screenDiv.style.backgroundPosition = "center";
        screenDiv.style.width = "100%";
        screenDiv.style.height = "100%";
        screenDiv.style.border = "none";
        screenDiv.style.boxShadow = "none";
        screenDiv.style.opacity = "0";
        screenDiv.style.zIndex = "1"; // Ensure the screenDiv is in the background
        document.body.appendChild(screenDiv);

        const checkpointTextDiv = document.createElement("div");
        checkpointTextDiv.id = "checkpointText";
        checkpointTextDiv.style.position = "absolute";
        checkpointTextDiv.style.top = "50%";
        checkpointTextDiv.style.left = "50%";
        checkpointTextDiv.style.transform = "translate(-50%, -50%)";
        checkpointTextDiv.style.fontFamily = '"Press Start 2P", sans-serif';
        checkpointTextDiv.style.fontSize = "30px";
        checkpointTextDiv.style.color = "white";
        checkpointTextDiv.style.background = "none"; // Transparent background
        checkpointTextDiv.style.padding = "10px 20px";
        checkpointTextDiv.style.borderRadius = "10px";
        checkpointTextDiv.style.textAlign = "center";
        checkpointTextDiv.style.zIndex = "10"; // Ensure the text is above the image
        checkpointTextDiv.textContent = "CHECKPOINT";
        screenDiv.appendChild(checkpointTextDiv);

        const dialogueDiv = document.createElement("div");
        dialogueDiv.id = "dialogueCheckpointThree";
        dialogueDiv.style.position = "absolute";
        dialogueDiv.style.left = "240px";
        dialogueDiv.style.top = "65px";
        dialogueDiv.style.fontFamily = '"Press Start 2P", sans-serif';
        dialogueDiv.style.fontSize = "15px";
        dialogueDiv.style.color = "black";
        dialogueDiv.style.width = "50%";
        dialogueDiv.style.background = "white";
        dialogueDiv.style.padding = "10px";
        dialogueDiv.style.border = "4px solid #17434b";
        dialogueDiv.style.boxShadow = "6px 6px 0 #17434b, 12px 12px 0 #17434b";
        dialogueDiv.style.imageRendering = "pixelated";
        dialogueDiv.style.zIndex = "5"; // Ensure the dialogue is above the image

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
                "They say laughter is the best medicine. Well, in a world overrun by zombies, laughter might just be the only medicine we've got left. So, let's keep our jokes sharp and our aim even sharper!",
            ],
            typeSpeed: 15,
            showCursor: false,
            onComplete: () => {
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
                    this.cleanup();
                    this.chapterFourScreen();
                });
                buttonContainer.appendChild(continueButton);
            },
        });

        screenDiv.style.animation = "fade-in 1s forwards";
    }

    // -------------------------------------------------------------- MAIN GAME SCREEN AND CLEANUP  ---------------------------------------------------------------------------

    startMainGame() {
        this.cleanup();
        this.scene.start("Game");
    }

    goToMenu() {
        this.cleanup;
        this.scene.start("MainMenu"); // Redirect to Main Menu scene
    }
    

    cleanup() {
        const elementsToRemove = [
            "chapterOne",
            "chapterTwo",
            "chapterThree",
            "chapterFour",
            "chapterFinale",
            "chapterOneContinuation",
            "dialogueChapterOne",
            "chapterTwoContinuation",
            "dialogueChapterTwo",
            "chapterThreeContinuation",
            "dialogueChapterThree",
            "chapterFourContinuation",
            "dialogueChapterFour",
            "chapterFinaleContinuation",
            "dialogueChapterFinale",
            "checkpointOne",
            "dialogueCheckpointOne",
            "checkpointTwo",
            "dialogueCheckpointTwo",
            "checkpointThree",
            "dialogueCheckpointThree",
            "thankYouForPlaying",
        ];
        elementsToRemove.forEach((id) => {
            const element = document.getElementById(id);
            if (element) {
                document.body.removeChild(element);
            }
        });
    }
}
