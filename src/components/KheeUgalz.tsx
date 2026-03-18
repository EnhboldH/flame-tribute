export default function KheeUgalz({ className, variant = "divider" }: { className?: string; variant?: "divider" | "mountains" }) {
  if (variant === "mountains") {
    return (
      <div className={`khee-ugalz mountains ${className || ""}`}>
        <svg viewBox="0 0 800 200" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
          {/* Cloud swirls top layer */}
          <path d="M200 50 Q220 30 240 45 Q260 25 280 40 Q295 20 310 35 Q325 18 340 32 Q355 15 375 30 Q395 12 410 28 Q425 10 445 25 Q460 8 480 22 Q495 5 515 20 Q530 10 545 28 Q560 15 580 35 Q600 25 610 42" stroke="currentColor" strokeWidth="0.8" opacity="0.2" />
          <path d="M160 65 Q180 45 200 55 Q215 38 235 50 Q250 35 270 48 Q290 30 310 42 Q325 28 345 40 Q365 25 385 38 Q400 22 420 35 Q440 20 460 33 Q475 18 495 30 Q515 15 535 28 Q555 20 575 38 Q590 28 610 45 Q630 35 650 55" stroke="currentColor" strokeWidth="0.8" opacity="0.18" />

          {/* Mountain peaks */}
          <path d="M100 180 L160 95 L185 120 L220 70 L255 115 L280 80 L320 55 L360 85 L400 45 L440 85 L480 55 L520 80 L545 115 L580 70 L615 120 L640 95 L700 180" stroke="currentColor" strokeWidth="1" opacity="0.22" fill="none" />
          <path d="M60 180 L130 110 L165 135 L205 90 L240 125 L275 95 L320 70 L365 100 L400 60 L435 100 L480 70 L525 95 L560 125 L595 90 L635 135 L670 110 L740 180" stroke="currentColor" strokeWidth="0.8" opacity="0.15" fill="none" />
          <path d="M30 180 L110 125 L150 148 L190 108 L230 138 L265 110 L310 88 L355 112 L400 78 L445 112 L490 88 L535 110 L570 138 L610 108 L650 148 L690 125 L770 180" stroke="currentColor" strokeWidth="0.6" opacity="0.1" fill="none" />

          {/* Cloud detail curls */}
          <path d="M280 45 Q290 35 300 42 Q308 30 318 38" stroke="currentColor" strokeWidth="0.6" opacity="0.15" fill="none" />
          <path d="M380 38 Q390 26 402 34 Q410 24 422 32" stroke="currentColor" strokeWidth="0.6" opacity="0.15" fill="none" />
          <path d="M480 45 Q490 35 500 42 Q508 30 518 38" stroke="currentColor" strokeWidth="0.6" opacity="0.15" fill="none" />

          {/* Decorative angular details at peak bases */}
          <path d="M370 60 L380 52 L390 60 L400 48 L410 60 L420 52 L430 60" stroke="currentColor" strokeWidth="0.5" opacity="0.12" fill="none" />

          {/* Subtle horizontal base lines */}
          <line x1="0" y1="180" x2="800" y2="180" stroke="currentColor" strokeWidth="0.5" opacity="0.08" />
          <line x1="50" y1="175" x2="750" y2="175" stroke="currentColor" strokeWidth="0.3" opacity="0.05" />
        </svg>
      </div>
    );
  }

  return (
    <div className={`khee-ugalz ${className || ""}`}>
      <svg viewBox="0 0 400 24" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
        <line x1="0" y1="12" x2="140" y2="12" stroke="currentColor" strokeWidth="0.5" opacity="0.2" />
        <path d="M142 12 L150 4 L158 4 L158 12 L166 12 L166 20 L158 20 L158 12" stroke="currentColor" strokeWidth="0.6" opacity="0.35" fill="none" />
        <path d="M188 4 L200 12 L188 20 L200 12 L212 4 L200 12 L212 20 L200 12 Z" stroke="currentColor" strokeWidth="0.7" opacity="0.4" fill="none" />
        <circle cx="200" cy="12" r="2" fill="currentColor" opacity="0.3" />
        <path d="M234 12 L242 12 L242 4 L250 4 L258 12 L250 20 L242 20 L242 12" stroke="currentColor" strokeWidth="0.6" opacity="0.35" fill="none" />
        <line x1="260" y1="12" x2="400" y2="12" stroke="currentColor" strokeWidth="0.5" opacity="0.2" />
      </svg>
    </div>
  );
}
