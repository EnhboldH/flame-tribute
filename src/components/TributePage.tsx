"use client";

import { useState } from "react";
import PageLoader from "./PageLoader";
import Particles from "./Particles";
import FlameField from "./FlameField";
import Hero from "./Hero";
import ColleagueGrid from "./ColleagueGrid";
import BottomSheet from "./BottomSheet";
import Footer from "./Footer";

export default function TributePage() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  return (
    <>
      <PageLoader />
      <Particles />
      <FlameField
        selectedIndex={selectedIndex}
        overlayOpen={selectedIndex !== null}
      />
      <Hero />
      <ColleagueGrid onSelect={setSelectedIndex} />
      <BottomSheet index={selectedIndex} onClose={() => setSelectedIndex(null)} />
      <Footer />
    </>
  );
}
