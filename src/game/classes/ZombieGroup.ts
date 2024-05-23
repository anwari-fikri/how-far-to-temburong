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

        // Initialize 100 zombies and make them inactive
        for (let i = 0; i < 100; i++) {
            const zombie = new Zombie(scene);
            this.add(zombie, true);
        }
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

    getFreezed() {
        this.children.iterate((zombie: Phaser.GameObjects.GameObject) => {
            if (zombie instanceof Zombie) {
                zombie.freeze();
            }
            return true;
        });
    }

    getUnFreezed() {
        this.children.iterate((zombie: Phaser.GameObjects.GameObject) => {
            if (zombie instanceof Zombie) {
                zombie.unfreeze();
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

