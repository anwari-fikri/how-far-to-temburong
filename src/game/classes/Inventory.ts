import Weapon from "./Weapon";

export default class Inventory {
    private items: Weapon[];
    private capacity: number;

    constructor(capacity: number = 2) {
        this.capacity = capacity;
        this.items = [];

        document.addEventListener("keydown", this.handleKeyDown.bind(this));
    }

    private isFull(): boolean {
        return this.items.length >= this.capacity;
    }

    private containsWeaponType(weapon: Weapon): boolean {
        return this.items.some(
            (item) => item.texture.key === weapon.texture.key,
        );
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
        if (this.containsWeaponType(weapon)) {
            console.log(`${weapon.texture.key} is already in the inventory.`);
            return false;
        }

        return this.addItem(weapon);
    }

    getItems(): Weapon[] {
        return this.items;
    }

    displayInventory(): void {
        console.log(this.getInventoryString());
    }

    private getInventoryString(): string {
        let inventoryString = "Inventory:\n";
        this.items.forEach((item, index) => {
            inventoryString += `${index + 1}. ${item.texture.key}\n`;
        });
        return inventoryString;
    }

    private handleKeyDown(event: KeyboardEvent): void {
        if (event.key === "Tab") {
            event.preventDefault();

            this.displayInventory();
        }
    }
}
