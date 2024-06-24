import React, { useRef, useEffect } from "react";
import { IRefPhaserGame, PhaserGame } from "../game/PhaserGame";
import { MainMenu } from "../game/scenes/MainMenu";

function App() {
    const phaserRef = useRef<IRefPhaserGame | null>(null);

    useEffect(() => {
        const handleBeforeUnload = (event: BeforeUnloadEvent) => {
            event.preventDefault();
            event.returnValue = ""; // Required for Chrome
        };

        window.addEventListener("beforeunload", handleBeforeUnload);

        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, []);

    return (
        <div id="app" className="h-dvh w-dvw justify-center items-center">
            <PhaserGame ref={phaserRef} />
        </div>
    );
}

export default App;
