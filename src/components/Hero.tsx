"use client";

import HeroCanvas from "./HeroCanvas";
import KheeUgalz from "./KheeUgalz";

export default function Hero() {
  const handleCta = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    document.getElementById("stories")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="hero" id="hero">
      <div className="hero-bg">
        <HeroCanvas />
      </div>
      <div className="hero-gradient" />
      <div className="hero-wind-texture" />

      <div className="hero-content">
        <div className="hero-line" />
        <h1>
          Each flame holds power.
          <br />
          <em>Together, they conquer</em>
        </h1>
      </div>

      <KheeUgalz variant="mountains" className="hero-mountains" />

      <div className="scroll-hint">
        <span />
      </div>
    </section>
  );
}
