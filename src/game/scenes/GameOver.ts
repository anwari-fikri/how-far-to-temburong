import { Scene } from "phaser";
import { EventBus } from "../EventBus";
import { Game } from "./Game";

function loadGoogleFont() {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap";
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

    .button {
        background: none;
        border: none;
        color: white;
        font-family: 'Press Start 2P', sans-serif;
        font-size: 30px;
        position: absolute;
        transition: color 0.3s ease-in-out, transform 0.1s ease-in-out;
        text-shadow: 2px 2px 4px #333333;
    }

    .text-shadow {
        text-shadow: 2px 2px 4px #333333; 
    }

    .bordered {
        border: 2px solid white; 
        padding: 10px;
    }

    .top-left, .top-center, .top-right {
        position: absolute;
        color: white;
        font-family: 'Press Start 2P', sans-serif;
        font-size: 20px;
        z-index: 10;
        text-shadow: 2px 2px 4px #333333;
    }

    .top-left {
        top: 10px;
        left: 200px;
    }

    .top-center {
        top: 10px;
        left: 50%;
        transform: translateX(-50%);
    }

    .top-right {
        top: 10px;
        right: 200px;
    }
    `;
    document.head.appendChild(style);
}

export class GameOver extends Scene {
    currentSelection: string;
    kill: Phaser.GameObjects.Text;
    distance: Phaser.GameObjects.Text;
    timePlay: Phaser.GameObjects.Text;
    constructor() {
        super("GameOver");
    }

    preload() {
    }

    create() {
        loadGoogleFont();
        addGlobalStyles();

        this.cameras.main.setBackgroundColor("#000000");

        EventBus.emit("current-scene-ready", this);

        setTimeout(() => {
            this.gameOverScreen();
        }, 1000);
    }

    gameOverScreen() {
        this.cleanup();
    
        const screenDiv = document.createElement("div");
        screenDiv.id = "gameOverScreen";
        screenDiv.style.position = "fixed";
        screenDiv.style.top = "50%";
        screenDiv.style.left = "50%";
        screenDiv.style.transform = "translate(-50%, -50%)";
        screenDiv.style.backgroundImage = 'url("assets/Intro/GameOver.png")';
        screenDiv.style.backgroundSize = '78% 100%';
        screenDiv.style.backgroundRepeat = 'no-repeat';
        screenDiv.style.backgroundPosition = 'center';
        screenDiv.style.width = '100%';
        screenDiv.style.height = '100%';
        screenDiv.style.border = "none";
        screenDiv.style.boxShadow = "none";
        screenDiv.style.opacity = "0";
        document.body.appendChild(screenDiv);
    
        const imageElement = document.createElement("img");
        imageElement.src = "assets/Intro/GameOverText.png"; 
        imageElement.style.position = "absolute";
        imageElement.style.top = "40%";
        imageElement.style.left = "50%";
        imageElement.style.transform = "translate(-50%, -50%)";
        imageElement.style.width = "47%"; 
        imageElement.style.height = "auto"; 
    
        const textElement = document.createElement("div");
        textElement.textContent = "CONTINUE?";
        textElement.style.position = "absolute";
        textElement.style.top = "70%"; 
        textElement.style.left = "50%";
        textElement.style.transform = "translate(-50%, -50%)";
        textElement.style.color = "#f29e00";
        textElement.style.fontFamily = '"Press Start 2P", sans-serif';
        textElement.style.fontSize = "35px";
        textElement.style.textAlign = "center";
        textElement.style.zIndex = "6"; 
        textElement.className = "text-shadow"; 
    
        const yesButton = document.createElement("button");
        yesButton.textContent = "YES";
        yesButton.className = "button text-shadow"; 
        yesButton.style.top = "80%";
        yesButton.style.left = "50%";
        yesButton.style.transform = "translate(-50%, -50%)";
        yesButton.onclick = () => {
            this.selectOption("yes");
        };
    
        const noButton = document.createElement("button");
        noButton.textContent = "NO";
        noButton.className = "button text-shadow"; 
        noButton.style.top = "90%";
        noButton.style.left = "50%";
        noButton.style.transform = "translate(-50%, -50%)";
        noButton.onclick = () => {
            this.selectOption("no");
        };
    
        const arrowElement = document.createElement("div");
        arrowElement.textContent = ">"; 
        arrowElement.id = "arrow";
        arrowElement.style.position = "absolute";
        arrowElement.style.width = "50px";
        arrowElement.style.height = "auto";
        arrowElement.style.left = "47%"; 
        arrowElement.style.transform = "translate(-50%, -50%)";
        arrowElement.style.transition = "top 0.3s ease-in-out";
        arrowElement.style.zIndex = "7"; 
        arrowElement.style.color = "white"; 
        arrowElement.style.fontFamily = '"Press Start 2P', 'sans-serif'; 
        arrowElement.style.fontSize = "30px"; 
        arrowElement.className = "text-shadow"; 

        const killsElement = document.createElement("div");
        killsElement.textContent = "Kills:"; 
        killsElement.className = "top-left text-shadow";
        killsElement.style.color = "#f29e00";
        
        const killsElementSpan:any = document.createElement("span");
        killsElementSpan.textContent = Game.totalKill; 
        killsElementSpan.style.color = "white"; 
        killsElement.appendChild(killsElementSpan); 

        const distanceElement = document.createElement("div");
        distanceElement.textContent = "Distance: " ; 
        distanceElement.className = "top-center text-shadow";
        distanceElement.style.color = "#f29e00";

        const distanceValueSpan:any = document.createElement("span");
        distanceValueSpan.textContent = Game.totalDistance; 
        distanceValueSpan.style.color = "white"; 
        distanceElement.appendChild(distanceValueSpan); 

            // Create top-right element for time
        const timeElement = document.createElement("div");
        timeElement.textContent = "Time: "; // Set the text content for "Time: "
        timeElement.className = "top-right text-shadow";
        timeElement.style.color = "#f29e00"; // Set the color of "Time: " text to #f29e00

        // Create a span element for the actual time data
        const timeValueSpan:any = document.createElement("span");
        timeValueSpan.textContent = Game.totalTime; 
        timeValueSpan.style.color = "white"; 
        timeElement.appendChild(timeValueSpan); 

        screenDiv.appendChild(textElement); 
        screenDiv.appendChild(imageElement); 
        screenDiv.appendChild(yesButton);         
        screenDiv.appendChild(noButton);        
        screenDiv.appendChild(arrowElement); 
        screenDiv.appendChild(killsElement); 
        screenDiv.appendChild(distanceElement); 
        screenDiv.appendChild(timeElement);     
        screenDiv.style.animation = "fade-in 1s forwards";
    
       
        this.currentSelection = "yes";
        this.updateArrowPosition();
    

        document.addEventListener("keydown", this.handleKeydown.bind(this));
    }
    
    handleKeydown(event:any) {
        if (event.key === "ArrowUp" || event.key === "ArrowDown") {
            if (this.currentSelection === "yes") {
                this.currentSelection = "no";
            } else {
                this.currentSelection = "yes";
            }
            this.updateArrowPosition();
        } else if (event.key === "Enter") {
            this.selectOption(this.currentSelection);
        }
    }

    updateArrowPosition() {
        const arrow = document.getElementById("arrow");
        if (arrow) {
            if (this.currentSelection === "yes") {
                arrow.style.top = "80%";
            } else if (this.currentSelection === "no") {
                arrow.style.top = "90%";
            }
        }
    }

    selectOption(option:any) {
        console.log(`${option.toUpperCase()} clicked`);
        if (option === "yes") {
        this.cleanup();
            this.scene.start("Game");
        } else if (option === "no") {

        }
    }

    cleanup() {
        const screenDiv = document.getElementById("gameOverScreen");
        if (screenDiv) {
            screenDiv.remove();
        }
        document.removeEventListener("keydown", this.handleKeydown.bind(this));
    }
}
