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

export class Game extends Scene {
    private player: Player;
    zombies: ZombieGroup;
    private weapons: Weapon[] = [];
    private powerUps: PowerUp[] = [];
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

        this.weapons.push(new Weapon(this, 500, 0, "katana", true));
        this.weapons.push(new Weapon(this, 600, 0, "katana", true));
        this.weapons.push(new Weapon(this, 700, 0, "sword", true));
        this.weapons.push(new Weapon(this, 800, 0, "gun", false));
        this.weapons.push(new Weapon(this, 900, 0, "spear", true));

        this.player = new Player(this, 0, -100, "dude");
        this.zombies = new ZombieGroup(this);
        this.physics.add.collider(this.zombies, this.zombies);
        this.physics.add.collider(this.zombies, this.wallLayer);

        this.time.addEvent({
            delay: 50,
            loop: true,
            callback: () => {
                this.zombies.addZombie();
            },
            callbackScope: this,
        });

        if (this.player && this.wallLayer) {
            this.physics.add.collider(this.player, this.wallLayer);
        }

        this.weapons.forEach((weapon) => {
            PickUp(this, this.player, weapon, this.inventory);
        });

        AttackWeapon(this, this.player, this.inventory);

        this.powerUps.push(
            new PowerUp(this, 400, 450, "star", PowerUpType.SPEED_BOOST),
            new PowerUp(this, 0, 450, "star", PowerUpType.SPEED_BOOST),
            new PowerUp(this, 700, 700, "attack-up", PowerUpType.ATTACK_BOOST),
            new PowerUp(this, 400, 0, "nuke", PowerUpType.NUKE),
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
        // this.powerUps.forEach((powerUp: PowerUp) => {
        //     PickUp(this, this.player, powerUp, this.inventory, this.enemies);
        // });

        if (this.player && this.wallLayer) {
            this.physics.add.collider(this.player, this.wallLayer);
        }

        this.camera = this.cameras.main;
        this.camera.setBounds(0, -650, 10000, this.map.heightInPixels);
        this.camera.setZoom(0.75);
        this.camera.startFollow(this.player);

        // uncomment to check collider
        // debugGraphic(this);
        createPause(this);

        EventBus.emit("current-scene-ready", this);
    }

    update() {
        this.player.update();
        this.zombies.update(this.player);

        if (playerStore.currentHealth <= 0) {
            this.scene.pause();
            this.scene.launch("GameOver");
        }
    }

    changeScene() {
        this.scene.start("GameOver");
    }
}
