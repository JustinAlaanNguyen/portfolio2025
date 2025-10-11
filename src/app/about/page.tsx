"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { startAvatarVineAnimation } from "./AvatarVineAnimation";
import { startVineAnimation } from "./VineAnimation";
import "../about.css"; // ✅ Import your CSS file

export default function AboutPage() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const avatarRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!canvasRef.current || !avatarRef.current) return;

    let initialized = false;
    let stopBorderVine: (() => void) | null = null;
    let stopBackgroundVine: (() => void) | null = null;

    const startAnimations = () => {
      if (initialized) return;
      initialized = true;

      if (!canvasRef.current || !avatarRef.current) return;
      const canvas = canvasRef.current;
      const avatarRect = avatarRef.current.getBoundingClientRect();
      const canvasRect = canvas.getBoundingClientRect();

      // Manual tweak to align vine ring
      const manualNudge = { dx: 14, dy: -28 };

      const x =
        avatarRect.left -
        canvasRect.left +
        avatarRect.width / 2 +
        manualNudge.dx;
      const y =
        avatarRect.top -
        canvasRect.top +
        avatarRect.height / 2 +
        manualNudge.dy;
      const r = avatarRect.width / 2;

      stopBackgroundVine = startVineAnimation(canvas, { x, y, r });
      stopBorderVine = startAvatarVineAnimation(canvas, { x, y, r });
    };

    // ✅ Wait until layout is fully painted and animations settle
    const delay = setTimeout(() => {
      requestAnimationFrame(startAnimations);
    }, 400); // 300–500ms gives layout time to stabilize

    return () => {
      clearTimeout(delay);
      if (stopBorderVine) stopBorderVine();
      if (stopBackgroundVine) stopBackgroundVine();
    };
  }, []);

  return (
    <motion.div
      className="about-container"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{
        duration: 1.2,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      <div className="about-background" />
      <canvas ref={canvasRef} className="about-canvas" />
      <div className="about-overlay" />

      <motion.div
        className="about-content"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: "easeOut", delay: 0.4 }}
      >
        {/* Title */}
        <motion.div
          className="about-title-wrapper"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: { staggerChildren: 0.07, delayChildren: 0.3 },
            },
          }}
        >
          <h1 className="about-title">
            {"Justin Alaan-Nguyen".split("").map((char, i) => (
              <motion.span
                key={i}
                className="inline-block origin-left"
                variants={{
                  hidden: {
                    opacity: 0,
                    scaleX: 0,
                    transformOrigin: "0% 50%", // Grow from left edge
                  },
                  visible: {
                    opacity: 1,
                    scaleX: 1,
                    transition: {
                      duration: 0.6,
                      ease: [0.16, 1, 0.3, 1],
                      delay: i * 0.08, // letter delay
                    },
                  },
                }}
                style={{
                  display: "inline-block",
                  transformOrigin: "0% 50%", // ensures growth from left
                }}
              >
                {char === " " ? "\u00A0" : char}
              </motion.span>
            ))}
          </h1>

          <motion.div
            className="about-underline"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
          />
        </motion.div>

        {/* Avatar */}
        <motion.div
          ref={avatarRef} // ✅ ADD THIS
          className="about-avatar"
          whileHover={{ scale: 1.05, rotate: 0.5 }}
          transition={{ type: "spring", stiffness: 200 }}
        >
          <div className="about-avatar-inner">
            <img src="/avatar.png" alt="Avatar" className="about-avatar-img" />
          </div>
        </motion.div>

        {/* Description Card */}
        <motion.div
          className="about-card"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 1.2, ease: "easeOut" }}
        >
          <h2 className="about-role">Front-End Developer</h2>
          <p className="about-description">
            I’m passionate about crafting intuitive, elegant interfaces that
            feel both alive and effortless. Inspired by nature’s balance, I
            blend structure with creativity — turning ideas into warm, living
            digital experiences. When I’m not coding, I’m sketching interface
            ideas, exploring cozy cafés, or experimenting with color and motion.
          </p>
        </motion.div>
        {/* Back Button */}
        <motion.button
          onClick={() => router.push("/")}
          className="w-full mt-16 py-14 flex flex-col items-center justify-center space-y-3 bg-transparent backdrop-blur-sm hover:bg-green-500/10 transition-all duration-700 outline-none focus:outline-none ring-0 border-none shadow-none"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
        >
          <h1 className="text-6xl font-extrabold tracking-[0.15em] text-green-100 drop-shadow-[0_0_12px_rgba(34,197,94,0.3)]">
            BACK TO TOWER
          </h1>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 1.4, ease: "easeInOut" }}
            className="text-green-300 text-5xl select-none"
          >
            ︾
          </motion.div>
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
