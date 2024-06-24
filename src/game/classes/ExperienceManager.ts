import { Scene } from "phaser";
import { Experience } from "./Experience";

export class ExperienceManager extends Phaser.GameObjects.Group {
    levelCount: number;
    experiencePoint: number;
    nextLevel: number;

    constructor(scene: Scene) {
        super(scene),
            {
                classType: Experience,
                maxSize: 100,
            };

        this.levelCount = 0;
        this.experiencePoint = 0;
        this.nextLevel = 5;
        this.loadExperienceState();
    }

    addExperience(x: number, y: number) {
        let experience = this.getFirstDead(false) as Experience;
        if (!experience) {
            experience = new Experience(this.scene);
            this.add(experience);
        }
        experience.activateExp(x, y);
        this.setDepth(43);
    }

    update() {
        this.children.iterate((experience: Phaser.GameObjects.GameObject) => {
            if (experience instanceof Experience) {
                experience.update();
            }
            return true;
        });
    }

    saveExperienceState() {
        const experienceState = {
            levelCount: this.levelCount,
            experiencePoint: this.experiencePoint,
            nextLevel: this.nextLevel,
        };
        sessionStorage.setItem(
            "experienceState",
            JSON.stringify(experienceState),
        );
    }

    loadExperienceState() {
        const savedState = sessionStorage.getItem("experienceState");
        if (savedState !== null) {
            const { levelCount, experiencePoint, nextLevel } =
                JSON.parse(savedState);
            this.levelCount = levelCount;
            this.experiencePoint = experiencePoint;
            this.nextLevel = nextLevel;
        }
    }
}

