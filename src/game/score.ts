import { makeAutoObservable, action } from "mobx";

class ScoreState {
    coins: number = 0;

    constructor() {
        makeAutoObservable(this, {
            updateCoins: action,
        });
    }

    async updateCoins(amount: number) {
        this.coins = amount;
    }
}

export const score = new ScoreState();

