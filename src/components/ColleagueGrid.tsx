"use client";

import { colleagues } from "@/data/colleagues";
import ColleagueCard from "./ColleagueCard";

interface Props {
  onSelect: (index: number) => void;
}

export default function ColleagueGrid({ onSelect }: Props) {
  return (
    <section id="stories">
      <div className="section-intro">
        <p className="section-subtitle">
          Sending notes of honor and appreciation
          <br />
          to every courageous flame.
          <br />
          Happy Military Day!
        </p>
      </div>

      <div className="grid-section">
        <div className="sphere-grid">
          {colleagues.map((c, i) => (
            <ColleagueCard
              key={c.name}
              name={c.name}
              index={i}
              colors={c.colors}
              gradientAngle={c.gradientAngle}
              onClick={() => onSelect(i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
