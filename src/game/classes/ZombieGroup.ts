import { Scene } from "phaser";
import { ZOMBIE_TYPE, Zombie } from "./Zombie";
import Player from "./Player";
import { Game } from "../scenes/Game";

export class ZombieGroup extends Phaser.GameObjects.Group {
    spawnRate: number;
    enemiesPerSpawn: number;
    elapsedMinutes: number;
    player: Player;

    constructor(scene: Scene, player: Player) {
        super(scene, {
            classType: Zombie,
            maxSize: 50,
        });
        this.player = player;

        scene.add.existing(this);
        this.adjustSpawnRate();
        this.elapsedMinutes = 0;

        this.startSpawnTimer();
        this.startMinuteTracker();

        if (Game.bossStage) {
            this.addBoss();
        }

        // for (let i = 0; i < 100; i++) {
        //     const zombie = this.get() as Zombie;
        //     if (zombie) {
        //         zombie.activateZombie();
        //     }
        // }
    }

    private startSpawnTimer() {
        this.scene.time.addEvent({
            delay: this.spawnRate,
            loop: true,
            callback: () => {
                this.spawnEnemies();
            },
            callbackScope: this,
        });
    }

    private startMinuteTracker() {
        this.scene.time.addEvent({
            delay: 60000,
            loop: true,
            callback: () => {
                this.elapsedMinutes++;
                this.adjustSpawnRate();
                if (!Game.bossStage) {
                    this.addMiniBoss();
                }
            },
            callbackScope: this,
        });
    }

    addMiniBoss() {
        const zombie = this.get() as Zombie;
        if (zombie) {
            zombie.activateZombie(this.player, ZOMBIE_TYPE.MINI_BOSS);
            const minibossSpawn = this.scene.sound.add("spawnMiniboss");
            minibossSpawn.play({ volume: 0.2 });
        }
    }

    addBoss() {
        const zombie = this.get() as Zombie;

        switch (Game.gameStage) {
            case 2:
                zombie.activateZombie(this.player, ZOMBIE_TYPE.SLIME_BOSS);
                break;
            case 4:
                zombie.activateZombie(this.player, ZOMBIE_TYPE.MONKE_BOSS);
                break;
        }
    }

    adjustSpawnRate() {
        let spawnNum = 0;
        let spawnInterval = 0;
        switch (Game.gameStage) {
            case 1:
                spawnNum = 1;
                spawnInterval = 5000;
                break;
            case 2:
                spawnNum = 3;
                spawnInterval = 5000;
                break;
            case 3:
                spawnNum = 7;
                spawnInterval = 5000;
                break;
            case 4:
                spawnNum = 10;
                spawnInterval = 4000;
                break;
            default:
                spawnNum = 1;
                spawnInterval = 10000;
                break;
        }

        // Adjust spawn rate and enemies per spawn based on elapsed minutes
        const test = this.elapsedMinutes;
        this.enemiesPerSpawn = spawnNum; // Increase enemies per spawn each minute
        this.spawnRate = spawnInterval; // Decrease spawn interval
    }

    spawnEnemies() {
        if (!Game.player.isTimeStopped) {
            for (let i = 0; i < this.enemiesPerSpawn; i++) {
                this.addZombie();
            }
        }
    }

    exampleInfiniteZombie() {
        this.scene.time.addEvent({
            delay: 50,
            loop: true,
            callback: () => {
                this.addZombie();
            },
            callbackScope: this,
        });
    }

    addZombie() {
        const zombie = this.get() as Zombie;
        if (!Game.bossStage) {
            let normalRate = 0;
            switch (Game.gameStage) {
                case 3:
                    normalRate = 0.2;
                    break;
                case 4:
                    normalRate = 0.2;
                    break;
                default:
                    normalRate = 0.5;
                    break;
            }
            if (zombie) {
                const randomType = Math.random();
                if (randomType < normalRate) {
                    zombie.activateZombie(this.player, ZOMBIE_TYPE.NORMAL);
                } else {
                    zombie.activateZombie(this.player, ZOMBIE_TYPE.STRONG);
                }
            }
        } else {
            if (zombie) {
                switch (Game.gameStage) {
                    case 2:
                        zombie.activateZombie(
                            this.player,
                            ZOMBIE_TYPE.SLIME_MINION,
                        );
                        break;
                    case 4:
                        zombie.activateZombie(
                            this.player,
                            ZOMBIE_TYPE.MONKE_MINION,
                        );
                        break;
                }
            }
        }
    }

    // PowerUps
    getNuked() {
        this.children.iterate((zombie: Phaser.GameObjects.GameObject) => {
            if (zombie instanceof Zombie) {
                zombie.die(true);
            }
            return true;
        });
    }

    getFreezed() {
        const action = Game.player.isTimeStopped ? "freeze" : "unfreeze";

        this.children.iterate((zombie: Phaser.GameObjects.GameObject) => {
            if (zombie instanceof Zombie) {
                (zombie as Zombie)[action]();
            }
            return true;
        });
    }

    update(player: Player) {
        this.children.iterate((zombie: Phaser.GameObjects.GameObject) => {
            if (zombie instanceof Zombie) {
                zombie.update(player);
            }
            return true;
        });
    }
}
