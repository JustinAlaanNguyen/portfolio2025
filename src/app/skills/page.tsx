"use client";
import "../skills/skills.css";
import RootsCanvas from "@/app/components/RootsCanvas";
import { PreviewProvider } from "@/app/context/PreviewContext";

export default function SkillsPage() {
  return (
    <div className="skills-page">
      <div className="skills-surface">
        <div className="skills-surface">
          <img
            src="/myskill/myskill.png"
            alt="My Skills"
            className="skills-title-image"
          />
        </div>
      </div>

      <div className="skills-underground">
        <PreviewProvider>
          <RootsCanvas />
        </PreviewProvider>
      </div>
    </div>
  );
}
