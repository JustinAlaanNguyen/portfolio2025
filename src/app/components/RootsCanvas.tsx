"use client";
import { useEffect, useRef } from "react";
import "./RootsCanvas.css";

export default function RootsCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;

    // === Handle resizing and DPR scaling ===
    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const width = window.innerWidth;
      const height =
        document.querySelector(".skills-underground")?.clientHeight || 500;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
    };

    resize();
    window.addEventListener("resize", resize);

    // === Configuration ===
    const subRootConfig: Record<
      number,
      { angle: number; lifetimeScale: number; widthScale: number }
    > = {
      0: { angle: -0.4, lifetimeScale: 0.5, widthScale: 0.6 },
      1: { angle: 0.4, lifetimeScale: 0.5, widthScale: 0.7 },
      2: { angle: -0.3, lifetimeScale: 0.6, widthScale: 0.5 },
    };

    const branchSkills: Record<number, string> = {
      0: "React",
      1: "JavaScript",
      2: "C++",
    };

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
      depth: number;
      done: boolean;
      children: Root[];
      branchIndex?: number;
      subRootIndex?: number;

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

          // === Branching logic ===
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
              r.branchIndex = 0; // React
              this.children.push(r);
            }

            if (this.life === 25) {
              const r1 = new Root(
                this.x,
                this.y,
                this.angle - 1.5,
                this.lifetime * 0.9,
                this.width * 0.6,
                1
              );
              r1.branchIndex = 1; // JavaScript
              this.children.push(r1);

              // === CSS Subroot (manual branch) ===
              const r2 = new Root(
                this.x,
                this.y,
                this.angle - 1.4,
                this.lifetime * 0.7,
                this.width * 0.5,
                1
              );
              r2.subRootIndex = 3; // CSS
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
              r.branchIndex = 2; // C++
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
              subRoot.subRootIndex = this.branchIndex; // map sub-root to its pair skill
              this.children.push(subRoot);
            }
          }
        } else {
          this.done = true;
          endpoints.push({ x: this.x, y: this.y });

          // === Education bubble (main root end) ===
          if (this.depth === 0) {
            const imgSrc = skillIcons["Education"];
            bubbles.push(new Bubble(this.x, this.y + 30, imgSrc));
          }

          // === Skill bubble logic ===
          if (this.depth === 1 && this.branchIndex !== undefined) {
            const skillName = branchSkills[this.branchIndex];
            if (skillName) {
              const imgSrc = skillIcons[skillName];
              bubbles.push(new Bubble(this.x, this.y + 20, imgSrc));
            }
          }

          if (this.subRootIndex !== undefined) {
            const skillName = subRootSkills[this.subRootIndex];
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
      spawnTime: number;
      animDuration: number;
      isHovered: boolean;
      targetScale: number;
      currentScale: number;

      constructor(x: number, y: number, imgSrc: string) {
        this.x = x;
        this.y = y;
        this.radius = 35;
        this.img = new Image();
        this.img.src = imgSrc;

        this.spawnTime = performance.now();
        this.animDuration = 800;

        this.isHovered = false;
        this.targetScale = 1;
        this.currentScale = 0; // start at 0 for pop-in animation
      }

      checkHover(mx: number, my: number) {
        const dx = mx - this.x;
        const dy = my - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        this.isHovered = distance < this.radius;
      }

      draw() {
        const elapsed = performance.now() - this.spawnTime;
        const progress = Math.min(elapsed / this.animDuration, 1);

        // smooth ease-out
        const easeOutBack = (t: number) => {
          const c1 = 1.70158;
          const c3 = c1 + 1;
          return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
        };

        const eased = easeOutBack(progress);

        // hover target scale
        this.targetScale = this.isHovered ? 1.15 : 1;

        // smooth interpolate current scale
        this.currentScale += (this.targetScale - this.currentScale) * 0.1;

        const opacity = Math.min(progress * 1.2, 1);

        ctx.save();
        ctx.globalAlpha = opacity;
        ctx.translate(this.x, this.y);
        ctx.scale(eased * this.currentScale, eased * this.currentScale);

        // background circle
        ctx.beginPath();
        ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = "#f5f5f5";
        ctx.fill();
        ctx.strokeStyle = "rgba(27, 16, 6, 0.4)"; // softer edge
        ctx.lineWidth = 2; // thinner line
        ctx.shadowColor = "rgba(0, 0, 0, 0.25)";
        ctx.shadowBlur = this.isHovered ? 8 : 3;
        ctx.stroke();

        // draw the image if loaded
        if (this.img.complete && this.img.naturalWidth > 0) {
          const size = this.radius * 1.3;
          ctx.drawImage(this.img, -size / 2, -size / 2, size, size);
        }

        ctx.restore();
      }

      update() {
        this.draw();
      }
    }

    // === Setup ===
    const endpoints: { x: number; y: number }[] = [];
    const bubbles: Bubble[] = [];
    const allRoots: Root[] = [];
    let mouseX = 0;
    let mouseY = 0;
    canvas.addEventListener("mousemove", (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    });

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

    // === Animate ===
    function animate() {
      if (!rootsDone) {
        let activeCount = 0;
        for (const root of allRoots) {
          root.draw();
          activeCount += root.done ? 0 : 1;
          allRoots.push(...root.children.splice(0));
        }
        if (activeCount === 0) rootsDone = true;
      } else {
        bubbles.forEach((b) => {
          b.checkHover(mouseX, mouseY);
          b.update();
        });
      }

      requestAnimationFrame(animate);
    }

    animate();
    return () => window.removeEventListener("resize", resize);
  }, []);

  return <canvas ref={canvasRef} className="roots-canvas" />;
}
