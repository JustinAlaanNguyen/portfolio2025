"use client";
import React from "react";

type Props = {
  current: number;
  onSelect: (floor: number) => void;
};

export default function FloorSelect({ current, onSelect }: Props) {
  return (
    <div id="floorSelect">
      <h4>Select your floor</h4>
      <ul>
        {["GL", "1", "2", "3"].map((label, i) => (
          <li
            key={i}
            className={current === i ? "active" : ""}
            onClick={() => onSelect(i)}
          >
            {label}
          </li>
        ))}
      </ul>
    </div>
  );
}
