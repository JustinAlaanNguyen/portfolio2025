"use client";
import { useEffect, useRef, useState } from "react";
import "./RootsCanvas.css";
import { usePreview } from "@/app/context/PreviewContext";
import { motion, AnimatePresence } from "framer-motion";

export default function RootsCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);
  const [hoveredPlaque, setHoveredPlaque] = useState<string | null>(null);
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);
  const [hoveredPlaquePos, setHoveredPlaquePos] = useState({ x: 0, y: 0 });

  const {
    previewSignPos,
    setPreviewSignPos,
    selectedSkill,
    setSelectedSkill,
    skillDescriptions,
    skillIcons,
  } = usePreview();

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

    const baseWidth = 1440; // baseline design width (your dev screen)
    const baseHeight = 900; // baseline design height
    const scaleFactor = Math.min(
      window.innerWidth / baseWidth,
      window.innerHeight / baseHeight
    );

    // === 🌿 Configurations ===
    const subRootProfiles = {
      developing: [
        {
          angle: 0.5,
          lifetime: 170,
          width: 6,
          stepSize: 0.8,
        },
        {
          angle: 1.5,
          lifetime: 170,
          width: 7,
          stepSize: 0.5,
        },
        {
          angle: 2.5,
          lifetime: 170,
          width: 5,
          stepSize: 0.8,
        },
      ],
      current: [
        {
          angle: 3.2,
          lifetime: 150,
          width: 6,
          stepSize: 2,
        },
        {
          angle: 2.9,
          lifetime: 150,
          width: 6,
          stepSize: 2,
        },
        {
          angle: 2.6,
          lifetime: 150,
          width: 5,
          stepSize: 2,
        },
        {
          angle: 2.3,
          lifetime: 150,
          width: 7,
          stepSize: 2,
        },
        {
          angle: 3.1,
          lifetime: 150,
          width: 7,
          stepSize: 1.3,
        },
        {
          angle: 2.7,
          lifetime: 150,
          width: 6,
          stepSize: 1.3,
        },
        {
          angle: 2.3,
          lifetime: 150,
          width: 5,
          stepSize: 1.3,
        },
      ],
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
        this.radius = 35 * scaleFactor; // scaled radius
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

          // ✅ Handle click to "select" skill permanently
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
        | "current"
        | "developing"
        | "preview"
        | "main"
        | "current-sub"
        | "developing-sub"
        | "education";
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
          | "current"
          | "developing"
          | "preview"
          | "main"
          | "current-sub"
          | "developing-sub"
          | "education" = "main"
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
                this.angle + 1,
                this.lifetime * 0.3,
                this.width * 0.6,
                1,
                this.stepSize,
                "current"
              )
            );
          }
          if (this.depth === 0 && this.life === 70) {
            // LEFT → Developing Skills
            this.children.push(
              new Root(
                this.x,
                this.y,
                this.angle + 0.8,
                this.lifetime * 0.3,
                this.width * 0.6,
                1,
                this.stepSize,
                "developing"
              )
            );
          }

          if (this.depth === 0 && this.life === 40) {
            // RIGHT → Skill preview
            this.children.push(
              new Root(
                this.x,
                this.y,
                this.angle - 1.6,
                this.lifetime * 0.5,
                this.width * 0.6,
                1,
                this.stepSize,
                "preview"
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
            const eduLabel = {
              x: this.x,
              y: this.y + 70,
              text: "My Education",
            };
            textLabels.push(eduLabel);

            if (!educationTriggered) {
              educationTriggered = true;

              // === 🌱 Root #1: From "My Education" → "Seneca Polytechnic, 2024"
              const senecaRoot = new Root(
                eduLabel.x,
                eduLabel.y - 10,
                Math.PI / 2,
                40,
                5,
                1,
                2.5,
                "education"
              );
              educationRoots.push(senecaRoot);

              // === 🌿 Wait for first root to grow, then spawn next
              setTimeout(() => {
                educationPlaques.push({
                  x: senecaRoot.x,
                  y: senecaRoot.y + 40,
                  title: "Seneca Polytechnic, 2024",
                });

                // === 🌱 Root #2: From "Seneca Polytechnic" → "Computer Programming and Analysis"
                const cpaRoot = new Root(
                  senecaRoot.x,
                  senecaRoot.y + 40,
                  Math.PI / 2 + 0.05,
                  40,
                  4.5,
                  2,
                  2.4,
                  "education"
                );
                educationRoots.push(cpaRoot);

                setTimeout(() => {
                  educationPlaques.push({
                    x: cpaRoot.x,
                    y: cpaRoot.y + 40,
                    title: "Computer Programming and Analysis",
                  });

                  // === 🌳 Roots from "Computer Programming and Analysis" to two plaques
                  const leftBranch = new Root(
                    cpaRoot.x - 50,
                    cpaRoot.y + 40,
                    Math.PI / 2 + 0.7,
                    60,
                    3.8,
                    3,
                    2.3,
                    "education"
                  );

                  const rightBranch = new Root(
                    cpaRoot.x + 50,
                    cpaRoot.y + 40,
                    Math.PI / 2 - 0.7,
                    60,
                    3.8,
                    3,
                    2.3,
                    "education"
                  );

                  educationRoots.push(leftBranch, rightBranch);

                  // Add plaques at tips slightly delayed for animation sync
                  setTimeout(() => {
                    educationPlaques.push({
                      x: leftBranch.x - 10,
                      y: leftBranch.y + 40,
                      title: "Ontario Advanced Diploma 2024",
                    });
                    educationPlaques.push({
                      x: rightBranch.x + 10,
                      y: rightBranch.y + 40,
                      title: "President’s Honour List 2023",
                    });
                  }, 1200);
                }, 1200);
              }, 1000);
            }
          }

          // === current ROOT → spawn subroots for Current Skills ===
          if (this.direction === "current") {
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

          // === developing ROOT → spawn subroots for Developing Skills ===
          if (this.direction === "developing") {
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

          // === developing ROOT → spawn subroots for Developing Skills ===
          if (this.direction === "preview") {
            const label = {
              x: this.x,
              y: this.y + 75,
              text: "Skill in Preview",
            };
            textLabels.push(label);
            setPreviewSignPos({ x: label.x, y: label.y }); // ✅ use context instead
          }

          // === SUBROOT COMPLETION → Bubbles appear at the tips ===
          if (this.direction === "current-sub") {
            const skill =
              currentSkills[currentSkillIndex % currentSkills.length];
            bubbles.push(
              new Bubble(this.x, this.y + 25 * scaleFactor, skillIcons[skill])
            );

            currentSkillIndex++;
          }

          if (this.direction === "developing-sub") {
            const skill =
              developingSkills[developingSkillIndex % developingSkills.length];
            bubbles.push(
              new Bubble(this.x, this.y + 25 * scaleFactor, skillIcons[skill])
            );

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
    // === 🎓 Education Nodes ===
    const educationRoots: Root[] = [];
    const educationPlaques: { x: number; y: number; title: string }[] = [];
    let educationTriggered = false;

    canvas.addEventListener("mousemove", (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;

      // 🎓 Detect hover over education plaques
      // 🎓 Detect hover over education plaques (card-accurate hover area)
      let hovering: string | null = null;
      let hoverPos = { x: 0, y: 0 };

      const plaqueWidth = 250;
      const plaqueHeight = 70;

      for (const { x, y, title } of educationPlaques) {
        const halfW = plaqueWidth / 2;
        const halfH = plaqueHeight / 2;

        if (
          mouseX >= x - halfW &&
          mouseX <= x + halfW &&
          mouseY >= y - halfH &&
          mouseY <= y + halfH
        ) {
          hovering = title;
          hoverPos = { x, y };
          break;
        }
      }

      setHoveredPlaque(hovering);
      setHoveredPlaquePos(hoverPos);
    });

    function initRoots() {
      allRoots = [];
      bubbles = [];

      const startX = window.innerWidth / 2;
      const startY = 10;

      // 🌿 SCALE FIX: define a scaling factor based on screen width
      const baseWidth = 1440; // design baseline width
      const scaleFactor = window.innerWidth / baseWidth;

      // 🌿 SCALE FIX: adjust vertical depth and step sizes proportionally
      const targetDepth = canvas.height * 0.6 * scaleFactor;
      const stepSize = Math.max(
        2,
        Math.min(4, (canvas.height / 300) * scaleFactor)
      );
      const lifetime = (targetDepth / stepSize) * 0.4;

      // 🌿 SCALE FIX: also scale root width slightly for balance
      const rootWidth = 18 * scaleFactor;

      allRoots.push(
        new Root(startX, startY, Math.PI / 2, lifetime, rootWidth, 0, stepSize)
      );
    }

    // Add after you define bubbles and skillIcons but before animate()

    canvas.addEventListener("click", (e) => {
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;

      for (const b of bubbles) {
        const dx = mx - b.x;
        const dy = my - b.y;
        if (Math.sqrt(dx * dx + dy * dy) < b.radius) {
          const skillName = Object.keys(skillIcons).find((k) =>
            b.img.src.includes(skillIcons[k].split("/").pop()!)
          );

          if (skillName) {
            setSelectedSkill((prev) => (prev === skillName ? null : skillName));
          }
          break;
        }
      }
    });

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

        const elapsed = (performance.now() - signSpawnTimes[id]) / 800;
        const t = Math.min(elapsed, 1);

        // easing animation
        const easeOutBack = (t: number) => {
          const c1 = 1.70158;
          const c3 = c1 + 1;
          return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
        };

        const scale = easeOutBack(t);
        const opacity = Math.min(t * 1.5, 1);

        // === Polished Natural Wood Plank ===
        const boardWidth = 200;
        const boardHeight = 55;

        ctx.save();
        ctx.globalAlpha = opacity;
        ctx.translate(x, y - 45);
        ctx.scale(scale, scale);

        // Smooth rich wood gradient
        const grad = ctx.createLinearGradient(
          -boardWidth / 2,
          -boardHeight / 2,
          boardWidth / 2,
          boardHeight / 2
        );
        grad.addColorStop(0, "#795836");
        grad.addColorStop(0.5, "#A57A4D");
        grad.addColorStop(1, "#6B4A2F");
        ctx.fillStyle = grad;

        // Rounded polished plank
        ctx.beginPath();
        ctx.roundRect(
          -boardWidth / 2,
          -boardHeight / 2,
          boardWidth,
          boardHeight,
          12
        );
        ctx.fill();

        // Clean soft border
        ctx.lineWidth = 2;
        ctx.strokeStyle = "rgba(40, 25, 10, 0.5)";
        ctx.stroke();

        // Subtle horizontal grain lines
        ctx.strokeStyle = "rgba(255,255,255,0.15)";
        ctx.lineWidth = 1;
        for (let i = -boardHeight / 2 + 6; i < boardHeight / 2; i += 7) {
          ctx.beginPath();
          ctx.moveTo(-boardWidth / 2 + 10, i);
          ctx.lineTo(boardWidth / 2 - 10, i + 1);
          ctx.stroke();
        }

        // Brass rivets
        const rivets = [
          [-boardWidth / 2 + 12, -boardHeight / 2 + 12],
          [boardWidth / 2 - 12, -boardHeight / 2 + 12],
        ];

        rivets.forEach(([nx, ny]) => {
          const rg = ctx.createRadialGradient(nx, ny, 0, nx, ny, 5);
          rg.addColorStop(0, "#F4E3A1");
          rg.addColorStop(1, "#C0A060");

          ctx.beginPath();
          ctx.fillStyle = rg;
          ctx.arc(nx, ny, 4, 0, Math.PI * 2);
          ctx.fill();
        });

        // Engraved text
        ctx.font = "600 20px 'Cormorant', serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        ctx.strokeStyle = "rgba(40,25,10,0.45)";
        ctx.lineWidth = 3;
        ctx.strokeText(text, 0, 3);

        ctx.fillStyle = "#F7E8C7";
        ctx.fillText(text, 0, 3);

        ctx.restore();
      });

      ctx.restore();

      // === 🎓 Draw Education Roots and Plaques ===
      for (const root of educationRoots) root.draw();

      // === 🎓 Animated Education Plaques ===
      educationPlaques.forEach(({ x, y, title }) => {
        const id = `${x}-${y}-${title}`;
        if (!signSpawnTimes[id]) signSpawnTimes[id] = performance.now();

        const elapsed = (performance.now() - signSpawnTimes[id]) / 900;
        const t = Math.min(elapsed, 1);

        // Easing function
        const easeOutBack = (t: number) => {
          const c1 = 1.70158;
          const c3 = c1 + 1;
          return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
        };

        const scale = easeOutBack(t);
        const opacity = Math.min(t * 1.3, 1);

        ctx.save();
        ctx.globalAlpha = opacity;
        ctx.translate(x, y);
        ctx.scale(scale, scale);

        const width = 250;
        const height = 70;

        /* === Idle subtle glow when NO plaque is hovered === */
        if (!hoveredPlaque) {
          ctx.save();
          ctx.strokeStyle = "rgba(255, 230, 150, 0.15)";
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.roundRect(
            -width / 2 - 3,
            -height / 2 - 3,
            width + 6,
            height + 6,
            14
          );
          ctx.stroke();
          ctx.restore();
        }

        // === Subtle hover hint glow ===
        if (hoveredPlaque === title) {
          // only glow when NOT hovered over another plaque
          const pulse = 0.4 + Math.sin(performance.now() / 500) * 0.2;

          ctx.save();
          ctx.globalAlpha = 0.35 * pulse;
          ctx.strokeStyle = "#f9e1b0";
          ctx.lineWidth = 4;

          ctx.beginPath();
          ctx.roundRect(
            -width / 2 - 3,
            -height / 2 - 3,
            width + 6,
            height + 6,
            14
          );
          ctx.stroke();
          ctx.restore();
        }

        const grad = ctx.createLinearGradient(-width / 2, 0, width / 2, 0);
        grad.addColorStop(0, "#7a4f27");
        grad.addColorStop(0.5, "#9c6b3d");
        grad.addColorStop(1, "#5a3b1a");

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.roundRect(-width / 2, -height / 2, width, height, 12);
        ctx.fill();

        ctx.font = "bold 18px 'Cormorant', serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "#f4e1c1";

        const wrapText = (text: string, maxWidth: number): string[] => {
          const words = text.split(" ");
          const lines: string[] = [];
          let currentLine = words[0];
          for (let i = 1; i < words.length; i++) {
            const testLine = currentLine + " " + words[i];
            const metrics = ctx.measureText(testLine);
            if (metrics.width > maxWidth - 20) {
              lines.push(currentLine);
              currentLine = words[i];
            } else {
              currentLine = testLine;
            }
          }
          lines.push(currentLine);
          return lines;
        };

        const lines = wrapText(title, width);
        const lineHeight = 20;
        const totalTextHeight = lines.length * lineHeight;
        const startY = -totalTextHeight / 2 + 10;

        lines.forEach((line, i) => {
          ctx.fillText(line, 0, startY + i * lineHeight);
        });

        ctx.restore();
      });

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
      {previewSignPos && (
        <AnimatePresence mode="wait">
          {selectedSkill ? (
            <motion.div
              key={selectedSkill}
              className="skill-card"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
                transition: { duration: 0.45, ease: "easeOut", delay: 0.1 },
              }}
              exit={{
                opacity: 0,
                scale: 0.9,
                y: 20,
                transition: { duration: 0.35, ease: "easeIn", delay: 0.1 },
              }}
              style={{
                left: (previewSignPos?.x ?? 0) - 165,
                top: (previewSignPos?.y ?? 0) + 10,
              }}
            >
              <div className="skill-card-header">
                <h2>{selectedSkill}</h2>
                <button
                  onClick={() => setSelectedSkill(null)}
                  className="close-btn"
                >
                  ✕
                </button>
              </div>
              <div className="skill-card-body">
                <img
                  src={skillIcons[selectedSkill]}
                  alt={selectedSkill}
                  className="skill-icon"
                />
                <p>{skillDescriptions[selectedSkill]}</p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="no-skill"
              className="skill-card no-skill"
              initial={{ opacity: 0, scale: 0.9, y: 15 }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
                transition: { duration: 0.4, ease: "easeOut", delay: 0.2 },
              }}
              exit={{
                opacity: 0,
                scale: 0.9,
                y: 15,
                transition: { duration: 0.3, ease: "easeIn", delay: 0.1 },
              }}
              style={{
                left: (previewSignPos?.x ?? 0) - 150,
                top: (previewSignPos?.y ?? 0) + 10,
              }}
            >
              <div className="no-skill-body">
                <p>No skill selected</p>
                <span className="hint">Click a bubble to learn more 🌱</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
      {/* 🎓 Hover PDF Preview Thumbnails */}
      {/* 🎓 Hover PDF Preview Thumbnails */}
      <AnimatePresence>
        {hoveredPlaque === "Ontario Advanced Diploma 2024" && (
          <motion.div
            key="diploma"
            className="pdf-preview"
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            style={{
              position: "absolute",
              left: hoveredPlaquePos.x - 125, // align under sign horizontally
              top: hoveredPlaquePos.y + 40, // slide directly below the sign
              zIndex: 20,
            }}
          >
            <motion.div
              initial={{ y: -30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -30, opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="diploma-preview-container"
            >
              <a
                href="/education/Computer Programming and Analysis - Ontario College Advanced Diploma.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="diploma-link"
              >
                <iframe
                  src="/education/Computer Programming and Analysis - Ontario College Advanced Diploma.pdf#toolbar=0&navpanes=0&scrollbar=0"
                  title="Diploma Preview"
                  className="diploma-preview"
                />
                <div className="hover-overlay">View</div>
              </a>
            </motion.div>
          </motion.div>
        )}

        {hoveredPlaque === "President’s Honour List 2023" && (
          <motion.div
            key="honour"
            className="pdf-preview"
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            style={{
              position: "absolute",
              left: hoveredPlaquePos.x - 125,
              top: hoveredPlaquePos.y + 40,
              zIndex: 20,
            }}
          >
            <motion.div
              initial={{ y: -30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -30, opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="diploma-preview-container"
            >
              <a
                href="/education/Presidents_Honour_List.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="diploma-link"
              >
                <iframe
                  src="/education/Presidents_Honour_List.pdf#toolbar=0&navpanes=0&scrollbar=0"
                  title="President’s Honour List"
                  className="diploma-preview"
                />
                <div className="hover-overlay">View</div>
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
