import { EventBus } from "../EventBus";
import { Scene } from "phaser";
import Player from "../classes/Player";
import { debugGraphic } from "../classes/DebugTool";
import { createPause } from "../classes/PauseResume";
import { ZombieGroup } from "../classes/ZombieGroup";
import { PowerUpManager } from "../classes/PowerUpManager";
import { GameUI } from "../classes/GameUI";
import {
    bridgeMap,
    generateMapContinuation,
    slimeDebuff,
} from "../classes/Map";
import { Intro } from "./Intro";
import { objectiveUI, stageObjective } from "../classes/GameObjective";

export class Game extends Scene {
    player: Player;
    zombies: ZombieGroup;
    gameUI: GameUI;
    powerUps: PowerUpManager;
    private wallLayer!: any;
    private wallLayer2!: any;
    private objectLayer!: any;
    private slimeLayer!: any;
    private map: Phaser.Tilemaps.Tilemap;
    private camera: Phaser.Cameras.Scene2D.Camera;
    private falling: any;
    private highestX: any;
    private distanceText: any;
    private killText: any;

    static gameStage = 0;
    static totalKill = 0;
    static totalDistance = 0;
    static totalTime = 0;

    constructor() {
        super("Game");
    }

    create() {
        this.camera = this.cameras.main;
        this.camera.setZoom(1);
        this.camera.followOffset.set(0, 50);
        this.camera.setBounds(0, 0, 10000, 700);

        Game.gameStage += 1;
        // Game.gameStage = 2;
        bridgeMap(this);

        this.physics.world.setBounds(
            0,
            0,
            this.map.widthInPixels,
            this.map.heightInPixels,
        );

        // Player
        this.player = new Player(this, 40, 450, "soldier");
        this.camera.startFollow(this.player);

        // Zombies
        this.zombies = new ZombieGroup(this, this.player);
        // this.zombies.exampleInfiniteZombie();

        // PowerUps
        this.powerUps = new PowerUpManager(this);
        this.powerUps.exampleSpawnPowerUps();

        this.gameUI = new GameUI(this, this.player);

        this.collider();

        // AttackWeapon(this, this.player, this.inventory);

        objectiveUI(this);
        this.fallingObject(70, 70, 250, 432, 4000);

        createPause(this);

        EventBus.emit("current-scene-ready", this);
    }

    update() {
        this.player.update();
        this.zombies.update(this.player);
        this.powerUps.update(this.player, this.zombies);
        this.gameUI.update();

        this.player.setDepth(11);
        this.zombies.setDepth(11);

        if (this.player.x > this.map.widthInPixels - 800) {
            generateMapContinuation(this);
            this.collider();
            this.camera.setBounds(0, 0, this.map.widthInPixels, 700);
            this.physics.world.setBounds(
                0,
                0,
                this.map.widthInPixels,
                this.map.heightInPixels,
            );
        }

        slimeDebuff(this);
        stageObjective(this);
    }

    collider() {
        this.player.setCollideWorldBounds(true);
        this.physics.add.collider(this.player, this.wallLayer);
        this.physics.add.collider(this.player, this.wallLayer2);
        this.physics.add.collider(this.player, this.objectLayer);
        this.physics.add.collider(this.player, this.falling);
        this.physics.add.collider(this.zombies, this.wallLayer);
        this.physics.add.collider(this.zombies, this.wallLayer2);
        this.physics.add.collider(this.zombies, this.objectLayer);
        this.physics.add.collider(this.zombies, this.zombies);
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
        this.falling.body.setImmovable(true);
        this.falling.setDepth(20);

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
        this.physics.add.collider(this.player, this.falling);
    }
}
