import { useRef, useState } from "react";
import { IRefPhaserGame, PhaserGame } from "../game/PhaserGame";
import { MainMenu } from "../game/scenes/MainMenu";

function App() {
    //  References to the PhaserGame component (game and scene are exposed)
    const phaserRef = useRef<IRefPhaserGame | null>(null);

    return (
        <div id="app" className="h-dvh w-dvw justify-center items-center">
            <PhaserGame ref={phaserRef} />
        </div>
    );
}

export default App;
