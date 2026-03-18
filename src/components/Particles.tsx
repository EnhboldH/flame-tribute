"use client";

import { useEffect, useRef } from "react";

export default function Particles() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    for (let i = 0; i < 25; i++) {
      const p = document.createElement("div");
      p.classList.add("particle");
      p.style.left = Math.random() * 100 + "%";
      p.style.animationDuration = 15 + Math.random() * 25 + "s";
      p.style.animationDelay = Math.random() * 20 + "s";
      const size = 1 + Math.random() * 2 + "px";
      p.style.width = size;
      p.style.height = size;
      p.style.opacity = String(0.05 + Math.random() * 0.12);
      container.appendChild(p);
    }

    return () => {
      container.innerHTML = "";
    };
  }, []);

  return <div ref={containerRef} className="particles" />;
}
