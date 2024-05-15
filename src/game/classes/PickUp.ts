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
        const pickupKey = scene.input?.keyboard?.addKey("E");
        if (pickupKey) {
            pickupKey.on("down", () => {
                if (scene.physics.overlap(player, pickupItem)) {
                    const weaponName = pickupItem.texture.key;
                    if (weaponName) {
                        inventory.addWeapon(pickupItem);
                        pickupItem.destroy();
                    } else {
                        console.log("Weapon name not set.");
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
                default:
                    break;
            }
            pickupItem.destroy();
        });
    }
}
