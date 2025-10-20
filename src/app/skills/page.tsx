"use client";
import "../skills/skills.css";
import RootsCanvas from "@/app/components/RootsCanvas";

export default function SkillsPage() {
  return (
    <div className="skills-page">
      <div className="skills-surface">
        <h1 className="skills-title">My Skills</h1>
      </div>

      <div className="skills-underground">
        <RootsCanvas />
      </div>
    </div>
  );
}
