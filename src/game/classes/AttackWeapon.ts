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

    attackKey?.on("down", () => {
        const equippedWeapon = inventory.getEquippedWeapon();

        if (!equippedWeapon) {
            console.log("No weapon equipped.");
            return;
        }

        if (equippedWeapon instanceof Weapon) {
            scene.physics.add.existing(equippedWeapon);
            equippedWeapon.setPosition(player.x, player.y);
            equippedWeapon.setVisible(true);

            if (!scene.children.list.includes(equippedWeapon)) {
                scene.add.existing(equippedWeapon);
            }

            console.log(
                "Performing melee attack with",
                equippedWeapon.texture.key,
            );

            if (equippedWeapon.getIsMelee()) {
                if (equippedWeapon.getMeleeRange() === "short") {
                    console.log("Short range melee weapon equipped.");

                    const thrustDistance = 10; // Adjust this value for desired thrust distance
                    let targetX: number;
                    let targetY: number;

                    // Calculate target position based on player's facing direction
                    if (player.facing === "left") {
                        equippedWeapon.setAngle(-90);
                        targetX = player.x - thrustDistance;
                    } else {
                        equippedWeapon.setAngle(90);
                        targetX = player.x + thrustDistance;
                    }

                    // For horizontal movement, keep Y position same
                    if (player.body && player.body.velocity.y === 0) {
                        targetY = player.y;
                    } else {
                        // For diagonal movement, adjust Y position based on movement direction
                        if (player.body && player.body.velocity.y < 0) {
                            targetY = player.y - thrustDistance; // Move up
                        } else {
                            targetY = player.y + thrustDistance; // Move down
                        }
                    }

                    // Tween the weapon to the target position
                    scene.tweens.add({
                        targets: equippedWeapon,
                        x: targetX,
                        y: targetY,
                        duration: 100, // Shorten duration for quick thrust
                        ease: "power1",
                        onComplete: () => {
                            equippedWeapon.setVisible(false);
                        },
                    });
                } else if (equippedWeapon.getMeleeRange() === "medium") {
                    console.log("Medium range melee weapon equipped.");

                    const rotationAngle = 90; // 90-degree swing
                    const rotationDuration = 300; // Duration for the rotation
                    const swingDistance = 30; // Distance in front of the player

                    let initialX: number;
                    let initialY: number;

                    // Calculate initial position based on player's facing direction
                    if (player.facing === "left") {
                        initialX = player.x - swingDistance;
                        initialY = player.y;
                    } else {
                        initialX = player.x + swingDistance;
                        initialY = player.y;
                    }

                    // Set the weapon's initial position and angle
                    equippedWeapon.setPosition(initialX, initialY);
                    equippedWeapon.setVisible(true);
                    equippedWeapon.setAngle(
                        player.facing === "left" ? -45 : 45,
                    ); // Initial angle

                    // Create a tween to rotate the weapon
                    scene.tweens.add({
                        targets: equippedWeapon,
                        x: initialX, // Keep the weapon slightly in front of the player
                        y: initialY,
                        angle: player.facing === "left" ? -135 : 135, // Rotate by 90 degrees from initial angle
                        duration: rotationDuration,
                        ease: "linear",
                        repeat: 0,
                        onStart: () => {
                            // Set pivot point to the center of the weapon
                            equippedWeapon.setOrigin(0.5, 0.5);
                        },
                        onUpdate: () => {
                            // Update the physics body position and rotation to match the visual position
                            if (
                                equippedWeapon.body instanceof
                                Phaser.Physics.Arcade.Body
                            ) {
                                equippedWeapon.body.x =
                                    equippedWeapon.x -
                                    equippedWeapon.displayOriginX;
                                equippedWeapon.body.y =
                                    equippedWeapon.y -
                                    equippedWeapon.displayOriginY;
                                equippedWeapon.body.rotation =
                                    Phaser.Math.DegToRad(equippedWeapon.angle);
                            }
                        },
                        onComplete: () => {
                            equippedWeapon.setVisible(false);
                            if (
                                equippedWeapon.body instanceof
                                Phaser.Physics.Arcade.Body
                            ) {
                                equippedWeapon.body.enable = false; // Disable physics body
                                equippedWeapon.body.setVelocity(0); // Ensure no residual velocity
                                equippedWeapon.body.rotation = 0; // Reset rotation
                            }
                        },
                    });
                } else if (equippedWeapon.getMeleeRange() === "long") {
                    console.log("Long range melee weapon equipped.");

                    const rotationAngle = 180; // Adjust this value for full rotation or any specific angle
                    const rotationDuration = 500; // Adjust duration for the rotation

                    let targetX: number;
                    let targetY: number;

                    // Calculate target position based on player's facing direction and offset
                    if (player.facing === "left") {
                        targetX = player.x;
                    } else {
                        targetX = player.x;
                    }

                    // Calculate target Y position based on player's current position
                    targetY = player.y;

                    // Create a tween to rotate the weapon
                    scene.tweens.add({
                        targets: equippedWeapon,
                        x: targetX,
                        y: targetY,
                        angle:
                            player.facing === "left"
                                ? -rotationAngle // Swing counterclockwise (left)
                                : rotationAngle, // Swing clockwise (right)
                        duration: rotationDuration,
                        ease: "linear",
                        repeat: 0,
                        onStart: () => {
                            // Set pivot point to bottom left
                            equippedWeapon.setOrigin(0, 1); // (x, y) where (0, 1) is bottom left
                        },
                        onComplete: () => {
                            equippedWeapon.setVisible(false);
                            equippedWeapon.disableBody(true, true); // Disable and destroy physics body
                        },
                    });

                    // Set the weapon's initial position and angle
                    equippedWeapon.setVisible(true);
                    equippedWeapon.setAngle(
                        player.facing === "left" ? -0 : 0, // Initial angle setup based on facing direction
                    );
                }
                // Melee weapon logic
            }
            // else {
            // // Ranged weapon logic
            // console.log(
            //     "Performing ranged attack with",
            //     equippedWeapon.texture.key,
            // );

            // // Define a range factor
            // const rangeFactor = 200; // Adjust this value to increase or decrease range

            // // Launch a projectile with increased range
            // const projectile = equippedWeapon.fireProjectile(
            //     scene,
            //     player.x + rangeFactor,
            //     player.y - rangeFactor,
            // );

            // // Optionally, apply a tween to the projectile for animation
            // if (projectile) {
            //     scene.tweens.add({
            //         targets: projectile,
            //         x: projectile.getData("targetX"),
            //         y: projectile.getData("targetY"),
            //         duration: 1000, // Adjust duration based on range and speed
            //         ease: "linear",
            //         onComplete: () => {
            //             projectile.destroy(); // Destroy the projectile after animation
            //         },
            //     });
            // }

            // scene.tweens.add({
            //     targets: equippedWeapon,
            //     alpha: 0,
            //     duration: 500,
            //     onComplete: () => {
            //         equippedWeapon.setVisible(false);
            //         equippedWeapon.setAlpha(1); // Reset alpha for next use
            //     },
            // });
            // }
        } else {
            console.log("Equipped item is not a valid weapon.");
        }
    });
}
