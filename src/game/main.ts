import { Boot } from "./scenes/Boot";
import { GameOver } from "./scenes/GameOver";
import { MobXObservable } from "./scenes/MobXObservable";
import { MainMenu } from "./scenes/MainMenu";
import { AUTO, Game } from "phaser";
import { Preloader } from "./scenes/Preloader";
import { SoundTest } from "./scenes/SoundTest";
import { TweenTest } from "./scenes/TweenTest";
import { PlayerCamera } from "./scenes/PlayerCamera";

//  Find out more information about the Game Config at:
//  https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
const config: Phaser.Types.Core.GameConfig = {
    type: AUTO,
    width: 1024,
    height: 768,
    pixelArt: true,
    parent: "game-container",
    physics: {
        default: "arcade",
        arcade: { debug: false },
    },
    backgroundColor: "#028af8",
    scene: [
        Boot,
        Preloader,
        MainMenu,
        MobXObservable,
        GameOver,
        SoundTest,
        TweenTest,
        PlayerCamera,
    ],
};

const StartGame = (parent: string) => {
    return new Game({ ...config, parent });
};

export default StartGame;

