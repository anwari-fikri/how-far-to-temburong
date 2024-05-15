import Phaser from "phaser";
import Enemy from "../classes/Enemy";
import Player from "../classes/Player";

export default class Enemies {
    private scene: Phaser.Scene;
    private enemies: Phaser.Physics.Arcade.Group;

    constructor(scene: Phaser.Scene) {
        this.scene = scene;
        this.enemies = this.scene.physics.add.group();
    }

    createEnemy(enemy: Enemy) {
        this.enemies.add(enemy);
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
        console.log("BOOM");
        this.enemies.clear(true, true);
    }

    getGroup() {
        return this.enemies;
    }
}

