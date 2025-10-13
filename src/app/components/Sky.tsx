"use client";

import React, { useMemo } from "react";
import "./Sky.css";

export default function Sky() {
  // arrays for repeated elements

  const treesGreen1 = Array.from({ length: 6 });
  const treesPurple1 = Array.from({ length: 6 });
  const treesBlue1 = Array.from({ length: 6 });

  const treesGreen2 = Array.from({ length: 4 });
  const treesPurple2 = Array.from({ length: 4 });
  const treesBlue2 = Array.from({ length: 4 });

  const treesGreen3 = Array.from({ length: 2 });
  const treesPurple3 = Array.from({ length: 2 });
  const treesBlue3 = Array.from({ length: 2 });

  const leaves10 = Array.from({ length: 10 });

  // waves randomized inline styles to mimic the Sass random behaviour
  const waves = useMemo(() => {
    return Array.from({ length: 100 }).map(() => {
      const size = Math.floor(Math.random() * 90) + 40; // 40..129
      const top = Math.floor(Math.random() * 200); // 0..199
      const left = Math.floor(Math.random() * 400); // 0..399 vw-ish
      const opacity = Math.random() * 0.5 + 0.05; // 0.05..0.55
      const delay = Math.random() * 25; // 0..25s
      return {
        width: `${size}px`,
        top: `${top}px`,
        left: `${left}vw`,
        opacity: `${opacity}`,
        animationDelay: `${delay}s`,
      } as React.CSSProperties;
    });
  }, []);

  return (
    <div className="container">
      <div className="sky">
        <div className="sun" />

        <div className="mountains-distant">
          <div className="mountain-left" />
          <div className="mountain-right" />
        </div>

        <div className="mountains-near">
          <div className="mountain-left-back">
            <div className="trees-green-1">
              {treesGreen1.map((_, i) => (
                <div key={i} className="tree" />
              ))}
            </div>
            <div className="trees-purple-1">
              {treesPurple1.map((_, i) => (
                <div key={i} className="tree" />
              ))}
            </div>
            <div className="trees-blue-1">
              {treesBlue1.map((_, i) => (
                <div key={i} className="tree" />
              ))}
            </div>
          </div>

          <div className="mountain-right-middle">
            <div className="trees-green-2">
              {treesGreen2.map((_, i) => (
                <div key={i} className="tree" />
              ))}
            </div>
            <div className="trees-purple-2">
              {treesPurple2.map((_, i) => (
                <div key={i} className="tree" />
              ))}
            </div>
            <div className="trees-blue-2">
              {treesBlue2.map((_, i) => (
                <div key={i} className="tree" />
              ))}
            </div>
          </div>

          <div className="mountain-left-front">
            <div className="trees-green-3">
              {treesGreen3.map((_, i) => (
                <div key={i} className="tree" />
              ))}
            </div>
            <div className="trees-purple-3">
              {treesPurple3.map((_, i) => (
                <div key={i} className="tree" />
              ))}
            </div>
            <div className="trees-blue-3">
              {treesBlue3.map((_, i) => (
                <div key={i} className="tree" />
              ))}
            </div>
          </div>
        </div>

        <div className="water">
          {waves.map((style, i) => (
            <div key={i} className="wave" style={style} />
          ))}
        </div>

        <div className="hills">
          <div className="hill-left" />
          <div className="hill-middle" />
          <div className="hill-right" />
        </div>

        <div className="trunk-middle">
          <div className="branch-1" />
          <div className="branch-2" />
          <div className="branch-3" />
          <div className="branch-4" />
          <div className="branch-5" />
          <div className="branch-6" />
          <div className="branch-7" />
          <div className="branch-other-side-1" />
          <div className="branch-other-side-2" />
          <div className="branch-other-side-3" />
          <div className="stump-1" />
          <div className="stump-2" />
        </div>

        <div className="trunk-left" />
        <div className="trunk-right" />

        <div className="plant">
          <div className="stem" />
          <div className="leaves">
            {leaves10.map((_, i) => (
              <div key={i} className="leaf" />
            ))}
          </div>
        </div>

        <div className="plant-2">
          <div className="stem-2" />
          <div className="orb" />
          <div className="orb-glow" />
        </div>

        <div className="plant-3">
          <div className="stem-3" />
          <div className="leaves-3">
            {leaves10.map((_, i) => (
              <div key={i} className="leaf" />
            ))}
          </div>
        </div>

        <div className="plant-4">
          <div className="stem-4" />
          <div className="leaves-4">
            {leaves10.map((_, i) => (
              <div key={i} className="leaf" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
