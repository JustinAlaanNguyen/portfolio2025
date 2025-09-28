"use client";
import { useEffect, useState } from "react";
import Elevator from "./components/Elevator";
import FloorSelect from "./components/FloorSelect";
import Sky from "./components/Sky";
import DecorativeTower from "./components/DecorativeTower";
import SkyscraperTower from "./components/SkyscraperTower";

const FLOORS = 5;

type SkyscraperConfig = {
  rows: number;
  cols: number;
  width: number; // in vw units
  height: number; // in vh units
  color: string;
  left: string;
  zIndex: number;
};

type TowerConfig = {
  floors: number;
  rows: number;
  cols: number;
  width: string;
  height: string;
  colorScheme: "brick" | "glass" | "concrete";
  shape: "rect" | "taper" | "wedge";
  left: string;
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
    left: `${random(0, 90)}vw`,
  };
}

export default function Home() {
  const [current, setCurrent] = useState(0);
  const [doorsOpen, setDoorsOpen] = useState(true);
  const [backSkyscrapers, setBackSkyscrapers] = useState<SkyscraperConfig[]>(
    []
  );

  const [backDecoratives, setBackDecoratives] = useState<TowerConfig[]>([]);
  const [frontTowers, setFrontTowers] = useState<TowerConfig[]>([]);

  // Generate skyline
  useEffect(() => {
    // 🎯 Generate 5 skyscraper towers
    const skyscraperCount = 5;
    const skyscrapers: SkyscraperConfig[] = Array.from(
      { length: skyscraperCount },
      (_, i) => {
        const slotWidth = 100 / skyscraperCount;
        const baseLeft = i * slotWidth + slotWidth / 4; // center in slot
        const jitter = Math.random() * (slotWidth / 2); // wiggle inside slot

        return {
          rows: 18 + Math.floor(Math.random() * 5),
          cols: 6 + Math.floor(Math.random() * 3),
          width: 4 + Math.random() * 2,
          height: 100 + Math.random() * 20,
          color: "#2a2d34",
          left: `${Math.min(baseLeft + jitter, 95)}vw`, // clamp to 95vw max
          zIndex: 0,
        };
      }
    );

    // 🎯 Generate 10 decorative towers
    const decorativeCount = 10;
    const decoratives: TowerConfig[] = Array.from(
      { length: decorativeCount },
      (_, i) => {
        const baseTower = randomTower();
        const slotWidth = 100 / decorativeCount;
        const baseLeft = i * slotWidth + slotWidth / 4;
        const jitter = Math.random() * (slotWidth / 2);

        return {
          ...baseTower,
          rows: baseTower.rows * 2,
          cols: baseTower.cols * 2,
          left: `${Math.min(baseLeft + jitter, 95)}vw`,
        };
      }
    );

    const fronts = Array.from({ length: 4 }, randomTower);

    setBackSkyscrapers(skyscrapers);
    setBackDecoratives(decoratives);
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
          bottom: 50,
          left: 0,
          width: "100vw",
          height: "100%",
          zIndex: 0,
          opacity: 0.7,
          transform: "scale(0.7)",
          transformOrigin: "bottom center",
          filter: "blur(1px)",
        }}
      >
        {/* Skyscraper towers */}
        {backSkyscrapers.map((tower, i) => (
          <div
            key={`sky-${i}`}
            style={{
              position: "absolute",
              bottom: 0,
              left: tower.left,
            }}
          >
            <SkyscraperTower {...tower} />
          </div>
        ))}

        {/* Decorative towers */}
        {backDecoratives.map((tower, i) => (
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
