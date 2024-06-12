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
import Bullet from "../classes/Bullet";
import { Zombie } from "../classes/Zombie";

export class Game extends Scene {
    static player: Player;
    zombies: ZombieGroup;
    gameUI: GameUI;
    powerUps: PowerUpManager;
    private wallLayer!: any;
    private wallLayer2!: any;
    private objectLayer!: any;
    private map: Phaser.Tilemaps.Tilemap;
    private camera: Phaser.Cameras.Scene2D.Camera;
    private falling: any;

    static gameStage = 1;
    static totalKill = 0;
    static totalDistance = 0;
    static totalTime = 0;

    constructor() {
        super("Game");
    }

    create() {
        this.camera = this.cameras.main;
        this.camera.setZoom(1);
        this.camera.followOffset.set(0, 100);
        this.camera.setBounds(0, 0, 10000, 700);

        // Game.gameStage = 3;
        // console.log(Game.gameStage);
        bridgeMap(this);

        this.physics.world.setBounds(
            0,
            0,
            this.map.widthInPixels,
            this.map.heightInPixels,
        );

        // Player
        Game.player = new Player(this, 40, 450, "soldier");
        this.camera.startFollow(Game.player);

        // Zombies
        this.zombies = new ZombieGroup(this, Game.player);
        // this.zombies.exampleInfiniteZombie();

        // PowerUps
        this.powerUps = new PowerUpManager(this);
        this.powerUps.exampleSpawnPowerUps();

        this.gameUI = new GameUI(this);

        this.collider();

        // AttackWeapon(this, this.player, this.inventory);

        objectiveUI(this);
        this.fallingObject(70, 70, 250, 432, 4000);

        // const graphics = this.add.graphics().setDepth(100);
        // graphics.lineStyle(2, 0xff0000);
        // graphics.strokeRect(0, 550, this.map.widthInPixels, 90);

        createPause(this);

        this.physics.add.overlap(
            Game.player.inventory.rangedWeapon.bullets,
            this.zombies,
            // @ts-ignore
            this.bulletHitZombie, // IDK how to fix this!!
            null,
            this,
        );

        EventBus.emit("current-scene-ready", this);
    }

    bulletHitZombie(zombie: Zombie, bullet: Bullet) {
        bullet.die();
        zombie.receiveDamage(
            Game.player.currentAttackPower,
            Game.player.inventory.rangedWeapon,
        );
        console.log(zombie.currentHealth);
        if (zombie.currentHealth <= 0) {
            zombie.die();
            const zombieDeath = this.sound.add("zombieDeath");
            zombieDeath.play();
        }
    }

    update() {
        Game.player.update();
        this.zombies.update(Game.player);
        this.powerUps.update(Game.player, this.zombies);
        this.gameUI.update();

        Game.player.setDepth(11);
        this.zombies.setDepth(11);

        if(Game.player.currentHealth<=0){
            this.scene.start("GameOver")
        }

        if (Game.player.x > this.map.widthInPixels - 800) {
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
        Game.player.setCollideWorldBounds(true);
        this.physics.add.collider(Game.player, this.wallLayer);
        this.physics.add.collider(Game.player, this.wallLayer2);
        this.physics.add.collider(Game.player, this.objectLayer);
        this.physics.add.collider(Game.player, this.falling);
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
        this.physics.add.collider(Game.player, this.falling);
    }
}
