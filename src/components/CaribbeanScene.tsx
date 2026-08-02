"use client";

import { useEffect, useRef } from "react";

export function CaribbeanScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const W = 420;
    const H = 340;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = `${W}px`;
    canvas.style.height = `${H}px`;
    ctx.scale(dpr, dpr);

    // Helper: draw a sphere from evenly-spaced lat/lon dots
    function drawSphere(
      cx: number, cy: number, radius: number,
      color: [number, number, number],
      rotY: number, rotX: number,
      latLines: number, lonLines: number
    ) {
      if (!ctx) return;
      for (let lat = 0; lat <= latLines; lat++) {
        const theta = (lat / latLines) * Math.PI;
        const dotsOnRing = Math.max(4, Math.floor(lonLines * Math.sin(theta)));
        for (let lon = 0; lon < dotsOnRing; lon++) {
          const phi = (lon / dotsOnRing) * Math.PI * 2;

          let x = Math.sin(theta) * Math.cos(phi);
          let y = Math.cos(theta);
          let z = Math.sin(theta) * Math.sin(phi);

          // Rotate Y
          const rx = x * Math.cos(rotY) - z * Math.sin(rotY);
          const rz = x * Math.sin(rotY) + z * Math.cos(rotY);
          x = rx; z = rz;

          // Rotate X
          const ry = y * Math.cos(rotX) - z * Math.sin(rotX);
          const rz2 = y * Math.sin(rotX) + z * Math.cos(rotX);
          y = ry; z = rz2;

          if (z < -0.05) continue;

          const depth = (z + 1) / 2;
          const alpha = 0.15 + depth * 0.7;
          const size = 1.0 + depth * 1.4;

          ctx.beginPath();
          ctx.arc(cx + x * radius, cy + y * radius, size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${Math.min(1, alpha * 1.4)})`;
          ctx.fill();
        }
      }
    }

    // Pre-generate palm trunk
    const trunkDots: { t: number; offset: number }[] = [];
    for (let i = 0; i < 80; i++) {
      trunkDots.push({ t: i / 80, offset: (Math.random() - 0.5) * 2.5 });
    }

    // Frond data
    const frondAngles = [-2.5, -2.1, -1.7, -1.3, -0.9, -0.4, 0.0, 0.3];
    const frondDots: { frond: number; progress: number; side: number }[] = [];
    for (let f = 0; f < frondAngles.length; f++) {
      const count = 28 + Math.floor(Math.random() * 8);
      for (let j = 0; j < count; j++) {
        frondDots.push({ frond: f, progress: j / count, side: (Math.random() - 0.5) * 2 });
      }
    }

    // Sand dots
    const sandDots: { x: number; y: number }[] = [];
    for (let i = 0; i < 180; i++) {
      const angle = Math.random() * Math.PI * 2;
      const r = Math.random();
      sandDots.push({ x: Math.cos(angle) * r * 50, y: Math.sin(angle) * r * 12 });
    }

    let frame = 0;
    let animId: number;

    function draw() {
      if (!ctx) return;
      ctx.clearRect(0, 0, W, H);

      const t = frame * 0.005;

      // === SUN — OpenAI-style sphere, top-right ===
      // Steady sphere, burst particles orbit around it
      const sunCX = 310;
      const sunCY = 50;
      const sunR = 50;

      drawSphere(sunCX, sunCY, sunR, [255, 87, 51], 0, 0.3, 16, 22);

      // Sun rays — tiny particles streaming downward toward palm/sand/sea
      for (let i = 0; i < 200; i++) {
        const angle = (i / 200) * Math.PI * 1.2 + 0.3; // fan downward-left
        const baseDist = sunR + 5;
        const travel = ((t * 30 + i * 7) % 180); // particles travel outward
        const dist = baseDist + travel;
        const x = sunCX + Math.cos(angle) * dist;
        const y = sunCY + Math.sin(angle) * dist;

        // Only draw if within canvas and below/left of sun
        if (x < 0 || x > W || y < 0 || y > H) continue;

        const fade = 1 - travel / 180;
        const alpha = fade * 0.4;

        ctx.beginPath();
        ctx.arc(x, y, 0.7, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 87, 51, ${alpha})`;
        ctx.fill();
      }

      // === SAND — warm tan dots ===
      const sandCX = 110;
      const sandCY = 220;

      for (const sd of sandDots) {
        ctx.beginPath();
        ctx.arc(sandCX + sd.x, sandCY + sd.y, 1.3, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(194, 160, 110, 0.45)";
        ctx.fill();
      }

      // === SEA — blue sphere style, flat horizon band ===
      const seaCX = 200;
      const seaCY = 240;
      // Flat elliptical ring of blue dots — like a horizon
      for (let ring = 0; ring < 5; ring++) {
        const baseR = 80 + ring * 12;
        const dotCount = 40 + ring * 6;
        for (let i = 0; i < dotCount; i++) {
          const angle = (i / dotCount) * Math.PI * 2;
          const x = seaCX + Math.cos(angle) * baseR;
          const y = seaCY + Math.sin(angle) * (8 + ring * 3);
          const wave = Math.sin(angle * 2 + t * 0.8 + ring) * 1;
          const alpha = 0.3 + (1 - ring / 5) * 0.35;

          ctx.beginPath();
          ctx.arc(x, y + wave, 0.9, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(0, 119, 182, ${alpha})`;
          ctx.fill();
        }
      }

      // === PALM TREE ===
      const trunkBaseX = sandCX + 8;
      const trunkBaseY = sandCY - 8;

      // Trunk — static dots
      for (const td of trunkDots) {
        const progress = td.t;
        const curve = Math.sin(progress * 0.7) * 14;
        const x = trunkBaseX + curve + td.offset;
        const y = trunkBaseY - progress * 95;

        ctx.beginPath();
        ctx.arc(x, y, 1.8 - progress * 0.8, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(101, 67, 33, ${0.45 + progress * 0.4})`;
        ctx.fill();
      }

      // Crown
      const crownX = trunkBaseX + Math.sin(0.7) * 14;
      const crownY = trunkBaseY - 95;

      // Fronds — swaying
      const windCycle = t * 0.4;
      for (const fd of frondDots) {
        const baseAngle = frondAngles[fd.frond];
        const sway = Math.sin(windCycle + fd.frond * 0.7) * 0.18;
        const tipSway = Math.sin(windCycle * 1.5 + fd.frond * 0.5) * 0.14 * fd.progress;
        const progress = fd.progress;
        const angle = baseAngle + sway + tipSway + progress * 0.28;
        const dist = progress * 48;
        const droop = progress * progress * 20;
        const spread = fd.side * (3 + progress * 6);

        const perpAngle = angle + Math.PI / 2;
        const x = crownX + Math.cos(angle) * dist + Math.cos(perpAngle) * spread;
        const y = crownY + Math.sin(angle) * dist + droop + Math.sin(perpAngle) * spread;

        const alpha = 0.7 - progress * 0.35;
        const g = 150 + Math.floor(progress * 40);

        ctx.beginPath();
        ctx.arc(x, y, 1.4 - progress * 0.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, ${g}, ${55 + Math.floor(progress * 15)}, ${alpha})`;
        ctx.fill();
      }

      frame++;
      animId = requestAnimationFrame(draw);
    }

    animId = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none"
      style={{ width: "420px", height: "340px" }}
    />
  );
}
