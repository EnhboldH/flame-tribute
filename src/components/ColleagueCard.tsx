"use client";

import { useEffect, useRef, useCallback } from "react";

interface Props {
  name: string;
  index: number;
  colors: [string, string];
  gradientAngle: number;
  onClick: () => void;
}

export default function ColleagueCard({ name, index, colors, gradientAngle, onClick }: Props) {
  const cardRef = useRef<HTMLDivElement>(null);
  const clickedRef = useRef(false);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    // Only show name once flames have settled (scroll past hero + grid intro)
    function checkScroll() {
      if (!card) return;
      const vh = window.innerHeight;
      const threshold = vh * 0.5;
      if (window.scrollY > threshold) {
        const rect = card.getBoundingClientRect();
        if (rect.top < vh * 0.9) {
          setTimeout(() => card?.classList.add("visible"), (index % 5) * 120);
          window.removeEventListener("scroll", checkScroll);
        }
      }
    }

    window.addEventListener("scroll", checkScroll, { passive: true });
    return () => window.removeEventListener("scroll", checkScroll);
  }, [index]);

  const handleClick = useCallback(() => {
    if (clickedRef.current) return;
    clickedRef.current = true;
    const card = cardRef.current;
    card?.classList.add("card-reacting");
    setTimeout(() => {
      card?.classList.remove("card-reacting");
      clickedRef.current = false;
      onClick();
    }, 450);
  }, [onClick]);

  return (
    <div
      ref={cardRef}
      className="sphere-card"
      data-flame-index={index}
      onClick={handleClick}
      style={{
        "--color-from": colors[0],
        "--color-to": colors[1],
        "--gradient-angle": `${gradientAngle}deg`,
      } as React.CSSProperties}
    >
      {/* The sphere glow (sits behind, visible on hover) */}
      <div className="sphere-glow" />
      {/* Name overlaid on sphere area */}
      <span className="sphere-name">{name}</span>
    </div>
  );
}
