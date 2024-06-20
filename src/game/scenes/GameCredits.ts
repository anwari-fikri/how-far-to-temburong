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
export class GameCredits extends Scene {
    constructor() {
        super("GameCredits");
    }

    preload() {
        loadGoogleFont();
    }

    create() {
        addGlobalStyles();

        this.cameras.main.setBackgroundColor("#000000");

        EventBus.emit("current-scene-ready", this);

        this.showCredits();
    }

    showCredits() {
        this.cleanup();

        const creditsData = [
            { type: "Developed by", names: "Anwari Games" },
            { type: "Producer", names: "Anwari" },
            { type: "Director", names: "Muin" },
            { type: "Graphic Artist", names: "Amirul" },
            { type: "Programmers", names: "Danial, Anwari, Wajdi, Muin" },
            { type: "Music/Sounds", names: "Wajdi" },
        ];

        const creditsDiv = document.createElement("div");
        creditsDiv.id = "gameCredits";
        creditsDiv.style.position = "fixed";
        creditsDiv.style.top = "50%";
        creditsDiv.style.left = "50%";
        creditsDiv.style.transform = "translate(-50%, -50%)";
        creditsDiv.style.fontFamily = '"Press Start 2P", Arial, sans-serif';
        creditsDiv.style.fontSize = "24px";
        creditsDiv.style.color = "#ffffff";
        creditsDiv.style.textAlign = "left"; // Align text to the left

        // Create a heading for "Credits" with larger font size
        const creditsHeading = document.createElement("h1");
        creditsHeading.textContent = "Credits";
        creditsHeading.style.textAlign = "center"; // Center align the heading
        creditsHeading.style.paddingBottom = "15px";
        creditsHeading.style.fontSize = "36px"; // Set larger font size
        creditsDiv.appendChild(creditsHeading);

        creditsData.forEach((credit) => {
            const creditLine = document.createElement("div");
            creditLine.textContent = `${credit.type}: ${credit.names}`;
            creditLine.style.marginBottom = "8px"; // Add margin for gap
            creditsDiv.appendChild(creditLine);
        });

        // Create an "OK" button
        const okButton = document.createElement("button");
        okButton.textContent = "OK";
        okButton.style.display = "block";
        okButton.style.margin = "auto";
        okButton.style.marginTop = "20px"; // Add margin for spacing
        okButton.style.padding = "10px 20px";
        okButton.style.fontSize = "20px";
        okButton.style.cursor = "pointer";
        okButton.addEventListener("click", () => {
            this.cleanup();
            this.closeCredits();
        });
        creditsDiv.appendChild(okButton);

        document.body.appendChild(creditsDiv);
    }

    closeCredits() {
        this.cleanup;
        this.scene.start("MainMenu"); // Redirect to Main Menu scene
    }

    cleanup() {
        const creditsDiv = document.getElementById("gameCredits");
        if (creditsDiv) {
            document.body.removeChild(creditsDiv);
        }
    }
}
