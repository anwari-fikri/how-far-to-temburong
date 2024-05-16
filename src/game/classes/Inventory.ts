import Weapon from "./Weapon";

export default class Inventory {
    private items: Weapon[];
    private capacity: number;

    constructor(capacity: number = 2) {
        this.capacity = capacity;
        this.items = [];
    }

    private isFull(): boolean {
        return this.items.length >= this.capacity;
    }

    private containsWeapon(weapon: Weapon): boolean {
        return this.items.includes(weapon);
    }

    addItem(item: Weapon): boolean {
        if (!this.isFull()) {
            this.items.push(item);
            console.log(`Added ${item.texture.key} to inventory.`);
            return true;
        } else {
            console.log("Inventory is full.");
            return false;
        }
    }

    addWeapon(weapon: Weapon): boolean {
        if (this.containsWeapon(weapon)) {
            console.log(
                `Weapon ${weapon.texture.key} is already in the inventory.`,
            );
            return false;
        }

        return this.addItem(weapon);
    }

    getItems(): Weapon[] {
        return this.items;
    }

    displayInventory(): void {
        console.log("Inventory:");
        this.items.forEach((item, index) => {
            console.log(`${index + 1}. ${item.texture.key}`);
        });
    }
}

