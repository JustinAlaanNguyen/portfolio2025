import Sky from "./components/Sky";
import PlantCanvas from "./components/PlantCanvas";
import "./home.css";

export default function HomePage() {
  return (
    <main className="home-page">
      {/* 🌌 Sky background layer */}
      <Sky />

      {/* 🌿 Foreground content */}
      <div className="content">
        <PlantCanvas />
      </div>
    </main>
  );
}
