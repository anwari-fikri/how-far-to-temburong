// THIS FILE WILL BE DELETED AND BE REPLACED BY ZOMBIEGROUP.TS

import Phaser from "phaser";
import Enemy from "./Enemy";
import Player from "./Player";

export default class Enemies {
    private scene: Phaser.Scene;
    private enemies: Phaser.Physics.Arcade.Group;

    constructor(scene: Phaser.Scene) {
        this.scene = scene;
        this.enemies = this.scene.physics.add.group();
    }

    createEnemy(enemy: Enemy, wallLayer: any) {
        this.enemies.add(enemy);

        if (enemy.body && enemy.body instanceof Phaser.Physics.Arcade.Body) {
            enemy.body.setCircle((enemy.width / 2) * 0.7);
        }

        // Create a separate collider group for each enemy
        const enemyCollider = this.scene.physics.add.group();
        enemyCollider.add(enemy);
        this.scene.physics.add.collider(enemyCollider, this.enemies);

        if (enemy && wallLayer) {
            this.scene.physics.add.collider(enemyCollider, wallLayer);
        }
    }

    update(player: Player) {
        this.enemies.children.iterate(
            (gameObject: Phaser.GameObjects.GameObject) => {
                const enemy = gameObject as Enemy;
                if (enemy && enemy instanceof Enemy) {
                    enemy.update(player);
                }
                return true;
            },
        );
    }

    getNuked() {
        this.enemies.clear(true, true);
    }

    getTimeStopped() {
        this.enemies.children.iterate(
            (gameObject: Phaser.GameObjects.GameObject) => {
                const enemy = gameObject as Enemy;
                if (enemy && enemy instanceof Enemy) {
                    enemy.setChaseSpeed(0);
                }
                return true;
            },
        );
    }

    resumeMovement() {
        this.enemies.children.iterate(
            (gameObject: Phaser.GameObjects.GameObject) => {
                const enemy = gameObject as Enemy;
                if (enemy && enemy instanceof Enemy) {
                    enemy.setChaseSpeed(100);
                }
                return true;
            },
        );
    }

    getGroup() {
        return this.enemies;
    }
}
