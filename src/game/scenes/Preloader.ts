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
        this.load.image("star", "star.png");

        // UI
        this.load.image("calendar", "ui/calendar.png");
        this.load.spritesheet("heart", "ui/heart.png", {
            frameWidth: 7,
            frameHeight: 7,
        });

        // Power Ups
        this.load.image("attack-up", "powerUps/attack-up.png");
        this.load.image("nuke", "powerUps/nuke.png");
        this.load.image("time-stop", "powerUps/time-stop.png");
        this.load.image("invincibility", "powerUps/invincibility.png");

        this.load.image("corpse", "corpse.png");
        this.load.spritesheet("dude", "dude.png", {
            frameWidth: 32,
            frameHeight: 46,
        });

        this.load.image("katana", "weapons/weapon1.png");
        this.load.image("gun", "weapons/weapon2.png");
        this.load.image("sword", "weapons/weapon3.png");
        this.load.image("dagger", "weapons/weapon4.png");
        this.load.image("spear", "weapons/weapon5.png");
        this.load.image("seliparJepun", "weapons/weapon6.png");
        this.load.image("projectileTexture", "weapons/bullet.png");
        this.load.image("slash", "weapons/slash.png");

        this.load.image("bridgeImage", "tiles/Texture/bridgetilesetv2.png");

        this.load.image("ocean", "bg-ocean.png");
        this.load.image("sky", "bg-sky.jpg");
        this.load.image("objectImage", "tiles/Texture/enviromentalhazards.png");
        this.load.spritesheet(
            "objectImageS",
            "tiles/Texture/enviromentalhazards.png",
            {
                frameWidth: 32,
                frameHeight: 32,
            },
        );

        // Random Encounter
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
    }

    create() {
        //  When all the assets have loaded, it's often worth creating global objects here that the rest of the game can use.
        //  For example, you can define global animations here, so we can use them in other scenes.

        //  Move to the MainMenu. You could also swap this for a Scene Transition, such as a camera fade.
        this.scene.start("Game");
        // this.scene.start("WeaponTest");
        // this.scene.start("GameUIOverlay");
    }
}
