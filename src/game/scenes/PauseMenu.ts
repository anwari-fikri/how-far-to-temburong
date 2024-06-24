import { Scene } from "phaser";
import { EventBus } from "../EventBus";
import { Game } from "../scenes/Game";

function loadGoogleFont() {
    const link = document.createElement("link");
    link.href =
        "https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
}

function loadFontAwesome() {
    const link = document.createElement("link");
    link.href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css";
    link.rel = "stylesheet";
    document.head.appendChild(link);
}
function addGlobalStyles() {
    const style = document.createElement("style");
    style.textContent = `
    .volume-container {
        position: absolute;
        bottom: 7%;
        right: 15%;
        display: flex;
        align-items: center;
        z-index: 1000;
    }
    .volume-icon {
        font-size: 35px;
        color: #f29e00;
        margin-right: 10px;
    }
    .controls-container {
        position: absolute;
        bottom: 2%;
        left: 15%;
        display: flex;
        justify-content: flex-start;
        z-index: 1000;
    }
    .controls {
        display: flex;
        align-items: center;
        font-family: "Press Start 2P", sans-serif;
        font-size: 20px;
        color: #f29e00;
        margin-right: 20px;
    }
    .wasd-controls img {
        width: 100px;
        height: auto;
        margin-right: 10px;
    }
    .attack-controls img {
        width: 50px;
        height: auto;
        margin-right: 10px;
    }
    `;
    document.head.appendChild(style);
}


export class PauseMenu extends Scene {
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    gameOverText: Phaser.GameObjects.Text;
    escKey: Phaser.Input.Keyboard.Key | undefined;
    volumeSlider: HTMLInputElement | undefined;
    spriteSheet: HTMLImageElement;

    constructor() {
        super("PauseMenu");
    }

    create() {
        loadGoogleFont();
        loadFontAwesome();
        addGlobalStyles(); 

        this.cameras.main.setBackgroundColor("#000000");

        EventBus.emit("current-scene-ready", this);

        this.escKey = this.input.keyboard?.addKey(
            Phaser.Input.Keyboard.KeyCodes.ESC,
        );
        this.escKey?.on("down", () => {
            this.cleanup();
            this.sound.resumeAll();
            this.scene.resume("Game");
            this.scene.stop();
        });

        this.loadSpriteSheet();
        this.pauseMenuScreen();
    }

    loadSpriteSheet() {
        this.spriteSheet = new Image();
        this.spriteSheet.src = "assets/Intro/map.png";
    }

    pauseMenuScreen() {
        this.cleanup();

        const screenDiv = document.createElement("div");
        screenDiv.id = "pauseMenu";
        screenDiv.style.position = "fixed";
        screenDiv.style.top = "50%";
        screenDiv.style.left = "50%";
        screenDiv.style.transform = "translate(-50%, -50%)";
        screenDiv.style.backgroundImage = 'url("assets/Intro/GameOver.png")';
        screenDiv.style.backgroundSize = "78% 100%";
        screenDiv.style.backgroundRepeat = "no-repeat";
        screenDiv.style.backgroundPosition = "center";
        screenDiv.style.width = "100%";
        screenDiv.style.height = "100%";
        screenDiv.style.border = "none";
        screenDiv.style.boxShadow = "none";
        screenDiv.style.opacity = "1";
        document.body.appendChild(screenDiv);

        const imageElement = document.createElement("img");
        imageElement.src = "assets/Intro/pause.png";
        imageElement.style.position = "absolute";
        imageElement.style.top = "20%";
        imageElement.style.left = "50%";
        imageElement.style.transform = "translate(-50%, -50%)";
        imageElement.style.width = "47%";
        imageElement.style.height = "auto";

        screenDiv.appendChild(imageElement);

        const canvas = document.createElement("canvas");
        canvas.width = 400; 
        canvas.height = 400; 
        canvas.style.position = "absolute";
        canvas.style.top = "55%";
        canvas.style.left = "50%";
        canvas.style.transform = "translate(-50%, -50%)";
        screenDiv.appendChild(canvas);

        this.drawFrameOnCanvas(canvas, Game.gameStage - 1); 

        // const textElement = document.createElement("div");
        // textElement.textContent = "BACK TO MENU";
        // textElement.style.position = "absolute";
        // textElement.style.top = "90%";
        // textElement.style.left = "50%";
        // textElement.style.transform = "translate(-50%, -50%)";
        // textElement.style.color = "#f29e00";
        // textElement.style.fontFamily = '"Press Start 2P", sans-serif';
        // textElement.style.fontSize = "35px";
        // textElement.style.textAlign = "center";
        // textElement.style.zIndex = "6";
        // textElement.className = "text-shadow";

        // screenDiv.appendChild(textElement);

        const volumeContainer = document.createElement("div");
        volumeContainer.className = "volume-container";

        const volumeIcon = document.createElement("i");
        volumeIcon.className = "fas fa-volume-up volume-icon";
        volumeContainer.appendChild(volumeIcon);

        this.volumeSlider = document.createElement("input");
        this.volumeSlider.type = "range";
        this.volumeSlider.min = "0";
        this.volumeSlider.max = "1";
        this.volumeSlider.step = "0.01";
        this.volumeSlider.value = this.sound.volume.toString();
        volumeContainer.appendChild(this.volumeSlider);

        document.body.appendChild(volumeContainer);

        this.volumeSlider.addEventListener("input", (event) => {
            const target = event.target as HTMLInputElement;
            const newVolume = parseFloat(target.value);
            this.sound.volume = newVolume;
        });

        this.events.on(Phaser.Scenes.Events.SHUTDOWN, () => {
            if (volumeContainer && document.body.contains(volumeContainer)) {
                document.body.removeChild(volumeContainer);
            }
        });

        this.addControls();
    }

    addControls() {
        const screenDiv = document.getElementById("pauseMenu");
        if (!screenDiv) return;
    
        const controlsContainer = document.createElement("div");
        controlsContainer.className = "controls-container";
    
        const movementControls = document.createElement("div");
        movementControls.className = "controls wasd-controls";
        movementControls.innerHTML = `
            <img src="assets/Intro/wasd.png" alt="WASD keys">
            <span>Move</span>
        `;
        controlsContainer.appendChild(movementControls);
    
        const attackControls = document.createElement("div");
        attackControls.className = "controls attack-controls";
        attackControls.innerHTML = `
            <img src="assets/Intro/attack.png" alt="Left Mouse Button">
            <span>Attack</span>
        `;
        controlsContainer.appendChild(attackControls);
    
        screenDiv.appendChild(controlsContainer);
    }    

    drawFrameOnCanvas(canvas: HTMLCanvasElement, frameIndex: number) {
        const context = canvas.getContext("2d");
        if (!context) return;

        const frameWidth = this.spriteSheet.width / 5; 
        const frameHeight = this.spriteSheet.height;

        const sx = frameIndex * frameWidth;
        const sy = 0;
        const sWidth = frameWidth;
        const sHeight = frameHeight;
        const dx = 0;
        const dy = 0;
        const dWidth = canvas.width;
        const dHeight = canvas.height;

        this.spriteSheet.onload = () => {
            context.drawImage(
                this.spriteSheet,
                sx,
                sy,
                sWidth,
                sHeight,
                dx,
                dy,
                dWidth,
                dHeight
            );
        };
    }

    cleanup() {
        const screenDiv = document.getElementById("pauseMenu");
        if (screenDiv) {
            screenDiv.remove();
        }
    }
}
