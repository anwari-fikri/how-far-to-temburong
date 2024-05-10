import playerStore from "../stores/PlayerStore";
import Player from "./Player";
import PowerUps from "./PowerUps";
import Weapon from "./Weapon";

export function PickUp(
    scene: Phaser.Scene,
    player: Player,
    pickupItem: PowerUps | Weapon,
) {
    if (pickupItem instanceof Weapon) {
        const pickupKey = scene.input?.keyboard?.addKey("E");
        if (pickupKey) {
            pickupKey.on("down", () => {
                if (scene.physics.overlap(player, pickupItem)) {
                    const weaponName = pickupItem.name;
                    console.log(`Picked up ${weaponName}`);
                    return;
                }
            });
        }
    }

    if (pickupItem instanceof PowerUps) {
        scene.physics.add.collider(player, pickupItem, () => {
            playerStore.applySpeedBoost(scene);
            pickupItem.destroy();
        });
    }
}
