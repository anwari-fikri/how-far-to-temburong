import playerStore from "../stores/PlayerStore";
import Enemies from "./Enemies";
import Player from "./Player";
import PowerUp, { PowerUpType } from "./PowerUp";
import Weapon from "./Weapon";
import Inventory from "./Inventory";

export function PickUp(
    scene: Phaser.Scene,
    player: Player,
    pickupItem: PowerUp | Weapon,
    inventory: Inventory,
    enemies?: Enemies,
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

    if (pickupItem instanceof PowerUp) {
        scene.physics.add.collider(player, pickupItem, () => {
            switch (pickupItem.getPowerUpType()) {
                case PowerUpType.SPEED_BOOST:
                    playerStore.applySpeedBoost(scene);
                    break;
                case PowerUpType.ATTACK_BOOST:
                    playerStore.applyAttackBoost(scene);
                    break;
                case PowerUpType.NUKE:
                    playerStore.applyNuke(enemies!);
                    break;
                case PowerUpType.TIME_STOP:
                    playerStore.applyTimeStop(scene, enemies!);
                    break;
                case PowerUpType.INVINCIBILITY:
                    playerStore.applyInvincibility(scene);
                    break;
                default:
                    break;
            }
            pickupItem.destroy();
        });
    }
}

