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

    interface Leaf {
      x: number;
      y: number;
      size: number;
      maxSize: number;
      rot: number;
      swayOffset: number;
      shade: number;
    }

    interface Flower {
      x: number;
      y: number;
      size: number;
      maxSize: number;
      rot: number;
    }

    const leaves: Leaf[] = [];
    const flowers: Flower[] = [];

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
      nextLeaf: number;
      depth: number;
      children: Branch[];
      hasBranchedAtTop: boolean;

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
        this.nextLeaf = Math.round(rand() * 15) + 10;
        this.depth = depth;
        this.children = [];
        this.hasBranchedAtTop = false;
      }

      draw() {
        if (this.life > this.lifetime) return;

        this.width = Math.max(
          1,
          this.startWidth * (1 - this.life / this.lifetime)
        );

        const branchColors = [
          "#3B2F2F",
          "#4C3B2A",
          "#6B4423",
          "#8C593B",
          "#A06C48",
        ];
        ctx.fillStyle =
          branchColors[Math.min(this.depth, branchColors.length - 1)];

        // 🌿 Draw branch
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

        // 🌀 Movement + noise sway
        this.x += Math.cos(this.swing) * 3.5;
        this.y += Math.sin(this.swing) * 3.5;

        // 🌬 Slight outward lean based on depth
        const outwardBias =
          (this.depth - 1) * 0.1 * (this.trending > 0 ? 1 : -1);

        this.swing =
          this.depth === 0
            ? this.trending
            : this.trending +
              outwardBias +
              (Math.sin(this.noiseOffset) * Math.PI) / 4 +
              this.depth * 0.08;
        this.noiseOffset += 0.05;
        this.life++;

        // 🍃 Leaves only for depth > 1 and after half lifetime
        if (
          this.depth > 1 &&
          this.life >= this.lifetime * 0.5 &&
          this.life >= this.nextLeaf
        ) {
          this.nextLeaf += 6 + rand() * 10;
          const leafCount = 2 + Math.floor(rand() * 3);
          for (let i = 0; i < leafCount; i++) {
            const spread = 18 + rand() * 20;
            const angleFromBranch =
              this.trending + (rand() - 0.5) * Math.PI * 0.8;
            leaves.push({
              x: this.x + Math.cos(angleFromBranch) * spread,
              y: this.y + Math.sin(angleFromBranch) * spread,
              size: 0,
              maxSize: 6 + rand() * 5,
              rot: angleFromBranch + Math.PI / 2,
              swayOffset: rand() * Math.PI * 2,
              shade: 0.8 + rand() * 0.4,
            });
          }
        }

        // 🌸 Rare flowers on deeper branches
        if (rand() < 0.0005 && this.depth > 2) {
          flowers.push({
            x: this.x,
            y: this.y,
            size: 0,
            maxSize: 5 + rand() * 2,
            rot: rand() * Math.PI * 2,
          });
        }

        // 🌿 Controlled depth-based branching
        if (this.depth < 5) {
          const canBranchNow = this.life >= this.lifetime * 0.3;

          if (canBranchNow && !this.hasBranchedAtTop) {
            this.hasBranchedAtTop = true;

            // 🌱 Number of new branches depends on depth
            let newBranches = 1 + Math.round(rand() * 2);
            if (this.depth === 0) newBranches += 1;
            if (this.depth === 1) newBranches += 2;

            for (let n = 0; n < newBranches; n++) {
              // 🌿 Wider spread angles for outward growth
              const baseSpread = Math.PI / 2; // 90° base
              const angleOffset =
                (rand() - 0.5) * baseSpread * (1.2 + this.depth * 0.15);

              this.children.push(
                new Branch(
                  this.x,
                  this.y,
                  this.trending + angleOffset,
                  this.lifetime * (0.45 + rand() * 0.15),
                  this.width * 0.7,
                  this.depth + 1
                )
              );
            }
          }
        }

        // 🌿 Draw child branches
        for (let i = this.children.length - 1; i >= 0; i--) {
          this.children[i].draw();
          if (this.children[i].life >= this.children[i].lifetime)
            this.children.splice(i, 1);
        }
      }
    }

    // 🌳 Main trunk (slightly less vertical)
    const mainBranch = new Branch(
      canvas.width / 2,
      canvas.height - 15,
      -Math.PI / 2 + (rand() - 0.5) * 0.3, // small tilt
      (canvas.height - 15) / 3,
      30,
      0
    );

    const draw = () => {
      mainBranch.draw();

      // Draw leaves 🍃
      const time = Date.now() * 0.002;
      for (const leaf of leaves) {
        ctx.save();
        ctx.translate(leaf.x, leaf.y);
        const sway = Math.sin(time + leaf.swayOffset) * 0.2;
        ctx.rotate(leaf.rot + sway);

        const gradient = ctx.createLinearGradient(-leaf.size, 0, leaf.size, 0);
        gradient.addColorStop(0, `rgba(46,125,50,${leaf.shade})`);
        gradient.addColorStop(0.5, `rgba(76,175,80,${leaf.shade})`);
        gradient.addColorStop(1, `rgba(129,199,132,${leaf.shade})`);

        ctx.fillStyle = gradient;
        ctx.strokeStyle = "#1B5E20";
        ctx.lineWidth = 0.8;

        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(
          leaf.size,
          -leaf.size * 1.5,
          leaf.size,
          leaf.size * 1.5,
          0,
          leaf.size * 2.2
        );
        ctx.bezierCurveTo(
          -leaf.size,
          leaf.size * 1.5,
          -leaf.size,
          -leaf.size * 1.5,
          0,
          0
        );
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.restore();

        if (leaf.size < leaf.maxSize) leaf.size += 0.5;
      }

      // Draw flowers 🌸
      for (const flower of flowers) {
        ctx.save();
        ctx.translate(flower.x, flower.y);
        ctx.rotate(flower.rot);
        ctx.fillStyle = "#E6A1A1";
        ctx.beginPath();
        ctx.ellipse(0, 0, flower.size, flower.size, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        if (flower.size < flower.maxSize) flower.size += 0.45;
      }

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
