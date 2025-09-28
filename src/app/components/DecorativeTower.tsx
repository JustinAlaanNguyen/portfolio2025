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

type WindowBlock = {
  id: string;
  x: number;
  y: number;
  lit: boolean;
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
  const [windows, setWindows] = useState<WindowBlock[][]>([]);

  // Generate strict grid (no random spacing, just consistent lit/unlit)
  useEffect(() => {
    const newFloors: WindowBlock[][] = [];

    for (let f = 0; f < floors; f++) {
      const floorBlocks: WindowBlock[] = [];

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          floorBlocks.push({
            id: `${f}-${y}-${x}`,
            x,
            y,
            lit: Math.random() < 0.15, // random lighting, but not layout
          });
        }
      }

      newFloors.push(floorBlocks);
    }

    setWindows(newFloors);
  }, [floors, rows, cols]);

  // Flicker effect
  useEffect(() => {
    const interval = setInterval(() => {
      setWindows((prev) =>
        prev.map((floor) =>
          floor.map((w) => (Math.random() < 0.05 ? { ...w, lit: !w.lit } : w))
        )
      );
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  // Tower colors
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
        border: `6px solid ${border}`,
        borderRadius:
          shape === "taper"
            ? "12px 12px 40px 40px"
            : shape === "wedge"
            ? "60px 12px 0 0"
            : "8px",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {windows.map((floor, fi) =>
        floor.map((w) => (
          <div
            key={w.id}
            style={{
              position: "absolute",
              left: `${(w.x / cols) * 100}%`,
              bottom: `${((fi * rows + w.y) / (floors * rows)) * 100}%`,
              width: `${100 / cols}%`,
              height: `${100 / (floors * rows)}%`,
              background: w.lit ? "#ffe9a3" : "#111",
              borderRadius: "2px",
              transition: "background 0.4s ease",
            }}
          />
        ))
      )}
    </div>
  );
}
