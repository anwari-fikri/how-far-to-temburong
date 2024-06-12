import { Physics } from "phaser";
import { Game } from "../scenes/Game";
import { Zombie } from "./Zombie";

export function dropItem(zombie: Zombie, chance: number = 15) {
    const randomValue = Math.random();

    if (randomValue < chance / 100) {
        Game.powerUps.dropRandomPowerUp(zombie);
    }
}

