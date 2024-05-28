import { Scene } from "phaser";
import Player from "../classes/Player";
import Inventory from "../classes/Inventory";
import Weapon from "../classes/Weapon";
import { AttackWeapon } from "../classes/AttackWeapon";

export class WeaponTest extends Scene {
    player: Player;
    inventory: Inventory;

    constructor() {
        super("WeaponTest");
    }

    create() {
        this.player = new Player(
            this,
            this.scale.width / 2,
            this.scale.height / 2,
            "dude",
        );

        this.inventory = new Inventory();
        this.inventory.addWeapon(
            // new Weapon(this, 800, -300, "dagger", true, "short"),
            new Weapon(this, 800, -300, "sword", true, "medium"),
            // new Weapon(this, 800, -300, "spear", true, "long"),
        );

        AttackWeapon(this, this.player, this.inventory);
    }

    update() {
        this.player.update();
    }
}
