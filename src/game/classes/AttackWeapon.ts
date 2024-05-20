import Phaser from "phaser";
import Player from "./Player";
import Inventory from "./Inventory";
import Weapon from "./Weapon";

export function AttackWeapon(
    scene: Phaser.Scene,
    player: Player,
    inventory: Inventory,
) {
    const keyboardPlugin = scene.input.keyboard;
    const attackKey = keyboardPlugin?.addKey(Phaser.Input.Keyboard.KeyCodes.O);

    attackKey?.on("down", () => {
        const equippedWeapon = inventory.getEquippedWeapon();

        if (
            equippedWeapon &&
            equippedWeapon instanceof Weapon &&
            equippedWeapon.getIsMelee()
        ) {
            // Example: Trigger melee attack logic here
            console.log(
                "Performing melee attack with",
                equippedWeapon.texture.key,
            );
            // Example: player.attack(equippedWeapon); // Replace with actual attack logic
        } else {
            console.log("No valid melee weapon equipped.");
        }
    });
}
