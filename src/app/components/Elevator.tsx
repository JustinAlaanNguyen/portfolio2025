"use client";
import React, { useEffect, useState } from "react";
import Floor from "./Floor";

type Props = {
  current: number;
  doorsOpen: boolean;
};

export default function Elevator({ current, doorsOpen }: Props) {
  const [isMoving, setIsMoving] = useState(false);

  // Floor sizes (must match CSS for b1–b5)
  const floorSizes = [
    { width: "10vw", height: "20vh" }, // b1
    { width: "10vw", height: "20vh" }, // b2
    { width: "10vw", height: "20vh" }, // b3
    { width: "10vw", height: "15vh" }, // b4
    { width: "10vw", height: "15vh" }, // b5
  ];

  // Convert vh to numeric value for math
  const heights = [50, 40, 30, 20, 20]; // vh units
  const totalHeight = heights.reduce((a, b) => a + b, 0);

  // Build offsets from bottom
  const floorOffsets = heights.map((_, i) =>
    heights.slice(0, i).reduce((a, b) => a + b, 0)
  );

  // Pick cab size based on target floor
  const cabSize = floorSizes[current];

  // Cab bottom in %
  const cabBottomPercent = (floorOffsets[current] / totalHeight) * 100;

  // Trigger moving animation when floor changes
  useEffect(() => {
    setIsMoving(true);
    const timer = setTimeout(() => setIsMoving(false), 2000); // match CSS transition duration
    return () => clearTimeout(timer);
  }, [current]);

  return (
    <div className="tower">
      {/* Floors (bottom to top) */}
      <Floor rows={15} cols={15} className="b1" />
      <Floor rows={10} cols={10} className="b2" />
      <Floor rows={5} cols={5} className="b3" />
      <Floor rows={3} cols={3} className="b4" />
      <Floor rows={2} cols={2} className="b5" />

      {/* Elevator cab */}
      <div
        id="elevatorContainer"
        className={isMoving ? "moving" : ""}
        style={{
          bottom: `${cabBottomPercent}%`,
          width: cabSize.width,
          height: cabSize.height,
        }}
      >
        <div id="elevator">
          <div className={`door left ${doorsOpen ? "open" : ""}`} />
          <div className={`door right ${doorsOpen ? "open" : ""}`} />
        </div>
      </div>
    </div>
  );
}
