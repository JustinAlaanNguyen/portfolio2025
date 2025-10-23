"use client";
import { useEffect, useRef } from "react";
import "./RootsCanvas.css";

export default function RootsCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const width = window.innerWidth;
      const height =
        document.querySelector(".skills-underground")?.clientHeight || 500;

      // set actual pixel size
      canvas.width = width * dpr;
      canvas.height = height * dpr;

      // scale drawing operations so coordinates remain logical
      ctx.scale(dpr, dpr);

      // keep CSS size consistent
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      // crisp images
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
    };

    resize();
    window.addEventListener("resize", resize);

    const subRootConfig: Record<
      number,
      { angle: number; lifetimeScale: number; widthScale: number }
    > = {
      0: { angle: -0.4, lifetimeScale: 0.5, widthScale: 0.6 },
      1: { angle: 0.4, lifetimeScale: 0.5, widthScale: 0.7 },
      2: { angle: -0.3, lifetimeScale: 0.6, widthScale: 0.5 },
    };

    // Skill for each main branch (depth 1)
    const branchSkills: Record<number, string> = {
      0: "React",
      1: "JavaScript",
      2: "C++",
    };

    // Skill for each sub-root that grows from those branches (depth 2)
    const subRootSkills: Record<number, string> = {
      0: "SQL",
      1: "HTML",
      2: "TypeScript",
      3: "CSS",
    };

    // === Root ===
    class Root {
      x: number;
      y: number;
      angle: number;
      width: number;
      lifetime: number;
      life: number;
      children: Root[];
      depth: number;
      done: boolean;
      branchIndex?: number;

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
        this.done = false;
      }

      draw() {
        if (this.done) return;

        const finished = this.life >= this.lifetime;
        if (!finished) {
          const progress = this.life / this.lifetime;
          const newWidth = Math.max(1, this.width * (1 - progress));
          const pulse = Math.sin(this.life * 0.3) * 0.2 + 1;

          const grad = ctx.createLinearGradient(
            this.x,
            this.y,
            this.x + Math.cos(this.angle) * 10,
            this.y + Math.sin(this.angle) * 10
          );
          grad.addColorStop(0, `rgba(90, 60, 30, 0.9)`);
          grad.addColorStop(1, `rgba(40, 25, 10, 0.6)`);

          ctx.strokeStyle = grad;
          ctx.lineWidth = newWidth * pulse;
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

          // branching
          if (this.depth === 0) {
            if (this.life === 20) {
              const r = new Root(
                this.x,
                this.y,
                this.angle + 1.2,
                this.lifetime * 0.9,
                this.width * 0.6,
                1
              );
              r.branchIndex = 0; // first main branch
              this.children.push(r);
            }
            if (this.life === 25) {
              // === Main second branch ===
              const r1 = new Root(
                this.x,
                this.y,
                this.angle - 1.4,
                this.lifetime * 0.9,
                this.width * 0.6,
                1
              );
              r1.branchIndex = 1; // second main branch
              this.children.push(r1);

              // === New sub-root branch (CSS) ===
              const r2 = new Root(
                this.x,
                this.y,
                this.angle - 0.6, // slightly different angle
                this.lifetime * 0.7,
                this.width * 0.5,
                1
              );
              r2.branchIndex = 3; // 👈 matches subRootSkills[3] = "CSS"
              this.children.push(r2);
            }

            if (this.life === 40) {
              const r = new Root(
                this.x,
                this.y,
                this.angle - 0.3,
                this.lifetime * 0.7,
                this.width * 0.6,
                1
              );
              r.branchIndex = 2; // third main branch
              this.children.push(r);
            }
          }
          if (this.depth === 1 && this.life === 15) {
            const cfg = subRootConfig[this.branchIndex ?? 0];
            if (cfg) {
              const subRoot = new Root(
                this.x,
                this.y,
                this.angle + cfg.angle,
                this.lifetime * cfg.lifetimeScale,
                this.width * cfg.widthScale,
                2
              );
              subRoot.branchIndex = this.branchIndex; // ✅ propagate index
              this.children.push(subRoot);
            }
          }
        } else {
          this.done = true;
          endpoints.push({ x: this.x, y: this.y });

          if (this.depth === 0 && !this.branchIndex) {
            const imgSrc = skillIcons["Education"];
            bubbles.push(new Bubble(this.x, this.y + 30, imgSrc));
          }

          // === bubble assignment logic ===
          if (this.depth === 1 && this.branchIndex !== undefined) {
            // main branch bubble
            const skillName = branchSkills[this.branchIndex];
            if (skillName) {
              const imgSrc = skillIcons[skillName];
              bubbles.push(new Bubble(this.x, this.y + 20, imgSrc));
            }
          }

          if (this.depth === 2 && this.branchIndex !== undefined) {
            // sub-root bubble
            const skillName = subRootSkills[this.branchIndex];
            if (skillName) {
              const imgSrc = skillIcons[skillName];
              bubbles.push(new Bubble(this.x, this.y + 20, imgSrc));
            }
          }
        }

        for (const child of this.children) child.draw();
      }
    }

    // === Bubble ===
    class Bubble {
      x: number;
      y: number;
      radius: number;
      img: HTMLImageElement;

      constructor(x: number, y: number, imgSrc: string) {
        this.x = x;
        this.y = y;
        this.radius = 35;
        this.img = new Image();
        this.img.src = imgSrc;
      }

      draw() {
        // draw the background circle first
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = "#f5f5f5";
        ctx.fill();
        ctx.strokeStyle = "#1b1006";
        ctx.lineWidth = 3;
        ctx.stroke();

        // image rendering (safe)
        if (this.img.complete && this.img.naturalWidth > 0) {
          const size = this.radius * 1.3;
          ctx.drawImage(
            this.img,
            this.x - size / 2,
            this.y - size / 2,
            size,
            size
          );
        } else {
          this.img.onload = () => this.draw();
          this.img.onerror = () => {
            console.warn(`❌ Image failed to load: ${this.img.src}`);
          };
        }
      }

      update() {
        this.draw();
      }
    }

    // === Setup ===
    const endpoints: { x: number; y: number }[] = [];
    const bubbles: Bubble[] = [];
    const allRoots: Root[] = [];

    const startX = window.innerWidth / 2;
    const startY = 10;
    const mainRoot = new Root(
      startX,
      startY,
      Math.PI / 2,
      canvas.height / 20,
      18,
      0
    );
    allRoots.push(mainRoot);

    let rootsDone = false;

    // map each label to logo path
    const skillIcons: Record<string, string> = {
      HTML: "/logos/html.png",
      JavaScript: "/logos/javascript.png",
      TypeScript: "/logos/typescript.png",
      Education: "/logos/education.png",
      React: "/logos/react.png",
      "C++": "/logos/cpp.png",
      SQL: "/logos/mysql.png",
      CSS: "/logos/css.png",
    };

    const labels = Object.keys(skillIcons);

    // === Animate ===
    function animate() {
      if (!rootsDone) {
        let activeCount = 0;
        for (const root of allRoots) {
          root.draw();
          activeCount += root.done ? 0 : 1;
          allRoots.push(...root.children.splice(0));
        }

        if (activeCount === 0) {
          rootsDone = true;
        }
      } else {
        bubbles.forEach((b) => b.update());
      }

      requestAnimationFrame(animate);
    }

    animate();
    return () => window.removeEventListener("resize", resize);
  }, []);

  return <canvas ref={canvasRef} className="roots-canvas" />;
}
