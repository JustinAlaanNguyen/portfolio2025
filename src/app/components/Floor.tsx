"use client";
import { useEffect, useState } from "react";

type Props = {
  rows: number;
  cols: number;
  className?: string; // allow b1…b5 sizing classes
};

export default function Floor({ rows, cols, className }: Props) {
  const [lights, setLights] = useState<boolean[][]>(() =>
    Array.from({ length: rows }, () =>
      Array.from({ length: cols }, () => Math.random() < 0.4)
    )
  );

  // Randomly toggle windows
  useEffect(() => {
    const interval = setInterval(() => {
      setLights((prev) => {
        const newGrid = prev.map((r) => [...r]);
        const randRow = Math.floor(Math.random() * rows);
        const randCol = Math.floor(Math.random() * cols);
        newGrid[randRow][randCol] = !newGrid[randRow][randCol];
        return newGrid;
      });
    }, 2000 + Math.random() * 4000); // each floor gets different rhythm
    return () => clearInterval(interval);
  }, [rows, cols]);

  return (
    <div
      className={`floor ${className ?? ""}`}
      style={{
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gridTemplateRows: `repeat(${rows}, 1fr)`, // ✅ add this
      }}
    >
      {lights.map((row, i) =>
        row.map((on, j) => (
          <div key={`${i}-${j}`} className={`window ${on ? "on" : ""}`} />
        ))
      )}
    </div>
  );
}
