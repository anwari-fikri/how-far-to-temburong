import { Scene } from "phaser";
import { EventBus } from "../EventBus";

export class RandomEncounterTest extends Scene {
    constructor() {
        super("RandomEncounterTest");
    }

    create() {
        const title = this.add.text(100, 200, 'Static Text Object', { fontFamily: 'Arial', fontSize: 64, color: '#00ff00' });
        
        EventBus.emit("current-scene-ready", this);
    }
}