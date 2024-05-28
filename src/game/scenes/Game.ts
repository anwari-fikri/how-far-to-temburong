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
import { GameUI } from "../classes/GameUI";

export class Game extends Scene {
    player: Player;
    zombies: ZombieGroup;
    gameUI: GameUI;
    powerUps: PowerUpManager;
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
        this.player = new Player(
            this,
            this.scale.width / 2,
            this.scale.height / 2,
            "dude",
        );

        // Zombies
        this.zombies = new ZombieGroup(this, this.player);
        // this.zombies.exampleInfiniteZombie();

        // PowerUps
        this.powerUps = new PowerUpManager(this);
        this.powerUps.exampleSpawnPowerUps();

        this.gameUI = new GameUI(this, this.player);

        this.physics.add.collider(this.zombies, this.zombies);
        this.physics.add.collider(this.player, this.wallLayer);
        // this.physics.add.collider(this.zombies, this.wallLayer);

        this.weapons.forEach((weapon) => {
            PickUp(this, this.player, weapon, this.inventory);
        });

        AttackWeapon(this, this.player, this.inventory);

        const graphics = this.add.graphics();
        graphics.lineStyle(2, 0xffffff, 1.0);
        for (let y = -500; y < 500; y += 100) {
            graphics.moveTo(0, y);
            graphics.lineTo(this.scale.width, y);
            // Add text label for each line
            const text = this.add.text(10, y, `${y}`, {
                fontSize: "16px",
                color: "#ffffff",
            });
            text.setOrigin(0, 0.5);
        }
        graphics.strokePath();

        this.camera = this.cameras.main;
        // this.camera.setBounds(0, -650, 1000d0, this.map.heightInPixels);
        this.camera.setZoom(0.5);
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
        this.gameUI.update();

        if (playerStore.currentHealth <= 0) {
            this.scene.pause();
            this.scene.launch("GameOver");
        }
    }

    changeScene() {
        this.scene.start("GameOver");
    }
}
