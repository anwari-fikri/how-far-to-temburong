"use client";
import React, { useEffect } from "react";
import Image from "next/image";
import title from "../../../public/assets/images/gameTitle.png";
import styles from "./Page.module.css"; // Import the CSS module

const Page = () => {
    useEffect(() => {
        const image = document.querySelector(`.${styles.image}`);
        if (image) {
            // Zoom out and redirect after 3 seconds
            setTimeout(() => {
                image.classList.add(styles["zoom-out"]); // Add zoom-out class for zoom out effect
                setTimeout(() => {
                    window.location.href = "/mainMenu"; // Redirect to /mainMenu
                }, 2000); // Wait for zoom-out animation (2 seconds)
            }, 500); // Wait for 0.5 seconds before starting zoom out
        }
    }, []);

    return (
        <div className={styles.container}>
            <Image
                src={title}
                alt="Game Title"
                width={1100}
                height={1100}
                className={styles.image}
            />
        </div>
    );
};

export default Page;
