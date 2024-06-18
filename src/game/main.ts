import { Boot } from "./scenes/Boot";
import { GameOver } from "./scenes/GameOver";
import { Game as MainGame } from "./scenes/Game";
import { MainMenu } from "./scenes/MainMenu";
import { Game } from "phaser";
import { Preloader } from "./scenes/Preloader";
import { PauseMenu } from "./scenes/PauseMenu";
import { RandomEncounterTest } from "./scenes/RandomEncounterTest";
import { Intro } from "./scenes/Intro";
import { CheckpointAndChapters } from "./scenes/CheckpointAndChapters";
import { BossScene } from "./scenes/BossScene";
import { GameCredits } from "./scenes/GameCredits";
import { WeaponSkillUpgrade } from "./scenes/WeaponSkillUpgrade";


//  Find out more information about the Game Config at:
//  https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 480,
    height: 278,
    scale: {
        mode: Phaser.Scale.FIT,
    },
    physics: {
        default: "arcade",
        arcade: {
            gravity: { y: 0, x: 0 },
            debug: true,
        },
    },
    pixelArt: true,
    parent: "game-container",
    backgroundColor: "#028af8",
    scene: [
        Boot,
        Preloader,
        MainMenu,
        MainGame,
        GameOver,
        PauseMenu,
        RandomEncounterTest,
        Intro,
        CheckpointAndChapters,
        BossScene,
        GameCredits,
        WeaponSkillUpgrade
    ],
};

const StartGame = (parent: string) => {
    const parentElement = document.getElementById(parent);
    if (parentElement) {
        parentElement.style.backgroundColor = "black";
        parentElement.style.display = "flex";
        parentElement.style.justifyContent = "center";
        parentElement.style.alignItems = "center";
        parentElement.style.height = "100vh";
        parentElement.style.width = "100%";
    } else {
        console.warn(`Element with id "${parent}" not found.`);
    }

    return new Game({ ...config, parent });
};

export default StartGame;
