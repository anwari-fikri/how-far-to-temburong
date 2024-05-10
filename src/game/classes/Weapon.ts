export function Weapon(scene: any) {
    const katana = scene.physics.add.image(200, 200, "katana").setScale(0.5);
    const gun = scene.physics.add.image(200, 300, "gun").setScale(0.5);
    const sword = scene.physics.add.image(200, 400, "sword").setScale(0.5);
    const dagger = scene.physics.add.image(200, 500, "dagger").setScale(0.5);
    const spear = scene.physics.add.image(200, 600, "spear").setScale(0.5);
}
