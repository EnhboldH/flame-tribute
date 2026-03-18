"use client";

import HeroCanvas from "./HeroCanvas";
export default function Hero() {
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

      <div className="hero-mountains" />

      <div className="scroll-hint">
        <span />
      </div>
    </section>
  );
}
