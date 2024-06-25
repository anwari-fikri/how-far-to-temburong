import { Game } from "../scenes/Game";
import MeleeWeapon from "./MeleeWeapon";
import RangedWeapon from "./RangedWeapon";

export default class Inventory {
    selectedHandSlot: number;
    meleeWeapon: MeleeWeapon;
    rangedWeapon: RangedWeapon;
    // TODO: add ranged weapon
    // TODO: add support items - healing, buff, grenade etc

    constructor() {
        this.selectedHandSlot = 1;

        document.addEventListener("keydown", this.handleKeyDown.bind(this));
    }

    replaceMeleeWeapon(meleeWeapon: MeleeWeapon) {
        this.meleeWeapon = meleeWeapon;
    }

    replaceRangedWeapon(rangedWeapon: RangedWeapon) {
        this.rangedWeapon = rangedWeapon;
    }

    handleKeyDown(event: KeyboardEvent): void {
        if (event.key === "Tab") {
            event.preventDefault();
            Game.player.weaponSkill.showLevels();
        }

        if (event.key === "1") {
            Game.soundManager.swordSelect.play();
            this.selectedHandSlot = 1;
            Game.player.emit("handslot-changed");
        }

        if (event.key === "2") {
            Game.soundManager.gunSelect.play();
            this.selectedHandSlot = 2;
            Game.player.emit("handslot-changed");
        }
    }

    update() {
        this.meleeWeapon.update();
        this.rangedWeapon.update();
    }
}
