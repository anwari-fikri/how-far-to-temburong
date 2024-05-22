"use client";
import React, { useEffect } from "react";
import Image from "next/image";
import newspaper1 from "../../../public/assets/images/newspaper1.png";
import newspaper2 from "../../../public/assets/images/newspaper2.png";
import newspaper3 from "../../../public/assets/images/newspaper3.png";

const images = [newspaper1, newspaper2, newspaper3];

const Page = () => {
    useEffect(() => {
        const images = document.querySelectorAll(".image");

        // Function to slam the images in
        function slamImages() {
            images.forEach((image, index) => {
                setTimeout(() => {
                    image.classList.add("show", "slam");
                }, index * 1500); // Stagger the slams
            });
        }

        // Function to make all images fly away
        function flyAwayImages() {
            images.forEach((image) => {
                image.classList.remove("slam");
                image.classList.add("fly");
            });
            // Redirect to gameTitle after the images have flown away
            setTimeout(() => {
                window.location.href = "/gameTitle"; // Adjust the path as needed
            }, 2000); // Adjust the delay as needed
        }

        // Example usage
        slamImages();

        // Add event listener to trigger the fly-away effect after some delay
        setTimeout(() => {
            flyAwayImages();
        }, 5000); // Adjust the delay as needed
    }, []);

    return (
        <div className="container overflow-hidden">
            {images.map((image, index) => (
                <Image
                    key={index}
                    src={image}
                    alt={`Newspaper ${index + 1}`}
                    width={750}
                    height={750}
                    className={`image image-${index}`}
                />
            ))}
        </div>
    );
};

export default Page;
