import { Physics } from "phaser";
import { Game } from "../scenes/Game";
import { Zombie } from "./Zombie";
import RandomEncounterTrigger from "./RandomEncounterTrigger";
import HealthDrop from "./HealthDrop";

export function dropItem(zombie: Zombie, chance: number = 15) {
    const randomValue = Math.random();

    if (randomValue < chance / 100) {
        Game.powerUps.dropRandomPowerUp(zombie);
    } else if (randomValue < 0.8) {
        Game.player.experience.addExperience(zombie.x, zombie.y);
    } else {
        Game.HealthDrop.add(new HealthDrop(zombie.scene, zombie.x, zombie.y));
    }
}

export function dropRandomEncounterTrigger(zombie: Zombie) {
    Game.randomEncounters.activateTrigger(zombie.x, zombie.y);
}

