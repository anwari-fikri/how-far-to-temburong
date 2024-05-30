import { Scene } from 'phaser';
import { EventBus } from '../EventBus';
import Typed from 'typed.js';

function loadGoogleFont() {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
}

function addGlobalStyles() {
    const style = document.createElement('style');
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
    `;
    document.head.appendChild(style);
}

export class Intro extends Scene {
    constructor() {
        super('Intro');
    }

    preload() {
        this.load.image('background', 'assets/Intro/Company.png'); // Load the background image
    }

    create() {
        loadGoogleFont();
        addGlobalStyles();

        this.cameras.main.setBackgroundColor('#000000');

        EventBus.emit('current-scene-ready', this);

        setTimeout(() => {
            this.showScreen1();
        }, 1000);
    }

    showScreen1() {
        this.cleanup();
    
        const screenDiv = document.createElement('div');
        screenDiv.id = 'screen1';
        screenDiv.style.position = 'fixed';
        screenDiv.style.top = '50%';
        screenDiv.style.left = '50%';
        screenDiv.style.transform = 'translate(-50%, -50%)';
        screenDiv.style.backgroundImage = 'url("assets/Intro/Company.png")';
        screenDiv.style.backgroundSize = '35% 10%'; 
        screenDiv.style.backgroundRepeat = 'no-repeat'; 
        screenDiv.style.backgroundPosition = 'center';
        screenDiv.style.width = '100%'; 
        screenDiv.style.height = '100%'; 
        screenDiv.style.border = 'none';
        screenDiv.style.boxShadow = 'none';
        screenDiv.style.opacity = '0'; 
        document.body.appendChild(screenDiv);
    
        screenDiv.style.animation = 'fade-in 1s forwards';
    
        setTimeout(() => {
            screenDiv.style.animation = 'fade-out 1s forwards';
    
            setTimeout(() => {
                this.cleanup();
                this.showScreen2();
            }, 1000); 
        }, 3000); 
    }
    
    showScreen2() {
        this.cleanup();
    
        const imagePaths = ['assets/Intro/newspaper1.png', 'assets/Intro/newspaper2.png', 'assets/Intro/newspaper3.png'];
    
        const images: Phaser.GameObjects.Image[] = [];
        const imageGroup = this.add.group();
    
        imagePaths.forEach((path, index) => {
            this.load.image(`newspaper${index + 1}`, path);
        });
    
        this.load.on('complete', () => {
            imagePaths.forEach((path, index) => {
                let offsetX = 0;
                if (index === 0) {
                    offsetX = -75; 
                } else if (index === 1) {
                    offsetX = 75; 
                }
                const image = this.add.image(this.cameras.main.centerX + offsetX, this.cameras.main.centerY, `newspaper${index + 1}`);
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
                                        this.showScreen3();
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
    
    showScreen3() {
        this.cleanup();
    
        const screenDiv = document.createElement('div');
        screenDiv.id = 'screen3';
        screenDiv.style.position = 'fixed';
        screenDiv.style.top = '50%';
        screenDiv.style.left = '50%';
        screenDiv.style.transform = 'translate(-50%, -50%)';
        screenDiv.style.backgroundImage = 'url("assets/Intro/heh2.png")';
        screenDiv.style.backgroundSize = '90%'; // Adjust the size here
        screenDiv.style.backgroundRepeat = 'no-repeat'; // Prevent the image from repeating
        screenDiv.style.backgroundPosition = 'center'; // Center the image within the div
        screenDiv.style.width = '78%'; // Set the specific width
        screenDiv.style.height = '100%'; // Set the specific height
        screenDiv.style.border = 'none';
        screenDiv.style.boxShadow = 'none';
        screenDiv.style.opacity = '0'; 
        document.body.appendChild(screenDiv);
    
        // Create and style the vignette overlay
        const vignetteOverlay = document.createElement('div');
        vignetteOverlay.style.position = 'absolute';
        vignetteOverlay.style.top = '0';
        vignetteOverlay.style.left = '0';
        vignetteOverlay.style.width = '100%';
        vignetteOverlay.style.height = '100%';
        vignetteOverlay.style.pointerEvents = 'none';
        vignetteOverlay.style.zIndex = '10'; // Make sure it is above other elements
        vignetteOverlay.style.background = 'radial-gradient(circle, rgba(0, 0, 0, 0) 40%, rgba(0, 0, 0, 0.8) 100%)';
        screenDiv.appendChild(vignetteOverlay);
    
        const createButton = (text:any, id:any, top:any, onClick:any, imagePath:any) => {
            const button = document.createElement('button');
            button.id = id;
            button.innerText = text;
            button.style.position = 'absolute';
            button.style.top = top;
            button.style.padding = '12px';
            button.style.backgroundImage = `url("${imagePath}")`;
            button.style.backgroundSize = 'cover';
            button.style.backgroundRepeat = 'no-repeat';
            button.style.fontFamily = '"Press Start 2P", Arial, sans-serif';
            button.style.color = 'white';
            button.style.cursor = 'pointer';
            button.style.fontSize = '14px';
            button.style.width = '250px';
            button.style.height = '70px';
            button.classList.add('selection-button');
            button.style.imageRendering = 'pixelated';
            button.addEventListener('click', onClick);
            screenDiv.appendChild(button);
        };
    
        const startButtonLeft = '38%';
        const settingsButtonLeft = '40%'; 
        const creditsButtonLeft = '38%';
        const quitButtonLeft = '40%'; 
    
        createButton('Start', 'startButton', '48%', () => this.showScreen4(), 'assets/Intro/buttons.png');
        const startButton = document.getElementById('startButton');
        if (startButton) {
            startButton.style.left = startButtonLeft;
        }   
        createButton('Settings', 'settingsButton', '58%', () => console.log('Settings clicked'), 'assets/Intro/buttons.png');
        const settingsButton = document.getElementById('settingsButton');
        if (settingsButton) {
            settingsButton.style.left = settingsButtonLeft;
        }    
        createButton('Credits', 'creditsButton', '68%', () => console.log('Credits clicked'), 'assets/Intro/buttons.png');
        const creditsButton = document.getElementById('creditsButton');
        if (creditsButton) {
            creditsButton.style.left = creditsButtonLeft;
        }    
        // createButton('Quit', 'quitButton', '73%', () => console.log('Quit clicked'), 'assets/Intro/buttons.png');
        // const quitButton = document.getElementById('quitButton');
        // if (quitButton) {
        //     quitButton.style.left = quitButtonLeft;
        // }   
        screenDiv.style.animation = 'fade-in 1s forwards';
    }

    showScreen4() {
        this.cleanup();
    
        const screenDiv = document.createElement('div');
        screenDiv.id = 'screen4';
        screenDiv.style.position = 'fixed';
        screenDiv.style.top = '50%';
        screenDiv.style.left = '50%';
        screenDiv.style.transform = 'translate(-50%, -50%)';
        screenDiv.style.backgroundImage = 'url("assets/Intro/ChapterOne.png")';
        screenDiv.style.backgroundSize = '40% 70%'; 
        screenDiv.style.backgroundRepeat = 'no-repeat'; 
        screenDiv.style.backgroundPosition = 'center';
        screenDiv.style.width = '100%'; 
        screenDiv.style.height = '100%'; 
        screenDiv.style.border = 'none';
        screenDiv.style.boxShadow = 'none';
        screenDiv.style.opacity = '0'; 
        document.body.appendChild(screenDiv);
    
        screenDiv.style.animation = 'fade-in 2s forwards';
    
        setTimeout(() => {
            screenDiv.style.animation = 'fade-out 1s forwards';
    
            setTimeout(() => {
                this.cleanup();
                this.showScreen5();
            }, 1000); 
        }, 3000); 
    }

    showScreen5() {
        this.cleanup();
    
        const screenDiv = document.createElement('div');
        screenDiv.id = 'screen5';
        screenDiv.style.position = 'fixed';
        screenDiv.style.top = '50%';
        screenDiv.style.left = '50%';
        screenDiv.style.transform = 'translate(-50%, -50%)';
        screenDiv.style.backgroundImage = 'url("assets/Intro/introBridge.png")';
        screenDiv.style.backgroundSize = '70% 100%';
        screenDiv.style.backgroundRepeat = 'no-repeat';
        screenDiv.style.backgroundPosition = 'center';
        screenDiv.style.width = '100%';
        screenDiv.style.height = '100%';
        screenDiv.style.border = 'none';
        screenDiv.style.boxShadow = 'none';
        screenDiv.style.opacity = '0';
        document.body.appendChild(screenDiv);
    
        const dialogueDiv = document.createElement('div');
        dialogueDiv.id = 'dialogue';
        dialogueDiv.style.position = 'absolute';
        dialogueDiv.style.left = '260px';
        dialogueDiv.style.top = '50px';
        dialogueDiv.style.fontFamily = '"Press Start 2P", sans-serif';
        dialogueDiv.style.fontSize = '15px';
        dialogueDiv.style.color = 'black';
        dialogueDiv.style.width = '45%';
        dialogueDiv.style.background = 'white';
        dialogueDiv.style.padding = '10px';
        dialogueDiv.style.border = '4px solid black';
        dialogueDiv.style.boxShadow = '6px 6px 0 black, 12px 12px 0 black';
        dialogueDiv.style.imageRendering = 'pixelated';
        document.body.appendChild(dialogueDiv);
    
        new Typed('#dialogue', {
            strings: ['Two years have passed since the attacks began, The situation in Brunei Muara has worsened day by day. I\'m hopeful that Temburong is as safe as the rumors suggest. Great, the bridge is closed off! It appears my journey is about to take an unexpected turn…'],
            typeSpeed: 20,
            showCursor: false,
            onComplete: () => {
                const continueButton = document.createElement('button');
                continueButton.textContent = 'Continue';
                continueButton.style.position = 'absolute';
                continueButton.style.bottom = '1%';
                continueButton.style.right = '1%';
                continueButton.style.padding = '8px 15px';
                continueButton.style.background = 'black';
                continueButton.style.color = 'white';
                continueButton.style.fontFamily = '"Press Start 2P", Arial, sans-serif';
                continueButton.style.fontSize = '10px';
                continueButton.style.border = 'none';
                continueButton.style.cursor = 'pointer';
                continueButton.classList.add('continue-button');
                continueButton.addEventListener('click', () => this.startMainGame());
                dialogueDiv.appendChild(continueButton);
                continueButton.style.zIndex = '100';
            }
        });
    
        screenDiv.style.animation = 'fade-in 1s forwards';
    }
    
    

    startMainGame() {
        this.cleanup();
        this.scene.start('Game');
    }

    cleanup() {
        const elementsToRemove = ['screen1', 'screen2', 'screen3', 'screen4', 'screen5', 'dialogue'];
        elementsToRemove.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                document.body.removeChild(element);
            }
        });
    }
    
}
