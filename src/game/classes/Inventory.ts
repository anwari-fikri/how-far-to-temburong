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

    displayInventory(): void {
        console.log("selected hand slot:", this.selectedHandSlot);
        console.log("Melee Weapon:", this.meleeWeapon.weaponType.name);
    }

    handleKeyDown(event: KeyboardEvent): void {
        if (event.key === "Tab") {
            event.preventDefault();
            this.displayInventory();
        }

        if (event.key === "1") {
            this.selectedHandSlot = 1;
        }

        if (event.key === "2") {
            this.selectedHandSlot = 2;
        }
    }

    update() {
        this.meleeWeapon.update();
        this.rangedWeapon.update();
    }
}

