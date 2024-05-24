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

        if (!equippedWeapon) {
            console.log("No weapon equipped.");
            return;
        }

        if (equippedWeapon instanceof Weapon) {
            equippedWeapon.setPosition(player.x, player.y);
            equippedWeapon.setVisible(true);

            if (!scene.children.list.includes(equippedWeapon)) {
                scene.add.existing(equippedWeapon);
            }

            if (equippedWeapon.getIsMelee()) {
                // Melee weapon logic
                console.log(
                    "Performing melee attack with",
                    equippedWeapon.texture.key,
                );

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
                // Ranged weapon logic
                console.log(
                    "Performing ranged attack with",
                    equippedWeapon.texture.key,
                );

                // Define a range factor
                const rangeFactor = 200; // Adjust this value to increase or decrease range

                // Launch a projectile with increased range
                const projectile = equippedWeapon.fireProjectile(
                    scene,
                    player.x + rangeFactor,
                    player.y - rangeFactor,
                );

                // Optionally, apply a tween to the projectile for animation
                if (projectile) {
                    scene.tweens.add({
                        targets: projectile,
                        x: projectile.getData("targetX"),
                        y: projectile.getData("targetY"),
                        duration: 1000, // Adjust duration based on range and speed
                        ease: "linear",
                        onComplete: () => {
                            projectile.destroy(); // Destroy the projectile after animation
                        },
                    });
                }

                scene.tweens.add({
                    targets: equippedWeapon,
                    alpha: 0,
                    duration: 500,
                    onComplete: () => {
                        equippedWeapon.setVisible(false);
                        equippedWeapon.setAlpha(1); // Reset alpha for next use
                    },
                });
            }
        } else {
            console.log("Equipped item is not a valid weapon.");
        }
    });
}
