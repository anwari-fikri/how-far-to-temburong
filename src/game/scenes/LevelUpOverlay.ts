import { Scene } from "phaser";
import { Game } from "./Game";
import { SkillLevel } from "../classes/WeaponSkill";

export class LevelUpOverlay extends Scene {
    constructor() {
        super({ key: "LevelUpOverlay" });
    }

    create() {
        const weaponSkill = Game.player.weaponSkill;
        const selection: SkillLevel[] = weaponSkill.choose3Random();

        // Background panel for better readability
        const panel = this.add.graphics();
        panel.fillStyle(0x000000, 0.8); // Black with 80% opacity
        const panelWidth = 400;
        const panelHeight = 300; // Increased height to accommodate skill description
        panel.fillRect(0, 0, panelWidth, panelHeight);

        // Center the panel on the screen
        panel.x = this.cameras.main.width / 2 - panelWidth / 2;
        panel.y = this.cameras.main.height / 2 - panelHeight / 2;

        const selectionText = this.add
            .text(panel.x + panelWidth / 2, panel.y + 20, "Level Up!", {
                font: "24px Arial",
                color: "#ffffff",
                align: "center",
            })
            .setOrigin(0.5)
            .setDepth(1);

        // Placeholder for skill description
        const skillDescription = this.add.text(
            panel.x + panelWidth / 2,
            panel.y + panelHeight - 40,
            "Hover on any skills!",
            {
                font: "18px Arial",
                color: "#ffffff",
                align: "center",
                wordWrap: { width: panelWidth - 40, useAdvancedWrap: true },
            },
        );
        skillDescription.setOrigin(0.5).setDepth(1);

        const optionButtons = selection.map((option, index) => {
            const button = this.add
                .text(
                    panel.x + panelWidth / 2,
                    panel.y + 80 + index * 50,
                    `${option.displayName.toUpperCase()} (Level ${option.level + 1})`,
                    {
                        font: "20px Arial",
                        color: "#ffffff",
                        backgroundColor: "#000000",
                        padding: { x: 10, y: 5 },
                        fixedWidth: panelWidth - 20, // Match text width with the panel
                        align: "center",
                    },
                )
                .setInteractive()
                .setOrigin(0.5)
                .setDepth(1);

            button.on("pointerover", () => {
                button.setAlpha(0.7); // Dim button when hovered
                // Example: Update skill description based on the hovered skill
                switch (option.displayName) {
                    case "Attack Up":
                        skillDescription.setText(`Increase weapon attack`);
                        break;
                    case "Slow":
                        skillDescription.setText(
                            "Slow skill description goes here.",
                        );
                        break;
                    case "Confuse":
                        skillDescription.setText(
                            "Confuse skill description goes here.",
                        );
                        break;
                    case "Burn":
                        skillDescription.setText(
                            "Fire skill description goes here.",
                        );
                        break;
                    case "Freeze":
                        skillDescription.setText(
                            "Freeze skill description goes here.",
                        );
                        break;
                    case "Critical Chance":
                        skillDescription.setText(
                            `Increases your chance to deal double damage`,
                        );
                        break;
                    default:
                        skillDescription.setText(
                            "Skill description not found.",
                        );
                        break;
                }
            });

            button.on("pointerout", () => {
                button.setAlpha(1); // Restore button opacity
                skillDescription.setText("Hover on any skills!"); // Reset description text
            });

            button.on("pointerdown", () => {
                console.log(`Selected ${option.displayName} to level up`);
                Game.player.weaponSkill.applyLevelUp(option.displayName);
                selectionText.destroy();
                optionButtons.forEach((btn) => btn.destroy());

                this.scene.stop();
                this.scene.resume("Game");
            });

            return button;
        });

        // Ensure UI elements are displayed above everything else
        this.children.bringToTop(panel);
        this.children.bringToTop(selectionText);
        this.children.bringToTop(skillDescription);
    }
}

