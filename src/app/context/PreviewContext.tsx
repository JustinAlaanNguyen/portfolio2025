"use client";
import { createContext, useContext, useState, ReactNode } from "react";

interface PreviewPosition {
  x: number;
  y: number;
}

interface PreviewContextType {
  previewSignPos: PreviewPosition | null;
  setPreviewSignPos: (pos: PreviewPosition | null) => void;
  selectedSkill: string | null;
  setSelectedSkill: React.Dispatch<React.SetStateAction<string | null>>;
  skillDescriptions: Record<string, string>;
  skillIcons: Record<string, string>;
}

const PreviewContext = createContext<PreviewContextType | undefined>(undefined);

export function PreviewProvider({ children }: { children: ReactNode }) {
  const [previewSignPos, setPreviewSignPos] = useState<PreviewPosition | null>(
    null
  );
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);

  // === 🌿 Skill Descriptions ===
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

  // === 🌿 Skill Icons ===
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

  return (
    <PreviewContext.Provider
      value={{
        previewSignPos,
        setPreviewSignPos,
        selectedSkill,
        setSelectedSkill,
        skillDescriptions,
        skillIcons,
      }}
    >
      {children}
    </PreviewContext.Provider>
  );
}

export function usePreview() {
  const context = useContext(PreviewContext);
  if (!context)
    throw new Error("usePreview must be used within a PreviewProvider");
  return context;
}
