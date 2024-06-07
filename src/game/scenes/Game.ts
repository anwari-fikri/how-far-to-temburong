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
    private objectLayer!: any;
    private slimeLayer!: any;
    private map: Phaser.Tilemaps.Tilemap;
    private camera: Phaser.Cameras.Scene2D.Camera;
    private falling: any;
    private highestX: any;
    private distanceText: any;
    private killText: any;

    static entryCount = 0;
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

        Game.entryCount += 1;
        bridgeMap(this);

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

        createPause(this);

        EventBus.emit("current-scene-ready", this);
    }

    update() {
        this.player.update();
        this.zombies.update(this.player);
        this.powerUps.update(this.player, this.zombies);
        this.gameUI.update();

        // maybe delete nanti
        this.player.setDepth(4);
        this.zombies.setDepth(4);

        if (this.player.x > this.map.widthInPixels - 800) {
            generateMapContinuation(this);
            this.collider();
            this.camera.setBounds(0, 0, this.map.widthInPixels, 700);
        }

        slimeDebuff(this);
        stageObjective(this);
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
        this.falling.body.setImmovable(true);

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
