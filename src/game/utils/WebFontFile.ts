import WebFont from "webfontloader";

export default class WebFontFile extends Phaser.Loader.File {
    fontNames: string[];
    service: string;

    /**
     * @param {Phaser.Loader.LoaderPlugin} loader
     * @param {string | string[]} fontNames
     * @param {string} [service]
     */
    constructor(
        loader: Phaser.Loader.LoaderPlugin,
        fontNames: string | string[],
        service: string = "google",
    ) {
        super(loader, {
            type: "webfont",
            key: fontNames.toString(),
        });

        this.fontNames = Array.isArray(fontNames) ? fontNames : [fontNames];
        this.service = service;
    }

    load() {
        const config: any = {
            active: () => {
                this.loader.nextFile(this, true);
            },
        };

        switch (this.service) {
            case "google":
                config["google"] = {
                    families: this.fontNames,
                };
                break;

            default:
                throw new Error("Unsupported font service");
        }

        WebFont.load(config);
    }
}

