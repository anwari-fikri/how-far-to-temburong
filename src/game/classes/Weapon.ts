export function Weapon(scene: any) {
    const weapons = [
        scene.physics.add.image(200, 200, "katana").setScale(0.5),
        scene.physics.add.image(200, 300, "gun").setScale(0.5),
        scene.physics.add.image(200, 400, "sword").setScale(0.5),
        scene.physics.add.image(200, 500, "dagger").setScale(0.5),
        scene.physics.add.image(200, 600, "spear").setScale(0.5),
    ];

    return weapons;
}
