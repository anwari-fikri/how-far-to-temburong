import { Scene } from "phaser";
import Player from "../classes/Player";
import { Zombie } from "../classes/Zombie";

export class EnemyTestingGround extends Scene {
    player: Player;
    zombies: Phaser.GameObjects.Group;

    constructor() {
        super("EnemyTestingGround");
    }

    create() {
        this.player = new Player(this, 50, 50, "dude");

        this.zombies = this.add.group({
            classType: Zombie,
            defaultKey: "zombie",
            maxSize: 100,
        });
        this.physics.add.collider(this.zombies, this.zombies);

        this.time.addEvent({
            delay: 100, // Adjusted delay to 1000ms for better visualization
            loop: true,
            callback: this.addZombie,
            callbackScope: this,
        });
    }

    addZombie() {
        const zombie = this.zombies.get() as Zombie;
        if (zombie) {
            zombie.activateZombie();
        }
    }

    update() {
        this.player.update();
        // this.zombies.children.iterate(
        //     (zombie: Phaser.GameObjects.GameObject) => {
        //         (zombie as Zombie).update();
        //     },
        // );
        this.zombies.children.iterate(
            (zombie: Phaser.GameObjects.GameObject) => {
                if (zombie instanceof Zombie) {
                    zombie.update(this.player);
                }
                return true; // or return null;
            },
        );
    }
}

