import { Physics } from "phaser";

export default class RandomEncounterTrigger extends Physics.Arcade.Sprite {
    constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
        super(scene, x, y, texture);
    }
}

