"use client";
import React, { useEffect, useRef } from "react";
import Image from "next/image";
import Typed from "typed.js";
import gameplay2 from "../../../public/assets/images/gameplay2.png";

const Page = () => {
    const el = useRef(null);

    useEffect(() => {
        const options = {
            strings: [
                "Two years have passed since the attacks began, The situation in Brunei Muara has worsened day by day. I'm hopeful that Temburong is as safe as the rumors suggest. Great, the bridge is closed off! It appears my journey is about to take an unexpected turn…",
            ],
            typeSpeed: 20,
        };

        const typed = new Typed(el.current, options);

        // Add show class to the image after Typed is initialized
        const image = document.querySelector(".image");
        if (image) {
            image.classList.add("show");
        }

        return () => {
            // Destroy Typed instance during cleanup to stop animation
            typed.destroy();
        };
    }, []);

    return (
        <div className="container bg-black overflow-hidden relative">
            <Image
                src={gameplay2}
                alt="gameplay2 Logo"
                width={950}
                height={950}
                className="image"
            />
            <div className="text-container mt-8 mr-20 w-2/5 h-full flex  text-white">
                <span ref={el} />
            </div>
        </div>
    );
};

export default Page;
