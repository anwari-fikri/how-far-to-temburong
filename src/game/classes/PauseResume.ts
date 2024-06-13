export function createPause(scene: any) {
    const escKey = scene.input.keyboard?.addKey(
        Phaser.Input.Keyboard.KeyCodes.ESC,
    );

    escKey?.on("down", () => {
        scene.scene.pause();
        scene.sound.pauseAll();

        scene.scene.launch("PauseMenu");
    });
}
