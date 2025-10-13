"use client";

import { useEffect, useRef } from "react";

export default function PlantCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

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

      constructor(x: number, y: number, angle: number, color: string) {
        this.x = x;
        this.y = y;
        this.angle = angle;
        this.color = color;
        this.maxWidth = 15 + rand() * 6;
        this.maxHeight = 30 + rand() * 10;
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
        const doneGrowing = this.life > this.lifetime;

        // ✅ Only branch movement, branching, and leaf spawning stop after lifetime
        if (!doneGrowing) {
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
          this.x += Math.cos(this.swing) * 3.5;
          this.y += Math.sin(this.swing) * 3.5;

          // ✅ Curvature & sway
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

          this.noiseOffset += 0.05;
          this.life++;

          // ✅ Branching logic
          if (this.depth < 2 && !this.hasBranchedAtTop) {
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

            this.leaves.push(new Leaf(this.x, this.y, angle1, color));
            this.leaves.push(new Leaf(this.x, this.y, angle2, color));
          }

          // ✅ Draw children & prune
          for (let i = this.children.length - 1; i >= 0; i--) {
            this.children[i].draw();
            if (this.children[i].life >= this.children[i].lifetime) {
              this.children.splice(i, 1);
            }
          }
        }

        // ✅ ALWAYS animate leaves even after branch is done
        for (const leaf of this.leaves) {
          leaf.draw();
        }
      }
    }

    // 🌳 Main trunk
    const mainBranch = new Branch(
      canvas.width / 2,
      canvas.height - 15,
      -Math.PI / 2,
      (canvas.height - 15) / 4, // shorter trunk life
      30,
      0
    );

    const draw = () => {
      mainBranch.draw();
      requestAnimationFrame(draw);
    };

    draw();
  }, []);

  return (
    <div className="plant-container">
      <canvas ref={canvasRef} className="plant-canvas" />
    </div>
  );
}
