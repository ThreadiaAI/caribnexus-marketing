"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";

function AnimatedPrice({ value, duration = 400 }: { value: number; duration?: number }) {
  const [display, setDisplay] = useState(value);
  const prevRef = useRef(value);

  useEffect(() => {
    const from = prevRef.current;
    const to = value;
    if (from === to) return;

    const start = performance.now();
    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(from + (to - from) * eased));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
    prevRef.current = to;
  }, [value, duration]);

  return <>{display}</>;
}

const FEATURES = {
  0: [
    "AI bookkeeper via WhatsApp",
    "Voice note transcription",
    "Image & receipt reading",
    "All 11 financial reports",
    "GCT & TRN compliance",
    "Reminders & expectations",
    "Business memory",
    "Dashboard access",
  ],
  1: [
    "Everything in Micro",
    "Invoice generation",
    "Bill management",
  ],
  2: [
    "Everything in Small",
    "Dedicated support",
  ],
} as const;

const TIERS = {
  business: [
    { name: "Micro", monthly: 69, unit: "Up to 100 transactions/mo", desc: "For solo operators, freelancers, and side hustles." },
    { name: "Small", monthly: 119, unit: "Up to 300 transactions/mo", desc: "For restaurants, salons, and small contractors." },
    { name: "Medium", monthly: 299, unit: "Up to 2,000 transactions/mo", desc: "For growing companies with real operational volume." },
  ],
  partner: [
    { name: "Starter", monthly: 99, unit: "Up to 300 transactions pooled", desc: "For firms with a handful of clients." },
    { name: "Growth", monthly: 169, unit: "Up to 1,000 transactions pooled", desc: "For firms scaling their client base." },
    { name: "Professional", monthly: 329, unit: "Up to 3,000 transactions pooled", desc: "For established firms with 15+ clients." },
  ],
};

function PricingContent() {
  const searchParams = useSearchParams();
  const [tab, setTab] = useState<"business" | "partner">(
    searchParams.get("tab") === "partner" ? "partner" : "business"
  );
  const [yearly, setYearly] = useState(false);

  const tiers = TIERS[tab];

  return (
    <>
      <Nav />
      <main className="pt-[var(--nav-h)]">
        <div className="mx-auto max-w-[var(--content-max-w)] product-section-mobile md:page-grid">
          {/* Title */}
          <h1 className="text-[28px] md:text-[40px] font-bold tracking-tight text-cn-muted pt-[48px] md:pt-[120px]" style={{ gridColumn: "2 / 12" }}>
            Pricing
          </h1>

          {/* Tab toggle — centered */}
          <div className="mt-4" style={{ gridColumn: "2 / 12" }}>
            <div className="inline-flex items-center bg-gray-100 rounded-full p-1">
              <button
                onClick={() => setTab("business")}
                className={`px-4 py-1.5 rounded-full text-[11px] font-medium transition-all ${
                  tab === "business"
                    ? "bg-white text-[#0077B6] shadow-sm"
                    : "text-cn-muted/60 hover:text-cn-muted"
                }`}
              >
                For Businesses
              </button>
              <button
                onClick={() => setTab("partner")}
                className={`px-4 py-1.5 rounded-full text-[11px] font-medium transition-all ${
                  tab === "partner"
                    ? "bg-white text-[#00A859] shadow-sm"
                    : "text-cn-muted/60 hover:text-cn-muted"
                }`}
              >
                For Partners
              </button>
            </div>
            <p className="text-[11px] text-cn-muted" style={{ marginTop: "11px" }}>
              {tab === "business"
                ? "One business, one subscription. Pick the volume that fits your operations."
                : "One account, one invoice. Onboard your clients and pool all transactions. You set your own markup."
              }
            </p>
            <div className="border-t border-cn-border mt-6" />
          </div>

          {/* Pricing cards — fixed layout, only text content changes */}
          <div
            className="mt-12 grid grid-cols-1 md:grid-cols-3"
            style={{ gridColumn: "2 / 12", width: "100%", maxWidth: "900px", margin: "0 auto" }}
          >
            {/* Panel 1 */}
            <div className="py-8 px-4 md:px-6 flex flex-col">
              <h3 className="text-[18px] font-bold text-cn-muted">{tiers[0].name}</h3>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-[28px] font-bold text-cn-muted">$<AnimatedPrice value={yearly ? Math.round(tiers[0].monthly * 0.9) : tiers[0].monthly} /></span>
                <span className="text-[12px] text-cn-muted">/month</span>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <button onClick={() => setYearly(!yearly)} className={`relative w-[34px] h-[18px] rounded-full transition-colors ${yearly ? "bg-[#00A859]" : "bg-gray-200"}`}>
                  <span className={`absolute top-[2px] left-[2px] w-[14px] h-[14px] rounded-full bg-white shadow transition-transform ${yearly ? "translate-x-[16px]" : ""}`} />
                </button>
                <span className="text-[11px] text-cn-muted">Billed yearly</span>
              </div>
              <p className="mt-4 text-[12px] text-cn-muted" style={{ lineHeight: "1.4" }}>{tiers[0].desc}</p>
              <p className="mt-1 text-[11px] font-medium text-[#0077B6]">{tiers[0].unit}</p>
              <div className="border-t border-cn-border mt-5 mb-5" />
              <ul className="space-y-2.5">
                {FEATURES[0].map((f) => (<li key={f} className="flex items-start gap-2"><svg className="w-4 h-4 shrink-0 mt-0.5" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="10" fill="#E5E7EB" /><path d="M6 10l3 3 5-5" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg><span className="text-[12px] text-cn-muted">{f}</span></li>))}
              </ul>
              <div className="mt-auto pt-8">
                <button className="w-full py-2 text-[12px] font-medium text-cn-muted border border-cn-border rounded-full hover:border-cn-muted transition-all">Get started</button>
              </div>
            </div>

            {/* Panel 2 */}
            <div className="py-8 px-4 md:px-6 flex flex-col border-t md:border-t-0 md:border-l border-cn-border">
              <h3 className="text-[18px] font-bold text-cn-muted">{tiers[1].name}</h3>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-[28px] font-bold text-cn-muted">$<AnimatedPrice value={yearly ? Math.round(tiers[1].monthly * 0.9) : tiers[1].monthly} /></span>
                <span className="text-[12px] text-cn-muted">/month</span>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <button onClick={() => setYearly(!yearly)} className={`relative w-[34px] h-[18px] rounded-full transition-colors ${yearly ? "bg-[#00A859]" : "bg-gray-200"}`}>
                  <span className={`absolute top-[2px] left-[2px] w-[14px] h-[14px] rounded-full bg-white shadow transition-transform ${yearly ? "translate-x-[16px]" : ""}`} />
                </button>
                <span className="text-[11px] text-cn-muted">Billed yearly</span>
              </div>
              <p className="mt-4 text-[12px] text-cn-muted" style={{ lineHeight: "1.4" }}>{tiers[1].desc}</p>
              <p className="mt-1 text-[11px] font-medium text-[#FF5733]">{tiers[1].unit}</p>
              <div className="border-t border-cn-border mt-5 mb-5" />
              <ul className="space-y-2.5">
                {FEATURES[1].map((f) => (<li key={f} className="flex items-start gap-2"><svg className="w-4 h-4 shrink-0 mt-0.5" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="10" fill="#E5E7EB" /><path d="M6 10l3 3 5-5" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg><span className="text-[12px] text-cn-muted">{f}</span></li>))}
              </ul>
              <div className="mt-auto pt-8">
                <button className="w-full py-2 text-[12px] font-medium text-cn-muted border border-cn-border rounded-full hover:border-cn-muted transition-all">Get started</button>
              </div>
            </div>

            {/* Panel 3 */}
            <div className="py-8 px-4 md:px-6 flex flex-col border-t md:border-t-0 md:border-l border-cn-border">
              <h3 className="text-[18px] font-bold text-cn-muted">{tiers[2].name}</h3>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-[28px] font-bold text-cn-muted">$<AnimatedPrice value={yearly ? Math.round(tiers[2].monthly * 0.9) : tiers[2].monthly} /></span>
                <span className="text-[12px] text-cn-muted">/month</span>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <button onClick={() => setYearly(!yearly)} className={`relative w-[34px] h-[18px] rounded-full transition-colors ${yearly ? "bg-[#00A859]" : "bg-gray-200"}`}>
                  <span className={`absolute top-[2px] left-[2px] w-[14px] h-[14px] rounded-full bg-white shadow transition-transform ${yearly ? "translate-x-[16px]" : ""}`} />
                </button>
                <span className="text-[11px] text-cn-muted">Billed yearly</span>
              </div>
              <p className="mt-4 text-[12px] text-cn-muted" style={{ lineHeight: "1.4" }}>{tiers[2].desc}</p>
              <p className="mt-1 text-[11px] font-medium text-[#00A859]">{tiers[2].unit}</p>
              <div className="border-t border-cn-border mt-5 mb-5" />
              <ul className="space-y-2.5">
                {FEATURES[2].map((f) => (<li key={f} className="flex items-start gap-2"><svg className="w-4 h-4 shrink-0 mt-0.5" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="10" fill="#E5E7EB" /><path d="M6 10l3 3 5-5" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg><span className="text-[12px] text-cn-muted">{f}</span></li>))}
              </ul>
              <div className="mt-auto pt-8">
                <button className="w-full py-2 text-[12px] font-medium text-cn-muted border border-cn-border rounded-full hover:border-cn-muted transition-all">Get started</button>
              </div>
            </div>
          </div>


        </div>

        <Footer />
      </main>
    </>
  );
}

export default function PricingPage() {
  return (
    <Suspense>
      <PricingContent />
    </Suspense>
  );
}
