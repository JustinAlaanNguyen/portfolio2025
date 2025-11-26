"use client";
import "../skills/skills.css";
import RootsCanvas from "@/app/components/RootsCanvas";
import { PreviewProvider } from "@/app/context/PreviewContext";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function SkillsPage() {
  const router = useRouter();

  return (
    <div className="skills-page">
      {/* Floating title image */}
      <div className="skills-title-wrapper">
        <img
          src="/myskill/myskill.png"
          alt="My Skills"
          className="skills-title-image"
        />
      </div>

      {/* SKY LAYER WITH CLOUDS */}
      <div className="skills-surface">
        <div id="background-wrap">
          <div className="x1">
            <div className="cloud"></div>
          </div>
          <div className="x2">
            <div className="cloud"></div>
          </div>
          <div className="x3">
            <div className="cloud"></div>
          </div>
          <div className="x4">
            <div className="cloud"></div>
          </div>
          <div className="x5">
            <div className="cloud"></div>
          </div>
        </div>
      </div>

      {/* UNDERGROUND LAYER */}
      <div className="skills-underground">
        <PreviewProvider>
          <RootsCanvas />
        </PreviewProvider>

        {/* Back Button */}
        <motion.button
          onClick={() => router.push("/")}
          className="about-back-button skills-back-button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
        >
          <span>BACK TO TREE</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 1.3, ease: "easeInOut" }}
            className="arrow"
          >
            ︾
          </motion.div>
        </motion.button>
      </div>
    </div>
  );
}
