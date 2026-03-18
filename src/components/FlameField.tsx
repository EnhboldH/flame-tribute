"use client";

import { useEffect, useRef, useMemo } from "react";
import { colleagues } from "@/data/colleagues";

function seededRandom(seed: number) {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return x - Math.floor(x);
}

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

interface Props {
  selectedIndex: number | null;
  overlayOpen: boolean;
}

export default function FlameField({ selectedIndex, overlayOpen }: Props) {
  const flameRefs = useRef<(HTMLDivElement | null)[]>([]);
  const animRef = useRef<number>(0);

  const configs = useMemo(() => {
    const total = colleagues.length;
    const rings = [
      { count: 10, radius: 0.17 },
      { count: 14, radius: 0.27 },
      { count: 10, radius: 0.36 },
    ];

    let flameIndex = 0;
    const items: {
      angle: number;
      ringRadius: number;
      orbitRadius: number;
      orbitSpeed: number;
      phase: number;
      depth: number;
      size: number;
    }[] = [];

    for (const ring of rings) {
      for (let j = 0; j < ring.count && flameIndex < total; j++, flameIndex++) {
        items.push({
          angle: (j / ring.count) * Math.PI * 2,
          ringRadius: ring.radius,
          orbitRadius: 6 + seededRandom(flameIndex * 3 + 2) * 12,
          orbitSpeed: 0.00012 + seededRandom(flameIndex * 7) * 0.00025,
          phase: seededRandom(flameIndex * 11) * Math.PI * 2,
          depth: 0.85 + seededRandom(flameIndex * 13) * 0.3,
          size: 52,
        });
      }
    }
    return items;
  }, []);

  useEffect(() => {
    if (selectedIndex === null) return;
    const el = flameRefs.current[selectedIndex];
    if (!el) return;
    el.classList.add("flame-pulse");
    const timer = setTimeout(() => el.classList.remove("flame-pulse"), 700);
    return () => clearTimeout(timer);
  }, [selectedIndex]);

  useEffect(() => {
    let cardEls: HTMLElement[] = [];

    function queryCards() {
      const els = document.querySelectorAll<HTMLElement>("[data-flame-index]");
      cardEls = Array.from(els).sort(
        (a, b) => Number(a.dataset.flameIndex) - Number(b.dataset.flameIndex)
      );
    }

    const t1 = setTimeout(queryCards, 100);
    const t2 = setTimeout(queryCards, 800);
    window.addEventListener("resize", queryCards);

    function animate(time: number) {
      const scrollY = window.scrollY;
      const vh = window.innerHeight;
      const vw = window.innerWidth;

      const heroHeight = vh;
      const gridTopEstimate = heroHeight + 180;
      const transStart = heroHeight * 0.15;
      const transEnd = gridTopEstimate + vh * 0.15;
      const rawProgress = (scrollY - transStart) / (transEnd - transStart);
      const progress = Math.max(0, Math.min(1, rawProgress));
      const ep = easeInOutCubic(progress);

      configs.forEach((cfg, i) => {
        const el = flameRefs.current[i];
        if (!el) return;

        const orbitDampen = 1 - ep;
        const cx = vw / 2;
        const cy = vh / 2;
        const minDim = Math.min(vw, vh);
        const ringR = cfg.ringRadius * minDim;
        const ringRotation = time * cfg.orbitSpeed * 0.3;
        const baseAngle = cfg.angle + ringRotation;

        const hx =
          cx +
          Math.cos(baseAngle) * ringR +
          Math.cos(time * cfg.orbitSpeed + cfg.phase) * cfg.orbitRadius * orbitDampen;
        const hy =
          cy +
          Math.sin(baseAngle) * ringR +
          Math.sin(time * cfg.orbitSpeed * 0.7 + cfg.phase) * cfg.orbitRadius * 0.6 * orbitDampen;

        let tx = hx;
        let ty = hy;

        const cardEl = cardEls[i];
        if (cardEl) {
          const rect = cardEl.getBoundingClientRect();
          const cvx = rect.left + rect.width / 2;
          const cvy = rect.top + rect.height / 2;
          tx = hx + (cvx - hx) * ep;
          ty = hy + (cvy - hy) * ep;
        }

        const parallaxY = scrollY * (1 - cfg.depth) * 0.2 * orbitDampen;
        const fx = tx - cfg.size / 2;
        const fy = ty - cfg.size / 2 + parallaxY;

        const heroScale = 1.0;
        const cardScale = 0;
        const scale = heroScale + (cardScale - heroScale) * ep;

        const breathe =
          ep > 0.8
            ? 1 + Math.sin(time * 0.0008 + cfg.phase) * 0.03 * ep
            : 1;

        const opacity = ep > 0.85 ? Math.max(0, 1 - (ep - 0.85) / 0.15) : 0.85;

        el.style.transform = `translate3d(${fx}px, ${fy}px, 0) scale(${scale * breathe})`;
        el.style.opacity = String(opacity);
      });

      animRef.current = requestAnimationFrame(animate);
    }
    animRef.current = requestAnimationFrame(animate);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      window.removeEventListener("resize", queryCards);
      cancelAnimationFrame(animRef.current);
    };
  }, [configs]);

  return (
    <div className={`flame-field ${overlayOpen ? "dimmed" : ""}`}>
      {colleagues.map((c, i) => (
        <div
          key={c.name}
          ref={(el) => { flameRefs.current[i] = el; }}
          className={`flame-element ${selectedIndex === i ? "flame-selected" : ""}`}
          style={{
            "--flame-size": `${configs[i].size}px`,
            "--flame-delay": `${seededRandom(i * 23) * 4}s`,
            "--color-from": c.colors[0],
            "--color-to": c.colors[1],
            "--gradient-angle": `${c.gradientAngle}deg`,
          } as React.CSSProperties}
        >
          <div className="flame-body">
            <div className="flame-core" />
            <div className="flame-glow" />
          </div>
        </div>
      ))}
    </div>
  );
}
