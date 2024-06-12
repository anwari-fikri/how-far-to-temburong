import { Scene } from "phaser";
import { EventBus } from "../EventBus";
import Typed from "typed.js";

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

export class Intro extends Scene {
    static selectedMeleeWeapon: any;
    static selectedRangedWeapon: any;
    static selectedCharacter: any;

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
                                        this.mainMenuScreen();
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

    mainMenuScreen() {
        this.cleanup();

        const mainMenuSound = this.sound.add("mainMenu");
        mainMenuSound.play({ loop: true });

        const screenDiv = document.createElement("div");
        screenDiv.id = "mainMenuScreen";
        screenDiv.style.position = "fixed";
        screenDiv.style.top = "50%";
        screenDiv.style.left = "50%";
        screenDiv.style.transform = "translate(-50%, -50%)";
        screenDiv.style.backgroundImage = 'url("assets/Intro/mainMenu2.gif")';
        screenDiv.style.backgroundSize = "100% 100%"; // Adjust the size here
        screenDiv.style.backgroundRepeat = "no-repeat"; // Prevent the image from repeating
        screenDiv.style.backgroundPosition = "center"; // Center the image within the div
        screenDiv.style.width = "75%"; // Set the specific width
        screenDiv.style.height = "100%"; // Set the specific height
        screenDiv.style.border = "none";
        screenDiv.style.boxShadow = "none";
        screenDiv.style.opacity = "0";
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
            "radial-gradient(circle, rgba(0, 0, 0, 0) 10%, rgba(0, 0, 0, 0.8) 100%)";
        screenDiv.appendChild(vignetteOverlay);

        // Create and style the new image
        const topImage = document.createElement("img");
        topImage.src = "assets/Intro/gameTitle2.png"; // Path to your new image
        topImage.style.position = "absolute";
        topImage.style.top = "5%"; // Adjust the top position as needed
        topImage.style.left = "50%";
        topImage.style.transform = "translateX(-50%)";
        topImage.style.zIndex = "15"; // Make sure it is above other elements
        topImage.style.width = "50%"; // Adjust the size as needed
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

        createButton(
            "Start",
            "startButton",
            "53%",
            () => {
                const menuButtonSound = this.sound.add("menuButton");
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
            "Settings",
            "settingsButton",
            "63%",
            () => console.log("Settings clicked"),
            "assets/Intro/buttons.png",
        );
        const settingsButton = document.getElementById("settingsButton");
        if (settingsButton) {
            settingsButton.style.left = settingsButtonLeft;
        }
        createButton(
            "Credits",
            "creditsButton",
            "73%",
            () => console.log("Credits clicked"),
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
            "radial-gradient(circle, rgba(0, 0, 0, 0) 10%, rgba(0, 0, 0, 0.8) 100%)";
        screenDiv.appendChild(vignetteOverlay);

        // Create a container for the weapon selection
        const weaponContainer = document.createElement("div");
        weaponContainer.style.display = "flex";
        weaponContainer.style.flexDirection = "column";
        weaponContainer.style.alignItems = "center";
        weaponContainer.style.position = "absolute";
        weaponContainer.style.top = "34%";
        weaponContainer.style.left = "44%";
        weaponContainer.style.transform = "translate(-50%, -50%)";
        weaponContainer.style.width = "600px";
        weaponContainer.style.height = "250px"; // Increased height to accommodate text
        weaponContainer.style.fontFamily = '"Press Start 2P", sans-serif';
        weaponContainer.style.fontSize = "14px";
        weaponContainer.style.zIndex = "6";
        weaponContainer.style.backgroundColor = "none";

        // Add weapon images to the container
        const meleeWeapons = [
            { url: "assets/Intro/weapon1.png", name: "knife" },
            { url: "assets/Intro/weapon2.png", name: "sword" },
            { url: "assets/Intro/weapon3.png", name: "spear" },
        ];

        const rangedWeapons = [
            { url: "assets/Intro/weapon4.png", name: "pistol" },
            { url: "assets/Intro/weapon5.png", name: "sniper" },
        ];

        // Variables to track selected weapons
        Intro.selectedMeleeWeapon = null;
        Intro.selectedRangedWeapon = null;
        Intro.selectedCharacter = null;
        let selectedMeleeElement: any = null;
        let selectedRangedElement: any = null;

        // Function to check selections and update text
        const checkSelectionsAndUpdateText = () => {
            if (
                Intro.selectedMeleeWeapon &&
                Intro.selectedRangedWeapon &&
                Intro.selectedCharacter === "char1.5"
            ) {
                textElement.textContent = "PRESS ENTER TO CONTINUE...";
                this.enableEnterKey();
            } else {
                textElement.textContent = "SELECT YOUR WEAPONS & CHARACTER";
            }
        };

        // Function to create weapon rows
        const createWeaponRow = (weapons: any, label: any) => {
            const rowContainer = document.createElement("div");
            rowContainer.style.display = "flex";
            rowContainer.style.alignItems = "center";
            rowContainer.style.justifyContent = "flex-start"; // Align items to the start (left side)
            rowContainer.style.marginBottom = "10px";
            rowContainer.style.width = "100%"; // Ensure the row takes up full width
            rowContainer.style.paddingLeft = "20px"; // Add padding to the left for spacing

            const labelDiv = document.createElement("div");
            labelDiv.textContent = label;
            labelDiv.style.color = "white";
            labelDiv.style.fontSize = "24px";
            labelDiv.style.marginRight = "10px";
            labelDiv.style.width = "150px";
            rowContainer.appendChild(labelDiv);

            const weaponRow = document.createElement("div");
            weaponRow.style.display = "flex";
            weaponRow.style.justifyContent = "flex-start"; // Align items to the start (left side)

            weapons.forEach((weapon: any) => {
                const wrapper = document.createElement("div");
                const wrapperContainer = document.createElement("div"); // Container for the wrapper and text
                wrapperContainer.style.display = "flex";
                wrapperContainer.style.flexDirection = "column";
                wrapperContainer.style.alignItems = "center";
                wrapperContainer.style.margin = "0 10px"; // Add some spacing between images
                wrapperContainer.classList.add("weapon-image"); // Add the weapon-image class for shaking effect
                wrapper.style.display = "flex";
                wrapper.style.justifyContent = "center";
                wrapper.style.alignItems = "center";
                wrapper.style.backgroundColor = "#e03c28";
                wrapper.style.padding = "10px"; // Add padding around the image
                wrapper.style.border = "none";
                wrapper.style.boxShadow = "4px 4px 0 black, 8px 8px 0 black";
                wrapper.style.cursor = "pointer"; // Add pointer cursor

                const img = document.createElement("img");
                img.src = weapon.url;
                img.style.width = "60px"; // Adjust the size of the weapon images

                // Create a div for the weapon name
                const weaponName = document.createElement("div");
                weaponName.textContent = weapon.name;
                weaponName.style.color = "white"; // Adjust text color
                weaponName.style.marginTop = "10px"; // Space between image and text

                wrapper.addEventListener("click", () => {
                    const selectweapon = this.sound.add("select"); // Add this line

                    if (label === "Melee") {
                        if (selectedMeleeElement) {
                            selectweapon.play(); // Change this line
                            selectedMeleeElement.style.backgroundColor =
                                "#e03c28";
                        }
                        Intro.selectedMeleeWeapon = weapon.name;
                        selectedMeleeElement = wrapper;
                    } else if (label === "Ranged") {
                        if (selectedRangedElement) {
                            selectweapon.play(); // Change this line
                            selectedRangedElement.style.backgroundColor =
                                "#e03c28";
                        }
                        Intro.selectedRangedWeapon = weapon.name;
                        selectedRangedElement = wrapper;
                    }
                    wrapper.style.backgroundColor = "#43ac42";
                    checkSelectionsAndUpdateText();
                });

                wrapper.appendChild(img);
                wrapper.classList.add("weapon-wrapper"); // Add a class for easier selection

                // Append the wrapper and weapon name to the wrapperContainer
                wrapperContainer.appendChild(wrapper);
                wrapperContainer.appendChild(weaponName);

                // Append the wrapperContainer to the weaponRow
                weaponRow.appendChild(wrapperContainer);
            });

            rowContainer.appendChild(weaponRow);
            return rowContainer;
        };

        // Create and append melee and ranged weapon rows
        const meleeRow = createWeaponRow(meleeWeapons, "Melee");
        const rangedRow = createWeaponRow(rangedWeapons, "Ranged");

        weaponContainer.appendChild(meleeRow);
        weaponContainer.appendChild(rangedRow);

        // Add the weapon container to the screenDiv
        screenDiv.appendChild(weaponContainer);

        // Add fade-in animation
        screenDiv.style.animation = "fade-in 2s forwards";

        // Create a container for the images
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

        // Add images to the container
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
                Intro.selectedCharacter =
                    url === "assets/Intro/char1.5.png" ? "char1.5" : "other";
                checkSelectionsAndUpdateText(); // Check selections and update text
            });
            imageContainer.appendChild(img);
        });

        screenDiv.appendChild(imageContainer);

        // Create and style the text element
        const textElement = document.createElement("div");
        textElement.textContent = "SELECT YOUR WEAPONS & CHARACTER";
        textElement.style.position = "absolute";
        textElement.style.top = "10%"; // Adjust the position as needed
        textElement.style.left = "50%";
        textElement.style.transform = "translate(-50%, -50%)";
        textElement.style.color = "white";
        textElement.style.fontFamily = '"Press Start 2P", sans-serif';
        textElement.style.fontSize = "20px";
        textElement.style.textAlign = "center";
        textElement.style.zIndex = "6"; // Ensure text is above images

        screenDiv.appendChild(textElement);
    }

    characterDetailsScreen(img: any, imageUrl: any) {
        // Remove highlight class from all character images
        const allChars = document.querySelectorAll(".char-image");
        allChars.forEach((char) => char.classList.remove("highlight"));

        // Add highlight class to the clicked character image
        img.classList.add("highlight");

        // Remove any existing details div
        const existingDetailsDiv = document.getElementById("characterDetails");
        if (existingDetailsDiv) {
            existingDetailsDiv.remove();
        }

        // Create a new div for character details
        const detailsDiv = document.createElement("div");
        detailsDiv.id = "characterDetails";
        detailsDiv.style.position = "absolute";
        detailsDiv.style.top = "87%"; // Adjust position as needed
        detailsDiv.style.left = "50%";
        detailsDiv.style.transform = "translate(-50%, -50%)";
        detailsDiv.style.display = "flex";
        detailsDiv.style.justifyContent = "space-between";
        detailsDiv.style.alignItems = "center";
        detailsDiv.style.width = "100%"; // Adjust width as needed
        detailsDiv.style.height = "auto";
        detailsDiv.style.paddingLeft = "100px";
        detailsDiv.style.paddingRight = "100px";
        detailsDiv.style.paddingBottom = "10px";
        detailsDiv.style.backgroundColor = "rgba(0, 0, 0, 0.5)"; // Semi-transparent background
        detailsDiv.style.zIndex = "5"; // Ensure details div is below character images

        // Create and style the text elements for character details
        const textElement = document.createElement("div");
        textElement.style.display = "flex";
        textElement.style.flexDirection = "column";

        // First line
        const firstLine = document.createElement("div");
        firstLine.style.color = "red";
        firstLine.style.fontFamily = '"Press Start 2P", sans-serif';
        firstLine.style.fontSize = "24px"; // Larger font size
        firstLine.textContent =
            imageUrl === "assets/Intro/char2.png"
                ? "Character Locked"
                : "Askar";

        // Second line
        const secondLine = document.createElement("div");
        secondLine.style.color = "white";
        secondLine.style.fontFamily = '"Press Start 2P", sans-serif';
        secondLine.style.fontSize = "16px"; // Normal font size
        secondLine.style.marginTop = "10px";
        secondLine.textContent =
            imageUrl === "assets/Intro/char2.png"
                ? "You haven't unlocked this character yet."
                : "A tough military leader, good at planning and very responsible.";

        // Append lines to text element
        textElement.appendChild(firstLine);
        textElement.appendChild(secondLine);

        // Determine the details image based on the clicked character
        let detailsImageUrl = "";
        if (imageUrl === "assets/Intro/char2.png") {
            detailsImageUrl = "assets/Intro/char2Displayed.png"; // Replace with your actual details image path
        } else if (imageUrl === "assets/Intro/char1.5.png") {
            detailsImageUrl = "assets/Intro/char1.5Display.png"; // Replace with your actual details image path
        }

        // Create and style the image element for character details
        const imgElement = document.createElement("img");
        imgElement.src = detailsImageUrl; // Use the corresponding details image
        imgElement.style.width = "200px"; // Adjust width as needed
        imgElement.style.height = "auto"; // Maintain aspect ratio

        // Append text and image elements to the details div
        detailsDiv.appendChild(textElement);
        detailsDiv.appendChild(imgElement);

        // Append the details div to the screen div if it exists
        const screenDiv = document.getElementById("characterSelectionScreen");
        if (screenDiv) {
            screenDiv.appendChild(detailsDiv);
        } else {
            console.error("characterSelectionScreen element not found");
        }
    }

    enableEnterKey(): void {
        const enterKey = this.input.keyboard?.addKey(
            Phaser.Input.Keyboard.KeyCodes.ENTER,
        );
        enterKey?.on("down", () => {
            if (
                Intro.selectedMeleeWeapon &&
                Intro.selectedRangedWeapon &&
                Intro.selectedCharacter === "char1.5"
            ) {
                this.cleanup();
                this.sound.stopAll();
                this.scene.start("CheckpointAndChapters");
            }
        });
    }

    cleanup() {
        const elementsToRemove = [
            "companyNameScreen",
            "newspaperScreen",
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
