import { EventBus } from "../EventBus";
import { Scene } from "phaser";
import Player from "../classes/Player";
import PowerUps, { PowerUpType } from "../classes/PowerUps";
import { PickUp } from "../classes/PickUp";
import Weapon from "../classes/Weapon";
import { createPause } from "../classes/PauseResume";
import Enemy from "../classes/Enemy";
import Enemies from "../classes/Enemies";
import Inventory from "../classes/Inventory";

export class Game extends Scene {
    private player: Player;
    private enemies: Enemies;
    private weapons: Weapon[] = [];
    private speedBoost: PowerUps;
    private speedBoost2: PowerUps;
    private attackUp: PowerUps;
    private background: Phaser.GameObjects.Image;
    private inventory: Inventory;

    constructor() {
        super("Game");
    }

    create() {
        this.background = this.add
            .image(400, 300, "bg-bridge")
            .setScrollFactor(1);
        this.cameras.main.setZoom(1.5);

        this.inventory = new Inventory(this.player);

        this.weapons.push(new Weapon(this, 200, 200, "katana"));
        this.weapons.push(new Weapon(this, 700, 350, "sword"));
        this.weapons.push(new Weapon(this, 400, 400, "gun"));

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
        this.weapons.forEach((weapon) => {
            PickUp(this, this.player, weapon, this.inventory);
        });

        PickUp(this, this.player, this.speedBoost, this.inventory);
        PickUp(this, this.player, this.speedBoost2, this.inventory);
        PickUp(this, this.player, this.attackUp, this.inventory);

        EventBus.emit("current-scene-ready", this);
    }

    update() {
        this.player.update();
        this.enemies.update(this.player);

        if (this.player.getHealth() == 0) {
            this.scene.pause();
            this.scene.launch("GameOver");
        }
    }

    changeScene() {
        this.scene.start("GameOver");
    }
}
