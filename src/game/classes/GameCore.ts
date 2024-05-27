import Player from "./Player";

export default class GameCore {
    player: Player;
    game: any;
    scene: Phaser.Scene;

    constructor(game: Phaser.Game, scene: Phaser.Scene) {
        this.game = game;
        this.scene = scene;
    }
}

