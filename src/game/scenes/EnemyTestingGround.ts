import { Scene } from "phaser";
import Player from "../classes/Player";
import { ZombieGroup } from "../classes/ZombieGroup";

export class EnemyTestingGround extends Scene {
    player: Player;
    zombies: ZombieGroup;

    constructor() {
        super("EnemyTestingGround");
    }

    create() {
        this.player = new Player(this, 50, 50, "dude");

        this.zombies = new ZombieGroup(this);
        this.physics.add.collider(this.zombies, this.zombies);

        this.time.addEvent({
            delay: 10,
            loop: true,
            callback: this.addZombie,
            callbackScope: this,
        });
    }

    addZombie() {
        this.zombies.addZombie();
    }

    update() {
        this.player.update();
        this.zombies.update(this.player);
    }
}
