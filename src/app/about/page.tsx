"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { startAvatarVineAnimation } from "./AvatarVineAnimation";
import { startVineAnimation } from "./VineAnimation";
import "../about.css";

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

      const manualNudge = { dx: 10, dy: -20 };
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

    const delay = setTimeout(() => {
      requestAnimationFrame(startAnimations);
    }, 400);

    return () => {
      clearTimeout(delay);
      stopBorderVine?.();
      stopBackgroundVine?.();
    };
  }, []);

  return (
    <motion.div
      className="about-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Background Layers */}
      <div className="about-background" />
      <canvas ref={canvasRef} className="about-canvas" />
      <div className="about-overlay" />

      {/* Content Split Layout */}
      <div className="about-content-wrapper">
        {/* Left Side - Avatar + Vines */}
        <motion.div
          ref={avatarRef}
          className="about-avatar-section"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <div className="about-avatar-inner">
            <img src="/avatar.png" alt="Avatar" className="about-avatar-img" />
          </div>
        </motion.div>

        {/* Right Side - Text */}
        <motion.div
          className="about-text-section"
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <motion.h1
            className="about-title"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: {
                transition: { staggerChildren: 0.05, delayChildren: 0.2 },
              },
            }}
          >
            {"Justin Alaan-Nguyen".split("").map((char, i) => (
              <motion.span
                key={i}
                className="inline-block"
                variants={{
                  hidden: { opacity: 0, scaleX: 0 },
                  visible: {
                    opacity: 1,
                    scaleX: 1,
                    transition: {
                      duration: 0.4,
                      ease: [0.16, 1, 0.3, 1],
                      delay: i * 0.05,
                    },
                  },
                }}
                style={{ display: "inline-block" }}
              >
                {char === " " ? "\u00A0" : char}
              </motion.span>
            ))}
          </motion.h1>

          <motion.div
            className="about-underline"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
          />

          <h2 className="about-role">Front-End Developer</h2>
          <p className="about-description">
            I craft interactive, nature-inspired interfaces that feel alive and
            intuitive. My focus is on blending structure with creativity —
            transforming digital spaces into warm, breathing experiences. When
            I’m not coding, you’ll find me sketching UI ideas, exploring cozy
            cafés, or experimenting with color and motion.
          </p>

          <motion.button
            onClick={() => router.push("/")}
            className="about-back-button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
          >
            <span>BACK TO TOWER</span>
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{
                repeat: Infinity,
                duration: 1.3,
                ease: "easeInOut",
              }}
              className="arrow"
            >
              ︾
            </motion.div>
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
}
