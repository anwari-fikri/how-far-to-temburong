import { Scene } from "phaser";
import { Zombie } from "./Zombie";
import Player from "./Player";

export class ZombieGroup extends Phaser.GameObjects.Group {
    constructor(scene: Scene) {
        super(scene, {
            classType: Zombie,
            maxSize: 100,
        });

        scene.add.existing(this);
    }

    exampleInfiniteZombie() {
        this.scene.time.addEvent({
            delay: 50,
            loop: true,
            callback: () => {
                this.addZombie();
            },
            callbackScope: this,
        });
    }

    addZombie() {
        const zombie = this.get() as Zombie;
        if (zombie) {
            zombie.activateZombie();
        }
    }

    // PowerUps
    getNuked() {
        this.children.iterate((zombie: Phaser.GameObjects.GameObject) => {
            if (zombie instanceof Zombie) {
                zombie.die();
            }
            return true;
        });
    }

    update(player: Player) {
        this.children.iterate((zombie: Phaser.GameObjects.GameObject) => {
            if (zombie instanceof Zombie) {
                zombie.update(player);
            }
            return true;
        });
    }
}
