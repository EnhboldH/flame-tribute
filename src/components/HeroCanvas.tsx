"use client";

import { useEffect, useRef } from "react";

export default function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;

    function resize() {
      canvas!.width = window.innerWidth;
      canvas!.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    function draw(time: number) {
      const w = canvas!.width;
      const h = canvas!.height;

      ctx!.fillStyle = "#0a0e1a";
      ctx!.fillRect(0, 0, w, h);

      const grd = ctx!.createRadialGradient(w * 0.5, h * 0.45, 0, w * 0.5, h * 0.45, w * 0.6);
      grd.addColorStop(0, "rgba(214,198,168,0.03)");
      grd.addColorStop(0.5, "rgba(214,198,168,0.015)");
      grd.addColorStop(1, "rgba(0,0,0,0)");
      ctx!.fillStyle = grd;
      ctx!.fillRect(0, 0, w, h);

      const x = w * 0.5 + Math.sin(time * 0.0003) * w * 0.15;
      const y = h * 0.4 + Math.cos(time * 0.0004) * h * 0.08;
      const grd2 = ctx!.createRadialGradient(x, y, 0, x, y, w * 0.35);
      grd2.addColorStop(0, "rgba(214,198,168,0.025)");
      grd2.addColorStop(1, "rgba(0,0,0,0)");
      ctx!.fillStyle = grd2;
      ctx!.fillRect(0, 0, w, h);

      animId = requestAnimationFrame(draw);
    }
    animId = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return <canvas ref={canvasRef} className="hero-canvas" />;
}
