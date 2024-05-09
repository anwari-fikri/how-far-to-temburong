import { GameObjects, Scene } from "phaser";

import { EventBus } from "../EventBus";

export class MainMenu extends Scene {
    background: GameObjects.Image;
    logo: GameObjects.Image;
    title: GameObjects.Text;
    logoTween: Phaser.Tweens.Tween | null;

    constructor() {
        super("MainMenu");
    }

    create() {
        this.background = this.add.image(512, 384, "background");
        this.logo = this.add.image(512, 300, "logo").setDepth(100);

        this.title = this.add
            .text(512, 460, "Hallo", {
                fontFamily: "Arial Black",
                fontSize: 38,
                color: "#ffffff",
                stroke: "#000000",
                strokeThickness: 8,
                align: "center",
            })
            .setOrigin(0.5)
            .setDepth(100);

        // Create a rectangle shape
        const rectangle = this.add.graphics();
        rectangle.fillStyle(0xff0000, 1); // Set fill color (red) and alpha (1 for fully opaque)
        rectangle.fillRect(100, 100, 200, 100); // Draw a filled rectangle (x, y, width, height)

        // Create a circle shape
        const circle = this.add.graphics();
        circle.fillStyle(0x00ff00, 1); // Set fill color (green) and alpha
        circle.fillCircle(400, 200, 50); // Draw a filled circle (x, y, radius)

        // Create a line shape
        const line = this.add.graphics();
        line.lineStyle(4, 0x0000ff, 1); // Set line style (lineWidth, color, alpha)
        line.beginPath(); // Begin drawing path
        line.moveTo(100, 300); // Move pen to starting point (x, y)
        line.lineTo(300, 400); // Draw line to end point (x, y)
        line.strokePath(); // Stroke the path

        // Create a polygon shape
        const polygon = this.add.graphics();
        polygon.fillStyle(0xffff00, 1); // Set fill color (yellow) and alpha
        polygon.fillTriangle(500, 300, 600, 400, 500, 400); // Draw a filled triangle (x1, y1, x2, y2, x3, y3)

        // Group
        const group = this.add.group();
        group.create(100, 200, "star");
        group.create(500, 200, "star");
        group.create(300, 400, "star");
        group.create(600, 300, "star");

        // Container
        const container = this.add.container().setPosition(100, 100);
        container.add(line);
        container.add(circle);
        container.add(polygon);

        // mouse input
        // this.input.on("pointerdown", this.addSprite);
        // this.input.on("pointerdown", this.addSpriteCollider);
        // this.input.on("pointerdown", this.addStarCollider);
        // Define variables to hold aqua_collide and star_collide
        // let aqua_collide_click: Phaser.Physics.Arcade.Image | null = null;
        let star_collide_click: Phaser.Physics.Arcade.Image[] = [];

        // Event handler for mouse click to add both aqua_collide and star_collide
        this.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
            const star_collide = this.addStarCollider(pointer);
            if (star_collide) {
                // Store the new star in the array
                star_collide_click.push(star_collide);

                // Apply collision between the new star and aqua_collide
                this.physics.add.collider(aqua_collide, star_collide);
            }
        });

        // keyboard input
        this.add.text(10, 10, "Enter your name:", {
            font: "32px Courier",
            color: "#ffffff",
        });

        const textEntry = this.add.text(10, 50, "", {
            font: "32px Courier",
            color: "#ffffff",
        });

        if (this.input.keyboard) {
            this.input.keyboard.on("keydown", (event: any) => {
                if (
                    event.keyCode === 32 ||
                    (event.keyCode >= 48 && event.keyCode <= 90)
                ) {
                    textEntry.text += event.key;
                }
            });
        } else {
            console.error("Keyboard input is not available.");
        }

        if (this.input.keyboard) {
            this.input.keyboard.on("keydown", (event: any) => {
                if (event.keyCode === 81) {
                    // keyCode for "q" key is 81
                    const x = Phaser.Math.Between(64, this.scale.width - 64);
                    const y = Phaser.Math.Between(64, this.scale.height - 64);

                    // Create a new sprite at random position
                    const aqua = this.add.sprite(x, y, "minatoAqua");

                    // Set the size of the sprite
                    const scaleX = 0.4;
                    const scaleY = 0.4;
                    aqua.setScale(scaleX, scaleY);

                    // Create a Phaser Tween to fade the sprite in and out
                    this.tweens.add({
                        targets: aqua,
                        duration: 500 + Math.random() * 1000,
                        alpha: 0,
                        yoyo: true,
                        repeat: -1,
                    });
                }
            });
        } else {
            console.error("Keyboard input is not available.");
        }

        // Physics (don't forget to add physics to config)
        const aqua_collide = this.physics.add.image(0, 0, "minatoAqua");
        aqua_collide
            .setVelocity(100, 200) // Set initial velocity as (100, 200)
            .setBounce(1, 1)
            .setCollideWorldBounds(true)
            .setGravityY(200); // Set gravity along the y-axis

        const scaleX = 0.1;
        const scaleY = 0.1;
        aqua_collide.setScale(scaleX, scaleY);

        aqua_collide.body.onCollide = true;

        EventBus.emit("current-scene-ready", this);
    }

    addSprite = (pointer: Phaser.Input.Pointer) => {
        // Get the mouse coordinates from the pointer event
        const x = pointer.x;
        const y = pointer.y;

        // Create a new sprite at the mouse coordinates
        const aqua = this.add.sprite(x, y, "minatoAqua");

        // Set the size of the sprite
        const scaleX = 0.1;
        const scaleY = 0.1;
        aqua.setScale(scaleX, scaleY);

        this.add.tween({
            targets: aqua,
            duration: 500 + Math.random() * 1000,
            alpha: 0,
            yoyo: true,
            repeat: -1,
        });
    };

    addSpriteCollider = (pointer: Phaser.Input.Pointer) => {
        // Get the mouse coordinates from the pointer event
        const x = pointer.x;
        const y = pointer.y;

        const aqua_collide = this.physics.add.image(x, y, "minatoAqua");
        aqua_collide
            .setVelocity(100, 200) // Set initial velocity as (100, 200)
            .setBounce(1, 1)
            .setCollideWorldBounds(true)
            .setGravityY(200); // Set gravity along the y-axis

        const scaleX = 0.1;
        const scaleY = 0.1;
        aqua_collide.setScale(scaleX, scaleY);

        aqua_collide.body.onCollide = true;

        return aqua_collide;
    };

    addStarCollider = (pointer: Phaser.Input.Pointer) => {
        const x = pointer.x;
        const y = pointer.y;

        const star_collide = this.physics.add
            .image(x, y, "star")
            .setVelocity(100, 0)
            .setCollideWorldBounds(true)
            .setBounce(1, 1)
            .setGravityY(200);

        star_collide.body.onCollide = true;

        return star_collide;
    };

    changeScene() {
        // if (this.logoTween) {
        //     this.logoTween.stop();
        //     this.logoTween = null;
        // }

        this.scene.start("Game");
    }

    moveLogo(vueCallback: ({ x, y }: { x: number; y: number }) => void) {
        if (this.logoTween) {
            if (this.logoTween.isPlaying()) {
                this.logoTween.pause();
            } else {
                this.logoTween.play();
            }
        } else {
            this.logoTween = this.tweens.add({
                targets: this.logo,
                x: { value: 750, duration: 3000, ease: "Back.easeInOut" },
                y: { value: 80, duration: 1500, ease: "Sine.easeOut" },
                yoyo: true,
                repeat: -1,
                onUpdate: () => {
                    if (vueCallback) {
                        vueCallback({
                            x: Math.floor(this.logo.x),
                            y: Math.floor(this.logo.y),
                        });
                    }
                },
            });
        }
    }
}

