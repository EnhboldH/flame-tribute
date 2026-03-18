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
  const glowRefs = useRef<(HTMLDivElement | null)[]>([]);
  const animRef = useRef<number>(0);

  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  const configs = useMemo(() => {
    const total = colleagues.length;
    const mobile = typeof window !== "undefined" && window.innerWidth < 768;
    const rings = mobile
      ? [
          { count: 10, radius: 0.14 },
          { count: 14, radius: 0.22 },
          { count: 10, radius: 0.30 },
        ]
      : [
          { count: 10, radius: 0.17 },
          { count: 14, radius: 0.27 },
          { count: 10, radius: 0.36 },
        ];

    const ringSpeeds = [0.00008, -0.00006, 0.00005];
    const ringTilts = [0.55, 0.4, 0.3];

    let flameIndex = 0;
    const items: {
      angle: number;
      ringRadius: number;
      ringSpeed: number;
      ringTilt: number;
      wobbleSpeed: number;
      wobbleRadius: number;
      phase: number;
      depth: number;
      size: number;
    }[] = [];

    for (let r = 0; r < rings.length; r++) {
      const ring = rings[r];
      for (let j = 0; j < ring.count && flameIndex < total; j++, flameIndex++) {
        items.push({
          angle: (j / ring.count) * Math.PI * 2,
          ringRadius: ring.radius,
          ringSpeed: ringSpeeds[r],
          ringTilt: ringTilts[r],
          wobbleSpeed: 0.0003 + seededRandom(flameIndex * 7) * 0.0004,
          wobbleRadius: mobile ? 2 : 3 + seededRandom(flameIndex * 3 + 2) * 6,
          phase: seededRandom(flameIndex * 11) * Math.PI * 2,
          depth: 0.85 + seededRandom(flameIndex * 13) * 0.3,
          size: mobile ? 10 : 52,
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
    let startTime = -1;
    const INTRO_DURATION = 5000;

    // Cache card positions as PAGE-relative (stable, don't change with scroll)
    let cachedRects: { pageX: number; pageY: number; w: number; h: number }[] = [];

    function queryCards() {
      const els = document.querySelectorAll<HTMLElement>("[data-flame-index]");
      cardEls = Array.from(els).sort(
        (a, b) => Number(a.dataset.flameIndex) - Number(b.dataset.flameIndex)
      );
      cacheRects();
    }

    function cacheRects() {
      const sy = window.scrollY;
      const sx = window.scrollX;
      cachedRects = cardEls.map((el) => {
        const rect = el.getBoundingClientRect();
        return {
          pageX: rect.left + rect.width / 2 + sx,
          pageY: rect.top + rect.height / 2 + sy,
          w: rect.width,
          h: rect.height,
        };
      });
    }

    const t1 = setTimeout(queryCards, 100);
    const t2 = setTimeout(queryCards, 800);
    const t3 = setTimeout(queryCards, 2000);
    window.addEventListener("resize", queryCards);

    function animate(time: number) {
      if (startTime < 0) startTime = time;
      const scrollY = window.scrollY;
      const vh = window.innerHeight;
      const vw = window.innerWidth;

      const heroHeight = vh;
      const transStart = heroHeight * 0.05;
      const transEnd = heroHeight * 0.7;
      const rawProgress = (scrollY - transStart) / (transEnd - transStart);
      const progress = Math.max(0, Math.min(1, rawProgress));
      const ep = easeInOutCubic(progress);

      const elapsed = time - startTime;

      configs.forEach((cfg, i) => {
        const el = flameRefs.current[i];
        if (!el) return;

        const stagger = i * 120;
        const flameDuration = 800;
        const flameIntro = Math.max(0, Math.min(1, (elapsed - stagger) / flameDuration));
        const fi = easeInOutCubic(flameIntro);

        const orbitDampen = 1 - ep;
        const cx = vw / 2;
        const cy = vh / 2;
        const minDim = Math.min(vw, vh);
        const ringR = cfg.ringRadius * minDim;

        const ringRotation = time * cfg.ringSpeed;
        const baseAngle = cfg.angle + ringRotation;

        const orbitX = Math.cos(baseAngle) * ringR;
        const orbitZ = Math.sin(baseAngle);
        const orbitY = Math.sin(baseAngle) * ringR * Math.cos(cfg.ringTilt);

        const depthScale = 0.7 + (orbitZ + 1) * 0.3;

        const fallStartX = cx + (seededRandom(i * 19) - 0.5) * vw * 0.8;
        const fallStartY = -80 - seededRandom(i * 29) * vh * 0.3;

        const orbitPosX = cx + orbitX +
          Math.cos(time * cfg.wobbleSpeed + cfg.phase) * cfg.wobbleRadius * orbitDampen;
        const orbitPosY = cy + orbitY +
          Math.sin(time * cfg.wobbleSpeed * 0.7 + cfg.phase) * cfg.wobbleRadius * 0.6 * orbitDampen;

        const hx = fallStartX + (orbitPosX - fallStartX) * fi;
        const hy = fallStartY + (orbitPosY - fallStartY) * fi;

        let tx = hx;
        let ty = hy;
        let targetScale = 1.0;

        const cached = cachedRects[i];
        if (cached) {
          // Convert page-relative to viewport-relative each frame
          const cvx = cached.pageX - window.scrollX;
          const cvy = cached.pageY - scrollY;
          tx = hx + (cvx - hx) * ep;
          ty = hy + (cvy - hy) * ep;

          const maxPx = Math.min(cached.w, cached.h) * 0.4;
          targetScale = maxPx / cfg.size;
        }

        const parallaxY = scrollY * (1 - cfg.depth) * 0.2 * orbitDampen;
        // Center the element: offset by half the base size (transform-origin is center due to scale)
        const fx = tx - cfg.size / 2;
        const fy = ty - cfg.size / 2 + parallaxY;

        // Use transform-origin center so scaling doesn't shift position
        el.style.transformOrigin = 'center center';

        const heroS = depthScale;
        const scale = heroS + (targetScale - heroS) * ep;

        const breathe = 1 + Math.sin(time * 0.001 + cfg.phase) * 0.02;

        const heroOpacity = 0.5 + (orbitZ + 1) * 0.25;
        const baseOpacity = heroOpacity + (0.9 - heroOpacity) * ep;
        const opacity = baseOpacity * Math.min(1, fi * 1.5);

        el.style.transform = `translate3d(${fx}px, ${fy}px, 0) scale(${scale * breathe})`;
        el.style.opacity = String(opacity);

        // Glow — use cached ref, no DOM query per frame
        const glowEl = glowRefs.current[i];
        if (glowEl) {
          const settledGlow = ep > 0.7 ? 0.3 + (ep - 0.7) / 0.3 * 0.25 : 0.3;
          glowEl.style.opacity = String(settledGlow);
        }
      });

      animRef.current = requestAnimationFrame(animate);
    }
    animRef.current = requestAnimationFrame(animate);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
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
            <div
              className="flame-glow"
              ref={(el) => { glowRefs.current[i] = el; }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
