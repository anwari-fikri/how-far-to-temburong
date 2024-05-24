import { EventBus } from "../EventBus";
import { Scene } from "phaser";
import Player from "../classes/Player";
import PowerUp, { PowerUpType } from "../classes/PowerUp";
import { PickUp } from "../classes/PickUp";
import Weapon from "../classes/Weapon";
import Inventory from "../classes/Inventory";
import playerStore from "../stores/PlayerStore";
import { debugGraphic } from "../classes/DebugTool";
import { createPause } from "../classes/PauseResume";
import { AttackWeapon } from "../classes/AttackWeapon";
import { ZombieGroup } from "../classes/ZombieGroup";
import { PowerUpManager } from "../classes/PowerUpManager";

export class Game extends Scene {
    private player: Player;
    zombies: ZombieGroup;
    private powerUps: PowerUpManager;
    private weapons: Weapon[] = [];
    private wallLayer!: any;
    private inventory: Inventory;
    private map: Phaser.Tilemaps.Tilemap;
    private camera: Phaser.Cameras.Scene2D.Camera;

    constructor() {
        super("Game");
    }

    create() {
        this.map = this.make.tilemap({ key: "bridgeStage" });
        const tileset = this.map.addTilesetImage(
            "bridgeStage", //nama image set dalam tiled and json
            "bridgeimage", //key gambar di preload
        ) as Phaser.Tilemaps.Tileset;
        ["bridge", "wood", "light", "light2"].map((layerName) =>
            this.map.createLayer(layerName, tileset),
        );
        this.wallLayer = this.map.createLayer("barricade", tileset);
        this.wallLayer.setCollisionByProperty({ collides: true });

        this.inventory = new Inventory();

        this.weapons.push(new Weapon(this, 500, -300, "katana", true));
        this.weapons.push(new Weapon(this, 600, -300, "katana", true));
        this.weapons.push(new Weapon(this, 700, -300, "sword", true));
        this.weapons.push(new Weapon(this, 800, -300, "gun", false));
        this.weapons.push(new Weapon(this, 900, -300, "spear", true));
        this.weapons.push(new Weapon(this, 200, -200, "seliparJepun", false));

        // Player
        this.player = new Player(this, 0, 0, "dude");

        // Zombies
        this.zombies = new ZombieGroup(this);
        this.zombies.exampleInfiniteZombie();

        // PowerUps
        this.powerUps = new PowerUpManager(this);
        this.powerUps.exampleSpawnPowerUps();

        // this.powerUps.forEach((powerUp: PowerUp) => {
        //     PickUp(this, this.player, powerUp, this.inventory, this.enemies);
        // });

        this.physics.add.collider(this.zombies, this.zombies);
        this.physics.add.collider(this.player, this.wallLayer);
        this.physics.add.collider(this.zombies, this.wallLayer);

        this.weapons.forEach((weapon) => {
            PickUp(this, this.player, weapon, this.inventory);
        });

        AttackWeapon(this, this.player, this.inventory);

        if (this.player && this.wallLayer) {
            this.physics.add.collider(this.player, this.wallLayer);
        }

        this.camera = this.cameras.main;
        // this.camera.setBounds(0, -650, 1000d0, this.map.heightInPixels);
        this.camera.setZoom(1);
        this.camera.startFollow(this.player);

        // uncomment to check collider
        debugGraphic(this);
        createPause(this);

        EventBus.emit("current-scene-ready", this);
    }

    update() {
        this.player.update();
        this.zombies.update(this.player);
        this.powerUps.update(this.player, this.zombies);

        if (playerStore.currentHealth <= 0) {
            this.scene.pause();
            this.scene.launch("GameOver");
        }
    }

    changeScene() {
        this.scene.start("GameOver");
    }
}
