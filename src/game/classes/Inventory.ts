import Weapon from "./Weapon";

export default class Inventory {
    selectedHandSlot: number;
    meleeWeapon: Weapon;
    // TODO: add ranged weapon
    // TODO: add support items - healing, buff, grenade etc

    constructor(meleeWeapon: Weapon) {
        this.selectedHandSlot = 1;
        this.meleeWeapon = meleeWeapon;

        document.addEventListener("keydown", this.handleKeyDown.bind(this));
    }

    replaceMeleeWeapon(meleeWeapon: Weapon) {
        this.meleeWeapon = meleeWeapon;
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
}

