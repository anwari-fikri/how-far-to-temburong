import { Physics } from "phaser";
import { Game } from "../scenes/Game";
import { Zombie } from "./Zombie";
import RandomEncounterTrigger from "./RandomEncounterTrigger";

export function dropItem(zombie: Zombie, chance: number = 15) {
    const randomValue = Math.random();

    if (randomValue < chance / 100) {
        Game.powerUps.dropRandomPowerUp(zombie);
    }
}

export function dropRandomEncounterTrigger(zombie: Zombie) {
    Game.randomEncounters.activateTrigger(zombie.x, zombie.y);
}

