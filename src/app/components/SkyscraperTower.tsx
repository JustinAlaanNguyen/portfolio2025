"use client";
import React, { useEffect, useState } from "react";

type Props = {
  rows: number;
  cols: number;
  width: number; // vw
  height: number; // vh
  left: string; // % or vw
  color: string;
  zIndex: number;
};

export default function SkyscraperTower({
  rows,
  cols,
  width,
  height,
  left,
  color,
  zIndex,
}: Props) {
  const [lights, setLights] = useState<boolean[][]>(() =>
    Array.from({ length: rows }, () =>
      Array.from({ length: cols }, () => Math.random() < 0.15)
    )
  );

  // occasional flicker
  useEffect(() => {
    const interval = setInterval(() => {
      setLights((prev) =>
        prev.map((row) => row.map((lit) => (Math.random() < 0.02 ? !lit : lit)))
      );
    }, 1200);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        position: "absolute",
        bottom: 0,
        left,
        width: `${width}vw`,
        height: `${height}vh`,
        backgroundColor: color,
        display: "grid",
        gridTemplateRows: `repeat(${rows}, 1fr)`,
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        border: "1px solid rgba(0,0,0,0.4)",
        zIndex,
      }}
    >
      {lights.map((row, rowIndex) =>
        row.map((lit, colIndex) => (
          <div
            key={`${rowIndex}-${colIndex}`}
            style={{
              backgroundColor: lit ? "#ffd27f" : "#222",
              margin: "1px",
              borderRadius: "1px",
            }}
          />
        ))
      )}
    </div>
  );
}
