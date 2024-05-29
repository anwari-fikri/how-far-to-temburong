import Weapon from "./Weapon";
import { Zombie } from "./Zombie";
import { ZombieGroup } from "./ZombieGroup";

export default class WeaponSkill {
    isSlowSkill: boolean = false;
    slowSkillLevel: number = 0;

    weapon: Weapon;
    constructor(weapon: Weapon) {
        this.weapon = weapon;
    }

    applySlowSkill(zombies: ZombieGroup) {
        zombies.children.iterate((zombie: Phaser.GameObjects.GameObject) => {
            if (zombie instanceof Zombie) {
                switch (this.slowSkillLevel) {
                    case 1:
                        zombie.modifyChaseSpeed(-3, true);
                        break;
                    case 2:
                        zombie.modifyChaseSpeed(-5, true);
                        break;
                    case 3:
                        zombie.modifyChaseSpeed(-10, true);
                        break;
                    default:
                        // Do nothing
                        break;
                }
            }
            return true;
        });
    }
}

