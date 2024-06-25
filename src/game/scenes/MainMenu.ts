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

export class MainMenu extends Scene {
    static selectedMeleeWeapon: any;
    static selectedRangedWeapon: any;
    static selectedCharacter: any;

    constructor() {
        super("MainMenu");
    }

    preload() {
        this.load.image("background", "assets/Intro/Company.png");
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
            this.mainMenuScreen();
        }, 1000);
    }

    mainMenuScreen() {
        this.cleanup();
        const introSong = this.sound.add("mainMenu");
        introSong.play({ loop: true });

        const screenDiv = document.createElement("div");
        screenDiv.id = "mainMenuScreen";
        screenDiv.style.position = "fixed";
        screenDiv.style.top = "50%";
        screenDiv.style.left = "50%";
        screenDiv.style.transform = "translate(-50%, -50%)";
        screenDiv.style.backgroundImage = 'url("assets/Intro/mainMenu2.gif")';
        screenDiv.style.backgroundSize = "100% 100%";
        screenDiv.style.backgroundRepeat = "no-repeat";
        screenDiv.style.backgroundPosition = "center";
        screenDiv.style.width = "75%";
        screenDiv.style.height = "100%";
        screenDiv.style.border = "none";
        screenDiv.style.boxShadow = "none";
        screenDiv.style.opacity = "0";
        document.body.appendChild(screenDiv);

        const vignetteOverlay = document.createElement("div");
        vignetteOverlay.style.position = "absolute";
        vignetteOverlay.style.top = "0";
        vignetteOverlay.style.left = "0";
        vignetteOverlay.style.width = "100%";
        vignetteOverlay.style.height = "100%";
        vignetteOverlay.style.pointerEvents = "none";
        vignetteOverlay.style.zIndex = "10";
        vignetteOverlay.style.background =
            "radial-gradient(circle, rgba(0, 0, 0, 0) 10%, rgba(0, 0, 0, 0.8) 100%)";
        screenDiv.appendChild(vignetteOverlay);

        const topImage = document.createElement("img");
        topImage.src = "assets/Intro/gameTitle2.png";
        topImage.style.position = "absolute";
        topImage.style.top = "5%";
        topImage.style.left = "50%";
        topImage.style.transform = "translateX(-50%)";
        topImage.style.zIndex = "15";
        topImage.style.width = "50%";
        screenDiv.appendChild(topImage);

        const createButton = (
            text: any,
            id: any,
            top: any,
            onClick: any,
            imagePath: any,
        ) => {
            const button = document.createElement("button");
            button.id = id;
            button.innerText = text;
            button.style.position = "absolute";
            button.style.top = top;
            button.style.padding = "12px";
            button.style.backgroundImage = `url("${imagePath}")`;
            button.style.backgroundSize = "cover";
            button.style.backgroundRepeat = "no-repeat";
            button.style.fontFamily = '"Press Start 2P", Arial, sans-serif';
            button.style.color = "white";
            button.style.cursor = "pointer";
            button.style.fontSize = "14px";
            button.style.width = "250px";
            button.style.height = "70px";
            button.classList.add("selection-button");
            button.style.imageRendering = "pixelated";
            button.addEventListener("click", onClick);
            screenDiv.appendChild(button);
        };

        const startButtonLeft = "38%";
        const settingsButtonLeft = "40%";
        const creditsButtonLeft = "38%";
        const menuButtonSound = this.sound.add("menuButton");

        createButton(
            "Start",
            "startButton",
            "53%",
            () => {
                menuButtonSound.play();
                this.characterSelectionScreen();
            },
            "assets/Intro/buttons.png",
        );
        const startButton = document.getElementById("startButton");
        if (startButton) {
            startButton.style.left = startButtonLeft;
        }

        createButton(
            "Credits",
            "creditsButton",
            "63%",
            () => {
                console.log("Credits clicked");
                menuButtonSound.play();
                this.startCredits();
                this.sound.pauseAll();
            },
            "assets/Intro/buttons.png",
        );
        const creditsButton = document.getElementById("creditsButton");
        if (creditsButton) {
            creditsButton.style.left = creditsButtonLeft;
        }
        screenDiv.style.animation = "fade-in 1s forwards";
    }

    characterSelectionScreen() {
        this.cleanup();

        const screenDiv = document.createElement("div");
        screenDiv.id = "characterSelectionScreen";
        screenDiv.style.position = "fixed";
        screenDiv.style.top = "50%";
        screenDiv.style.left = "50%";
        screenDiv.style.transform = "translate(-50%, -50%)";
        screenDiv.style.backgroundImage = 'url("assets/Intro/dungeon.gif")';
        screenDiv.style.backgroundSize = "100%";
        screenDiv.style.backgroundRepeat = "no-repeat";
        screenDiv.style.backgroundPosition = "center";
        screenDiv.style.width = "75%";
        screenDiv.style.height = "100vh";
        screenDiv.style.border = "none";
        screenDiv.style.boxShadow = "none";
        screenDiv.style.opacity = "0";
        document.body.appendChild(screenDiv);

        const vignetteOverlay = document.createElement("div");
        vignetteOverlay.style.position = "absolute";
        vignetteOverlay.style.top = "0";
        vignetteOverlay.style.left = "0";
        vignetteOverlay.style.width = "100%";
        vignetteOverlay.style.height = "100%";
        vignetteOverlay.style.pointerEvents = "none";
        vignetteOverlay.style.zIndex = "10";
        vignetteOverlay.style.background =
            "radial-gradient(circle, rgba(0, 0, 0, 0) 10%, rgba(0, 0, 0, 0.8) 100%)";
        screenDiv.appendChild(vignetteOverlay);

        const weaponContainer = document.createElement("div");
        weaponContainer.style.display = "flex";
        weaponContainer.style.flexDirection = "column";
        weaponContainer.style.alignItems = "center";
        weaponContainer.style.position = "absolute";
        weaponContainer.style.top = "34%";
        weaponContainer.style.left = "44%";
        weaponContainer.style.transform = "translate(-50%, -50%)";
        weaponContainer.style.width = "600px";
        weaponContainer.style.height = "250px";
        weaponContainer.style.fontFamily = '"Press Start 2P", sans-serif';
        weaponContainer.style.fontSize = "14px";
        weaponContainer.style.zIndex = "6";
        weaponContainer.style.backgroundColor = "none";

        const meleeWeapons = [
            { url: "assets/Intro/weapon1.png", name: "knife" },
            { url: "assets/Intro/weapon2.png", name: "sword" },
            { url: "assets/Intro/weapon3.png", name: "spear" },
        ];

        const rangedWeapons = [
            { url: "assets/Intro/weapon4.png", name: "pistol" },
            { url: "assets/Intro/weapon5.png", name: "sniper" },
        ];

        MainMenu.selectedMeleeWeapon = null;
        MainMenu.selectedRangedWeapon = null;
        MainMenu.selectedCharacter = null;
        let selectedMeleeElement: any = null;
        let selectedRangedElement: any = null;

        const buttonElement = document.createElement("button");
        buttonElement.textContent = "OK";
        buttonElement.style.position = "absolute";
        buttonElement.style.top = "75%";
        buttonElement.style.left = "50%";
        buttonElement.style.transform = "translate(-50%, -50%)";
        buttonElement.style.padding = "10px 20px";
        buttonElement.style.fontFamily = '"Press Start 2P", sans-serif';
        buttonElement.style.fontSize = "20px";
        buttonElement.style.backgroundColor = "#43ac42";
        buttonElement.style.color = "white";
        buttonElement.style.border = "none";
        buttonElement.style.cursor = "pointer";
        buttonElement.style.display = "none";
        buttonElement.style.zIndex = "100";
        buttonElement.addEventListener("click", () => {
            this.cleanup();
            this.sound.stopAll();
            this.scene.start("CheckpointAndChapters");
        });

        screenDiv.appendChild(buttonElement);

        const checkSelectionsAndUpdateText = () => {
            if (
                MainMenu.selectedMeleeWeapon &&
                MainMenu.selectedRangedWeapon &&
                MainMenu.selectedCharacter === "char1.5"
            ) {
                textElement.textContent = "PRESS OK TO CONTINUE...";
                buttonElement.style.display = "block";
            } else {
                textElement.textContent = "SELECT YOUR WEAPONS & CHARACTER";
                buttonElement.style.display = "none";
            }
        };

        const createWeaponRow = (weapons: any, label: any) => {
            const rowContainer = document.createElement("div");
            rowContainer.style.display = "flex";
            rowContainer.style.alignItems = "center";
            rowContainer.style.justifyContent = "flex-start";
            rowContainer.style.marginBottom = "10px";
            rowContainer.style.width = "100%";
            rowContainer.style.paddingLeft = "20px";

            const labelDiv = document.createElement("div");
            labelDiv.textContent = label;
            labelDiv.style.color = "white";
            labelDiv.style.fontSize = "24px";
            labelDiv.style.marginRight = "10px";
            labelDiv.style.width = "150px";
            rowContainer.appendChild(labelDiv);

            const weaponRow = document.createElement("div");
            weaponRow.style.display = "flex";
            weaponRow.style.justifyContent = "flex-start";

            weapons.forEach((weapon: any) => {
                const wrapper = document.createElement("div");
                const wrapperContainer = document.createElement("div");
                wrapperContainer.style.display = "flex";
                wrapperContainer.style.flexDirection = "column";
                wrapperContainer.style.alignItems = "center";
                wrapperContainer.style.margin = "0 10px";
                wrapperContainer.classList.add("weapon-image");
                wrapper.style.display = "flex";
                wrapper.style.justifyContent = "center";
                wrapper.style.alignItems = "center";
                wrapper.style.backgroundColor = "#e03c28";
                wrapper.style.padding = "10px";
                wrapper.style.border = "none";
                wrapper.style.boxShadow = "4px 4px 0 black, 8px 8px 0 black";
                wrapper.style.cursor = "pointer";

                const img = document.createElement("img");
                img.src = weapon.url;
                img.style.width = "60px";

                const weaponName = document.createElement("div");
                weaponName.textContent = weapon.name;
                weaponName.style.color = "white";
                weaponName.style.marginTop = "10px";

                if (weapon.name !== "knife" && weapon.name !== "pistol") {
                    wrapper.style.backgroundColor = "grey";
                    wrapper.style.cursor = "not-allowed";
                } else {
                    wrapper.addEventListener("click", () => {
                        const selectweapon = this.sound.add("select");
                        selectweapon.play();
                        if (label === "Melee") {
                            if (selectedMeleeElement) {
                                selectedMeleeElement.style.backgroundColor =
                                    "#e03c28";
                            }
                            MainMenu.selectedMeleeWeapon = weapon.name;
                            selectedMeleeElement = wrapper;
                        } else if (label === "Ranged") {
                            if (selectedRangedElement) {
                                selectedRangedElement.style.backgroundColor =
                                    "#e03c28";
                            }
                            MainMenu.selectedRangedWeapon = weapon.name;
                            selectedRangedElement = wrapper;
                        }
                        wrapper.style.backgroundColor = "#43ac42";
                        checkSelectionsAndUpdateText();
                    });
                }

                wrapper.appendChild(img);
                wrapper.classList.add("weapon-wrapper");

                wrapperContainer.appendChild(wrapper);
                wrapperContainer.appendChild(weaponName);

                weaponRow.appendChild(wrapperContainer);
            });

            rowContainer.appendChild(weaponRow);
            return rowContainer;
        };

        const meleeRow = createWeaponRow(meleeWeapons, "Melee");
        const rangedRow = createWeaponRow(rangedWeapons, "Ranged");

        weaponContainer.appendChild(meleeRow);
        weaponContainer.appendChild(rangedRow);

        screenDiv.appendChild(weaponContainer);

        screenDiv.style.animation = "fade-in 2s forwards";

        const imageContainer = document.createElement("div");
        imageContainer.style.display = "flex";
        imageContainer.style.justifyContent = "center";
        imageContainer.style.alignItems = "center";
        imageContainer.style.position = "absolute";
        imageContainer.style.top = "37%";
        imageContainer.style.left = "50%";
        imageContainer.style.transform = "translate(-50%, -50%)";
        imageContainer.style.width = "90px";
        imageContainer.style.height = "auto";

        const imageUrls = [
            "assets/Intro/char2.png",
            "assets/Intro/char2.png",
            "assets/Intro/char2.png",
            "assets/Intro/char1.5.png",
            "assets/Intro/char2.png",
            "assets/Intro/char2.png",
            "assets/Intro/char2.png",
        ];
        imageUrls.forEach((url) => {
            const img = document.createElement("img");
            img.src = url;
            img.classList.add("char-image");
            img.style.cursor = "pointer";
            img.style.zIndex = "10";
            img.addEventListener("click", () => {
                const selectAudio = this.sound.add("select");
                selectAudio.play();
                this.characterDetailsScreen(img, url);
                if (url === "assets/Intro/char1.5.png") {
                    MainMenu.selectedCharacter = "char1.5";
                } else {
                    MainMenu.selectedCharacter = "others";
                }
                checkSelectionsAndUpdateText();
            });
            imageContainer.appendChild(img);
        });

        screenDiv.appendChild(imageContainer);

        const textElement = document.createElement("div");
        textElement.style.position = "absolute";
        textElement.style.top = "10%";
        textElement.style.left = "50%";
        textElement.style.transform = "translate(-50%, -50%)";
        textElement.style.color = "white";
        textElement.style.fontFamily = '"Press Start 2P", sans-serif';
        textElement.style.fontSize = "18px";
        textElement.style.zIndex = "100";
        textElement.style.textAlign = "center";
        textElement.textContent = "SELECT YOUR WEAPONS & CHARACTER";
        screenDiv.appendChild(textElement);
    }

    characterDetailsScreen(img: any, imageUrl: any) {
        const allChars = document.querySelectorAll(".char-image");
        allChars.forEach((char) => char.classList.remove("highlight"));

        img.classList.add("highlight");

        const existingDetailsDiv = document.getElementById("characterDetails");
        if (existingDetailsDiv) {
            existingDetailsDiv.remove();
        }

        const detailsDiv = document.createElement("div");
        detailsDiv.id = "characterDetails";
        detailsDiv.style.position = "absolute";
        detailsDiv.style.top = "87%";
        detailsDiv.style.left = "50%";
        detailsDiv.style.transform = "translate(-50%, -50%)";
        detailsDiv.style.display = "flex";
        detailsDiv.style.justifyContent = "space-between";
        detailsDiv.style.alignItems = "center";
        detailsDiv.style.width = "100%";
        detailsDiv.style.height = "auto";
        detailsDiv.style.paddingLeft = "100px";
        detailsDiv.style.paddingRight = "100px";
        detailsDiv.style.paddingBottom = "10px";
        detailsDiv.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
        detailsDiv.style.zIndex = "5";

        const textElement = document.createElement("div");
        textElement.style.display = "flex";
        textElement.style.flexDirection = "column";

        const firstLine = document.createElement("div");
        firstLine.style.color = "red";
        firstLine.style.fontFamily = '"Press Start 2P", sans-serif';
        firstLine.style.fontSize = "24px";
        firstLine.textContent =
            imageUrl === "assets/Intro/char2.png"
                ? "Character Locked"
                : "Askar";

        const secondLine = document.createElement("div");
        secondLine.style.color = "white";
        secondLine.style.fontFamily = '"Press Start 2P", sans-serif';
        secondLine.style.fontSize = "16px";
        secondLine.style.marginTop = "10px";
        secondLine.textContent =
            imageUrl === "assets/Intro/char2.png"
                ? "You haven't unlocked this character yet."
                : "A tough military leader, good at planning and very responsible.";

        textElement.appendChild(firstLine);
        textElement.appendChild(secondLine);

        let detailsImageUrl = "";
        if (imageUrl === "assets/Intro/char2.png") {
            detailsImageUrl = "assets/Intro/char2Displayed.png";
        } else if (imageUrl === "assets/Intro/char1.5.png") {
            detailsImageUrl = "assets/Intro/char1.5Display.png";
        }

        const imgElement = document.createElement("img");
        imgElement.src = detailsImageUrl;
        imgElement.style.width = "200px";
        imgElement.style.height = "auto";

        detailsDiv.appendChild(textElement);
        detailsDiv.appendChild(imgElement);

        const screenDiv = document.getElementById("characterSelectionScreen");
        if (screenDiv) {
            screenDiv.appendChild(detailsDiv);
        } else {
            console.error("characterSelectionScreen element not found");
        }
    }

    startCredits() {
        this.cleanup();
        this.scene.start("GameCredits");
    }

    cleanup() {
        const elementsToRemove = [
            "mainMenuScreen",
            "characterSelectionScreen",
            "characterDetailsScreen",
        ];
        elementsToRemove.forEach((id) => {
            const element = document.getElementById(id);
            if (element) {
                document.body.removeChild(element);
            }
        });
    }
}
