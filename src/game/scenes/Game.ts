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
import { bridgeMap, generateMapContinuation } from "../classes/Map";

export class Game extends Scene {
    player: Player;
    zombies: ZombieGroup;
    gameUI: GameUI;
    powerUps: PowerUpManager;
    private weapons: Weapon[] = [];
    private wallLayer!: any;
    private objectLayer!: any;
    private inventory: Inventory;
    private map: Phaser.Tilemaps.Tilemap;
    private camera: Phaser.Cameras.Scene2D.Camera;
    private falling: any;

    constructor() {
        super("Game");
    }

    create() {
        bridgeMap(this);

        this.inventory = new Inventory();

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
        this.camera.setZoom(1);
        this.camera.startFollow(this.player);
        this.camera.followOffset.set(0, 50);
        this.camera.setBounds(0, 0, 10000, 700);

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

        if (this.player.x > this.map.widthInPixels - 800) {
            generateMapContinuation(this);
            this.collider();
        }
    }

    collider() {
        this.physics.add.collider(this.player, this.wallLayer);
        this.physics.add.collider(this.player, this.objectLayer);
        this.physics.add.collider(this.player, this.falling);
        this.physics.add.collider(this.zombies, this.wallLayer);
        this.physics.add.collider(this.zombies, this.objectLayer);
        // uncomment to check collider
        // debugGraphic(this);
    }

    fallingObject(
        startX: number,
        startY: number,
        targetX: number,
        targetY: number,
        duration: number,
    ) {
        this.falling = this.physics.add.sprite(
            startX,
            startY,
            "objectImageS",
            2,
        );

        this.tweens.add({
            targets: this.falling,
            y: targetY,
            x: targetX,
            duration: duration,
            ease: "Linear",
            onComplete: () => {
                this.falling.setTexture("objectImageS", 1);
            },
        });
    }

    changeScene() {
        this.scene.start("WeaponTest");
    }
}
