import { Scene } from 'phaser';
import { EventBus } from '../EventBus';
import Typed from 'typed.js';
import playerStore from '../stores/PlayerStore';

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
        super('CheckpointAndChapters');
       
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
            this.showScreen4();
        }, 1000);
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

    screenDiv.style.animation = 'fade-in 5s forwards';

    setTimeout(() => {
        screenDiv.style.animation = 'fade-out 1s forwards';

        setTimeout(() => {
            this.cleanup();
            this.showScreen5();
        }, 1000); 
    }, 4000); 
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
            continueButton.textContent = '>>';
            continueButton.style.position = 'absolute';
            continueButton.style.marginLeft = '5px';
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
    const elementsToRemove = [ 'screen4', 'screen5',  'dialogue'];
    elementsToRemove.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            document.body.removeChild(element);
        }
    });
}
}