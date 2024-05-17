import Weapon from "./Weapon";

export default class Inventory {
    private items: (Weapon | null)[];
    private capacity: number;
    private handSlot: number;

    constructor(capacity: number = 2) {
        this.capacity = capacity;
        this.items = new Array(capacity).fill(null);
        this.handSlot = 0;

        document.addEventListener("keydown", this.handleKeyDown.bind(this));
    }

    public isFull(): boolean {
        return this.items.every((item) => item !== null);
    }

    private containsWeaponType(weapon: Weapon): boolean {
        return this.items.some(
            (item) => item?.texture.key === weapon.texture.key,
        );
    }

    public addWeapon(weapon: Weapon): boolean {
        if (this.containsWeaponType(weapon)) {
            console.log(`${weapon.texture.key} is already in the inventory.`);
            return false;
        }

        if (this.items[this.handSlot] !== null) {
            const currentWeapon = this.items[this.handSlot]!;
            console.log(
                `Swapping ${currentWeapon.texture.key} with ${weapon.texture.key} in hand slot (slot ${this.handSlot + 1}).`,
            );
        } else {
            console.log(
                `Added ${weapon.texture.key} to hand slot (slot ${this.handSlot + 1}).`,
            );
        }

        this.items[this.handSlot] = weapon;
        return true;
    }

    public swapHandSlot(newHandSlot: number): void {
        if (newHandSlot >= 0 && newHandSlot < this.capacity) {
            this.handSlot = newHandSlot;
            console.log(`Set slot ${this.handSlot + 1} as the new hand slot.`);
        } else {
            console.log("Invalid slot index.");
        }
    }

    public getItems(): (Weapon | null)[] {
        return this.items;
    }

    public displayInventory(): void {
        console.log(this.getInventoryString());
    }

    private getInventoryString(): string {
        let inventoryString = "Inventory:\n";
        this.items.forEach((item, index) => {
            inventoryString += `${index + 1}. ${item ? item.texture.key : "Empty"}\n`;
        });
        return inventoryString;
    }

    private handleKeyDown(event: KeyboardEvent): void {
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
