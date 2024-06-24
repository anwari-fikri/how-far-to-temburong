import { Scene } from "phaser";

export class SoundManager {
    scene: Scene;
    speedBoostSound: Phaser.Sound.BaseSound;
    nukeSound: Phaser.Sound.BaseSound;
    attackBoostSound: Phaser.Sound.BaseSound;
    timeStopSound: Phaser.Sound.BaseSound;
    invincibilitySound: Phaser.Sound.BaseSound;

    playerDamageSound: Phaser.Sound.BaseSound;
    playerDeathSound: Phaser.Sound.BaseSound;
    playerHealSound: Phaser.Sound.BaseSound;
    attackSound: Phaser.Sound.BaseSound;
    gunSound: Phaser.Sound.BaseSound;
    swordSelect: Phaser.Sound.BaseSound;
    gunSelect: Phaser.Sound.BaseSound;
    levelUpSound: Phaser.Sound.BaseSound;
    expSound: Phaser.Sound.BaseSound;

    zombieDeathSound: Phaser.Sound.BaseSound;

    slimeSound: Phaser.Sound.BaseSound;
    dialougeSound: Phaser.Sound.BaseSound;
    encounterSound: Phaser.Sound.BaseSound;

    constructor(scene: Scene) {
        this.scene = scene;

        //  PowerUp sounds
        this.speedBoostSound = this.scene.sound.add("speedUp");
        this.nukeSound = this.scene.sound.add("nuke");
        this.attackBoostSound = this.scene.sound.add("attackUp");
        this.timeStopSound = this.scene.sound.add("timeStop");
        this.invincibilitySound = this.scene.sound.add("invincibility");

        // Player sounds
        this.playerDamageSound = this.scene.sound.add("playerHurt");
        this.playerDeathSound = this.scene.sound.add("playerDeath");
        this.playerHealSound = this.scene.sound.add("playerHeal");
        this.attackSound = this.scene.sound.add("mediumAttack");
        this.gunSound = this.scene.sound.add("gunAttack");
        this.swordSelect = this.scene.sound.add("swordSheath");
        this.gunSelect = this.scene.sound.add("gunReload");
        this.levelUpSound = this.scene.sound.add("levelUp");
        this.expSound = this.scene.sound.add("exp");

        // Zombie sounds
        this.zombieDeathSound = this.scene.sound.add("zombieDeath");

        //Stage sounds
        this.slimeSound = this.scene.sound.add("slimeStep");
        this.encounterSound = this.scene.sound.add("encounter");
    }
}
