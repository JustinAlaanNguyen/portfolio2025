export type StopFn = () => void;

export function startAvatarVineAnimation(
  canvas: HTMLCanvasElement,
  avatarCircle: { x: number; y: number; r: number }
): StopFn {
  const ctx = canvas.getContext("2d")!;
  if (!ctx) return () => {};

  // Handle retina displays
  function resizeCanvasToDisplaySize() {
    const dpr = window.devicePixelRatio || 1;
    const width = Math.floor(canvas.clientWidth * dpr);
    const height = Math.floor(canvas.clientHeight * dpr);
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0); // Scale drawing to match CSS size
  }

  resizeCanvasToDisplaySize();
  window.addEventListener("resize", resizeCanvasToDisplaySize);

  // --- CONFIG ---
  const vineColor = "rgb(34, 139, 34)";
  const segmentLength = 2.5;
  const rnd = (a = 0, b = 1) => a + Math.random() * (b - a);

  // --- LEAF CLASS ---
  class Leaf {
    x: number;
    y: number;
    angle: number;
    currScale = 0.1;
    maxScale: number;
    delta = 0.03;
    pointShift = rnd(-15, 15);

    constructor(x: number, y: number, angle: number, scale: number) {
      this.x = x;
      this.y = y;
      this.angle = angle;
      this.maxScale = scale;
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

  // --- STATE ---
  const leaves: Leaf[] = [];
  let rafId: number | null = null;
  let angle = -Math.PI / 2; // Start from top
  const fullCircle = Math.PI * 2;
  const startAngle = angle;

  const dpr = window.devicePixelRatio || 1;
  const radius = avatarCircle.r - 77; // Slightly outside avatar border
  const centerX = avatarCircle.x + 10;
  const centerY = avatarCircle.y + 20;

  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.lineWidth = 2.5;

  // --- FRAME LOOP ---
  function frame() {
    ctx.strokeStyle = vineColor;

    const prevX = centerX + radius * Math.cos(angle);
    const prevY = centerY + radius * Math.sin(angle);

    angle += (segmentLength / radius) * rnd(0.9, 1.1);
    const newX = centerX + radius * Math.cos(angle);
    const newY = centerY + radius * Math.sin(angle);

    ctx.beginPath();
    ctx.moveTo(prevX, prevY);
    ctx.lineTo(newX, newY);
    ctx.stroke();

    if (Math.random() < 0.05) {
      const leafAngle = angle + rnd(-Math.PI / 4, Math.PI / 4);
      leaves.push(new Leaf(newX, newY, leafAngle, rnd(0.7, 1.2)));
    }

    for (const l of leaves) l.draw();

    if (angle - startAngle < fullCircle) {
      rafId = requestAnimationFrame(frame);
    } else {
      cancelAnimationFrame(rafId!);
    }
  }

  rafId = requestAnimationFrame(frame);

  return () => {
    if (rafId) cancelAnimationFrame(rafId);
    window.removeEventListener("resize", resizeCanvasToDisplaySize);
  };
}
