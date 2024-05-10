import { makeAutoObservable, action } from "mobx";

class PlayerStore {
    baseSpeed: number = 300;

    constructor() {
        makeAutoObservable(this, {
            // updateCoins: action,
        });
    }

    // async updateCoins(amount: number) {
    //     this.coins = amount;
    // }
}

const playerStore = new PlayerStore();
export default playerStore;

