"use client";
import { motion } from "framer-motion";

// Generate random sub-roots along trunk:
const generateSubRoots = () => {
  const roots = [];
  for (let i = 0; i < 10; i++) {
    const y = 80 + i * 90 + Math.random() * 40; // random along trunk
    const xOffset = (Math.random() > 0.5 ? 1 : -1) * (30 + Math.random() * 40);
    roots.push({
      id: i,
      d1: `M450 ${y} C450 ${y} ${450 + xOffset} ${y + 40} ${
        450 + xOffset * 0.8
      } ${y + 80}`,
      d2: `M450 ${y} C450 ${y} ${450 + xOffset * 1.15} ${y + 45} ${
        450 + xOffset * 0.9
      } ${y + 82}`,
      delay: 0.4 + i * 0.25,
    });
  }
  return roots;
};

const subRoots = generateSubRoots();

export default function AnimatedRootSystem({ delay = 0 }) {
  return (
    <svg
      className="animated-roots-svg"
      viewBox="0 0 900 1800"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* ==========================================================
          MAIN TRUNK — With Medium Snaking Wave Motion
      ========================================================== */}
      <motion.path
        d="
          M450 0
          C450 150 460 260 450 380
          C440 520 460 700 450 900
        "
        stroke="#b17a3a"
        strokeWidth="12"
        strokeLinecap="round"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{
          pathLength: 1,
          d: [
            "M450 0 C450 150 460 260 450 380 C440 520 460 700 450 900",
            "M450 0 C465 150 430 260 470 380 C430 520 480 700 450 900",
            "M450 0 C450 150 460 260 450 380 C440 520 460 700 450 900",
          ],
        }}
        transition={{
          duration: 3.5,
          ease: "easeInOut",
          delay,
          d: {
            repeat: Infinity,
            repeatType: "mirror",
            duration: 6,
          },
        }}
      />

      {/* ==========================================================
          SIDE BRANCH — UPPER (with snaking)
      ========================================================== */}
      <motion.path
        d="
          M450 260
          C415 300 365 360 340 420
          C315 480 330 540 350 580
        "
        stroke="#a56b31"
        strokeWidth="7"
        strokeLinecap="round"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{
          pathLength: 1,
          d: [
            "M450 260 C415 300 365 360 340 420 C315 480 330 540 350 580",
            "M450 260 C410 300 360 360 335 420 C310 480 338 548 354 586",
          ],
        }}
        transition={{
          duration: 2,
          ease: "easeInOut",
          delay: delay + 1.2,
          d: { repeat: Infinity, repeatType: "mirror", duration: 4.5 },
        }}
      />

      {/* ==========================================================
          SIDE BRANCH — MIDDLE (with snaking)
      ========================================================== */}
      <motion.path
        d="
          M450 600
          C495 650 550 710 580 770
          C610 830 600 880 570 910
        "
        stroke="#a56b31"
        strokeWidth="7"
        strokeLinecap="round"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{
          pathLength: 1,
          d: [
            "M450 600 C495 650 550 710 580 770 C610 830 600 880 570 910",
            "M450 600 C500 650 555 710 585 770 C620 830 608 880 574 914",
          ],
        }}
        transition={{
          duration: 2.2,
          ease: "easeInOut",
          delay: delay + 2.1,
          d: { repeat: Infinity, repeatType: "mirror", duration: 5 },
        }}
      />

      {/* ==========================================================
          LOWER BURROW LOOP (breathing/pulse)
      ========================================================== */}
      <motion.path
        d="
          M450 900
          C350 980 340 1150 350 1280
          C360 1420 450 1500 450 1500
          C450 1500 540 1420 550 1280
          C560 1150 550 980 450 900
        "
        stroke="#b17a3a"
        strokeWidth="12"
        strokeLinecap="round"
        fill="none"
        initial={{ pathLength: 0, opacity: 0.6 }}
        animate={{
          pathLength: 1,
          opacity: [0.7, 1, 0.8, 1],
        }}
        transition={{
          duration: 3.2,
          ease: "easeInOut",
          delay: delay + 3.4,
          opacity: {
            repeat: Infinity,
            repeatType: "mirror",
            duration: 3.8,
          },
        }}
      />

      {/* ==========================================================
          RANDOM SUB-ROOT FILAMENTS (medium thickness)
      ========================================================== */}
      {subRoots.map((r) => (
        <motion.path
          key={r.id}
          d={r.d1}
          stroke="#9a652c"
          strokeWidth="4.5"
          strokeLinecap="round"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{
            pathLength: 1,
            opacity: 1,
            d: [r.d1, r.d2, r.d1],
          }}
          transition={{
            duration: 1.2,
            ease: "easeOut",
            delay: delay + r.delay,
            d: {
              repeat: Infinity,
              repeatType: "mirror",
              duration: 5 + Math.random() * 2,
            },
          }}
        />
      ))}
    </svg>
  );
}
