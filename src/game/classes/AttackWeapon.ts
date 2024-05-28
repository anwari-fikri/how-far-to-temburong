import Player from "./Player";
import Inventory from "./Inventory";
import Weapon from "./Weapon";

export function AttackWeapon(
    scene: Phaser.Scene,
    player: Player,
    inventory: Inventory,
) {
    const keyboardPlugin = scene.input.keyboard;
    const attackKey = keyboardPlugin?.addKey(Phaser.Input.Keyboard.KeyCodes.J);
    let isAttacking = false; // To prevent attack spamming

    attackKey?.on("down", () => {
        if (isAttacking) return; // Prevent attacking again until the current attack is finished

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

            console.log(
                "Performing melee attack with",
                equippedWeapon.texture.key,
            );

            const handleAttackComplete = () => {
                equippedWeapon.setVisible(false);
                if (equippedWeapon.body instanceof Phaser.Physics.Arcade.Body) {
                    equippedWeapon.body.enable = false;
                    equippedWeapon.body.setVelocity(0);
                    equippedWeapon.body.rotation = 0;
                }
                isAttacking = false; // Reset attack state
            };

            const handleShortRangeAttack = () => {
                console.log("Short range melee weapon equipped.");

                const thrustDistance = 10; // Adjust this value for desired thrust distance
                let targetX: number;
                let targetY: number;

                if (player.facing === "left") {
                    equippedWeapon.setAngle(-90);
                    targetX = player.x - thrustDistance;
                } else {
                    equippedWeapon.setAngle(90);
                    targetX = player.x + thrustDistance;
                }

                targetY = player.y;

                scene.tweens.add({
                    targets: equippedWeapon,
                    x: targetX,
                    y: targetY,
                    duration: 100,
                    ease: "power1",
                    onComplete: handleAttackComplete,
                });
            };

            const handleMediumRangeAttack = () => {
                console.log("Medium range melee weapon equipped.");

                const rotationAngle = 90;
                const rotationDuration = 300;
                const swingDistance = 30;

                let initialX =
                    player.facing === "left"
                        ? player.x - swingDistance
                        : player.x + swingDistance;
                let initialY = player.y;

                equippedWeapon.setPosition(initialX, initialY);
                equippedWeapon.setAngle(player.facing === "left" ? -45 : 45);
                equippedWeapon.setOrigin(0.5, 0.5);

                scene.tweens.add({
                    targets: equippedWeapon,
                    x: initialX,
                    y: initialY,
                    angle: player.facing === "left" ? -135 : 135,
                    duration: rotationDuration,
                    ease: "linear",
                    onComplete: handleAttackComplete,
                });
            };

            const handleLongRangeAttack = () => {
                console.log("Long range melee weapon equipped.");

                const rotationAngle = 180;
                const rotationDuration = 500;

                let targetX = player.x;
                let targetY = player.y;

                equippedWeapon.setOrigin(0, 1);

                scene.tweens.add({
                    targets: equippedWeapon,
                    x: targetX,
                    y: targetY,
                    angle:
                        player.facing === "left"
                            ? -rotationAngle
                            : rotationAngle,
                    duration: rotationDuration,
                    ease: "linear",
                    onComplete: handleAttackComplete,
                });

                equippedWeapon.setAngle(player.facing === "left" ? -0 : 0);
            };

            isAttacking = true; // Set attack state

            if (equippedWeapon.getIsMelee()) {
                switch (equippedWeapon.getMeleeRange()) {
                    case "short":
                        handleShortRangeAttack();
                        break;
                    case "medium":
                        handleMediumRangeAttack();
                        break;
                    case "long":
                        handleLongRangeAttack();
                        break;
                    default:
                        console.log("Unknown melee range.");
                }
            } else {
                // Handle ranged weapon logic if necessary
            }
        } else {
            console.log("Equipped item is not a valid weapon.");
        }
    });

    // Update the weapon's position to follow the player
    scene.events.on("update", () => {
        const equippedWeapon = inventory.getEquippedWeapon();
        if (equippedWeapon && !isAttacking) {
            equippedWeapon.setPosition(player.x, player.y);
        }
    });
}
