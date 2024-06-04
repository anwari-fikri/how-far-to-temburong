import { Scene } from "phaser";
import Player from "../classes/Player";
import Inventory from "../classes/Inventory";
import { ZombieGroup } from "../classes/ZombieGroup";

export class WeaponTest extends Scene {
    player: Player;
    inventory: Inventory;
    zombies: ZombieGroup;

    constructor() {
        super("WeaponTest");
    }

    create() {
        this.player = new Player(
            this,
            this.scale.width / 2,
            this.scale.height / 2,
            "soldier",
        );
        this.zombies = new ZombieGroup(this, this.player);
    }

    update() {
        this.player.update();
        this.zombies.update(this.player);
    }
}
