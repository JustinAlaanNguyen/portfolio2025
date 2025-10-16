"use client";
import "./PlantCanvas.css";
import { useEffect, useRef, useState } from "react";

export default function PlantCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [showText, setShowText] = useState(false);
  const extraBranchSpawned = useRef(false);
  const [circleTip, setCircleTip] = useState<{ x: number; y: number } | null>(
    null
  );
  const [circleDone, setCircleDone] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    window.addEventListener("resize", () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    });

    // === CONSISTENCY CONTROL ===
    let seed = 42;
    const rand = () => {
      const x = Math.sin(seed++) * 10000;
      return x - Math.floor(x);
    };

    class Leaf {
      x: number;
      y: number;
      angle: number;
      color: string;
      maxWidth: number;
      maxHeight: number;
      age: number;
      popDuration: number;

      constructor(
        x: number,
        y: number,
        angle: number,
        color: string,
        sizeScale = 1
      ) {
        this.x = x;
        this.y = y;
        this.angle = angle;
        this.color = color;
        this.maxWidth = (15 + rand() * 6) * sizeScale;
        this.maxHeight = (30 + rand() * 10) * sizeScale;
        this.age = 0;
        this.popDuration = 25 + rand() * 10; // shorter burst
      }

      draw() {
        // t goes 0 → 1 over popDuration
        const t = Math.min(this.age / this.popDuration, 1);

        // Start at ~90% size, pop to 115%, then settle at 100%
        const eased =
          t < 0.4
            ? 0.9 + (t * (1.15 - 0.9)) / 0.4 // 0.9 → 1.15
            : 1.15 - ((t - 0.4) * (1.15 - 1)) / 0.6; // 1.15 → 1

        const leafWidth = this.maxWidth * eased;
        const leafHeight = this.maxHeight * eased;

        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.quadraticCurveTo(leafWidth, 0, leafWidth, leafHeight);
        ctx.quadraticCurveTo(0, leafHeight, 0, 0);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.restore();

        if (t < 1) this.age++;
      }
    }

    class Branch {
      x: number;
      y: number;
      trending: number;
      swing: number;
      noiseOffset: number;
      width: number;
      startWidth: number;
      lifetime: number;
      life: number;
      depth: number;
      children: Branch[];
      hasBranchedAtTop: boolean;
      leaves: Leaf[] = [];
      frozen: boolean = false; // ✅ new flag
      isCircleBranch?: boolean; // ✅ add this
      tipX?: number;
      tipY?: number;

      constructor(
        x: number,
        y: number,
        angle: number,
        life: number,
        width: number,
        depth: number
      ) {
        this.x = x;
        this.y = y;
        this.trending = angle;
        this.swing = angle;
        this.noiseOffset = rand() * 10;
        this.startWidth = width;
        this.width = width;
        this.lifetime = life;
        this.life = 0;
        this.depth = depth;
        this.children = [];
        this.hasBranchedAtTop = false;
        this.leaves = [];
      }

      draw() {
        // Right at the top of draw()
        // ✅ FIRST: detect when the circle branch finishes
        if (this.isCircleBranch && this.life >= this.lifetime && !circleDone) {
          setCircleTip({ x: this.x, y: this.y });
          setCircleDone(true);
          this.frozen = true;
          return;
        }

        // ✅ THEN: respect frozen branches
        if (this.frozen) {
          for (const child of this.children) {
            child.draw();
          }
          return;
        }

        const doneGrowing = this.life >= this.lifetime;

        console.log("circleDone:", circleDone);
        console.log("circleTip:", circleTip);
        if (!doneGrowing && !this.frozen) {
          // ✅ Width taper
          this.width = Math.max(
            1,
            this.startWidth * (1 - this.life / this.lifetime)
          );

          // ✅ Colors by depth
          const branchColors = [
            "#3B2F2F",
            "#4C3B2A",
            "#6B4423",
            "#8C593B",
            "#A06C48",
          ];
          ctx.fillStyle =
            branchColors[Math.min(this.depth, branchColors.length - 1)];

          // ✅ Draw segment
          if (this.width > 2) {
            ctx.beginPath();
            ctx.ellipse(
              this.x,
              this.y,
              this.width,
              this.width,
              0,
              0,
              Math.PI * 2
            );
            ctx.fill();
          } else {
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            const nextX = this.x + Math.cos(this.swing) * 3.5;
            const nextY = this.y + Math.sin(this.swing) * 3.5;
            ctx.lineTo(nextX, nextY);
            ctx.strokeStyle = ctx.fillStyle;
            ctx.lineWidth = this.width * 1.2;
            ctx.lineCap = "round";
            ctx.stroke();
          }

          // ✅ Move forward
          const step = this.isCircleBranch ? 3 : 3.5; // ✅ faster for circle
          this.x += Math.cos(this.swing) * step;
          this.y += Math.sin(this.swing) * step;

          // ✅ Curvature & sway
          if (this.isCircleBranch) {
            this.tipX = this.x;
            this.tipY = this.y;

            const straightPhase = 0.5;
            const progress = this.life / this.lifetime;
            if (progress < straightPhase) {
              // Just follow the initial trending angle (grow straight)
              this.swing = this.trending;
            } else {
              // Start curving after the straight phase
              const curveProgress =
                (progress - straightPhase) / (1 - straightPhase);
              const curvature = Math.PI * 2 * curveProgress; // same total curvature
              this.swing = this.trending - curvature;
            }
          } else {
            // ✅ Original behavior for all normal branches
            const upwardCorrection =
              (Math.PI / 2 - Math.abs(this.trending)) * 0.15;
            const outwardBias =
              this.depth > 0
                ? (this.depth - 1) * 0.1 * (this.trending > 0 ? 1 : -1)
                : 0;

            this.swing =
              this.trending +
              outwardBias +
              upwardCorrection +
              Math.sin(this.noiseOffset) * 0.2;
          }

          this.noiseOffset += 0.05;
          this.life++;

          // ✅ Branching logic
          if (
            !this.isCircleBranch &&
            this.depth < 2 &&
            !this.hasBranchedAtTop
          ) {
            const trunkDelay =
              this.depth === 0 ? this.lifetime * 0.35 : this.lifetime * 0.25;

            if (this.life >= trunkDelay) {
              this.hasBranchedAtTop = true;

              // Leader for main trunk
              if (this.depth === 0) {
                this.children.push(
                  new Branch(
                    this.x,
                    this.y,
                    this.trending + (rand() - 0.5) * 0.1,
                    this.lifetime * (0.7 + rand() * 0.1),
                    this.width * 0.8,
                    0
                  )
                );
              }

              // Side branches
              const sideBranches =
                this.depth === 0
                  ? 6 + Math.round(rand() * 2)
                  : 4 + Math.round(rand() * 2);

              const baseSpread = Math.PI / 1.5;

              for (let n = 0; n < sideBranches; n++) {
                const angleOffset = (rand() - 0.5) * baseSpread;

                this.children.push(
                  new Branch(
                    this.x,
                    this.y,
                    this.trending + angleOffset,
                    this.lifetime * (1.125 + rand() * 0.375),
                    this.width * 0.4,
                    this.depth + 1
                  )
                );
              }
            }
          }

          // 🌿 Leaves on both sides of thin / near-thin branches
          const isLeafBranch =
            this.width <= 2 || (this.depth >= 1 && this.width <= 6);

          if (isLeafBranch && rand() < 0.25) {
            const leafStyles = ["#1f801f", "#259925", "#2bb32b", "#32cd32"];
            const color = leafStyles[Math.floor(rand() * leafStyles.length)];

            const angle1 = this.swing + (rand() - 0.5) * 1.2;
            const angle2 = angle1 + Math.PI;

            // ✅ Smaller leaves if from circle branch
            const sizeScale = this.isCircleBranch ? 0.2 : 1;

            this.leaves.push(
              new Leaf(this.x, this.y, angle1, color, sizeScale)
            );
            this.leaves.push(
              new Leaf(this.x, this.y, angle2, color, sizeScale)
            );
          }
        }

        // ✅ Draw children & prune
        for (let i = this.children.length - 1; i >= 0; i--) {
          this.children[i].draw();

          // optional prune
          if (this.children[i].life >= this.children[i].lifetime) {
            this.children.splice(i, 1);
          }
        }

        // ✅ Leaves should ALWAYS animate
        for (const leaf of this.leaves) {
          leaf.draw();
        }
      }
    }

    // 🌳 Main trunk
    const startX = canvas.width / 2;
    const startY = canvas.height - 15;

    const mainBranch = new Branch(
      startX,
      startY,
      -Math.PI / 2,
      (canvas.height - 15) / 3.5,
      30,
      0
    );

    function freezeAllBranches(branch: Branch) {
      branch.frozen = true;
      for (const child of branch.children) {
        freezeAllBranches(child);
      }
    }

    const draw = () => {
      mainBranch.draw();

      // 🔥 Trigger text when close to end
      const remaining = mainBranch.lifetime - mainBranch.life;
      if (!showText && remaining < 60) {
        setShowText(true);
      }

      if (
        !extraBranchSpawned.current &&
        mainBranch.life >= mainBranch.lifetime
      ) {
        extraBranchSpawned.current = true;

        const spawnX = startX;
        const spawnY = startY - canvas.height * 0.3;
        const angle = -Math.PI + (rand() - 0.5) * 0.3;

        // ✅ Create the circle branch
        const newBranch = new Branch(
          spawnX,
          spawnY,
          angle,
          mainBranch.lifetime * 1.2,
          mainBranch.startWidth * 0.2,
          1
        );
        newBranch.isCircleBranch = true;

        // ✅ Freeze ONLY the existing children (not the main branch)
        for (const child of mainBranch.children) {
          freezeAllBranches(child);
        }

        // ✅ Replace old children with ONLY the active new branch
        mainBranch.children = [newBranch];
      }

      requestAnimationFrame(draw);
    };

    draw();
  }, []);

  return (
    <div className="plant-container">
      <canvas ref={canvasRef} className="plant-canvas" />
      {circleDone && circleTip && (
        <button
          className="about-button"
          onClick={() => (window.location.href = "/about")}
          style={{
            left: circleTip.x - 25,
            top: circleTip.y - 25,
            width: 50,
            height: 50,
            borderRadius: "50%",
            backgroundColor: "rgba(255,255,255,0.85)",
            backdropFilter: "blur(6px)",
            boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
            border: "2px solid rgba(0,0,0,0.15)",
            color: "black",
            cursor: "pointer",
            fontSize: "12px",
            fontWeight: "600",
          }}
        >
          About Me
        </button>
      )}

      {showText && (
        <>
          <div className="pop-text line1">
            {"Justin".split("").map((char, i) => (
              <span
                key={i}
                className="pop-letter"
                style={{ animationDelay: `${(i + 5) * 0.08}s` }}
              >
                {char}
              </span>
            ))}
          </div>

          <div className="pop-text line2">
            {"Alaan-Nguyen".split("").map((char, i) => (
              <span
                key={i}
                className="pop-letter"
                style={{ animationDelay: `${i * 0.08}s` }}
              >
                {char}
              </span>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
