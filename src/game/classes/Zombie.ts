import Player from "./Player";
import { Physics, Scene } from "phaser";

interface ZombieProperties {
    texture: string;
    chaseSpeed: number;
    tint: number;
}

export const ZOMBIE_TYPE: Readonly<{ [key: string]: ZombieProperties }> = {
    NORMAL: { texture: "dude", chaseSpeed: 10, tint: 0xff0000 },
    STRONG: { texture: "dude", chaseSpeed: 20, tint: 0x00ff00 },
    MINI_BOSS: { texture: "dude", chaseSpeed: 30, tint: 0xffff00 },
} as const;

type ZombieType = (typeof ZOMBIE_TYPE)[keyof typeof ZOMBIE_TYPE];

export class Zombie extends Physics.Arcade.Sprite {
    chaseSpeed: number = 20;

    constructor(scene: Scene) {
        super(scene, 0, 0, "dude");

        scene.add.existing(this);
        scene.physics.add.existing(this);

        var radius = this.width / 3;
        this.setCircle(
            radius,
            -radius + 0.5 * this.width,
            -radius + 0.5 * this.height + 5,
        );

        this.setActive(false);
        this.setVisible(false);
        this.disableBody(true, true);
    }

    activateZombie(player: Player, zombieType: ZombieType) {
        const spawnMargin = 50; // Margin to ensure spawning outside the visible area
        const playerX = player.x;
        const playerY = player.y;
        const camera = this.scene.cameras.main;

        let spawnX: number = 0;
        let spawnY: number = 0;

        const spawnSide = Phaser.Math.Between(0, 1);
        switch (spawnSide) {
            case 0: // Left side
                spawnX = playerX - camera.width - spawnMargin;
                break;
            case 1: // Right side
                spawnX = playerX + camera.width + spawnMargin;
                break;
        }

        spawnY = Phaser.Math.Between(-300, 250);

        // Set the zombie's position and activate it
        switch (zombieType) {
            case ZOMBIE_TYPE.NORMAL:
                this.setTexture(ZOMBIE_TYPE.NORMAL.texture);
                this.chaseSpeed = ZOMBIE_TYPE.NORMAL.chaseSpeed;
                this.setTint(ZOMBIE_TYPE.NORMAL.tint); // Normal zombies tinted red
                break;
            case ZOMBIE_TYPE.STRONG:
                this.setTexture(ZOMBIE_TYPE.STRONG.texture);
                this.chaseSpeed = ZOMBIE_TYPE.STRONG.chaseSpeed;
                this.setTint(ZOMBIE_TYPE.STRONG.tint); // Strong zombies tinted green
                break;
            case ZOMBIE_TYPE.MINI_BOSS:
                this.setTexture(ZOMBIE_TYPE.MINI_BOSS.texture);
                this.chaseSpeed = ZOMBIE_TYPE.MINI_BOSS.chaseSpeed;
                this.setTint(ZOMBIE_TYPE.MINI_BOSS.tint); // Mini-boss zombies tinted yellow
                break;
        }
        this.alive(spawnX, spawnY);
    }

    alive(spawnX: number, spawnY: number) {
        this.setPosition(spawnX, spawnY);
        this.setActive(true);
        this.setVisible(true);
        this.enableBody();
    }

    die(isDeSpawn: boolean = false) {
        if (isDeSpawn) {
            // don't count towards kill count
        }
        this.setActive(false);
        this.setVisible(false);
        this.disableBody(true, true);
    }

    checkDistanceToPlayer(player: Player) {
        const deSpawnDistance: number = this.scene.cameras.main.width * 4;
        if (player) {
            const distance = Phaser.Math.Distance.Between(
                this.x,
                this.y,
                player.x,
                player.y,
            );
            if (distance > deSpawnDistance) {
                this.die(true);
            }
        }
    }

    freeze() {
        this.chaseSpeed = 0;
    }

    unfreeze() {
        this.chaseSpeed = 40;
    }

    update(player: Player) {
        if (this.active) {
            this.scene.physics.moveToObject(this, player, this.chaseSpeed);
            this.checkDistanceToPlayer(player);
            if (this.scene.physics.overlap(this, player)) {
                this.die();
                player.receiveDamage(0.1);
            }
            if (
                this.scene.physics.overlap(this, player.inventory.meleeWeapon)
            ) {
                this.die();
                const zombieDeath = this.scene.sound.add("zombieDeath");
                zombieDeath.play();
            }
            if (
                this.scene.physics.overlap(
                    this,
                    player.inventory.rangedWeapon.bullets,
                )
            ) {
                this.die();
                const zombieDeath = this.scene.sound.add("zombieDeath");
                zombieDeath.play();
            }
        }
    }
}
