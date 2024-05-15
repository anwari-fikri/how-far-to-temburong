import { EventBus } from "../EventBus";
import { Scene } from "phaser";
import Player from "../classes/Player";
import PowerUps, { PowerUpType } from "../classes/PowerUps";
import { PickUp } from "../classes/PickUp";
import Weapon from "../classes/Weapon";
import { createPause } from "../classes/PauseResume";
import Enemy from "../classes/Enemy";
import Enemies from "../classes/Enemies";

export class Game extends Scene {
    private player: Player;
    private enemies: Enemies;
    private weapon: Weapon;
    private speedBoost: PowerUps;
    private speedBoost2: PowerUps;
    private attackUp: PowerUps;
    private nuke: PowerUps;
    private background: Phaser.GameObjects.Image;

    constructor() {
        super("Game");
    }

    create() {
        this.background = this.add
            .image(400, 300, "bg-bridge")
            .setScrollFactor(1);
        this.cameras.main.setZoom(1.5);

        this.weapon = new Weapon(this, 200, 200, "katana");

        this.player = new Player(this, 100, 450, "dude");

        this.enemies = new Enemies(this);
        for (let x = 0; x <= 1000; x += 100) {
            this.enemies.createEnemy(new Enemy(this, x, 650, "dude", 100.0, 5));
        }

        this.speedBoost = new PowerUps(
            this,
            400,
            450,
            "star",
            PowerUpType.SPEED_BOOST,
        );
        this.speedBoost2 = new PowerUps(
            this,
            0,
            450,
            "star",
            PowerUpType.SPEED_BOOST,
        );
        this.attackUp = new PowerUps(
            this,
            700,
            700,
            "attack-up",
            PowerUpType.ATTACK_BOOST,
        );
        this.nuke = new PowerUps(this, 600, 600, "nuke", PowerUpType.NUKE);

        PickUp(this, this.player, this.weapon);
        PickUp(this, this.player, this.speedBoost);
        PickUp(this, this.player, this.speedBoost2);
        PickUp(this, this.player, this.attackUp);
        PickUp(this, this.player, this.nuke, this.enemies);

        EventBus.emit("current-scene-ready", this);
    }

    getEnemies() {
        return this.enemies;
    }

    update() {
        this.player.update();
        this.enemies.update(this.player);

        if (this.player.getHealth() <= 0) {
            this.scene.pause();
            this.scene.launch("GameOver");
        }
    }

    changeScene() {
        this.scene.start("GameOver");
    }
}
