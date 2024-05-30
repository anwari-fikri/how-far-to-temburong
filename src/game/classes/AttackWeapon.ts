import Player from "./Player";
import Inventory from "./Inventory";
import Weapon from "./Weapon";
import { ZombieGroup } from "./ZombieGroup";

export function AttackWeapon(
    scene: Phaser.Scene,
    player: Player,
    inventory: Inventory,
    zombies: ZombieGroup,
) {
    const keyboardPlugin = scene.input.keyboard;
    const attackKey = keyboardPlugin?.addKey(Phaser.Input.Keyboard.KeyCodes.J);
    let isAttacking = false;

    const attackSound = scene.sound.add("attack"); // Ensure 'attackSoundKey' matches the key used when loading the sound

    const createHitBox = (weapon: Weapon, width: number, height: number) => {
        if (weapon.body instanceof Phaser.Physics.Arcade.Body) {
            weapon.body.enable = true;
            weapon.body.setSize(width, height);
        }
    };

    const handleAttackComplete = (equippedWeapon: Weapon) => {
        equippedWeapon.setVisible(false);
        equippedWeapon.setActive(false);
        equippedWeapon.disableBody(true, true);
        if (equippedWeapon.body instanceof Phaser.Physics.Arcade.Body) {
            equippedWeapon.body.enable = false;
            equippedWeapon.body.setVelocity(0);
            equippedWeapon.body.rotation = 0;
        }

        isAttacking = false;
    };

    const handleShortRangeAttack = (equippedWeapon: Weapon) => {
        const thrustDistance = 40;
        const targetX =
            player.facing === "left"
                ? player.x - thrustDistance
                : player.x + thrustDistance;
        const targetY = player.y;

        equippedWeapon.setAngle(player.facing === "left" ? -90 : 90);
        createHitBox(equippedWeapon, 100, 50);

        scene.tweens.add({
            targets: equippedWeapon,
            x: targetX,
            y: targetY,
            duration: 200,
            ease: "power1",
            onComplete: () => handleAttackComplete(equippedWeapon),
        });
    };

    const handleMediumRangeAttack = (equippedWeapon: Weapon) => {
        const rotationAngle = 90;
        const rotationDuration = 300;
        const swingDistance = 40;
        const initialX =
            player.facing === "left"
                ? player.x - swingDistance
                : player.x + swingDistance;
        const initialY = player.y + 10;

        equippedWeapon.setPosition(initialX, initialY);
        equippedWeapon.setAngle(player.facing === "left" ? -45 : 45);
        createHitBox(equippedWeapon, 150, 150);

        scene.tweens.add({
            targets: equippedWeapon,
            x: initialX,
            y: initialY,
            angle: player.facing === "left" ? -135 : 135,
            duration: rotationDuration,
            ease: "linear",
            onComplete: () => handleAttackComplete(equippedWeapon),
        });
    };

    const handleLongRangeAttack = (equippedWeapon: Weapon) => {
        const rotationAngle = 180;
        const rotationDuration = 500;
        const swingDistance = 40;
        const initialX =
            player.x +
            (player.facing === "left" ? -swingDistance : swingDistance);
        const initialY = player.y + 15;

        equippedWeapon.setPosition(initialX, initialY);
        equippedWeapon.setAngle(0);
        createHitBox(equippedWeapon, 150, 300);

        scene.tweens.add({
            targets: equippedWeapon,
            x: initialX,
            y: initialY,
            angle: player.facing === "left" ? -rotationAngle : rotationAngle,
            duration: rotationDuration,
            ease: "linear",
            onComplete: () => handleAttackComplete(equippedWeapon),
        });
    };

    attackKey?.on("down", () => {
        if (isAttacking) return;
        const equippedWeapon = inventory.getEquippedWeapon();
        if (!equippedWeapon) {
            console.log("No weapon equipped.");
            return;
        }

        if (equippedWeapon instanceof Weapon) {
            equippedWeapon.setPosition(player.x, player.y);
            equippedWeapon.setVisible(true);
            equippedWeapon.setActive(true);
            equippedWeapon.enableBody();

            if (!scene.children.list.includes(equippedWeapon)) {
                scene.add.existing(equippedWeapon);
                scene.physics.add.existing(equippedWeapon);
                if (equippedWeapon.body instanceof Phaser.Physics.Arcade.Body) {
                    equippedWeapon.body.enable = false;
                }
            }

            if (scene.physics.overlap(equippedWeapon, zombies)) {
                console.log("OOF");
                attackSound.play();
            }
            console.log(
                "Performing melee attack with",
                equippedWeapon.texture.key,
            );

            isAttacking = true;

            if (equippedWeapon.getIsMelee()) {
                switch (equippedWeapon.getMeleeRange()) {
                    case "short":
                        handleShortRangeAttack(equippedWeapon);
                        break;
                    case "medium":
                        handleMediumRangeAttack(equippedWeapon);
                        break;
                    case "long":
                        handleLongRangeAttack(equippedWeapon);
                        break;
                    default:
                        console.log("Unknown melee range.");
                }
            } else {
                // Handle ranged weapon logic here if needed
            }
        } else {
            console.log("Equipped item is not a valid weapon.");
        }
    });

    scene.events.on("update", () => {
        const equippedWeapon = inventory.getEquippedWeapon();
        if (equippedWeapon && !isAttacking) {
            equippedWeapon.setPosition(player.x, player.y);
        }
    });
}
