import { Boot } from "./scenes/Boot";
import { GameOver } from "./scenes/GameOver";
import { Game as MainGame } from "./scenes/Game";
import { MainMenu } from "./scenes/MainMenu";
import { Game } from "phaser";
import { Preloader } from "./scenes/Preloader";
import { PauseMenu } from "./scenes/PauseMenu";
import { EnemyTestingGround } from "./scenes/EnemyTestingGround";

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
        EnemyTestingGround,
    ],
};

const StartGame = (parent: string) => {
    return new Game({ ...config, parent });
};

export default StartGame;
