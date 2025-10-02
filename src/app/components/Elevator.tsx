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
    { width: "10vw", height: "20vh" }, // b1
    { width: "10vw", height: "20vh" }, // b2
    { width: "10vw", height: "20vh" }, // b3
    { width: "10vw", height: "15vh" }, // b4
  ];

  // Convert "20vh" -> 20 for math (just numbers)
  const heights = floorSizes.map((f) => parseFloat(f.height));

  // Build offsets from bottom (in vh units)
  const floorOffsets = heights.map(
    (_, i) => heights.slice(0, i + 1).reduce((a, b) => a + b, 0) // cumulative up to current floor
  );

  // Pick cab size based on target floor
  const cabSize = floorSizes[current];

  // ✅ Cab bottom flush with *bottom* of target floor
  const cabBottomVh = floorOffsets[current] - parseFloat(cabSize.height);

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

  function BeaconSpire() {
    const text = "Now Viewing: Justin";
    const chars = text.split("");

    return (
      <div className="beacon-wrap" style={{ pointerEvents: "none" }}>
        {/* Tall mast */}
        <div className="spire"></div>
        {/* Beacon cap / glow */}
        <div className="beacon-cap">
          <div className="cap-glow"></div>
        </div>

        {/* 3D text ring */}
        <div
          className="text-ring"
          style={
            {
              "--n": chars.length,
            } as React.CSSProperties
          }
          aria-label={text}
        >
          {chars.map((ch, i) => (
            <span
              key={i}
              className="text-seg"
              style={
                {
                  ["--i" as string]: i,
                } as React.CSSProperties
              }
            >
              {ch === " " ? "\u00A0" : ch}
            </span>
          ))}
        </div>
      </div>
    );
  }

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
        <Floor rows={3} cols={3} className="b4" />

        {/* Beacon / Spire on top */}
        <div className="top-with-spire">
          <BeaconSpire />
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
