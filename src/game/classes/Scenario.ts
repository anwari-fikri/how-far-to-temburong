interface Selection {
    answer: string;
    success: boolean;
    reward: string;
}

export class Scenario {
    scenarioText: string;
    selectionState: Selection[];
    bgImage: string;

    constructor(scenarioText: string, selectionState: Selection[], bgImage: string) {
        this.scenarioText = scenarioText;
        this.selectionState = selectionState;
        this.bgImage = bgImage;
    }

    getScenarioText() {
        return this.scenarioText;
    }

    getSelectionState() {
        return this.selectionState;
    }

    getBackgroundImage() {
        return this.bgImage;
    }
}
