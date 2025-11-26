"use client";
import "./projects.css";
import AnimatedRootSystem from "@/app/components/AnimatedRootSystem";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function ProjectsPage() {
  const router = useRouter();

  const projects = [
    {
      title: "Treasure Tracker",
      description: "A tool for storing and organizing personal goals.",
      icon: "/projects/icons/treasure.png",
    },
    {
      title: "Eco Planner",
      description: "A nature-inspired productivity and planning app.",
      icon: "/projects/icons/leaf.png",
    },
    {
      title: "System Builder",
      description: "Automation and task system built for speed.",
      icon: "/projects/icons/gear.png",
    },
    {
      title: "LaunchPad",
      description: "A starter template for rapid deployment.",
      icon: "/projects/icons/rocket.png",
    },
  ];

  return (
    <div className="projects-page">
      {/* SKY & TITLE */}
      <div className="projects-sky">
        <img
          src="/projects/projects.png"
          alt="Projects"
          className="projects-title-img"
        />

        {/* Fireflies */}
        <div className="fireflies">
          <div className="firefly"></div>
          <div className="firefly"></div>
          <div className="firefly"></div>
          <div className="firefly"></div>
          <div className="firefly"></div>
          <div className="firefly"></div>
          <div className="firefly"></div>
          <div className="firefly"></div>
          <div className="firefly"></div>
          <div className="firefly"></div>
          <div className="firefly"></div>
          <div className="firefly"></div>
        </div>
      </div>

      {/* UNDERGROUND AREA */}
      <div className="projects-underground">
        <div className="projects-root-container">
          <div className="root-left">
            <AnimatedRootSystem delay={0} />
          </div>

          <div className="root-right">
            <AnimatedRootSystem delay={0.2} />
          </div>
        </div>

        <div className="burrow-grid">
          {projects.map((proj, index) => (
            <motion.div
              key={index}
              className="burrow"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
            >
              <div className="burrow-card">
                <img src={proj.icon} className="burrow-icon" alt="icon" />
                <h2>{proj.title}</h2>
                <p>{proj.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* BACK BUTTON */}
        <motion.button
          onClick={() => router.push("/")}
          className="projects-back-button"
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
