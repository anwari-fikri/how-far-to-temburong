import { Scene } from "phaser";
import PowerUp, { PowerUpType } from "./PowerUp";
import Player from "./Player";
import { ZombieGroup } from "./ZombieGroup";
import { Game } from "../scenes/Game";
import { Zombie } from "./Zombie";

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
        this.addPowerUp(270, 400, "nuke", PowerUpType.NUKE);
        this.addPowerUp(100, 400, "speed_boost", PowerUpType.SPEED_BOOST);
        this.addPowerUp(150, 400, "attack_boost", PowerUpType.ATTACK_BOOST);
        this.addPowerUp(200, 400, "time_stop", PowerUpType.TIME_STOP);
        this.addPowerUp(250, 400, "invincibility", PowerUpType.INVINCIBILITY);
    }

    dropRandomPowerUp(zombie: Zombie) {
        const powerUpTypes = Object.values(PowerUpType);
        const randomIndex = Math.floor(Math.random() * powerUpTypes.length);
        const randomPowerUpType = powerUpTypes[randomIndex];

        let powerUpKey = "";

        switch (randomPowerUpType) {
            case PowerUpType.NUKE:
                powerUpKey = PowerUpType.NUKE;
                break;
            case PowerUpType.SPEED_BOOST:
                powerUpKey = PowerUpType.SPEED_BOOST;
                break;
            case PowerUpType.ATTACK_BOOST:
                powerUpKey = PowerUpType.ATTACK_BOOST;
                break;
            case PowerUpType.TIME_STOP:
                powerUpKey = PowerUpType.TIME_STOP;
                break;
            case PowerUpType.INVINCIBILITY:
                powerUpKey = PowerUpType.INVINCIBILITY;
                break;
        }

        this.addPowerUp(zombie.x, zombie.y, powerUpKey, randomPowerUpType);
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
        powerUp.activatePowerUp(x, y, powerUpType);
        this.setDepth(40);
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

