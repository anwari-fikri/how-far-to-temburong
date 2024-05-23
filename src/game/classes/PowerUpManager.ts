import { Scene } from "phaser";
import PowerUp, { PowerUpType } from "./PowerUp";
import Player from "./Player";
import { ZombieGroup } from "./ZombieGroup";

export class PowerUpManager extends Phaser.GameObjects.Group {
    constructor(scene: Scene) {
        super(scene),
            {
                classType: PowerUp,
                maxSize: 2,
            };

        scene.add.existing(this);
    }

    exampleSpawnPowerUps() {
        this.addPowerUp(100, 50, "nuke", PowerUpType.NUKE);
        this.addPowerUp(100, 100, "star", PowerUpType.SPEED_BOOST);
    }

    addPowerUp(
        x: number,
        y: number,
        texture: string,
        powerUpType: PowerUpType,
    ) {
        // Create a new PowerUp if the pool is empty
        let powerUp = this.getFirstDead(false) as PowerUp;
        if (!powerUp) {
            powerUp = new PowerUp(this.scene, x, y, texture, powerUpType);
            this.add(powerUp);
        } else {
            powerUp.powerUpType = powerUpType; // Ensure the type is updated
        }
        powerUp.activatePowerUp(x, y);
    }

    update(player: Player, enemies: ZombieGroup) {
        this.children.iterate((powerUp: Phaser.GameObjects.GameObject) => {
            if (powerUp instanceof PowerUp) {
                powerUp.update(player, enemies);
            }
            return true;
        });
    }
}

