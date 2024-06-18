import { Scene } from "phaser";
import { EventBus } from "../EventBus";

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
    `;
    document.head.appendChild(style);
}

export class Intro extends Scene {


    constructor() {
        super("Intro");
    }

    preload() {
        this.load.image("background", "assets/Intro/Company.png"); // Load the background image
        this.load.audio("mainMenu", "assets/audio/intro_mainMenu.mp3");
        this.load.audio("newspaper", "assets/audio/intro_newspaper.mp3");
        this.load.audio("menuButton", "assets/audio/intro_menuButton.mp3");
        this.load.audio("select", "assets/audio/intro_select.mp3");
    }

    create() {
        loadGoogleFont();
        addGlobalStyles();

        this.cameras.main.setBackgroundColor("#000000");

        EventBus.emit("current-scene-ready", this);

        setTimeout(() => {
            this.companyNameScreen();
        }, 1000);
    }

    companyNameScreen() {
        this.cleanup();

        const screenDiv = document.createElement("div");
        screenDiv.id = "companyNameScreen";
        screenDiv.style.position = "fixed";
        screenDiv.style.top = "50%";
        screenDiv.style.left = "50%";
        screenDiv.style.transform = "translate(-50%, -50%)";
        screenDiv.style.backgroundImage = 'url("assets/Intro/Company.png")';
        screenDiv.style.backgroundSize = "35% 10%";
        screenDiv.style.backgroundRepeat = "no-repeat";
        screenDiv.style.backgroundPosition = "center";
        screenDiv.style.width = "100%";
        screenDiv.style.height = "100%";
        screenDiv.style.border = "none";
        screenDiv.style.boxShadow = "none";
        screenDiv.style.opacity = "0";
        document.body.appendChild(screenDiv);

        screenDiv.style.animation = "fade-in 1s forwards";

        setTimeout(() => {
            screenDiv.style.animation = "fade-out 1s forwards";

            setTimeout(() => {
                this.cleanup();
                this.newspaperScreen();
            }, 1000);
        }, 3000);
    }

    newspaperScreen() {
        this.cleanup();

        const newspaperSound = this.sound.add("newspaper");
        newspaperSound.play();

        const imagePaths = [
            "assets/Intro/n1.png",
            "assets/Intro/n2.png",
            "assets/Intro/n3.png",
        ];

        const images: Phaser.GameObjects.Image[] = [];
        const imageGroup = this.add.group();

        imagePaths.forEach((path, index) => {
            this.load.image(`newspaper${index + 1}`, path);
        });

        this.load.on("complete", () => {
            imagePaths.forEach((path, index) => {
                let offsetX = 0;
                if (index === 0) {
                    offsetX = -75;
                } else if (index === 1) {
                    offsetX = 75;
                }
                const image = this.add.image(
                    this.cameras.main.centerX + offsetX,
                    this.cameras.main.centerY,
                    `newspaper${index + 1}`,
                );
                image.setOrigin(0.5);
                image.setScale(0.2);
                image.setAlpha(0);
                images.push(image);
                imageGroup.add(image);
            });

            images.forEach((image, index) => {
                this.tweens.add({
                    targets: image,
                    alpha: 1,
                    duration: 1000,
                    delay: index * 1000,
                    onComplete: () => {
                        if (index === images.length - 1) {
                            setTimeout(() => {
                                this.tweens.add({
                                    targets: images,
                                    x: this.cameras.main.width + 100,
                                    y: -100,
                                    duration: 1000,
                                    onComplete: () => {
                                        this.cleanup();
                                        this.scene.start("MainMenu");
                                    },
                                });
                            }, 500);
                        }
                    },
                });
            });
        });

        this.load.start();
    }

    cleanup() {
        const elementsToRemove = [
            "companyNameScreen",
            "newspaperScreen",
        ];
        elementsToRemove.forEach((id) => {
            const element = document.getElementById(id);
            if (element) {
                document.body.removeChild(element);
            }
        });
    }
}
