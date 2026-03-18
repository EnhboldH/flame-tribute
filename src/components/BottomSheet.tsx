"use client";

import { useEffect, useRef, useState } from "react";
import { colleagues } from "@/data/colleagues";
import KheeUgalz from "./KheeUgalz";

interface Props {
  index: number | null;
  onClose: () => void;
}

export default function BottomSheet({ index, onClose }: Props) {
  const sheetRef = useRef<HTMLDivElement>(null);
  const [visibleMessages, setVisibleMessages] = useState<number>(0);
  const isOpen = index !== null;
  const colleague = index !== null ? colleagues[index] : null;

  useEffect(() => {
    if (!isOpen || !colleague) {
      setVisibleMessages(0);
      return;
    }
    setVisibleMessages(0);
    const timers: ReturnType<typeof setTimeout>[] = [];
    colleague.messages.forEach((_, i) => {
      timers.push(setTimeout(() => setVisibleMessages(i + 1), 800 + i * 700));
    });
    return () => timers.forEach(clearTimeout);
  }, [isOpen, colleague]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  return (
    <div className={`bottomsheet-overlay ${isOpen ? "active" : ""}`}>
      <div className="bottomsheet-backdrop" onClick={onClose} />

      <div className="bottomsheet" ref={sheetRef}>
        <div className="bottomsheet-handle"><span /></div>

        <button className="bottomsheet-close" onClick={onClose} aria-label="Close">
          <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {colleague && (
          <div className="bottomsheet-content">
            {/* Gradient sphere */}
            <div
              className="bottomsheet-sphere"
              style={{
                "--color-from": colleague.colors[0],
                "--color-to": colleague.colors[1],
                "--gradient-angle": `${colleague.gradientAngle}deg`,
              } as React.CSSProperties}
            >
              <div className="bottomsheet-sphere-glow" />
            </div>

            <h2 className="bottomsheet-name">{colleague.name}</h2>

            <KheeUgalz className="bottomsheet-divider" />

            <div className="bottomsheet-messages">
              {colleague.messages.map((msg, i) => (
                <p
                  key={i}
                  className={`bottomsheet-message ${i < visibleMessages ? "visible" : ""}`}
                >
                  &ldquo;{msg}&rdquo;
                </p>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
