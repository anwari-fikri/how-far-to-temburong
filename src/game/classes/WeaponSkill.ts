import { Game } from "../scenes/Game";

export interface SkillLevel {
    displayName: string;
    level: number;
    bonus: number;
}

export class WeaponSkill {
    atk: SkillLevel;
    slow: SkillLevel;
    confuse: SkillLevel;
    fire: SkillLevel;
    freeze: SkillLevel;
    critChance: SkillLevel;

    constructor(
        atkLevel: number = 0,
        slowLevel: number = 0,
        confuseLevel: number = 0,
        fireLevel: number = 0,
        freezeLevel: number = 0,
        critChanceLevel: number = 0,
    ) {
        this.atk = this.createSkillLevel(
            "Attack Up",
            atkLevel,
            this.calculateAtkBonus,
        );
        this.slow = this.createSkillLevel(
            "Slow",
            slowLevel,
            this.calculateSlowBonus,
        );
        this.confuse = this.createSkillLevel(
            "Confuse",
            confuseLevel,
            this.calculateConfuseBonus,
        );
        this.fire = this.createSkillLevel(
            "Burn",
            fireLevel,
            this.calculateFireBonus,
        );
        this.freeze = this.createSkillLevel(
            "Freeze",
            freezeLevel,
            this.calculateFreezeBonus,
        );
        this.critChance = this.createSkillLevel(
            "Critical Chance",
            critChanceLevel,
            this.calculateCritBonus,
        );
    }

    showLevels(): void {
        console.log({
            atkLevel: this.atk.level,
            slowLevel: this.slow.level,
            confuseLevel: this.confuse.level,
            fireLevel: this.fire.level,
            freezeLevel: this.freeze.level,
            critChanceLevel: this.critChance.level,
        });
    }

    applyLevelUp(skillName: string) {
        switch (skillName) {
            case "Attack Up":
                this.levelUpAtk();
                break;
            case "Slow":
                this.levelUpSlow();
                break;
            case "Confuse":
                this.levelUpConfuse();
                break;
            case "Burn":
                this.levelUpFire();
                break;
            case "Freeze":
                this.levelUpFreeze();
                break;
            case "Critical Chance":
                this.levelUpCritChance();
                break;
            default:
                console.warn(`Unknown skill name: ${skillName}`);
        }
    }

    createSkillLevel(
        displayName: string,
        level: number,
        bonusCalc: (level: number) => number,
    ): SkillLevel {
        return {
            displayName: displayName,
            level: level,
            bonus: bonusCalc(level),
        };
    }

    calculateAtkBonus = (level: number): number => {
        // Add flat amount of damage to weapon
        switch (level) {
            case 0:
                return 0;
            case 1:
                return 10;
            case 2:
                return 20;
            case 3:
                return 40;
            default:
                return 40;
        }
    };

    levelUpAtk(): void {
        this.atk.level++;
        this.atk.bonus = this.calculateAtkBonus(this.atk.level);
        Game.player.emit("weaponSkillLevelUp");
    }

    calculateSlowBonus = (level: number): number => {
        // Apply permanent % slow to enemy
        switch (level) {
            case 0:
                return 0;
            case 1:
                return 5;
            case 2:
                return 10;
            case 3:
                return 20;
            default:
                return 20;
        }
    };

    levelUpSlow() {
        if (this.slow.level < 3) {
            this.slow.level++;
            this.slow.bonus = this.calculateSlowBonus(this.slow.level);
            Game.player.emit("weaponSkillLevelUp");
            return true;
        } else {
            return false;
        }
    }

    calculateConfuseBonus = (level: number): number => {
        // Apply % chance to confuse enemy per hit
        switch (level) {
            case 0:
                return 0;
            case 1:
                return 5;
            case 2:
                return 10;
            case 3:
                return 20;
            default:
                return 20;
        }
    };

    levelUpConfuse(): void {
        this.confuse.level++;
        this.confuse.bonus = this.calculateConfuseBonus(this.confuse.level);
        Game.player.emit("weaponSkillLevelUp");
    }

    calculateFireBonus = (level: number): number => {
        // Apply damage over time
        switch (level) {
            case 0:
                return 0;
            case 1:
                return 5;
            case 2:
                return 10;
            case 3:
                return 20;
            default:
                return 20;
        }
    };

    levelUpFire(): void {
        this.fire.level++;
        this.fire.bonus = this.calculateFireBonus(this.fire.level);
        Game.player.emit("weaponSkillLevelUp");
    }

    calculateFreezeBonus = (level: number): number => {
        // Apply % chance to freeze enemy per hit for 1 second
        switch (level) {
            case 0:
                return 0;
            case 1:
                return 5;
            case 2:
                return 10;
            case 3:
                return 20;
            default:
                return 20;
        }
    };

    levelUpFreeze(): void {
        this.freeze.level++;
        this.freeze.bonus = this.calculateFireBonus(this.freeze.level);
        Game.player.emit("weaponSkillLevelUp");
    }

    calculateCritBonus = (level: number): number => {
        // Apply % chance to crit for double damage
        switch (level) {
            case 0:
                return 0;
            case 1:
                return 10;
            case 2:
                return 20;
            case 3:
                return 40;
            default:
                return 40;
        }
    };

    levelUpCritChance(): void {
        this.critChance.level++;
        this.critChance.bonus = this.calculateCritBonus(this.critChance.level);
        Game.player.emit("weaponSkillLevelUp");
    }

    choose3Random(): SkillLevel[] {
        const skills = [
            this.atk,
            this.slow,
            this.confuse,
            this.fire,
            this.freeze,
            this.critChance,
        ];

        const selectableSkills = skills.filter((skill) => skill.level < 3);

        if (selectableSkills.length <= 3) {
            return selectableSkills;
        }

        const selection: SkillLevel[] = [];
        const usedIndices: Set<number> = new Set();

        while (selection.length < 3) {
            const randomIndex = Math.floor(
                Math.random() * selectableSkills.length,
            );
            if (!usedIndices.has(randomIndex)) {
                usedIndices.add(randomIndex);
                selection.push(selectableSkills[randomIndex]);
            }
        }

        return selection;
    }
}

