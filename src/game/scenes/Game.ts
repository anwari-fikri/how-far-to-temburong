import { EventBus } from "../EventBus";
import { Scene } from "phaser";
import Player from "../classes/Player";
import PowerUp, { PowerUpType } from "../classes/PowerUp";
import { PickUp } from "../classes/PickUp";
import Weapon from "../classes/Weapon";
import Enemy from "../classes/Enemy";
import Enemies from "../classes/Enemies";
import playerStore from "../stores/PlayerStore";

export class Game extends Scene {
    private player: Player;
    private enemies: Enemies;
    private weapon: Weapon;
    private powerUps: PowerUp[] = [];
    private background: Phaser.GameObjects.Image;

    constructor() {
        super("Game");
    }

    create() {
        this.background = this.add
            .image(400, 300, "bg-bridge")
            .setScrollFactor(1);
        this.cameras.main.setZoom(1.5);

        this.player = new Player(this, 100, 450, "dude");

        this.weapon = new Weapon(this, 200, 200, "katana");
        PickUp(this, this.player, this.weapon);

        this.enemies = new Enemies(this);
        for (let x = 0; x <= 1000; x += 100) {
            this.enemies.createEnemy(new Enemy(this, x, 650, "dude", 100.0, 5));
        }

        this.powerUps.push(
            new PowerUp(this, 400, 450, "star", PowerUpType.SPEED_BOOST),
            new PowerUp(this, 0, 450, "star", PowerUpType.SPEED_BOOST),
            new PowerUp(this, 700, 700, "attack-up", PowerUpType.ATTACK_BOOST),
            new PowerUp(this, 600, 600, "nuke", PowerUpType.NUKE),
        );
        this.powerUps.forEach((powerUp: PowerUp) => {
            PickUp(this, this.player, powerUp, this.enemies);
        });

        EventBus.emit("current-scene-ready", this);
    }

    getEnemies() {
        return this.enemies;
    }

    update() {
        this.player.update();
        this.enemies.update(this.player);

        if (playerStore.currentHealth <= 0) {
            this.scene.pause();
            this.scene.launch("GameOver");
        }
    }

    changeScene() {
        this.scene.start("GameOver");
    }
}
