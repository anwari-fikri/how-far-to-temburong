import Player from "./Player";
import Inventory from "./Inventory";
import Weapon from "./Weapon";
import { ZombieGroup } from "./ZombieGroup";
import { Scene } from "phaser";

export default class AttackWeapon {
    scene: Phaser.Scene;
    player: Player;
    inventory: Inventory;
    zombies: ZombieGroup;

    constructor(
        scene: Scene,
        player: Player,
        inventory: Inventory,
        zombies: ZombieGroup,
    ) {
        this.scene = scene;
        this.player = player;
        this.inventory = inventory;
        this.zombies = zombies;
    }

    create() {
        const keyboardPlugin = this.scene.input.keyboard;
        const attackKey = keyboardPlugin?.addKey(
            Phaser.Input.Keyboard.KeyCodes.J,
        );
        let isAttacking = false;

        // Function to define custom hitboxes
        const createHitBox = (
            weapon: Weapon,
            width: number,
            height: number,
            originX: number = 0,
            originY: number = 0,
        ) => {
            if (weapon.body instanceof Phaser.Physics.Arcade.Body) {
                weapon.body.setSize(width, height);
                const offsetX = (weapon.width - width) * originX;
                const offsetY = (weapon.height - height) * originY;
                weapon.body.setOffset(offsetX, offsetY);
            }
        };

        attackKey?.on("down", () => {
            if (isAttacking) return;
            const equippedWeapon = this.inventory.getEquippedWeapon();
            if (!equippedWeapon) {
                console.log("No weapon equipped.");
                return;
            }

            if (equippedWeapon instanceof Weapon) {
                equippedWeapon.setPosition(this.player.x, this.player.y);
                equippedWeapon.setVisible(true);
                equippedWeapon.setActive(true);
                equippedWeapon.enableBody();

                if (!this.scene.children.list.includes(equippedWeapon)) {
                    this.scene.add.existing(equippedWeapon);
                    this.scene.physics.add.existing(equippedWeapon);
                    if (
                        equippedWeapon.body instanceof
                        Phaser.Physics.Arcade.Body
                    ) {
                        equippedWeapon.body.enable = false; // Initially disable physics body
                    }
                }

                console.log(
                    "Performing melee attack with",
                    equippedWeapon.texture.key,
                );

                const handleAttackComplete = () => {
                    if (
                        this.scene.physics.overlap(equippedWeapon, this.zombies)
                    ) {
                        console.log("OOF");
                    }
                    equippedWeapon.setVisible(false);
                    equippedWeapon.setActive(false);
                    equippedWeapon.disableBody(true, true);
                    if (
                        equippedWeapon.body instanceof
                        Phaser.Physics.Arcade.Body
                    ) {
                        equippedWeapon.body.enable = false;
                        equippedWeapon.body.setVelocity(0);
                        equippedWeapon.body.rotation = 0;
                    }
                    isAttacking = false;
                };

                const handleShortRangeAttack = () => {
                    const thrustDistance = 10;
                    equippedWeapon.setOrigin(0.5, 1);
                    let targetX: number;
                    let targetY: number;

                    if (this.player.facing === "left") {
                        equippedWeapon.setAngle(-90);
                        targetX = this.player.x - thrustDistance;
                    } else {
                        equippedWeapon.setAngle(90);
                        targetX = this.player.x + thrustDistance;
                    }

                    targetY = this.player.y;

                    createHitBox(equippedWeapon, 150, 50); // Example hit box size for short range
                    if (
                        equippedWeapon.body instanceof
                        Phaser.Physics.Arcade.Body
                    ) {
                        equippedWeapon.body.enable = true;
                    }

                    this.scene.tweens.add({
                        targets: equippedWeapon,
                        x: targetX,
                        y: targetY,
                        duration: 100,
                        ease: "power1",
                        onComplete: handleAttackComplete,
                    });
                };

                const handleMediumRangeAttack = () => {
                    const rotationAngle = 90;
                    const rotationDuration = 300;
                    const swingDistance = 5;

                    let initialX =
                        this.player.facing === "left"
                            ? this.player.x - swingDistance
                            : this.player.x + swingDistance;
                    let initialY = this.player.y + 15;

                    equippedWeapon.setPosition(initialX, initialY);
                    equippedWeapon.setAngle(
                        this.player.facing === "left" ? -45 : 45,
                    );
                    equippedWeapon.setOrigin(0.5, 1);

                    createHitBox(equippedWeapon, 150, 100, 0.5, 0.5); // Example hitbox size for medium range
                    if (
                        equippedWeapon.body instanceof
                        Phaser.Physics.Arcade.Body
                    ) {
                        equippedWeapon.body.enable = true;
                    }

                    this.scene.tweens.add({
                        targets: equippedWeapon,
                        x: initialX,
                        y: initialY,
                        angle: this.player.facing === "left" ? -135 : 135,
                        duration: rotationDuration,
                        ease: "linear",
                        onComplete: handleAttackComplete,
                    });
                };

                const handleLongRangeAttack = () => {
                    const rotationAngle = 180;
                    const rotationDuration = 500;
                    const swingDistance = 5;

                    let initialX =
                        this.player.facing === "left"
                            ? this.player.x - swingDistance
                            : this.player.x + swingDistance;
                    let initialY = this.player.y + 15;

                    equippedWeapon.setPosition(initialX, initialY);
                    equippedWeapon.setAngle(
                        this.player.facing === "left" ? 0 : 0,
                    );
                    equippedWeapon.setOrigin(0.5, 1);

                    createHitBox(equippedWeapon, 150, 300, 0.5, 0.01); // Example hitbox size for medium range
                    if (
                        equippedWeapon.body instanceof
                        Phaser.Physics.Arcade.Body
                    ) {
                        equippedWeapon.body.enable = true;
                    }

                    this.scene.tweens.add({
                        targets: equippedWeapon,
                        x: initialX,
                        y: initialY,
                        angle: this.player.facing === "left" ? -180 : 180,
                        duration: rotationDuration,
                        ease: "linear",
                        onComplete: handleAttackComplete,
                    });
                };

                isAttacking = true;

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
                    // Handle ranged weapon logic here if needed
                }
            } else {
                console.log("Equipped item is not a valid weapon.");
            }
        });

        // Update the weapon's position to follow the player
        this.scene.events.on("update", () => {
            const equippedWeapon = this.inventory.getEquippedWeapon();
            if (equippedWeapon && !isAttacking) {
                equippedWeapon.setPosition(this.player.x, this.player.y);
            }
        });
    }
}

