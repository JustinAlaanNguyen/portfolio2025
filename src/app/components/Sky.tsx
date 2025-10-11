"use client";
import "./Sky.css";
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
      const addStar = (
        cls: string,
        topRange: [number, number],
        duration: [number, number],
        extra?: (el: HTMLDivElement) => void
      ) => {
        const star = document.createElement("div");
        star.className = cls;
        star.style.top = `${getRandomInt(topRange[0], topRange[1])}vh`;
        star.style.left = `${getRandomInt(0, 100)}vw`;
        star.style.animationDuration = `${getRandomInt(
          duration[0],
          duration[1]
        )}s`;
        if (extra) extra(star);
        starsContainer.appendChild(star);
      };

      for (let i = 0; i < 500; i++) {
        addStar("star star-1 blink", [0, 40], [2, 5]);
        addStar("star star-2 blink", [20, 70], [4, 8]);
      }

      for (let i = 0; i < 150; i++) {
        addStar("star star-0", [0, 50], [1, 2.5]);
        addStar("star star-1 blink", [0, 50], [2.5, 4]);
        addStar("star star-2 blink", [0, 50], [4, 5]);
      }

      for (let i = 0; i < 100; i++) {
        addStar("star star-0", [40, 75], [1, 3]);
        addStar("star star-1 blink", [40, 75], [2, 4]);
      }

      for (let i = 0; i < 250; i++) {
        addStar("star star-0", [0, 100], [1, 2]);
        addStar("star star-1 blink", [0, 100], [2, 5]);
        addStar("star star-2", [0, 100], [1, 4]);
        addStar("star star-4 blink", [0, 70], [5, 7]);
      }

      for (let i = 0; i < 50; i++) {
        addStar("star star-5 blink", [0, 50], [5, 7], (el) => {
          const color = nightsky[Math.floor(Math.random() * nightsky.length)];
          el.style.backgroundColor = color;
          el.style.boxShadow = `0px 0px 6px 1px ${color}`;
        });
      }
    }

    const addBlur = (container: Element, count: number) => {
      for (let i = 0; i < count; i++) {
        const blur = document.createElement("div");
        blur.className = "blur";
        blur.style.top = `${getRandomInt(0, 100)}%`;
        blur.style.left = `${getRandomInt(0, 100)}%`;
        blur.style.backgroundColor =
          nightsky[Math.floor(Math.random() * nightsky.length)];
        container.appendChild(blur);
      }
    };

    if (cross) addBlur(cross, 150);
    if (crossAux) addBlur(crossAux, 120);
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
