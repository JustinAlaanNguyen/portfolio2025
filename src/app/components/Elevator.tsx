"use client";
import React, { useEffect, useState } from "react";
import Floor from "./Floor";

type Props = {
  current: number;
  doorsOpen: boolean;
};

export default function Elevator({ current, doorsOpen }: Props) {
  const [isMoving, setIsMoving] = useState(false);
  const [prevFloor, setPrevFloor] = useState(current);

  // Floor sizes (must match CSS for b1–b4)
  const floorSizes = [
    { width: "33vw", height: "50vh" }, // b1
    { width: "26vw", height: "40vh" }, // b2
    { width: "20vw", height: "30vh" }, // b3
    { width: "15vw", height: "20vh" }, // b4
  ];

  const elevatorSizes = [
    { width: "10vw", height: "15vh" }, // b1
    { width: "10vw", height: "15vh" }, // b2
    { width: "10vw", height: "15vh" }, // b3
    { width: "10vw", height: "15vh" }, // b4
  ];
  // Convert "20vh" -> 20 for math
  const heights = floorSizes.map((f) => parseFloat(f.height));

  // Calculate the bottom positions of each floor relative to the tower bottom
  const floorBottoms = heights.map((_, i) =>
    heights.slice(0, i).reduce((a, b) => a + b, 0)
  );

  // Pick cab size based on target floor
  const cabSize = elevatorSizes[current];

  // ✅ Position elevator so its **bottom** sits on the floor's **bottom**
  const cabBottomVh = floorBottoms[current];

  // Movement effect
  useEffect(() => {
    if (current !== prevFloor) {
      setIsMoving(true);
      const timer = setTimeout(() => {
        setIsMoving(false);
        setPrevFloor(current);
      }, 2000); // match your transition
      return () => clearTimeout(timer);
    }
  }, [current, prevFloor]);

  return (
    <div className="tower">
      <div
        style={{
          paddingRight: "10px",
          paddingLeft: "20px",
          height: "100%",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column-reverse",
          alignItems: "center",
        }}
      >
        {/* Floors (bottom to top) */}
        <Floor rows={10} cols={10} className="b1" />
        <Floor rows={8} cols={8} className="b2" />
        <Floor rows={5} cols={5} className="b3" />
        <div className="top-floor-wrapper">
          <Floor rows={3} cols={3} className="b4" />

          {/* Antenna pole */}
          <div className="antenna"></div>

          {/* Floating neon sign */}

          <h1 className="text neon-sign">
            <div className="line cage">
              <span className="word">
                <span className="letter">N</span>
                <span className="letter">O</span>
                <span className="letter">W</span>
              </span>

              <span className="word">
                <span className="letter">V</span>
                <span className="letter">I</span>
                <span className="letter">E</span>
                <span className="letter">W</span>
                <span className="letter">I</span>
                <span className="letter">N</span>
                <span className="letter">G</span>
              </span>

              <span className="word">
                <span className="letter">:</span>
              </span>
            </div>

            <div className="line cage extend">
              <span className="word">
                <span className="letter">J</span>
                <span className="letter">U</span>
                <span className="letter">S</span>
                <span className="letter">T</span>
                <span className="letter">I</span>
                <span className="letter">N</span>
              </span>

              <span className="letter">A</span>
              <span className="letter">L</span>
              <span className="letter">A</span>
              <span className="letter">A</span>
              <span className="letter">N</span>
              <span className="letter">-</span>
              <span className="letter">N</span>
              <span className="letter">G</span>
              <span className="letter">U</span>
              <span className="letter">Y</span>
              <span className="letter">E</span>
              <span className="letter broken">N</span>
            </div>
          </h1>
        </div>
      </div>

      {/* Elevator cab */}
      <div
        id="elevatorContainer"
        className={isMoving ? "moving" : ""}
        style={{
          bottom: `${cabBottomVh}vh`, // ✅ aligns flush to floor bottom
          width: cabSize.width,
          height: cabSize.height,
        }}
      >
        {/* Arrow Indicator */}
        <div className="elevator-indicator-box">
          <div
            className={`elevator-indicator ${
              isMoving ? (current > prevFloor ? "up" : "down") : ""
            }`}
          ></div>
        </div>

        <div id="elevator">
          <div className="door-wrapper">
            <div className={`door left ${doorsOpen ? "open" : ""}`} />
            <div className={`door right ${doorsOpen ? "open" : ""}`} />
          </div>
        </div>
      </div>
    </div>
  );
}
