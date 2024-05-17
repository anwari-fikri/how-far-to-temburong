import { EventBus } from "../EventBus";
import { Scene } from "phaser";
import Player from "../classes/Player";
import PowerUp, { PowerUpType } from "../classes/PowerUp";
import { PickUp } from "../classes/PickUp";
import Weapon from "../classes/Weapon";
import Enemy from "../classes/Enemy";
import Enemies from "../classes/Enemies";
import Inventory from "../classes/Inventory";
import playerStore from "../stores/PlayerStore";
import { debugGraphic } from "../classes/DebugTool";
import { createPause } from "../classes/PauseResume";

export class Game extends Scene {
    private player: Player;
    private enemies: Enemies;
    private weapons: Weapon[] = [];
    private powerUps: PowerUp[] = [];
    private wallLayer!: any;
    private inventory: Inventory;

    constructor() {
        super("Game");
    }

    create() {
        this.cameras.main.setZoom(1.5);

        const map = this.make.tilemap({ key: "map" });
        const tiles_grass = map.addTilesetImage(
            "tiles_grass",
            "tiles_grass",
        ) as Phaser.Tilemaps.Tileset;
        const tiles_wall = map.addTilesetImage(
            "tiles_wall",
            "tiles_wall",
        ) as Phaser.Tilemaps.Tileset;
        const tiles_props = map.addTilesetImage(
            "tiles_props",
            "tiles_props",
        ) as Phaser.Tilemaps.Tileset;
        map.createLayer("ground", tiles_grass);
        this.wallLayer = map.createLayer("wall", tiles_wall);
        this.wallLayer.setCollisionByProperty({ collides: true });
        map.createLayer("wall2", tiles_props);

        this.inventory = new Inventory();

        this.weapons.push(new Weapon(this, 200, 200, "katana"));
        this.weapons.push(new Weapon(this, 200, 300, "katana"));
        this.weapons.push(new Weapon(this, 700, 350, "sword"));
        this.weapons.push(new Weapon(this, 400, 400, "gun"));

        this.player = new Player(this, 100, 450, "dude");

        this.weapons.forEach((weapon) => {
            PickUp(this, this.player, weapon, this.inventory);
        });

        this.enemies = new Enemies(this);
        for (let x = 0; x <= 1000; x += 100) {
            this.enemies.createEnemy(
                new Enemy(this, x, 650, "dude", 100.0, 1),
                this.wallLayer,
            );
        }

        this.powerUps.push(
            new PowerUp(this, 400, 450, "star", PowerUpType.SPEED_BOOST),
            new PowerUp(this, 0, 450, "star", PowerUpType.SPEED_BOOST),
            new PowerUp(this, 700, 700, "attack-up", PowerUpType.ATTACK_BOOST),
            new PowerUp(this, 600, 600, "nuke", PowerUpType.NUKE),
            new PowerUp(this, 0, 200, "time-stop", PowerUpType.TIME_STOP),
            new PowerUp(this, 0, 400, "time-stop", PowerUpType.TIME_STOP),
            new PowerUp(
                this,
                200,
                150,
                "invincibility",
                PowerUpType.INVINCIBILITY,
            ),
            new PowerUp(
                this,
                100,
                200,
                "invincibility",
                PowerUpType.INVINCIBILITY,
            ),
        );
        this.powerUps.forEach((powerUp: PowerUp) => {
            PickUp(this, this.player, powerUp, this.inventory, this.enemies);
        });

        if (this.player && this.wallLayer) {
            this.physics.add.collider(this.player, this.wallLayer);
        }

        // uncomment to check collider
        // debugGraphic(this);
        createPause(this);

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
