import { Scene } from "phaser";
import Player from "../classes/Player";
import Inventory from "../classes/Inventory";
import Weapon, { WEAPON_TYPE } from "../classes/Weapon";
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
            new Weapon(this, 800, -300, WEAPON_TYPE.SPEAR),
        );

        AttackWeapon(this, this.player, this.inventory);
    }

    update() {
        this.player.update();
    }
}

