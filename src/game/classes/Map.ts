// bridgeImage tileset:
const light = 1;
const lightStandMid = 2;
const lightStandBot = 3;
const fence = 4;
const roadLineBot_r = 5;
const roadLineBot_l = 6;
const road = 7;
const roadLineTop_r = 8;
const roadLineTop_l = 9;
const barricade = 10;
const bridgeBroken_l = 11;
const bridgeBroken_r = 12;
const barricadeCrack1 = 13;
const barricadeCrack2 = 14;
const bridge_l = 18;
const bridge_r = 17;

// objectImage tileset:
const crushedRock = 1;
const rock = 2;
const carRed = 6;
const carBlue_l = 8;
const carBlue_r = 9;
const carGreen = 10;
const carPurple = 12;
const pothole = 14;
const pothole2_1 = 15;
const pothole2_2 = 16;
const pothole2_3 = 17;
const pothole2_4 = 18;

export function bridgeMap(scene: any) {
    const sky = scene.add.image(450, 350, "sky");
    sky.setScrollFactor(1.1, 1);
    const ocean = scene.add.image(0, 980, "ocean");
    ocean.setScrollFactor(1.3, 1);
    scene.map = scene.make.tilemap({
        tileWidth: 32,
        tileHeight: 32,
        width: 50,
        height: 50,
    });
    const tileset = scene.map.addTilesetImage("bridgeImage");
    const objectset = scene.map.addTilesetImage("objectImage");

    if (tileset && objectset) {
        scene.roadLayer = scene.map.createBlankLayer("Road Layer", tileset);
        scene.lightLayer2 = scene.map.createBlankLayer(
            "Light Layer 2",
            tileset,
        );
        scene.wallLayer = scene.map.createBlankLayer("Wall Layer", tileset);
        scene.objectLayer = scene.map.createBlankLayer(
            "Object Layer",
            objectset,
        );
        scene.lightLayer1 = scene.map.createBlankLayer(
            "Light Layer 1",
            tileset,
        );
    }

    const roadX = 12;
    const roadWidth = 4;
    for (let roadRow = roadX; roadRow < roadX + roadWidth; roadRow += 1) {
        scene.roadLayer.fill(road, 0, roadRow, scene.map.width, 1);
    }
    const roadLineY = roadWidth / 2 - 1;
    for (let roadlineX = 0; roadlineX < scene.map.width; roadlineX += 3) {
        scene.roadLayer.putTileAt(
            roadLineBot_r,
            roadlineX,
            roadLineY + roadX,
            scene.map.width,
            1,
        );
        scene.roadLayer.putTileAt(
            roadLineTop_r,
            roadlineX,
            roadLineY + roadX + 1,
            scene.map.width,
            1,
        );
    }

    const roadX2 = roadX + roadWidth + 1;
    for (let roadRow = roadX2; roadRow < roadX2 + roadWidth; roadRow += 1) {
        scene.roadLayer.fill(road, 0, roadRow, scene.map.width, 1);
    }
    for (let roadlineX = 0; roadlineX < scene.map.width; roadlineX += 3) {
        scene.roadLayer.putTileAt(
            roadLineBot_r,
            roadlineX,
            roadLineY + roadX2,
            scene.map.width,
            1,
        );
        scene.roadLayer.putTileAt(
            roadLineTop_r,
            roadlineX,
            roadLineY + roadX2 + 1,
            scene.map.width,
            1,
        );
    }

    scene.wallLayer.fill(fence, 0, roadX - 1, scene.map.width, 1); // tile, x, y, ', num of row
    scene.wallLayer.fill(fence, 0, roadX2 + roadWidth - 1, scene.map.width, 1);
    scene.wallLayer.weightedRandomize(
        [
            { index: barricade, weight: 40 },
            { index: barricadeCrack1, weight: 15 },
            { index: barricadeCrack2, weight: 15 },
            { index: -1, weight: 3 },
        ],
        0,
        roadX + roadWidth - 1,
        scene.map.width,
        2,
    );

    scene.objectLayer.weightedRandomize(
        [
            { index: rock, weight: 1 },
            { index: crushedRock, weight: 1 },
            { index: carBlue_l, weight: 1 },
            { index: -1, weight: 50 },
        ],
        0,
        roadX + 1,
        scene.map.width,
        7,
    );

    generateStreetLight(scene.lightLayer1, 11);
    generateStreetLight(scene.lightLayer2, 20);
    clearPath(scene.wallLayer, -1);
    generateBridge(1, scene.wallLayer, bridge_r);
    clearObject(scene.objectLayer);
    completeCar(scene.objectLayer, carBlue_l, carBlue_r);

    scene.wallLayer.setCollision([
        fence,
        barricade,
        barricadeCrack1,
        barricadeCrack2,
    ]);
    scene.objectLayer.setCollision([rock, crushedRock, carBlue_l, carBlue_r]);
}

export function generateMapContinuation(scene: any) {
    const originalWidth = scene.map.width;
    const newWidth = originalWidth + 50;

    scene.map = scene.make.tilemap({
        tileWidth: 32,
        tileHeight: 32,
        width: newWidth,
        height: 50,
    });
    const tileset = scene.map.addTilesetImage("bridgeImage");
    const objectset = scene.map.addTilesetImage("objectImage");
    if (tileset) {
        scene.roadLayer = scene.map.createBlankLayer("Road Layer", tileset);
        scene.wallLayer = scene.map.createBlankLayer("Wall Layer", tileset);
        scene.objectLayer = scene.map.createBlankLayer(
            "Object Layer",
            objectset,
        );
    }

    const startX = originalWidth;

    const roadX = 12;
    const roadWidth = 4;
    for (let roadRow = roadX; roadRow < roadX + roadWidth; roadRow += 1) {
        scene.roadLayer.fill(road, startX, roadRow, scene.map.width, 1);
    }
    const roadLineY = roadWidth / 2 - 1;
    for (let roadlineX = startX; roadlineX < scene.map.width; roadlineX += 3) {
        scene.roadLayer.putTileAt(
            roadLineBot_r,
            roadlineX,
            roadLineY + roadX,
            scene.map.width,
            1,
        );
        scene.roadLayer.putTileAt(
            roadLineTop_r,
            roadlineX,
            roadLineY + roadX + 1,
            scene.map.width,
            1,
        );
    }

    const roadX2 = roadX + roadWidth + 1;
    for (let roadRow = roadX2; roadRow < roadX2 + roadWidth; roadRow += 1) {
        scene.roadLayer.fill(road, startX, roadRow, scene.map.width, 1);
    }
    for (let roadlineX = startX; roadlineX < scene.map.width; roadlineX += 3) {
        scene.roadLayer.putTileAt(
            roadLineBot_r,
            roadlineX,
            roadLineY + roadX2,
            scene.map.width,
            1,
        );
        scene.roadLayer.putTileAt(
            roadLineTop_r,
            roadlineX,
            roadLineY + roadX2 + 1,
            scene.map.width,
            1,
        );
    }

    scene.wallLayer.fill(fence, startX, roadX - 1, scene.map.width, 1); // tile, x, y, ', num of row
    scene.wallLayer.fill(
        fence,
        startX,
        roadX2 + roadWidth - 1,
        scene.map.width,
        1,
    );
    scene.wallLayer.weightedRandomize(
        [
            { index: barricade, weight: 40 },
            { index: barricadeCrack1, weight: 15 },
            { index: barricadeCrack2, weight: 15 },
            { index: -1, weight: 2.5 },
        ],
        startX + 1,
        roadX + roadWidth - 1,
        scene.map.width,
        2,
    );

    scene.objectLayer.weightedRandomize(
        [
            { index: rock, weight: 1 },
            { index: crushedRock, weight: 1 },
            { index: carBlue_l, weight: 1 },
            { index: -1, weight: 50 },
        ],
        startX,
        roadX + 1,
        scene.map.width,
        7,
    );

    generateStreetLight(scene.lightLayer1, 11);
    generateStreetLight(scene.lightLayer2, 20);
    clearPath(scene.wallLayer, -1);
    generateBridge(startX, scene.wallLayer, bridge_r);
    clearObject(scene.objectLayer);
    completeCar(scene.objectLayer, carBlue_l, carBlue_r);

    scene.roadLayer.setDepth(1);
    scene.lightLayer2.setDepth(2);
    scene.wallLayer.setDepth(3);
    scene.objectLayer.setDepth(3);
    scene.lightLayer1.setDepth(4);
    scene.player.setDepth(4);
    scene.zombies.setDepth(4);

    scene.wallLayer.setCollision(
        [fence, barricade, barricadeCrack1, barricadeCrack2],
        true,
        true,
        {
            tileIndex: startX,
        },
    );
    scene.objectLayer.setCollision(
        [rock, crushedRock, carBlue_l, carBlue_r],
        true,
        true,
        {
            tileIndex: startX,
        },
    );
}

export function replaceTiles(layer: any, targetIndex: any, newIndex: any) {
    for (let x = 0; x < 500; x++) {
        if (layer.hasTileAt(x, 15)) {
            const tile = layer.getTileAt(x, 15);
            if (tile.index === targetIndex) {
                layer.putTileAt(newIndex, x + 1, 15);
            }
        }
    }
}

export function clearPath(layer: any, newIndex: any) {
    for (let x = 1; x < 500; x++) {
        const tile = layer.getTileAt(x, 15);
        if (!tile) {
            layer.putTileAt(newIndex, x - 1, 16);
            layer.putTileAt(newIndex, x - 2, 16);
            layer.putTileAt(newIndex, x - 1, 15);
        }
    }
}

export function generateBridge(startX: any, layer: any, newIndex: any) {
    for (let x = startX; x < startX + 51; x++) {
        const tile = layer.getTileAt(x, 15);
        const noBridge = layer.getTileAt(x - 1, 15);
        if (!tile && !noBridge) {
            layer.putTileAt(newIndex, x, 15);
            layer.putTileAt(newIndex + 1, x - 1, 15);
            layer.putTileAt(newIndex, x - 1, 16);
            layer.putTileAt(newIndex + 1, x - 2, 16);
            layer.putTileAt(newIndex, x - 2, 17);
            layer.putTileAt(newIndex + 1, x - 3, 17);
        }
    }
}

export function clearObject(layer: any) {
    for (let y = 15; y < 17; y++) {
        for (let x = 0; x < 500; x++) {
            if (layer.hasTileAt(x, y)) {
                layer.putTileAt(-1, x, y);
            }
        }
    }
}

export function completeCar(layer: any, targetIndex: any, newIndex: any) {
    for (let y = 0; y < 500; y++) {
        for (let x = 0; x < 500; x++) {
            if (layer.hasTileAt(x, y)) {
                const tile = layer.getTileAt(x, y);
                if (tile.index === targetIndex) {
                    layer.putTileAt(newIndex, x + 1, y);
                }
            }
        }
    }
}

export function generateStreetLight(layer: any, startY: any) {
    for (let x = 1; x < 500; x++) {
        let rangeIsEmpty = true;
        for (let i = 1; i <= 5; i++) {
            const prevTile = layer.getTileAt(x - i, startY);
            if (prevTile) {
                rangeIsEmpty = false;
                break;
            }
        }
        const tile = layer.getTileAt(x, startY);
        if (!tile && rangeIsEmpty) {
            layer.putTileAt(lightStandBot, x, startY);
            layer.putTileAt(lightStandMid, x, startY - 1);
            layer.putTileAt(light, x, startY - 2);
        }
    }
}