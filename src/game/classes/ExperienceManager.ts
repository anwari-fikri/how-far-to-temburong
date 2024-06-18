import { Scene } from "phaser";
import { Experience } from "./Experience";

export class ExperienceManager extends Phaser.GameObjects.Group {
    experiencePoint: number;
    nextLevel: number;

    constructor(scene: Scene) {
        super(scene),
            {
                classType: Experience,
                maxSize: 100,
            };

        this.experiencePoint = 0;
        this.nextLevel = 5;
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
}

