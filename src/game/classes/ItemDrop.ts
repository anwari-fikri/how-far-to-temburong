import { Physics } from "phaser";
import { Game } from "../scenes/Game";
import { Zombie } from "./Zombie";

// const dropExp(zombie: Zombie) {
//     let exp = this.getFirstDead(false) as Physics.Arcade.Sprite
// }

export function dropItem(zombie: Zombie) {
    const randomValue = Math.random();

    if (randomValue < 0.15) {
        Game.powerUps.dropRandomPowerUp(zombie);
    }
}

