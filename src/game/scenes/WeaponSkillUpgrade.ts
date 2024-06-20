import { Scene } from "phaser";
import { EventBus } from "../EventBus";
import { SkillLevel, WeaponSkill } from "../classes/WeaponSkill";
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

    body {
        margin: 0;
        padding: 0;
        height: 100vh;
        background-color: #000000;
        overflow: hidden;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    #weaponSkillUpgrade {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
        position: relative;
    }

    #container {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        width: 100%;
    }
    .skill-div {
        text-align: center;
        margin: 0 10px;
        transition: transform 0.3s ease;
        border: 2px solid white;
        border-radius: 10px;
        padding: 10px;
        width: 200px; 
        height: 270px; 
        display: flex;
        flex-direction: column;
        justify-content: space-between; /* Ensures space between elements */
        align-items: center;
        position: relative; 
    }
    
    .skill-div img {
        width: 100px;
        height: 100px;
        margin-bottom: 10px; /* Increased margin for better spacing */
    }
    
    .skill-text {
        color: white;
        font-family: 'Press Start 2P', sans-serif;
        margin-bottom: 10px; /* Increased margin for better spacing */
    }
    
    .skill-description {
        font-size: 10px;
        color: white;
        font-family: 'Press Start 2P', sans-serif;
        width: 100%; /* Adjust width as needed */
        text-align: center;
        margin-top: 10px; /* Added margin-top to separate from text */
    }
    
    .skill-div:hover {
        transform: scale(1.1);
    }

    .big-text {
        position: absolute;
        top: 20%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 40px;
        color: white;
        font-family: 'Press Start 2P', sans-serif;
    }

    `;
    document.head.appendChild(style);
}
export class WeaponSkillUpgrade extends Scene {
    weaponSkill: WeaponSkill;
    constructor() {
        super("WeaponSkillUpgrade");
        this.weaponSkill = new WeaponSkill();
    }

    preload() {
        loadGoogleFont();
    }

    create() {
        addGlobalStyles();
        this.cameras.main.setBackgroundColor("#000000");
        EventBus.emit("current-scene-ready", this);

        this.weaponSkillUpgradeScreen();
    }

    weaponSkillUpgradeScreen() {
        this.cleanup();

        const screenDiv = document.createElement("div");
        screenDiv.id = "weaponSkillUpgrade";
        screenDiv.style.position = "fixed"; // Change position to fixed
        screenDiv.style.top = "0"; // Position from the top of the viewport
        screenDiv.style.left = "0"; // Position from the left of the viewport
        screenDiv.style.width = "100vw"; // Full width of the viewport
        screenDiv.style.height = "100vh"; // Full height of the viewport
        screenDiv.style.backgroundColor = "rgba(0, 0, 0, 0.8)"; // Semi-transparent background
        screenDiv.style.display = "flex";
        screenDiv.style.justifyContent = "center";
        screenDiv.style.alignItems = "center";
        screenDiv.style.zIndex = "100"; // Increase z-index value

        const bigText = document.createElement("div");
        bigText.className = "big-text";
        bigText.textContent = "Skill Level Up!";
        screenDiv.appendChild(bigText);

        const container = document.createElement("div");
        container.id = "container";
        container.style.display = "flex";
        container.style.flexDirection = "row"; // Change to row for horizontal layout
        container.style.alignItems = "center"; // Center items horizontally
        screenDiv.appendChild(container);

        const weaponSkill = Game.player.weaponSkill;
        const displayedSkills: SkillLevel[] = weaponSkill.choose3Random();

        if (displayedSkills.length === 0) {
            const maxLevelText = document.createElement("div");
            maxLevelText.className = "skill-text";
            maxLevelText.textContent = "All skills are at max level.";
            container.appendChild(maxLevelText);

            container.addEventListener("click", () => {
                this.goToGame();
            });
        } else {
            displayedSkills.forEach((skill: SkillLevel) => {
                const skillDiv = document.createElement("div");
                skillDiv.className = "skill-div";

                const text = document.createElement("div");
                text.className = "skill-text";
                text.textContent = `${skill.displayName} lvl.${skill.level + 1}`;
                skillDiv.appendChild(text);

                const description = document.createElement("div");
                description.className = "skill-description";
                description.textContent = skill.description;
                skillDiv.appendChild(description);

                skillDiv.addEventListener("click", () => {
                    Game.player.weaponSkill.applyLevelUp(skill.displayName);
                    const selectSkill = this.sound.add("select");
                    selectSkill.play();
                    this.goToGame();
                });

                container.appendChild(skillDiv);

                // Add hover event to update skill description
                skillDiv.addEventListener("mouseover", () => {
                    description.style.display = "block"; // Show description on hover
                });
                skillDiv.addEventListener("mouseout", () => {
                    description.style.display = "none"; // Hide description when not hovered
                });
            });
        }

        document.body.appendChild(screenDiv);
        screenDiv.style.animation = "fade-in 1s forwards";
    }

    goToGame() {
        this.cleanup();
        this.scene.stop();
        this.scene.resume("Game");
    }

    cleanup() {
        const element = document.getElementById("weaponSkillUpgrade");
        if (element) {
            document.body.removeChild(element);
        }
    }
}
