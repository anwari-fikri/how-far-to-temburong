import Player from "./Player";
import Weapon from "./Weapon"; // Assuming Weapon class is defined in a separate file

export default class Inventory {
    private items: Weapon[];
    private capacity: number;
    private player: Player;

    constructor(player: Player, capacity: number = 2) {
        this.player = player;
        this.capacity = capacity;
        this.items = [];
    }

    addItem(item: Weapon): boolean {
        if (this.items.length < this.capacity) {
            this.items.push(item);
            console.log(`Added ${item.texture.key} to inventory.`);
            return true;
        } else {
            console.log("Inventory is full.");
            return false;
        }
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

    addWeapon(weapon: Weapon): boolean {
        // Check if the weapon is already in the inventory
        if (this.items.includes(weapon)) {
            console.log(
                `Weapon ${weapon.texture.key} is already in the inventory.`,
            );
            return false;
        }

        // Add the weapon to the inventory
        if (this.addItem(weapon)) {
            console.log(
                `Picked up ${weapon.texture.key} and added to inventory.`,
            );
            return true;
        } else {
            console.log(
                `Failed to pick up ${weapon.texture.key}. Inventory is full.`,
            );
            return false;
        }
    }
}
