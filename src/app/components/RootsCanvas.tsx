"use client";
import { useEffect, useRef } from "react";
import "./RootsCanvas.css";

export default function RootsCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;

    canvas.width = window.innerWidth;
    canvas.height =
      document.querySelector(".skills-underground")?.clientHeight || 500;

    window.addEventListener("resize", () => {
      canvas.width = window.innerWidth;
      canvas.height =
        document.querySelector(".skills-underground")?.clientHeight || 500;
    });

    class Root {
      x: number;
      y: number;
      angle: number;
      width: number;
      lifetime: number;
      life: number;
      children: Root[];
      depth: number;

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
        this.angle = angle;
        this.width = width;
        this.lifetime = life;
        this.life = 0;
        this.depth = depth;
        this.children = [];
      }

      draw() {
        const done = this.life >= this.lifetime;
        if (!done) {
          // Taper width as it grows
          const newWidth = Math.max(
            1,
            this.width * (1 - this.life / this.lifetime)
          );
          ctx.strokeStyle = "#2b1a0e";
          ctx.lineWidth = newWidth;
          ctx.lineCap = "round";

          const nextX = this.x + Math.cos(this.angle) * 3;
          const nextY = this.y + Math.sin(this.angle) * 3;

          ctx.beginPath();
          ctx.moveTo(this.x, this.y);
          ctx.lineTo(nextX, nextY);
          ctx.stroke();

          this.x = nextX;
          this.y = nextY;
          this.life++;

          // ✅ HARD-CODED BRANCHING
          if (this.depth === 0) {
            if (this.life === 20) {
              // First Left branch
              this.children.push(
                new Root(
                  this.x,
                  this.y,
                  this.angle + 0.8, // angle to the right
                  this.lifetime * 0.9,
                  this.width * 0.6,
                  this.depth + 1
                )
              );
            }

            if (this.life === 25) {
              // First Right branch
              this.children.push(
                new Root(
                  this.x,
                  this.y,
                  this.angle - 1, // angle to the left
                  this.lifetime * 0.9,
                  this.width * 0.6,
                  this.depth + 1
                )
              );
            }

            if (this.life === 40) {
              // Second right branch
              this.children.push(
                new Root(
                  this.x,
                  this.y,
                  this.angle - 0.7, // angle to the left
                  this.lifetime * 0.9,
                  this.width * 0.6,
                  this.depth + 1
                )
              );
            }
          }

          // ✅ SECOND LEVEL HARD-CODED BRANCHES
          if (this.depth === 1) {
            if (this.life === 15) {
              this.children.push(
                new Root(
                  this.x,
                  this.y,
                  this.angle + 0.4,
                  this.lifetime * 0.5,
                  this.width * 0.6,
                  this.depth + 1
                )
              );
            }
          }
        }

        // Draw children
        for (let i = this.children.length - 1; i >= 0; i--) {
          this.children[i].draw();
          if (this.children[i].life >= this.children[i].lifetime) {
            this.children.splice(i, 1);
          }
        }
      }
    }

    // Start roots from the bottom of surface
    const startX = canvas.width / 2;
    const startY = 10;

    const mainRoot = new Root(
      startX,
      startY,
      Math.PI / 2,
      canvas.height / 20,
      18,
      0
    );

    function animate() {
      requestAnimationFrame(animate);
      mainRoot.draw();
    }

    animate();
  }, []);

  return <canvas ref={canvasRef} className="roots-canvas" />;
}
