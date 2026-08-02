"use client";

import { useEffect, useState } from "react";

const LS_KEY = "cn.gridlines.visible";
const BASELINE_PX = 8;

export function Gridlines() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(LS_KEY);
      if (raw === "0") setVisible(false);
    } catch {}

    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isTyping = target && ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName);
      if (isTyping) return;
      if (e.shiftKey && (e.key === "G" || e.key === "g")) {
        e.preventDefault();
        setVisible((v) => {
          const next = !v;
          try { window.localStorage.setItem(LS_KEY, next ? "1" : "0"); } catch {}
          return next;
        });
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (!visible) return null;

  return (
    <div aria-hidden className="fixed inset-0 pointer-events-none z-[9999]">
      {/* 8px baseline micro grid */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `repeating-linear-gradient(0deg, rgba(255,87,51,0.04) 0px, rgba(255,87,51,0.04) 1px, transparent 1px, transparent ${BASELINE_PX}px)`,
          backgroundSize: `100% ${BASELINE_PX}px`,
        }}
      />
      {/* 12-column grid — uses same structural grid as nav/content */}
      <div
        className="mx-auto h-full"
        style={{
          maxWidth: "var(--content-max-w)",
          display: "grid",
          gridTemplateColumns: "repeat(12, 1fr)",
          columnGap: "var(--grid-gap)",
          paddingInline: "var(--grid-padding)",
        }}
      >
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="h-full" style={{ background: "rgba(0,119,182,0.05)" }} />
        ))}
      </div>
      <div className="fixed bottom-3 right-3 px-2.5 py-1 rounded-full bg-neutral-900 text-white text-[11px] font-medium shadow-lg">
        Gridlines · Shift+G
      </div>
    </div>
  );
}

export function GridlinesGate() {
  if (process.env.NODE_ENV !== "development") return null;
  return <Gridlines />;
}
