import { Game } from "../scenes/Game";

export function fallingSlime(
    this: any,
    startX: number,
    startY: number,
    targetX: number,
    targetY: number,
    duration: number,
) {
    this.falling = this.physics.add.sprite(startX, startY, "objectImageS", 2);
    this.falling.body.setImmovable(true);
    this.falling.setDepth(20);

    this.tweens.add({
        targets: this.falling,
        y: targetY,
        x: targetX,
        duration: duration,
        ease: "Linear",
        onComplete: () => {
            this.falling.setTexture("objectImageS", 1);
        },
    });
    this.physics.add.collider(Game.player, this.falling);
}

// more tba..
