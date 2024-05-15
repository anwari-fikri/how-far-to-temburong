import Player from "./Player";

// Inventory.ts
export default class Inventory {
    private items: any[];
    private capacity: number;

    constructor(player: Player, capacity: number = 2) {
        this.capacity = capacity;
        this.items = [];
    }

    addItem(item: any): boolean {
        if (this.items.length < this.capacity) {
            this.items.push(item);
            console.log(`Added ${item.texture.key} to inventory.`);
            return true;
        } else {
            console.log("Inventory is full.");
            return false;
        }
    }

    getItems(): any[] {
        return this.items;
    }
}
