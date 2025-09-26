"use client";
import { useEffect, useState } from "react";
import Elevator from "./components/Elevator";
import FloorSelect from "./components/FloorSelect";
import Sky from "./components/Sky";
import DecorativeTower from "./components/DecorativeTower";

const FLOORS = 5;

type TowerConfig = {
  floors: number;
  rows: number;
  cols: number;
  width: string;
  height: string;
  colorScheme: "brick" | "glass" | "concrete";
  shape: "rect" | "taper" | "wedge";
  left: string; // horizontal placement
};

function randomTower(): TowerConfig {
  const shapes: TowerConfig["shape"][] = ["rect", "taper", "wedge"];
  const schemes: TowerConfig["colorScheme"][] = ["brick", "glass", "concrete"];
  const random = (min: number, max: number) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

  return {
    floors: random(3, 6),
    rows: random(2, 3),
    cols: random(2, 4),
    width: `${random(10, 14)}vw`,
    height: `${random(30, 75)}vh`,
    colorScheme: schemes[random(0, schemes.length - 1)],
    shape: shapes[random(0, shapes.length - 1)],
    left: `${random(0, 90)}vw`, // scatter horizontally
  };
}

export default function Home() {
  const [current, setCurrent] = useState(0);
  const [doorsOpen, setDoorsOpen] = useState(true);

  const [backTowers, setBackTowers] = useState<TowerConfig[]>([]);
  const [frontTowers, setFrontTowers] = useState<TowerConfig[]>([]);

  // Generate skyline
  useEffect(() => {
    const backs: TowerConfig[] = Array.from({ length: 20 }, (_, i) => {
      const slotWidth = 100 / 20; // divide screen into 20 slots
      const baseLeft = i * slotWidth;
      const jitter = Math.random() * (slotWidth * 0.6); // random offset within slot
      return {
        ...randomTower(),
        left: `${baseLeft + jitter}vw`, // distributed but still random
      };
    });

    const fronts = Array.from({ length: 4 }, randomTower);
    setBackTowers(backs);
    setFrontTowers(fronts);
  }, []);

  const moveToFloor = (floor: number) => {
    if (floor === current || floor < 0 || floor >= FLOORS) return;
    const floorsToMove = Math.abs(floor - current);
    const travelMs = floorsToMove * 1000;

    setDoorsOpen(false);

    setTimeout(() => {
      setCurrent(floor);
      setTimeout(() => setDoorsOpen(true), travelMs + 2000);
    }, 600);
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (/^[0-9]$/.test(e.key)) {
        const num = parseInt(e.key, 10);
        if (num >= 0 && num < FLOORS) moveToFloor(num);
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [current]);

  return (
    <div id="canvas">
      <Sky />
      <FloorSelect current={current} onSelect={moveToFloor} />

      <div className="street">
        <div className="sidewalk top"></div>
        <div className="road">
          <div className="lane-markings"></div>
        </div>
        <div className="sidewalk bottom"></div>
      </div>

      {/* BACKGROUND towers */}
      <div
        style={{
          position: "absolute",
          bottom: 80,
          left: 0,
          width: "90vw", // <-- span full screen
          height: "100%", // (optional, but keeps alignment predictable)
          zIndex: 0,
          opacity: 0.4,
          transform: "scale(0.7)",
          transformOrigin: "bottom center",
          filter: "blur(1px)",
        }}
      >
        {backTowers.map((tower, i) => (
          <div
            key={`back-${i}`}
            style={{
              position: "absolute",
              bottom: 0,
              left: tower.left,
            }}
          >
            <DecorativeTower {...tower} />
          </div>
        ))}
      </div>

      {/* FOREGROUND towers */}
      <div
        className="city-row"
        style={{ position: "relative", bottom: 0, zIndex: 1 }}
      >
        {frontTowers.map((tower, i) =>
          i === 1 ? (
            // Place elevator between towers[1] and towers[2]
            <div
              key={`elev-wrap`}
              style={{ display: "flex", alignItems: "flex-end" }}
            >
              <DecorativeTower {...tower} />
              <Elevator current={current} doorsOpen={doorsOpen} />
              <DecorativeTower {...frontTowers[2]} />
            </div>
          ) : i === 2 ? null : ( // skip since already rendered with elevator
            <DecorativeTower key={`front-${i}`} {...tower} />
          )
        )}
      </div>
    </div>
  );
}
