import { Game } from "../scenes/Game";
import { WEAPON_TYPE } from "./MeleeWeapon";

interface SkillLevel {
    level: number;
    bonus: number;
}

export class WeaponSkill {
    name: WEAPON_TYPE;
    atk: SkillLevel;
    speed: SkillLevel;

    constructor(
        name: WEAPON_TYPE,
        atkLevel: number = 0,
        speedLevel: number = 0,
    ) {
        this.name = name;
        this.atk = this.createSkillLevel(atkLevel, this.calculateAtkBonus);
        this.speed = this.createSkillLevel(
            speedLevel,
            this.calculateSpeedBonus,
        );
    }

    private createSkillLevel(
        level: number,
        bonusCalc: (level: number) => number,
    ): SkillLevel {
        return {
            level: level,
            bonus: bonusCalc(level),
        };
    }

    private calculateAtkBonus(level: number): number {
        switch (level) {
            case 0:
                return 0; // No bonus
            case 1:
                return 10; // +10%
            case 2:
                return 20; // +20%
            // Add more levels as needed
            default:
                return 0;
        }
    }

    private calculateSpeedBonus(level: number): number {
        switch (level) {
            case 0:
                return 0; // No bonus
            case 1:
                return 5; // +5%
            case 2:
                return 10; // +10%
            // Add more levels as needed
            default:
                return 0;
        }
    }

    public levelUpAtk(): void {
        this.atk.level++;
        this.atk.bonus = this.calculateAtkBonus(this.atk.level);
        Game.player.emit("weaponSkillLevelUp");
    }

    public levelUpSpeed(): void {
        this.speed.level++;
        this.speed.bonus = this.calculateSpeedBonus(this.speed.level);
        Game.player.emit("weaponSkillLevelUp");
    }
}

