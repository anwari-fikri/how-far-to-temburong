import { Scene } from "phaser";

export class Preloader extends Scene {
    constructor() {
        super("Preloader");
    }

    init() {
        //  We loaded this image in our Boot Scene, so we can display it here
        this.add.image(512, 384, "background");

        //  A simple progress bar. This is the outline of the bar.
        this.add.rectangle(512, 384, 468, 32).setStrokeStyle(1, 0xffffff);

        //  This is the progress bar itself. It will increase in size from the left based on the % of progress.
        const bar = this.add.rectangle(512 - 230, 384, 4, 28, 0xffffff);

        //  Use the 'progress' event emitted by the LoaderPlugin to update the loading bar
        this.load.on("progress", (progress: number) => {
            //  Update the progress bar (our bar is 464px wide, so 100% = 464px)
            bar.width = 4 + 460 * progress;
        });
    }

    preload() {
        //  Load the assets for the game - Replace with your own assets
        this.load.setPath("assets");

        this.load.image("logo", "logo.png");

        // UI
        this.load.image("health_drop", "ui/health_drop.png");
        this.load.image("experience", "ui/exp.png");
        this.load.image("calendar", "ui/calendar.png");
        this.load.spritesheet("inventory-slot", "ui/inventory-slot.png", {
            frameWidth: 32,
            frameHeight: 32,
        });

        // Power Ups
        this.load.image("attack_boost", "powerUps/attack-boost.png");
        this.load.image("nuke", "powerUps/nuke.png");
        this.load.image("time_stop", "powerUps/time-stop.png");
        this.load.image("invincibility", "powerUps/invincibility.png");
        this.load.image("speed_boost", "powerUps/speed-boost.png");

        // Characters
        this.load.spritesheet("soldier", "characters/soldier.png", {
            frameWidth: 96,
            frameHeight: 64,
        });
        this.load.spritesheet("zombie", "characters/zombie.png", {
            frameWidth: 96,
            frameHeight: 64,
        });
        this.load.spritesheet("fat_zombie", "characters/fat_zombie.png", {
            frameWidth: 96,
            frameHeight: 64,
        });
        this.load.spritesheet("slime_boss", "characters/slime_boss.png", {
            frameWidth: 96,
            frameHeight: 64,
        });
        this.load.spritesheet("monke_boss", "characters/monke_boss.png", {
            frameWidth: 96,
            frameHeight: 96,
        });
        this.load.spritesheet("slime_minion", "characters/slime_minion.png", {
            frameWidth: 96,
            frameHeight: 64,
        });
        this.load.spritesheet("monke_minion", "characters/monke_minion.png", {
            frameWidth: 96,
            frameHeight: 64,
        });

        // Weapons
        this.load.image("sword_icon", "weapons/icons/sword_icon.png");
        this.load.spritesheet("sword_attack", "weapons/sword_attack.png", {
            frameWidth: 96,
            frameHeight: 64,
        });
        this.load.image("pistol_icon", "weapons/icons/pistol_icon.png");
        this.load.spritesheet("pistol", "weapons/pistol.png", {
            frameWidth: 96,
            frameHeight: 64,
        });

        // Projectiles
        this.load.spritesheet(
            "bullet_sheet",
            "weapons/projectiles/bullet_sheet.png",
            {
                frameWidth: 20,
                frameHeight: 5,
            },
        );

        this.load.image("corpse", "corpse.png");
        this.load.spritesheet("dude", "dude.png", {
            frameWidth: 32,
            frameHeight: 46,
        });

        this.load.image("katana", "weapons/weapon1.png");
        this.load.image("gun", "weapons/weapon2.png");
        // this.load.image("sword", "weapons/weapon3.png");
        this.load.image("dagger", "weapons/weapon4.png");
        this.load.image("spear", "weapons/weapon5.png");
        this.load.image("seliparJepun", "weapons/weapon6.png");
        this.load.image("projectileTexture", "weapons/bullet.png");

        this.load.image("bridgeImage", "tiles/Texture/bridgetilesetv2.png");

        this.load.image("ocean", "tiles/Texture/oceantileset.png");
        this.load.image("sky", "bg-sky.jpg");
        this.load.image("jungle", "bg-jungle.png");
        this.load.image("objectImage", "tiles/Texture/enviromentalhazards.png");
        this.load.spritesheet(
            "objectImageS",
            "tiles/Texture/enviromentalhazards.png",
            {
                frameWidth: 32,
                frameHeight: 32,
            },
        );
        this.load.image("slime", "tiles/Texture/slime.png");
        this.load.image("start", "tiles/Texture/start.png");
        this.load.image("end", "tiles/Texture/end.png");

        //weapon skill upgrade
        this.load.image("attackUp", "assets/Intro/attackUpSkill.png");
        this.load.image("slow", "assets/Intro/slowSkill.png");
        this.load.image("confuse", "assets/Intro/confuseSkill.png");
        this.load.image(
            "criticalChance",
            "assets/Intro/criticalChanceSkill.png",
        );
        this.load.image("fire", "assets/Intro/fireSkill.png");
        this.load.image("freeze", "assets/Intro/freezeSkill.png");

        // Random Encounter
        this.load.image("trigger", "randomEncounter/trigger.png");
        this.load.image("random1", "randomEncounter/random1.png");
        this.load.image("random2", "randomEncounter/random2.png");
        this.load.image("random3", "randomEncounter/random3.png");
        this.load.image("random4", "randomEncounter/random4.png");
        this.load.image("random5", "randomEncounter/random5.png");
        this.load.image("random6", "randomEncounter/random6.png");
        this.load.image("random7", "randomEncounter/random7.png");
        this.load.image("random8", "randomEncounter/random8.png");
        this.load.image("random9", "randomEncounter/random9.png");
        this.load.image("random10", "randomEncounter/random10.png");
        this.load.image("char1", "assets/Intro/char1.png");

        // Audio
        this.load.audio("mediumAttack", "audio/player_attack_medium.mp3");
        this.load.audio("swordSheath", "audio/player_swordSheath.mp3");
        this.load.audio("gunAttack", "audio/player_attack_pistol.mp3");
        this.load.audio("gunReload", "audio/player_pistolReload.mp3");
        this.load.audio("playerHurt", "audio/player_hurt.mp3");
        this.load.audio("playerHeal", "audio/player_heal.mp3");
        this.load.audio("exp", "audio/player_pickExp.mp3");
        this.load.audio("levelUp", "audio/player_levelUp.mp3");
        this.load.audio("playerDeath", "audio/player_death.mp3");
        this.load.audio("equip", "audio/player_equip.mp3");
        this.load.audio("spawnMiniboss", "audio/enemy_miniboss_spawn.mp3");
        this.load.audio("zombieDeath", "audio/enemy_zombie_death.mp3");
        this.load.audio("zombieHurt", "audio/enemy_zombie_hurt.mp3");
        this.load.audio("attackUp", "audio/powerUp_attack.mp3");
        this.load.audio("speedUp", "audio/powerUp_speed.mp3");
        this.load.audio("timeStop", "audio/powerUp_timeStop.mp3");
        this.load.audio("nuke", "audio/powerUp_nuke.mp3");
        this.load.audio("invincibility", "audio/powerUp_invincibility.mp3");
        this.load.audio("waves", "audio/stage_waves.mp3");
        this.load.audio("trees", "audio/stage_trees.mp3");
        this.load.audio("encounter", "audio/stage_encounter.mp3");
        this.load.audio("slimeStep", "audio/stage_slimeStep.mp3");
        this.load.audio("dialouge", "audio/dialouge_keyboard.mp3");
        this.load.audio("select", "audio/intro_select.mp3");
    }

    create() {
        //  When all the assets have loaded, it's often worth creating global objects here that the rest of the game can use.
        //  For example, you can define global animations here, so we can use them in other scenes.

        //  Move to the MainMenu. You could also swap this for a Scene Transition, such as a camera fade.
        // this.scene.start("GameUIOverlay");
        // this.scene.start("CheckpointAndChapters");
        // this.scene.start("GameOver");
        this.scene.start("Game");
    }
}
