import { Weapon } from "./Weapon";

export function PickUp(scene: Phaser.Scene, player: any) {
    const weaponsData = Weapon(scene);

    const weapons = Object.values(weaponsData); // Extract the weapon objects from the weaponsData object

    console.log("Weapons array:", weapons); // Log weapons array to check if it contains the correct objects

    const pickupKey = scene.input?.keyboard?.addKey("E");

    // Check if the 'E' key is pressed
    pickupKey?.on("down", () => {
        // Loop through all weapons
        weapons.forEach((weapon: any) => {
            // Check if the player is overlapping with the weapon
            if (scene.physics.overlap(player, weapon)) {
                // Get the name of the weapon
                const weaponName = weapon.name;
                // Collect the weapon
                // scene.collectWeapon(player, weapon, weaponName);
                // Log the name of the picked up weapon
                console.log(`Picked up ${weaponName}`);
                // Exit the loop after picking up one weapon
                return;
            }
        });
    });
}
