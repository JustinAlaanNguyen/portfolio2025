"use client";
import { useEffect, useState } from "react";

type Props = {
  floors: number;
  rows: number;
  cols: number;
  className?: string;
  colorScheme?: "brick" | "glass" | "concrete";
  width: string;
  height: string;
  shape?: "rect" | "taper" | "wedge";
};

export default function DecorativeTower({
  floors,
  rows,
  cols,
  className,
  colorScheme = "concrete",
  width,
  height,
  shape = "rect",
}: Props) {
  const [lights, setLights] = useState<boolean[][][]>(() =>
    Array.from({ length: floors }, () =>
      Array.from({ length: rows }, () =>
        Array.from({ length: cols }, () => Math.random() < 0.5)
      )
    )
  );

  // Rebuild grid when props change
  useEffect(() => {
    const initGrid = Array.from({ length: floors }, () =>
      Array.from({ length: rows }, () =>
        Array.from({ length: cols }, () => false)
      )
    );
    setLights(initGrid);
  }, [floors, rows, cols]);

  // Flickering effect
  useEffect(() => {
    const interval = setInterval(() => {
      setLights((prev) => {
        if (!prev.length) return prev;

        const newGrid = prev.map((f) => f.map((r) => [...r]));

        const randFloor = Math.floor(Math.random() * floors);
        const randRow = Math.floor(Math.random() * rows);
        const randCol = Math.floor(Math.random() * cols);

        // ✅ Safety check
        if (
          newGrid[randFloor] &&
          newGrid[randFloor][randRow] &&
          newGrid[randFloor][randRow][randCol] !== undefined
        ) {
          newGrid[randFloor][randRow][randCol] =
            !newGrid[randFloor][randRow][randCol];
        }

        return newGrid;
      });
    }, 800);

    return () => clearInterval(interval);
  }, [floors, rows, cols]);

  // Colors
  const bg =
    colorScheme === "brick"
      ? "#5a2a27"
      : colorScheme === "glass"
      ? "#12344a"
      : "#444";
  const border =
    colorScheme === "brick"
      ? "#3c1b18"
      : colorScheme === "glass"
      ? "#0a1c2b"
      : "#222";

  return (
    <div
      className={`decor-tower ${className ?? ""}`}
      style={{
        width,
        height,
        background: bg,
        border: `8px solid ${border}`,
        display: "flex",
        flexDirection: "column-reverse",
        borderRadius:
          shape === "taper"
            ? "12px 12px 40px 40px"
            : shape === "wedge"
            ? "60px 12px 0 0"
            : "12px",
        overflow: "hidden",
      }}
    >
      {lights.map((floor, f) => (
        <div
          key={f}
          className="decor-floor"
          style={{
            flex: 1,
            display: "grid",
            gridTemplateColumns: `repeat(${cols}, 1fr)`,
            gridTemplateRows: `repeat(${rows}, 1fr)`,
            gap: "3px",
            padding: "2px",
          }}
        >
          {floor.map((row, i) =>
            row.map((on, j) => (
              <div
                key={`${f}-${i}-${j}`}
                className={`decor-window ${on ? "on" : ""}`}
                style={{
                  background: on ? "#ffe9a3" : "#111",
                  borderRadius: "2px",
                  transition: "background 0.4s ease",
                }}
              />
            ))
          )}
        </div>
      ))}
    </div>
  );
}
