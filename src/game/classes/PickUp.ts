import Player from "./Player";
import PowerUp, { PowerUpType } from "./PowerUp";
import Weapon from "./Weapon";
import Inventory from "./Inventory";

export function PickUp(
    scene: Phaser.Scene,
    player: Player,
    pickupItem: PowerUp | Weapon,
    inventory: Inventory,
) {
    if (pickupItem instanceof Weapon) {
        const keyboardPlugin = scene.input.keyboard;

        if (keyboardPlugin) {
            const pickupKey = keyboardPlugin.addKey(
                Phaser.Input.Keyboard.KeyCodes.E,
            );

            pickupKey.on("down", () => {
                if (scene.physics.overlap(player, pickupItem)) {
                    if (inventory.addWeapon(pickupItem)) {
                        console.log(`Picked up ${pickupItem.texture.key}`);
                        pickupItem.destroy();
                    } else if (inventory.isFull()) {
                        console.log("Inventory is full.");
                    }
                }
            });
        }
    }
}
