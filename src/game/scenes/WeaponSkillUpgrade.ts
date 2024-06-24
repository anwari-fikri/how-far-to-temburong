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

    @keyframes shake {
        0% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        50% { transform: translateX(5px); }
        75% { transform: translateX(-5px); }
        100% { transform: translateX(0); }
    }

    body {
        margin: 0;
        padding: 0;
        height: 100vh;
        background-color: transparent; 
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
        background-color: transparent; 
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
        margin: 0 15px;
        transition: transform 0.3s ease;
        width: 200px; 
        height: 270px; 
        display: flex;
        flex-direction: column;
        justify-content: space-between; 
        align-items: center;
        position: relative; 
    }

    .skill-div img {
        width: 100px;
        height: 100px;
        margin-bottom: 10px; 
        position: absolute;
        top: 80px;
    }

    .skill-text {
        color: white;
        font-family: 'Press Start 2P', sans-serif;
        margin-bottom: 10px; 
    }

    .skill-description {
        font-size: 10px;
        color: white;
        font-family: 'Press Start 2P', sans-serif;
        width: 100%; 
        text-align: center;
        margin-top: 10px; 
    }

    .skill-div:hover {
        transform: scale(1.1);
    }

    .big-text, .upgrade-text {
        position: absolute;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 40px;
        color: white;
        text-align: center;
        align-items: center;
        font-family: 'Press Start 2P', sans-serif;
        
    }

    @keyframes flash-text {
        0%, 100% { opacity: 1; }
        50% { opacity: 0; }
    }
    
    .big-text {
        top: 20%;
        animation: flash-text 1s infinite;
    }
    
    .upgrade-text {
        top: 65%;
        width:899px;
        height:100vh;
        animation: flash-text 1s infinite;
    }
    

    .result-div {
        text-align: center;
        margin: 0 15px;
        width: 200px; 
        height: 270px; 
        display: flex;
        flex-direction: column;
        justify-content: space-between; 
        align-items: center;
        position: relative; 
        background: #98444c;
        color: white;
        font-family: 'Press Start 2P', sans-serif;
        padding: 10px;
        border: 4px solid black;
        box-shadow: 6px 6px 0 black, 12px 12px 0 black;
        image-rendering: pixelated;
        animation: fade-in 1s forwards, shake 0.5s; 
    }

    .result-div img {
        width: 100px;
        height: 100px;
        margin-bottom: 10px; 
    }

    .result-description {
        font-size: 10px;
        color: white;
        font-family: 'Press Start 2P', sans-serif;
        width: 100%; 
        text-align: center;
        margin-top: 10px; 
    }
    `;
    document.head.appendChild(style);
}

export class WeaponSkillUpgrade extends Scene {
    weaponSkill: WeaponSkill;
    selectedSkill: SkillLevel | null;

    constructor() {
        super("WeaponSkillUpgrade");
        this.weaponSkill = new WeaponSkill();
        this.selectedSkill = null;
    }

    preload() {
        loadGoogleFont();
    }

    create() {
        addGlobalStyles();
        this.cameras.main.setBackgroundColor("rgba(0, 0, 0, 0)");
        EventBus.emit("current-scene-ready", this);

        this.weaponSkillUpgradeScreen();
    }

    weaponSkillUpgradeScreen() {
        this.cleanup();
    
        const screenDiv = document.createElement("div");
        screenDiv.id = "weaponSkillUpgrade";
        screenDiv.style.position = "fixed";
        screenDiv.style.top = "0";
        screenDiv.style.left = "0";
        screenDiv.style.width = "100vw";
        screenDiv.style.height = "100vh";
        screenDiv.style.backgroundColor = "transparent";
        screenDiv.style.display = "flex";
        screenDiv.style.justifyContent = "center";
        screenDiv.style.alignItems = "center";
        screenDiv.style.zIndex = "100";
    
        const bigText = document.createElement("div");
        bigText.className = "big-text";
        bigText.textContent = "CHOOSE A SKILL!";
        screenDiv.appendChild(bigText);
    
        document.body.appendChild(screenDiv);
        screenDiv.style.animation = "fade-in 1s forwards";
    
        setTimeout(() => {
            const container = document.createElement("div");
            container.id = "container";
            container.style.display = "flex";
            container.style.flexDirection = "row";
            container.style.alignItems = "center";
            screenDiv.appendChild(container);
    
            const weaponSkill = Game.player.weaponSkill;
            const displayedSkills: SkillLevel[] = weaponSkill.choose3Random();
    
            if (displayedSkills.length === 0) {
                const maxLevelText = document.createElement("div");
                maxLevelText.className = "skill-text";
                maxLevelText.textContent = "All skills are at max level.";
                container.appendChild(maxLevelText);
    
                setTimeout(() => {
                    this.goToGame();
                }, 2000);
            } else {
                displayedSkills.forEach((skill: SkillLevel, index: any) => {
                    const skillDiv = document.createElement("div");
                    skillDiv.className = "skill-div";
                    skillDiv.style.fontFamily = '"Press Start 2P", sans-serif';
                    skillDiv.style.color = "black";
                    skillDiv.style.background = "#98444c";
                    skillDiv.style.padding = "10px";
                    skillDiv.style.border = "4px solid black";
                    skillDiv.style.boxShadow = "6px 6px 0 black, 12px 12px 0 black";
                    skillDiv.style.imageRendering = "pixelated";
                    skillDiv.style.animation = 'fade-in 2s forwards';
    
                    const text = document.createElement("div");
                    text.className = "skill-text";
                    text.textContent = `${skill.displayName} lvl.${skill.level + 1}`;
                    skillDiv.appendChild(text);
    
                    const img = document.createElement("img");
                    img.src = skill.imageUrl;
                    skillDiv.appendChild(img);
    
                    const description = document.createElement("div");
                    description.className = "skill-description";
                    description.textContent = skill.description;
                    skillDiv.appendChild(description);
    
                    skillDiv.addEventListener("click", () => {
                        this.selectedSkill = skill;
                        Game.player.weaponSkill.applyLevelUp(skill.displayName);
                        this.showResultScreen();
                    });
    
                    container.appendChild(skillDiv);
                });
            }
        }, 2000); 
    }


    showResultScreen() {
        this.cleanup();
    
        const resultScreenDiv = document.createElement("div");
        resultScreenDiv.id = "resultScreen";
        resultScreenDiv.style.position = "fixed";
        resultScreenDiv.style.top = "50%";
        resultScreenDiv.style.left = "50%";
        resultScreenDiv.style.transform = "translate(-50%, -50%)";
        resultScreenDiv.style.display = "flex";
        resultScreenDiv.style.alignItems = "center";
        resultScreenDiv.style.background = "transparent";
        resultScreenDiv.style.flexDirection = "column"; 
    
        const skillDiv = document.createElement("div");
        skillDiv.className = "skill-div";
        skillDiv.style.fontFamily = '"Press Start 2P", sans-serif';
        skillDiv.style.color = "black";
        skillDiv.style.background = "#98444c";
        skillDiv.style.padding = "10px";
        skillDiv.style.border = "4px solid black";
        skillDiv.style.boxShadow = "6px 6px 0 black, 12px 12px 0 black";
        skillDiv.style.imageRendering = "pixelated";
    
        const text = document.createElement("div");
        text.className = "skill-text";
        text.textContent = `${this.selectedSkill!.displayName} lvl.${this.selectedSkill!.level - 1}`;
        skillDiv.appendChild(text);
    
        const img = document.createElement("img");
        img.src = this.selectedSkill!.imageUrl;
        skillDiv.appendChild(img);

        const description = document.createElement("div");
        description.className = "skill-description";
        description.textContent = this.selectedSkill!.description;
        skillDiv.appendChild(description);
    
        resultScreenDiv.appendChild(skillDiv);
        document.body.appendChild(resultScreenDiv);

        const upgradeMessage = document.createElement("div");
        upgradeMessage.className = "upgrade-text";
        upgradeMessage.style.marginTop = "80px"; 
        if (this.selectedSkill!.level === 1) {
            upgradeMessage.textContent = "NEW SKILL UNLOCKED!";
        } else {
            upgradeMessage.textContent = "SKILL LEVEL UP!";
        }
        resultScreenDiv.appendChild(upgradeMessage);
    
        document.body.appendChild(resultScreenDiv);

        skillDiv.style.animation = "shake 1s, fade-out 2s"; 
    
        setTimeout(() => {
            text.textContent = `${this.selectedSkill!.displayName} lvl.${this.selectedSkill!.level}`;
            skillDiv.style.animation = "fade-in 1s"; 
        }, 1500); 
    
        setTimeout(() => {
            this.goToGame();
        }, 2000);
    
    }
    

    cleanup() {
        const existingDiv = document.getElementById("weaponSkillUpgrade");
        if (existingDiv) {
            document.body.removeChild(existingDiv);
        }
        const existingResultDiv = document.getElementById("resultScreen");
        if (existingResultDiv) {
            document.body.removeChild(existingResultDiv);
        }
    }

    goToGame() {
        this.cleanup();
        this.scene.stop();
        this.scene.resume("Game");
    }
}
