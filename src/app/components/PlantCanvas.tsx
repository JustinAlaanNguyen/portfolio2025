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
  const [circleTip2, setCircleTip2] = useState<{ x: number; y: number } | null>(
    null
  );
  const [circleTip3, setCircleTip3] = useState<{ x: number; y: number } | null>(
    null
  );
  const [circleTip4, setCircleTip4] = useState<{ x: number; y: number } | null>(
    null
  );

  const [showAbout, setShowAbout] = useState(false);
  const [showEducation, setShowEducation] = useState(false);
  const [showProjects, setShowProjects] = useState(false);
  const [showContact, setShowContact] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

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
        this.popDuration = 25 + rand() * 10;
      }

      draw() {
        const t = Math.min(this.age / this.popDuration, 1);
        const eased =
          t < 0.4
            ? 0.9 + (t * (1.15 - 0.9)) / 0.4
            : 1.15 - ((t - 0.4) * (1.15 - 1)) / 0.6;

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
      frozen = false;
      isCircleBranch?: boolean;
      finished = false;
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
      }

      draw() {
        if (this.isCircleBranch) {
          if (!this.finished && this.life >= this.lifetime) {
            this.finished = true;
          }
        }

        if (this.frozen) {
          for (const child of this.children) {
            child.draw();
          }
          return;
        }

        const doneGrowing = this.life >= this.lifetime;

        if (!doneGrowing && !this.frozen) {
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

          const step = this.isCircleBranch ? 3 : 3.5;
          this.x += Math.cos(this.swing) * step;
          this.y += Math.sin(this.swing) * step;

          if (this.isCircleBranch) {
            this.tipX = this.x;
            this.tipY = this.y;
            const straightPhase = 0.4;
            const progress = this.life / this.lifetime;
            if (progress < straightPhase) {
              this.swing = this.trending;
            } else {
              const curveProgress =
                (progress - straightPhase) / (1 - straightPhase);
              const curvature = Math.PI * 2 * curveProgress;
              this.swing = this.trending - curvature;
            }
          } else {
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

          if (
            this.isCircleBranch &&
            !this.finished &&
            this.life >= this.lifetime
          ) {
            this.finished = true;
          }

          if (
            !this.isCircleBranch &&
            this.depth < 2 &&
            !this.hasBranchedAtTop
          ) {
            const trunkDelay =
              this.depth === 0 ? this.lifetime * 0.35 : this.lifetime * 0.25;

            if (this.life >= trunkDelay) {
              this.hasBranchedAtTop = true;

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

          const isLeafBranch =
            this.width <= 2 || (this.depth >= 1 && this.width <= 6);
          if (isLeafBranch && rand() < 0.25) {
            const leafStyles = ["#1f801f", "#259925", "#2bb32b", "#32cd32"];
            const color = leafStyles[Math.floor(rand() * leafStyles.length)];
            const angle1 = this.swing + (rand() - 0.5) * 1.2;
            const angle2 = angle1 + Math.PI;
            const sizeScale = this.isCircleBranch ? 0.2 : 1;
            this.leaves.push(
              new Leaf(this.x, this.y, angle1, color, sizeScale)
            );
            this.leaves.push(
              new Leaf(this.x, this.y, angle2, color, sizeScale)
            );
          }
        }

        for (let i = this.children.length - 1; i >= 0; i--) {
          this.children[i].draw();
          if (this.children[i].life >= this.children[i].lifetime) {
            this.children.splice(i, 1);
          }
        }

        for (const leaf of this.leaves) leaf.draw();
      }
    }

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

    let circleBranch: Branch | null = null;
    let circleBranch2: Branch | null = null;
    let circleBranch3: Branch | null = null;
    let circleBranch4: Branch | null = null;

    const freezeAllBranches = (branch: Branch) => {
      branch.frozen = true;
      for (const child of branch.children) freezeAllBranches(child);
    };

    let animationId: number;

    const draw = () => {
      mainBranch.draw();

      if (circleBranch && circleBranch.finished && !showAbout) {
        if (circleBranch.tipX && circleBranch.tipY) {
          setCircleTip({ x: circleBranch.tipX, y: circleBranch.tipY });
          setShowAbout(true);
        }
      }
      if (circleBranch2 && circleBranch2.finished && !showEducation) {
        if (circleBranch2.tipX && circleBranch2.tipY) {
          setCircleTip2({ x: circleBranch2.tipX, y: circleBranch2.tipY });
          setShowEducation(true);
        }
      }
      if (circleBranch3 && circleBranch3.finished && !showProjects) {
        if (circleBranch3.tipX && circleBranch3.tipY) {
          setCircleTip3({ x: circleBranch3.tipX, y: circleBranch3.tipY });
          setShowProjects(true);
        }
      }
      if (circleBranch4 && circleBranch4.finished && !showContact) {
        if (circleBranch4.tipX && circleBranch4.tipY) {
          setCircleTip4({ x: circleBranch4.tipX, y: circleBranch4.tipY });
          setShowContact(true);
        }
      }

      const remaining = mainBranch.lifetime - mainBranch.life;
      if (!showText && remaining < 60) setShowText(true);

      if (
        !extraBranchSpawned.current &&
        mainBranch.life >= mainBranch.lifetime
      ) {
        extraBranchSpawned.current = true;
        const spawnX = startX;
        const spawnY = startY - canvas.height * 0.3;

        const angleLeft1 = -Math.PI * 0.85 + (rand() - 0.5) * 0.15;
        const angleRight1 = -Math.PI * 0.1 + (rand() - 0.5) * 0.15;
        const angleLeft2 = -Math.PI * 1 + (rand() - 0.5) * 0.15;
        const angleRight2 = Math.PI * 0.1 + (rand() - 0.5) * 0.15;

        const leftBranch1 = new Branch(
          spawnX,
          spawnY,
          angleLeft1,
          mainBranch.lifetime * 1.2,
          mainBranch.startWidth * 0.2,
          1
        );
        const rightBranch1 = new Branch(
          spawnX,
          spawnY,
          angleRight1,
          mainBranch.lifetime * 1.2,
          mainBranch.startWidth * 0.2,
          1
        );
        const leftBranch2 = new Branch(
          spawnX,
          spawnY,
          angleLeft2,
          mainBranch.lifetime * 1.15,
          mainBranch.startWidth * 0.17,
          1
        );
        const rightBranch2 = new Branch(
          spawnX,
          spawnY,
          angleRight2,
          mainBranch.lifetime * 1.15,
          mainBranch.startWidth * 0.17,
          1
        );

        leftBranch1.isCircleBranch = true;
        rightBranch1.isCircleBranch = true;
        leftBranch2.isCircleBranch = true;
        rightBranch2.isCircleBranch = true;

        for (const child of mainBranch.children) freezeAllBranches(child);
        mainBranch.children = [
          leftBranch1,
          rightBranch1,
          leftBranch2,
          rightBranch2,
        ];

        circleBranch = leftBranch1;
        circleBranch2 = rightBranch1;
        circleBranch3 = leftBranch2;
        circleBranch4 = rightBranch2;
      }

      animationId = requestAnimationFrame(draw);
    };

    draw();

    // ✅ Cleanup on unmount
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="plant-container">
      <canvas ref={canvasRef} className="plant-canvas" />

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

      {showAbout && circleTip && (
        <a
          href="/about"
          className="about-btn"
          style={{
            position: "absolute",
            left: `${(circleTip.x / window.innerWidth) * 100 - 2.2}vw`,
            top: `${(circleTip.y / window.innerHeight) * 100 + 8.2}vh`,
            transform: "translate(-50%, -50%)",
          }}
        >
          About Me
        </a>
      )}

      {showEducation && circleTip2 && (
        <a
          href="/skills"
          className="about-btn"
          style={{
            position: "absolute",
            left: `${(circleTip2.x / window.innerWidth) * 100 - 1.13}vw`,
            top: `${(circleTip2.y / window.innerHeight) * 100 - 9.2}vh`,
            transform: "translate(-50%, -50%)",
          }}
        >
          Skills
        </a>
      )}

      {showProjects && circleTip3 && (
        <a
          href="/projects"
          className="about-btn"
          style={{
            position: "absolute",
            left: `${(circleTip3.x / window.innerWidth) * 100 + 0}vw`,
            top: `${(circleTip3.y / window.innerHeight) * 100 + 9.2}vh`,
            transform: "translate(-50%, -50%)",
          }}
        >
          Projects
        </a>
      )}

      {showContact && circleTip4 && (
        <a
          href="/contact"
          className="about-btn"
          style={{
            position: "absolute",
            left: `${(circleTip4.x / window.innerWidth) * 100 + 1.4}vw`,
            top: `${(circleTip4.y / window.innerHeight) * 100 - 8.5}vh`,
            transform: "translate(-50%, -50%)",
          }}
        >
          Contact
        </a>
      )}
    </div>
  );
}
