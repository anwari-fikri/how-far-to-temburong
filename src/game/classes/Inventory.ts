import Weapon from "./Weapon";

export default class Inventory {
    items: (Weapon | null)[];
    capacity: number;
    handSlot: number;

    constructor(capacity: number = 2) {
        this.capacity = capacity;
        this.items = new Array(capacity).fill(null);
        this.handSlot = 0;

        document.addEventListener("keydown", this.handleKeyDown.bind(this));
    }

    isFull(): boolean {
        return this.items.every((item) => item !== null);
    }

    containsWeaponType(weapon: Weapon): boolean {
        return this.items.some(
            (item) => item !== null && item.weaponType === weapon.weaponType,
        );
    }

    addWeapon(weapon: Weapon): boolean {
        if (this.containsWeaponType(weapon)) {
            console.log(
                `${weapon.weaponType.name} is already in the inventory.`,
            );
            return false;
        }

        const emptyIndex = this.items.findIndex((item) => item === null);

        if (emptyIndex !== -1) {
            this.items[emptyIndex] = weapon;
            console.log(
                `Added ${weapon.weaponType.name} to inventory slot ${emptyIndex + 1}.`,
            );
        } else {
            if (this.items[this.handSlot] !== null) {
                const currentWeapon: Weapon = this.items[this.handSlot]!;
                console.log(
                    `Swapping ${currentWeapon.weaponType.name} with ${weapon.weaponType.name} in hand slot (slot ${this.handSlot + 1}).`,
                );
            } else {
                console.log(
                    `Added ${weapon.weaponType.name} to hand slot (slot ${this.handSlot + 1}).`,
                );
            }
            this.items[this.handSlot] = weapon;
        }

        return true;
    }

    swapHandSlot(newHandSlot: number): void {
        if (newHandSlot >= 0 && newHandSlot < this.capacity) {
            this.handSlot = newHandSlot;
            console.log(`Set slot ${this.handSlot + 1} as the new hand slot.`);
        } else {
            console.log("Invalid slot index.");
        }
    }

    displayInventory(): void {
        console.log(this.getInventoryString());
    }

    getInventoryString(): string {
        let inventoryString = "Inventory:\n";
        this.items.forEach((item, index) => {
            inventoryString += `${index + 1}. ${item ? item.weaponType.name : "Empty"}\n`;
        });
        return inventoryString;
    }

    getEquippedWeapon(): Weapon | null {
        return this.items[this.handSlot];
    }

    handleKeyDown(event: KeyboardEvent): void {
        if (event.key === "Tab") {
            event.preventDefault();
            this.displayInventory();
        }

        if (event.key === "1") {
            this.swapHandSlot(0);
        }

        if (event.key === "2") {
            this.swapHandSlot(1);
        }
    }
}

