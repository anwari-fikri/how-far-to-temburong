import Weapon from "./Weapon";

export function dropItem(scene: Phaser.Scene, xPos: number, yPos: number) {
    const randomValue = Math.random();

    if (randomValue < 0.4) {
        new Weapon(scene, xPos, yPos, "katana", true);
    } else if (randomValue < 0.6) {
        new Weapon(scene, xPos, yPos, "gun", false);
    } else {
        new Weapon(scene, xPos, yPos, "sword", false);
    }
}