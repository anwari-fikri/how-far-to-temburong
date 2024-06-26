import { EventBus } from "../EventBus";
import { Scene } from "phaser";
import Player from "../classes/Player";
import { debugGraphic } from "../classes/DebugTool";
import { createPause } from "../classes/PauseResume";
import { ZombieGroup } from "../classes/ZombieGroup";
import { PowerUpManager } from "../classes/PowerUpManager";
import GameUI from "../classes/GameUI";
import {
    bridgeMap,
    generateMapContinuation,
    slimeDebuff,
} from "../classes/Map";
import { Intro } from "./Intro";
import { objectiveUI, stageObjective } from "../classes/GameObjective";
import Bullet from "../classes/Bullet";
import { Zombie } from "../classes/Zombie";
import RandomEncounterTrigger from "../classes/RandomEncounterTrigger";
import HealthDrop from "../classes/HealthDrop";
import { Objectives } from "./Objectives";
import { SoundManager } from "../classes/SoundManager";
import { ZOMBIE_TYPE } from "../classes/Zombie";

function loadGoogleFont() {
    const link = document.createElement("link");
    link.href =
        "https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
}

export class Game extends Scene {
    static player: Player;
    static zombies: ZombieGroup;
    static gameUI: GameUI;
    static powerUps: PowerUpManager;
    static randomEncounters: RandomEncounterTrigger;
    static HealthDrop: Phaser.GameObjects.Group;
    static soundManager: SoundManager;
    private wallLayer!: any;
    private wallLayer2!: any;
    private objectLayer!: any;
    private map: Phaser.Tilemaps.Tilemap;
    private camera: Phaser.Cameras.Scene2D.Camera;
    private falling: any;
    private vignetteSprite: Phaser.GameObjects.Sprite;

    static gameStage = 0;
    static bossStage = false;
    static totalKill = 0;
    static totalDistance = 0;
    static totalTime = 0;
    static isSceneLoaded = false;

    constructor() {
        super("Game");
    }

    create() {
        loadGoogleFont();
        this.camera = this.cameras.main;
        this.camera.setZoom(1);
        this.camera.followOffset.set(0, 100);
        this.camera.setBounds(0, 0, 10000, 700);
        this.camera.roundPixels = true;

        bridgeMap(this);

        this.physics.world.setBounds(
            0,
            0,
            this.map.widthInPixels,
            this.map.heightInPixels,
        );

        Game.soundManager = new SoundManager(this);

        // Player
        Game.player = new Player(this, 40, 450, "soldier");
        this.camera.startFollow(Game.player);

        // Zombies
        Game.zombies = new ZombieGroup(this, Game.player);
        // Game.zombies.exampleInfiniteZombie();

        // PowerUps
        Game.powerUps = new PowerUpManager(this);
        // Game.powerUps.exampleSpawnPowerUps();

        Game.gameUI = new GameUI(this);
        Game.HealthDrop = this.add.group({
            classType: HealthDrop,
            runChildUpdate: true,
        });
        Game.randomEncounters = new RandomEncounterTrigger(
            this,
            0,
            0,
            "trigger",
        );

        this.collider();

        // AttackWeapon(this, this.player, this.inventory);

        objectiveUI(this);
        Objectives(this);
        this.bgMusic();

        createPause(this);

        this.physics.add.overlap(
            Game.player.inventory.rangedWeapon.bullets,
            Game.zombies,
            // @ts-ignore
            this.bulletHitZombie, // IDK how to fix this!!
            null,
            this,
        );

        Game.isSceneLoaded = true;

        EventBus.emit("current-scene-ready", this);
    }

    bulletHitZombie(zombie: Zombie, bullet: Bullet) {
        bullet.die();
        const randomValue = 0.9 + Math.random() * 0.05;
        zombie.receiveDamage(
            (Game.player.inventory.rangedWeapon.attackPower +
                Game.player.bonusAttackPower) *
                randomValue,
            Game.player.inventory.rangedWeapon,
        );
        if (zombie.currentHealth <= 0) {
            zombie.die();
            // Check and play the specific death sound based on zombie type
            if (zombie.zombieType === ZOMBIE_TYPE.SLIME_BOSS) {
                Game.soundManager.slimebossDeathSound.play();
            } else if (zombie.zombieType === ZOMBIE_TYPE.SLIME_MINION) {
                Game.soundManager.minislimeDeathSound.play();
            } else if (zombie.zombieType === ZOMBIE_TYPE.MONKE_BOSS) {
                Game.soundManager.monkeybossDeathSound.play();
            } else if (zombie.zombieType === ZOMBIE_TYPE.MONKE_MINION) {
                Game.soundManager.minimonkeyDeathSound.play();
            } else {
                Game.soundManager.zombieDeathSound.play();
            }
        }
    }

    update() {
        Game.player.update();
        Game.zombies.update(Game.player);
        Game.powerUps.update(Game.zombies);
        Game.gameUI.update();
        Game.randomEncounters.update();

        Game.player.setDepth(11);
        Game.zombies.setDepth(11);

        if (Game.player.currentHealth <= 0) {
            this.sound.stopAll();
            Game.soundManager.playerDeathSound.play();
            this.scene.start("GameOver");
            Game.zombies.getNuked();
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

        if (Game.player.currentHealth <= 20) {
            this.lowHealth();
            this.vignetteSprite.setVisible(true);
            Game.soundManager.playerlowHealthSound.play({ loop: true });
        } else {
            if (this.vignetteSprite) {
                this.vignetteSprite.setVisible(false);
                Game.soundManager.playerlowHealthSound.stop();
            }
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
        this.physics.add.collider(Game.zombies, this.wallLayer);
        this.physics.add.collider(Game.zombies, this.wallLayer2);
        if (!Game.bossStage) {
            this.physics.add.collider(Game.zombies, this.objectLayer);
        }
        this.physics.add.collider(Game.zombies, Game.zombies);
        // uncomment to check collider
        // debugGraphic(this);
    }

    bgMusic() {
        if (Game.gameStage == 1 || Game.gameStage == 2) {
            const waveStage = this.sound.add("waves");
            waveStage.play({ loop: true });
        } else {
            const treeStage = this.sound.add("trees");
            treeStage.play({ loop: true });
        }
    }

    lowHealth() {
        this.cameras.main.shake(100, 0.0025);

        const vignetteTexture = this.textures.createCanvas(
            "vignette",
            this.cameras.main.width,
            this.cameras.main.height,
        );
        if (vignetteTexture) {
            const ctx = vignetteTexture.getContext();
            const width = vignetteTexture.width;
            const height = vignetteTexture.height;

            const gradient = ctx.createRadialGradient(
                width / 2,
                height / 2,
                0,
                width / 2,
                height / 2,
                Math.max(width, height) / 2,
            );
            gradient.addColorStop(0, "rgba(255, 0, 0, 0)");
            gradient.addColorStop(1, "rgba(255, 0, 0, 0.7)");

            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, width, height);

            vignetteTexture.refresh();

            this.vignetteSprite = this.add
                .sprite(0, 0, "vignette")
                .setOrigin(0, 0);
            this.vignetteSprite.setScrollFactor(0);
            this.vignetteSprite.setDepth(1000);
            this.vignetteSprite.setBlendMode(Phaser.BlendModes.MULTIPLY);

            this.vignetteSprite.alpha = 0.5;
        }
    }
}
