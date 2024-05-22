// AttackWeapon.ts

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
            if (!player || !player.body) {
                console.error("Player or player body is undefined.");
                return;
            }

            console.log(
                "Performing melee attack with",
                equippedWeapon.texture.key,
            );

            equippedWeapon.setPosition(player.x, player.y);
            equippedWeapon.setVisible(true);

            if (!scene.children.list.includes(equippedWeapon)) {
                scene.add.existing(equippedWeapon);
            }

            const targetX = player.x + 20;
            const targetY = player.y - 20;

            scene.tweens.add({
                targets: equippedWeapon,
                x: targetX,
                y: targetY,
                duration: 200,
                yoyo: true,
                ease: "power1",
                onComplete: () => {
                    equippedWeapon.setVisible(false);
                },
            });
        } else {
            console.log("No valid melee weapon equipped.");
        }
    });
}
