"use client";
import { useEffect, useRef, useState } from "react";
import "./RootsCanvas.css";

export default function RootsCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);

  // === Skill Descriptions (customizable!) ===
  const skillDescriptions: Record<string, string> = {
    // 🌿 Current Skills
    HTML: "The foundation of all web pages — defines structure and content.",
    CSS: "Styles and layouts that bring structure to life visually.",
    JavaScript: "Adds interactivity and dynamic behavior to the web.",
    TypeScript:
      "A superset of JavaScript that adds type safety and scalability.",
    React: "A powerful UI library for building component-based web apps.",
    SQL: "Structured Query Language for managing and querying databases.",
    "C++": "A performant, low-level language for system and game development.",

    // 🌱 Developing Skills
    Figma: "A collaborative design tool for creating modern UI/UX mockups.",
    FigJam: "An online whiteboard for brainstorming and team collaboration.",
    Framer: "A visual tool for interactive design and prototyping.",
  };

  const currentSkills = [
    "HTML",
    "CSS",
    "JavaScript",
    "TypeScript",
    "React",
    "SQL",
    "C++",
  ];
  const developingSkills = ["Figma", "FigJam", "Framer"];

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;

    // === 🌱 Resize canvas responsively ===
    function resizeCanvas() {
      const dpr = window.devicePixelRatio || 1;
      const width = window.innerWidth;
      const height =
        document.querySelector(".skills-underground")?.clientHeight ||
        window.innerHeight * 0.6;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
    }

    // === 🌿 Configurations ===
    const subRootProfiles = {
      developing: [
        { angle: 1.7, lifetime: 70, width: 6, stepSize: 2.5 },
        { angle: 2.3, lifetime: 120, width: 7, stepSize: 2.2 },
        { angle: 2.7, lifetime: 140, width: 5, stepSize: 2.8 },
      ],
      current: [
        { angle: 2.0, lifetime: 100, width: 6, stepSize: 2.0 },
        { angle: 1.6, lifetime: 100, width: 6, stepSize: 2.0 },
        { angle: 1.2, lifetime: 100, width: 5, stepSize: 2.0 },
        { angle: 0.8, lifetime: 100, width: 7, stepSize: 2.0 },
        { angle: 0.4, lifetime: 100, width: 7, stepSize: 2.0 },
        { angle: 0, lifetime: 100, width: 6, stepSize: 2.4 },
        { angle: -0.3, lifetime: 100, width: 5, stepSize: 2.8 },
      ],
    };

    const skillIcons: Record<string, string> = {
      // 🌿 Current Skills
      HTML: "/logos/html.png",
      CSS: "/logos/css.png",
      JavaScript: "/logos/javascript.png",
      TypeScript: "/logos/typescript.png",
      React: "/logos/react.png",
      SQL: "/logos/mysql.png",
      "C++": "/logos/cpp.png",

      // 🌱 Developing Skills
      Figma: "/logos/figma.png",
      FigJam: "/logos/figjam.png",
      Framer: "/logos/framer.png",

      // 🎓 Root bubble
      Education: "/logos/education.png",
    };

    // === Skill assignment indices ===
    let currentSkillIndex = 0;
    let developingSkillIndex = 0;

    const currentSkills = [
      "HTML",
      "CSS",
      "JavaScript",
      "TypeScript",
      "React",
      "SQL",
      "C++",
    ];
    const developingSkills = ["Figma", "FigJam", "Framer"];

    // === 🍂 Bubble Class ===
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
        this.currentScale = 0;
      }

      checkHover(mx: number, my: number) {
        const dx = mx - this.x;
        const dy = my - this.y;
        const wasHovered = this.isHovered;
        this.isHovered = Math.sqrt(dx * dx + dy * dy) < this.radius;

        // Identify which skill the bubble represents
        const skillName = Object.keys(skillIcons).find((k) =>
          this.img.src.includes(skillIcons[k].split("/").pop()!)
        );

        if (
          skillName &&
          (currentSkills.includes(skillName) ||
            developingSkills.includes(skillName))
        ) {
          if (this.isHovered && !wasHovered) setHoveredSkill(skillName);
          else if (!this.isHovered && wasHovered) setHoveredSkill(null);
        }
      }

      draw() {
        const elapsed = performance.now() - this.spawnTime;
        const progress = Math.min(elapsed / this.animDuration, 1);
        const easeOutBack = (t: number) => {
          const c1 = 1.70158;
          const c3 = c1 + 1;
          return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
        };
        const eased = easeOutBack(progress);

        this.targetScale = this.isHovered ? 1.15 : 1;
        this.currentScale += (this.targetScale - this.currentScale) * 0.1;
        const opacity = Math.min(progress * 1.2, 1);

        ctx.save();
        ctx.globalAlpha = opacity;
        ctx.translate(this.x, this.y);
        ctx.scale(eased * this.currentScale, eased * this.currentScale);
        ctx.beginPath();
        ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = "#f5f5f5";
        ctx.fill();
        ctx.strokeStyle = "rgba(27, 16, 6, 0.4)";
        ctx.lineWidth = 2;
        ctx.shadowColor = "rgba(0,0,0,0.25)";
        ctx.shadowBlur = this.isHovered ? 8 : 3;
        ctx.stroke();

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

    // === 🌾 Root Class ===
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
      direction?:
        | "left"
        | "right"
        | "main"
        | "developing"
        | "current-sub"
        | "developing-sub";
      stepSize: number;

      constructor(
        x: number,
        y: number,
        angle: number,
        lifetime: number,
        width: number,
        depth: number,
        stepSize: number,
        direction:
          | "left"
          | "right"
          | "main"
          | "developing"
          | "current-sub"
          | "developing-sub" = "main"
      ) {
        this.x = x;
        this.y = y;
        this.angle = angle;
        this.width = width;
        this.lifetime = lifetime;
        this.life = 0;
        this.depth = depth;
        this.done = false;
        this.children = [];
        this.stepSize = stepSize;
        this.direction = direction;
      }

      draw() {
        if (this.done) return;

        const finished = this.life >= this.lifetime;
        if (!finished) {
          const progress = this.life / this.lifetime;
          const newWidth = Math.max(1, this.width * (1 - progress));
          const pulse = Math.sin(this.life * 0.25) * 0.15 + 1;

          ctx.save();
          ctx.shadowBlur = 6 - this.depth * 1.5;
          ctx.shadowColor = "rgba(0,0,0,0.2)";
          const grad = ctx.createLinearGradient(
            this.x,
            this.y,
            this.x + Math.cos(this.angle) * 10,
            this.y + Math.sin(this.angle) * 10
          );
          grad.addColorStop(0, "rgba(90, 60, 30, 0.9)");
          grad.addColorStop(1, "rgba(40, 25, 10, 0.6)");
          ctx.strokeStyle = grad;
          ctx.lineWidth = newWidth * pulse;
          ctx.lineCap = "round";

          const curveOffset = Math.sin(this.life * 0.15) * 0.02;
          this.angle += curveOffset;

          const nextX = this.x + Math.cos(this.angle) * this.stepSize;
          const nextY = this.y + Math.sin(this.angle) * this.stepSize;
          ctx.beginPath();
          ctx.moveTo(this.x, this.y);
          ctx.lineTo(nextX, nextY);
          ctx.stroke();
          ctx.restore();

          this.x = nextX;
          this.y = nextY;
          this.life++;

          // 🌿 Controlled branching for main root
          if (this.depth === 0 && this.life === 25) {
            // LEFT → Current Skills
            this.children.push(
              new Root(
                this.x,
                this.y,
                this.angle - 1.7,
                this.lifetime * 0.4,
                this.width * 0.6,
                1,
                this.stepSize,
                "left"
              )
            );
          }
          if (this.depth === 0 && this.life === 30) {
            // RIGHT → Developing Skills
            this.children.push(
              new Root(
                this.x,
                this.y,
                this.angle + 0.8,
                this.lifetime * 0.4,
                this.width * 0.6,
                1,
                this.stepSize,
                "right"
              )
            );
          }
        } else {
          this.done = true;

          ctx.save();
          ctx.beginPath();
          ctx.arc(this.x, this.y, 4, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(255,255,255,0.35)";
          ctx.shadowColor = "rgba(255,255,255,0.2)";
          ctx.shadowBlur = 6;
          ctx.fill();
          ctx.restore();

          // 🌳 Add bubble at tip
          // 🌳 Add bubble only for main root (education) — not side roots
          // 🌳 Replace Education bubble with a wooden sign
          if (this.depth === 0 && this.direction === "main") {
            textLabels.push({
              x: this.x,
              y: this.y + 70,
              text: "My Education",
            });
          }

          // === LEFT ROOT → spawn subroots for Current Skills ===
          if (this.direction === "left") {
            textLabels.push({
              x: this.x,
              y: this.y + 75,
              text: "Current Skills",
            });

            for (const p of subRootProfiles.current) {
              allRoots.push(
                new Root(
                  this.x,
                  this.y + 25,
                  p.angle,
                  p.lifetime,
                  p.width,
                  2,
                  p.stepSize,
                  "current-sub"
                )
              );
            }
          }

          // === RIGHT ROOT → spawn subroots for Developing Skills ===
          if (this.direction === "right") {
            textLabels.push({
              x: this.x,
              y: this.y + 75,
              text: "Developing Skills",
            });

            for (const p of subRootProfiles.developing) {
              allRoots.push(
                new Root(
                  this.x,
                  this.y + 25,
                  p.angle,
                  p.lifetime,
                  p.width,
                  2,
                  p.stepSize,
                  "developing-sub"
                )
              );
            }
          }

          // === SUBROOT COMPLETION → Bubbles appear at the tips ===
          if (this.direction === "current-sub") {
            const skill =
              currentSkills[currentSkillIndex % currentSkills.length];
            bubbles.push(new Bubble(this.x, this.y + 25, skillIcons[skill]));
            currentSkillIndex++;
          }

          if (this.direction === "developing-sub") {
            const skill =
              developingSkills[developingSkillIndex % developingSkills.length];
            bubbles.push(new Bubble(this.x, this.y + 25, skillIcons[skill]));
            developingSkillIndex++;
          }
        }

        for (const c of this.children) c.draw();
      }
    }

    // === Runtime ===
    let allRoots: Root[] = [];
    let bubbles: Bubble[] = [];
    const textLabels: { x: number; y: number; text: string }[] = [];
    let mouseX = 0;
    let mouseY = 0;

    canvas.addEventListener("mousemove", (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    });

    function initRoots() {
      allRoots = [];
      bubbles = [];

      const startX = window.innerWidth / 2;
      const startY = 10;
      const targetDepth = canvas.height * 0.75;
      const stepSize = Math.max(2, Math.min(4, canvas.height / 300));
      const lifetime = (targetDepth / stepSize) * 0.4;

      allRoots.push(
        new Root(startX, startY, Math.PI / 2, lifetime, 18, 0, stepSize)
      );
    }

    function animate() {
      const newRoots: Root[] = [];
      for (const root of allRoots) {
        root.draw();
        newRoots.push(...root.children.splice(0));
      }
      allRoots.push(...newRoots);

      bubbles.forEach((b) => {
        b.checkHover(mouseX, mouseY);
        b.update();
      });

      // === 🪵 Draw Wooden Signboards for Text Labels ===
      // === 🪵 Draw Wooden Signboards for Text Labels ===
      ctx.save();
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      // Keep persistent animation state for signboards
      // Keep persistent animation state for signboards (typed safely)
      interface WindowWithSignSpawnTimes extends Window {
        _signSpawnTimes?: Record<string, number>;
      }
      const win = window as WindowWithSignSpawnTimes;
      if (!win._signSpawnTimes) win._signSpawnTimes = {};
      const signSpawnTimes = win._signSpawnTimes;

      textLabels.forEach(({ x, y, text }) => {
        const id = `${x}-${y}-${text}`;
        if (!signSpawnTimes[id]) signSpawnTimes[id] = performance.now();

        const elapsed = (performance.now() - signSpawnTimes[id]) / 800; // 0.8s animation
        const t = Math.min(elapsed, 1);

        // Easing function (pop/bounce feel)
        const easeOutBack = (t: number) => {
          const c1 = 1.70158;
          const c3 = c1 + 1;
          return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
        };
        const scale = easeOutBack(t);
        const opacity = Math.min(t * 1.5, 1);

        const boardWidth = 180;
        const boardHeight = 50;

        // 🪶 Raise sign position slightly
        const boardY = y - boardHeight / 2 - 40;

        ctx.save();
        ctx.globalAlpha = opacity;
        ctx.translate(x, y - 40); // animate from slightly below
        ctx.scale(scale, scale);

        // Wood grain gradient
        const woodGradient = ctx.createLinearGradient(
          -boardWidth / 2,
          0,
          boardWidth / 2,
          0
        );
        woodGradient.addColorStop(0, "#6b4226");
        woodGradient.addColorStop(0.5, "#8b5a2b");
        woodGradient.addColorStop(1, "#5c3921");

        // Draw wooden board
        ctx.shadowColor = "rgba(0, 0, 0, 0.4)";
        ctx.shadowBlur = 8;
        ctx.shadowOffsetY = 4;
        ctx.beginPath();

        // Slightly uneven edges for realism
        // Draw wooden board (no random jitter)
        ctx.beginPath();
        ctx.moveTo(-boardWidth / 2, -boardHeight / 2);
        ctx.lineTo(boardWidth / 2, -boardHeight / 2);
        ctx.lineTo(boardWidth / 2, boardHeight / 2);
        ctx.lineTo(-boardWidth / 2, boardHeight / 2);
        ctx.closePath();

        ctx.fillStyle = woodGradient;
        ctx.fill();

        // Add subtle horizontal wood lines
        ctx.strokeStyle = "rgba(255,255,255,0.1)";
        ctx.lineWidth = 1;
        for (let i = -boardHeight / 2; i < boardHeight / 2; i += 6) {
          ctx.beginPath();
          ctx.moveTo(-boardWidth / 2 + 4, i);
          ctx.lineTo(boardWidth / 2 - 4, i + Math.random() * 2 - 1);
          ctx.stroke();
        }

        // Wood border
        ctx.lineWidth = 2;
        ctx.strokeStyle = "rgba(30,20,10,0.5)";
        ctx.stroke();

        // Metal nails
        const nailRadius = 3;
        const nailOffsetX = boardWidth / 2 - 10;
        const nailOffsetY = boardHeight / 2 - 10;
        const nails = [
          [-nailOffsetX, -nailOffsetY],
          [nailOffsetX, -nailOffsetY],
        ];
        nails.forEach(([nx, ny]) => {
          ctx.beginPath();
          ctx.arc(nx, ny, nailRadius, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(220,220,220,0.8)";
          ctx.fill();
          ctx.strokeStyle = "rgba(50,50,50,0.5)";
          ctx.stroke();
        });

        // Engraved text
        ctx.font = "bold 22px 'Cormorant', serif";
        ctx.lineWidth = 3;
        ctx.strokeStyle = "rgba(30, 15, 5, 0.6)";
        ctx.strokeText(text, 0, 4);
        ctx.fillStyle = "#f5e9c4";
        ctx.fillText(text, 0, 4);

        ctx.restore();
      });

      ctx.restore();

      animationRef.current = requestAnimationFrame(animate);
    }

    function start() {
      cancelAnimationFrame(animationRef.current || 0);
      resizeCanvas();
      initRoots();
      animate();
    }

    start();
    window.addEventListener("resize", start);
    return () => {
      window.removeEventListener("resize", start);
      cancelAnimationFrame(animationRef.current || 0);
    };
  }, []);

  return (
    <>
      <canvas ref={canvasRef} className="roots-canvas" />

      {/* 🌿 Current Skill Card (Left) */}
      <div
        className={`skill-info-card current ${
          hoveredSkill && currentSkills.includes(hoveredSkill) ? "visible" : ""
        }`}
      >
        {hoveredSkill && currentSkills.includes(hoveredSkill) && (
          <>
            <h2>{hoveredSkill}</h2>
            <p>{skillDescriptions[hoveredSkill]}</p>
          </>
        )}
      </div>

      {/* 🌱 Developing Skill Card (Right) */}
      <div
        className={`skill-info-card developing ${
          hoveredSkill && developingSkills.includes(hoveredSkill)
            ? "visible"
            : ""
        }`}
      >
        {hoveredSkill && developingSkills.includes(hoveredSkill) && (
          <>
            <h2>{hoveredSkill}</h2>
            <p>{skillDescriptions[hoveredSkill]}</p>
          </>
        )}
      </div>
    </>
  );
}
