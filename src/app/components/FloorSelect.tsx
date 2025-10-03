"use client";
import React from "react";

type Props = {
  current: number;
  onSelect: (floor: number) => void;
};

const floorLabels = [
  { label: "GL", desc: "About Me" },
  { label: "1", desc: "My Education" },
  { label: "2", desc: "My Projects" },
  { label: "3", desc: "Contact Me" },
];

export default function FloorSelect({ current, onSelect }: Props) {
  return (
    <div id="floorSelect">
      <h4>Control Panel</h4>
      <ul className="floor-buttons">
        {floorLabels.map((f, i) => (
          <li
            key={i}
            className={current === i ? "active" : ""}
            onClick={() => onSelect(i)}
            title={f.desc} // tooltip on hover
          >
            {f.label}
          </li>
        ))}
      </ul>

      <div className="legend">
        {floorLabels.map((f, i) => (
          <p key={i}>
            <strong>{f.label}</strong> – {f.desc}
          </p>
        ))}
      </div>
    </div>
  );
}
