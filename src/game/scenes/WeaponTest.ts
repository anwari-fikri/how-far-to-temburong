import { Scene } from "phaser";
import Player from "../classes/Player";
import Inventory from "../classes/Inventory";
import Weapon, { WEAPON_TYPE } from "../classes/Weapon";
import { AttackWeapon } from "../classes/AttackWeapon";
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
            "dude",
        );
        this.zombies = new ZombieGroup(this, this.player);
        this.inventory = new Inventory(
            new Weapon(this, this.player, WEAPON_TYPE.SWORD),
        );

        // AttackWeapon(this, this.player, this.inventory, this.zombies);
    }

    update() {
        this.player.update();
        this.zombies.update(this.player);
        this.inventory.meleeWeapon.update();
    }
}

