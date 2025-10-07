// src/app/about/VineAnimation.ts
export type StopFn = () => void;

export function startVineAnimation(
  canvas: HTMLCanvasElement,
  avatarCircle?: { x: number; y: number; r: number }
): StopFn {
  const ctx = canvas.getContext("2d")!;
  if (!ctx) return () => {};

  function resizeCanvasToDisplaySize() {
    const dpr = window.devicePixelRatio || 1;
    const width = Math.floor(canvas.clientWidth * dpr);
    const height = Math.floor(canvas.clientHeight * dpr);
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }
  }

  resizeCanvasToDisplaySize();
  window.addEventListener("resize", resizeCanvasToDisplaySize);

  // CONFIG
  const spawnTime = 100;
  const deltaMs = 15;
  const vineColor = "rgb(34, 139, 34)";
  const rnd = (a = 0, b = 1) => a + Math.random() * (b - a);

  // ---------------------------
  // Leaf class
  // ---------------------------
  class Leaf {
    x: number;
    y: number;
    angle: number;
    maxScale: number;
    currScale: number;
    delta: number;
    pointShift: number;

    constructor(x: number, y: number, angle: number, scale: number) {
      this.x = x;
      this.y = y;
      this.angle = angle;
      this.maxScale = scale;
      this.currScale = 0.1;
      this.delta = 0.03;
      this.pointShift = rnd(-20, 20);
    }

    draw() {
      if (this.currScale <= this.maxScale) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.scale(this.currScale, this.currScale);
        ctx.fillStyle = vineColor;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(
          10,
          -15,
          40 + this.pointShift,
          -5 + this.pointShift / 2,
          50 + this.pointShift,
          0
        );
        ctx.bezierCurveTo(40 + this.pointShift, 10, 10, 25, 0, 0);
        ctx.fill();
        ctx.restore();

        this.currScale += this.delta;
      }
    }
  }

  // ---------------------------
  // Vine class
  // ---------------------------
  class Vine {
    x: number;
    y: number;
    rad: number;
    angle: number;
    dirX = 0;
    dirY = 0;
    previousTime = 0;
    delta = deltaMs;
    turnLeft = Math.random() > 0;

    constructor(x: number, y: number, angle?: number, rad = 20) {
      this.x = x;
      this.y = y;
      this.angle = angle ?? 0;
      this.rad = rad;
    }

    done() {
      return this.rad < 1;
    }

    spawn(): Vine | null {
      if (this.rad > 5) {
        const ran = rnd(-1, 1);
        const left = ran >= 0;
        const newAngle = left
          ? rnd(this.angle - Math.PI / 4, this.angle - Math.PI / 8)
          : rnd(this.angle + Math.PI / 8, this.angle + Math.PI / 4);
        return new Vine(this.x, this.y, newAngle, Math.min(this.rad, 5));
      }
      return null;
    }

    draw(now: number) {
      if (!this.previousTime) this.previousTime = now;
      if (now - this.previousTime > this.delta) {
        this.previousTime = now;

        ctx.fillStyle = vineColor;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.rad / 2, 0, Math.PI * 2);
        ctx.fill();

        // Movement
        const wave = 2 * Math.sin(0.03 * (this.y - canvas.height));
        const vx = wave;
        const vy = -this.rad / 3;
        const cosA = Math.cos(this.angle);
        const sinA = Math.sin(this.angle);
        this.dirX = vx * cosA - vy * sinA;
        this.dirY = vx * sinA + vy * cosA;

        // 🌿 NEW: Avatar avoidance behavior
        if (avatarCircle) {
          const dx = this.x - avatarCircle.x;
          const dy = this.y - avatarCircle.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const safeDist = avatarCircle.r + 20;

          if (dist < safeDist) {
            // Turn slightly away from avatar center
            const avoidAngle = Math.atan2(dy, dx);
            // Blend away from the avatar smoothly
            this.angle = this.angle * 0.8 + avoidAngle * 0.2;
          }
        }

        // Apply direction and reduce radius
        this.x += this.dirX;
        this.y += this.dirY;
        this.rad += rnd(-0.4, 0.2);
      }
    }
  }

  // ---------------------------
  // State
  // ---------------------------
  let vines: Vine[] = [];
  let leaves: Leaf[] = [];

  function initVines() {
    vines = [];
    leaves = [];
    const w = canvas.width;
    const h = canvas.height;
    const side = Math.floor(rnd(0, 3));
    let x = 0,
      y = 0,
      angle = 0;

    if (side === 0) {
      x = rnd(10, w - 10);
      y = h + 10;
      angle = rnd(-Math.PI / 3, Math.PI / 3);
    } else if (side === 1) {
      x = 10;
      y = rnd(30, h - 30);
      angle = rnd(-Math.PI / 6, Math.PI / 6);
   } else {
        x = w - 10;
        y = rnd(30, h - 30);
        angle = rnd(Math.PI * (5 / 6), Math.PI * (7 / 6)) - Math.PI;
      }


    vines.push(new Vine(x, y, angle, 20));
  }

  initVines();
  let prevSpawnTime = performance.now();
  let rafId: number | null = null;

  function frame(now: number) {
    for (const v of vines) v.draw(now);

    if (now - prevSpawnTime > spawnTime) {
      prevSpawnTime = now;
      const candidate = vines[0]?.spawn();
      if (candidate) vines.push(candidate);
    }

    for (let i = vines.length - 1; i >= 0; i--) {
      const v = vines[i];
      if (v.done()) {
        leaves.push(new Leaf(v.x, v.y, Math.atan2(v.dirY, v.dirX), rnd(0.7, 1.2)));
        vines.splice(i, 1);
        break;
      }
    }

    for (const l of leaves) l.draw();
    if (vines.length === 0) initVines();
    rafId = requestAnimationFrame(frame);
  }

  rafId = requestAnimationFrame(frame);

  return () => {
    if (rafId) cancelAnimationFrame(rafId);
    window.removeEventListener("resize", resizeCanvasToDisplaySize);
  };
}
