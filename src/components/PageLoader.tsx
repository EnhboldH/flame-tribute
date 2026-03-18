"use client";

import { useEffect, useState } from "react";

export default function PageLoader() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setHidden(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`page-loader ${hidden ? "hidden" : ""}`}>
      <span className="loader-text">A moment of appreciation...</span>
    </div>
  );
}
