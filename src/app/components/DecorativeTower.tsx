"use client";
import React, { useMemo, useEffect, useRef } from "react";

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
  const windowRefs = useRef<HTMLDivElement[][]>([]); // 2D array of refs per floor and window

  const windowGrid = useMemo(() => {
    const totalFloors: number[] = [];
    for (let f = 0; f < floors; f++) totalFloors.push(f);
    return totalFloors;
  }, [floors]);

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

  // Randomly turn lights on/off
  useEffect(() => {
    const intervals: NodeJS.Timeout[] = [];

    windowRefs.current.forEach((floor, floorIndex) => {
      floor.forEach((windowDiv, windowIndex) => {
        if (!windowDiv) return;

        const toggleLight = () => {
          const isOn = windowDiv.classList.contains("on");
          if (Math.random() < 0.5) {
            windowDiv.classList.toggle("on", !isOn);
          }
          const nextTime = 2000 + Math.random() * 10000; // 2-5s random interval
          intervals.push(setTimeout(toggleLight, nextTime));
        };

        toggleLight();
      });
    });

    return () => intervals.forEach(clearTimeout);
  }, [floors, rows, cols]);

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
            ? "12px 12px 0 0"
            : shape === "wedge"
            ? "60px 12px 0 0"
            : "8px 8px 0 0",
        overflow: "hidden",
        position: "relative",
        display: "flex",
        flexDirection: "column-reverse",
      }}
    >
      {windowGrid.map((floorIndex) => {
        if (!windowRefs.current[floorIndex]) {
          windowRefs.current[floorIndex] = [];
        }
        return (
          <div
            key={floorIndex}
            className="decor-floor"
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${cols}, 1fr)`,
              gridTemplateRows: `repeat(${rows}, 1fr)`,
              gap: "6px",
              flex: "1",
              padding: "7px",
            }}
          >
            {Array.from({ length: rows * cols }).map((_, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <div
                  ref={(el) => {
                    windowRefs.current[floorIndex][i] = el!;
                  }}
                  className="decor-window"
                  style={{
                    width: "85%",
                    height: "70%",
                    borderRadius: "3px",
                  }}
                />
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}
