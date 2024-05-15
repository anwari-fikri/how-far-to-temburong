import { EventBus } from "../EventBus";
import { Scene } from "phaser";
import Player from "../classes/Player";
import PowerUps, { PowerUpType } from "../classes/PowerUps";
import { PickUp } from "../classes/PickUp";
import Weapon from "../classes/Weapon";
import { createPause } from "../classes/PauseResume";
import Enemy from "../classes/Enemy";

export class Game extends Scene {
    private player: Player;
    private enemy1: Enemy;
    private weapons: Weapon[] = [];
    private speedBoost: PowerUps;
    private speedBoost2: PowerUps;
    private attackUp: PowerUps;
    private background: Phaser.GameObjects.Image;

    constructor() {
        super("Game");
    }

    create() {
        this.background = this.add
            .image(400, 300, "bg-bridge")
            .setScrollFactor(1);
        this.cameras.main.setZoom(1.5);

        this.weapons.push(new Weapon(this, 200, 200, "katana"));
        this.weapons.push(new Weapon(this, 700, 350, "sword"));

        this.player = new Player(this, 100, 450, "dude");
        this.enemy1 = new Enemy(this, 100, 650, "dude", 100.0, 5);

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
        this.attackUp = new PowerUps(
            this,
            700,
            700,
            "attack-up",
            PowerUpType.ATTACK_BOOST,
        );

        this.weapons.forEach((weapon) => {
            PickUp(this, this.player, weapon);
        });

        PickUp(this, this.player, this.speedBoost);
        PickUp(this, this.player, this.speedBoost2);
        PickUp(this, this.player, this.attackUp);

        EventBus.emit("current-scene-ready", this);
    }

    update() {
        this.player.update();
        this.enemy1.chase(this.player);
        this.enemy1.performAttack(this.player);

        if (this.player.getHealth() == 0) {
            this.scene.pause();
            this.scene.launch("GameOver");
        }
    }

    changeScene() {
        this.scene.start("GameOver");
    }
}
