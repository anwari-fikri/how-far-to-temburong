"use client";
import React, { useEffect } from "react";
import Image from "next/image";
import mainMenu from "../../../public/assets/images/mainMenu.png";
import Link from "next/link";

const Page = () => {
    useEffect(() => {
        const image = document.querySelector(".image");
        if (image) {
            // Fade in after component mounts
            image.classList.add("show");
        }
    }, []);

    return (
        <div className="container bg-black overflow-y-hidden">
            <Image
                src={mainMenu}
                alt="Main Menu"
                width={1100}
                height={1100}
                className="image"
            />
            <div
                className="absolute top-0 left-0 w-full h-full"
                style={{
                    background:
                        "radial-gradient(circle at center, transparent 0%, rgba(0, 0, 0, 0.95) 100%)", // Adjust opacity here
                    pointerEvents: "none",
                }}
            />

            <Link href="/chapterOne" passHref>
                <div className="pixel">
                    <p>PLAY</p>
                </div>
            </Link>
            <div className="pixel">
                <p>SETTINGS</p>
            </div>
            <div className="pixel">
                <p>QUIT</p>
            </div>
        </div>
    );
};

export default Page;
