"use client";
import { useEffect } from "react";

export default function Sky() {
  useEffect(() => {
    const nightsky = ["#280F36", "#632B6C", "#BE6590", "#FFC1A0", "#FE9C7F"];
    const starsContainer = document.querySelector(".stars");
    const cross = document.querySelector(".stars-cross");
    const crossAux = document.querySelector(".stars-cross-aux");

    function getRandomInt(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    if (starsContainer) {
      for (let i = 0; i < 400; i++) {
        const star = document.createElement("div");
        star.className = `star star-${Math.floor(Math.random() * 5)}`;
        star.style.top = `${getRandomInt(0, 100)}vh`;
        star.style.left = `${getRandomInt(0, 100)}vw`;
        star.style.animationDuration = `${getRandomInt(2, 6)}s`;
        if (star.className.includes("star-5")) {
          const color = nightsky[Math.floor(Math.random() * nightsky.length)];
          star.style.backgroundColor = color;
          star.style.boxShadow = `0px 0px 6px 1px ${color}`;
        }
        starsContainer.appendChild(star);
      }
    }

    if (cross) {
      for (let i = 0; i < 100; i++) {
        const blur = document.createElement("div");
        blur.className = "blur";
        blur.style.top = `${getRandomInt(0, 100)}%`;
        blur.style.left = `${getRandomInt(0, 100)}%`;
        blur.style.backgroundColor =
          nightsky[Math.floor(Math.random() * nightsky.length)];
        cross.appendChild(blur);
      }
    }

    if (crossAux) {
      for (let i = 0; i < 80; i++) {
        const blur = document.createElement("div");
        blur.className = "blur";
        blur.style.top = `${getRandomInt(0, 100)}%`;
        blur.style.left = `${getRandomInt(0, 100)}%`;
        blur.style.backgroundColor =
          nightsky[Math.floor(Math.random() * nightsky.length)];
        crossAux.appendChild(blur);
      }
    }
  }, []);

  return (
    <div className="sky">
      <div className="mountains">
        <div className="mountain-1"></div>
        <div className="mountain-2"></div>
        <div className="land-1"></div>
        <div className="land-2"></div>
        <div className="land-3"></div>
      </div>
      <div className="mountains-base"></div>
      <div className="light-base"></div>
      <div className="stars"></div>
      <div className="stars-cross"></div>
      <div className="stars-cross-aux"></div>
    </div>
  );
}
