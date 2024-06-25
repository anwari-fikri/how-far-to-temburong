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

        const savedState = this.loadExperienceState();

        // Initialize experience manager state, using saved state if available
        this.levelCount = savedState?.levelCount ?? 0;
        this.experiencePoint = savedState?.experiencePoint ?? 0;
        this.nextLevel = savedState?.nextLevel ?? 5;
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
        if (!savedState) {
            return null;
        }

        return JSON.parse(savedState) as {
            levelCount: number;
            experiencePoint: number;
            nextLevel: number;
        };
    }
}

