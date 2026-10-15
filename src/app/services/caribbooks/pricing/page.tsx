"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { TIERS, YEARLY_DISCOUNT } from "@/lib/pricing";

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

/**
 * What each tier lists, mirroring caribbooks-frontend-design's own tier
 * definitions so the sales page and the plan screen cannot promise different
 * things.
 *
 * KEYED BY TAB, which it was not before: the three lists were written for the
 * business tiers and then reused for the partner ones, so "For Partners" put
 * "Everything in Micro" and "Invoice generation" under Growth — a business
 * plan's features on an accounting firm's card.
 *
 * Nano and Micro carry the SAME list on purpose. They are capability-identical
 * and differ only in volume, which the transactions line above already says;
 * writing "Everything in Nano" under Micro would imply a difference that is
 * not there.
 */
const BUSINESS_BASE = [
  "AI bookkeeper via WhatsApp",
  "Voice note transcription",
  "Image & receipt reading",
  "All 11 financial reports",
  "GCT & TRN compliance",
  "Reminders & expectations",
  "Business memory",
  "Dashboard access",
];

const FEATURES: Record<"business" | "partner", string[][]> = {
  business: [
    BUSINESS_BASE,
    BUSINESS_BASE,
    ["Everything in Micro", "Invoice generation", "Bill management"],
    ["Everything in Small", "Dedicated support", "Priority processing"],
  ],
  partner: [
    [
      "Manage multiple client businesses",
      "Pooled transaction volume",
      "Firm-level dashboard",
      "Client onboarding tools",
      "All 11 reports per client",
    ],
    ["Everything in Starter", "White-label reports", "Team member access", "Client invite links"],
    ["Everything in Growth", "Dedicated support", "Priority processing", "Custom branding"],
  ],
};

/** One per column, from the brand palette. A fourth tier needed a fourth. */
const ACCENTS = ["#0077B6", "#009088", "#FF5733", "#00A859"];


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

          {/* Pricing cards.
              WAS three hardcoded panels indexed tiers[0..2], which is why a
              fourth business tier could be added to pricing.ts and simply not
              appear. Mapped now, so the column count follows the data. */}
          <div
            className={`mt-12 grid grid-cols-1 ${
              tiers.length === 4 ? "md:grid-cols-4" : "md:grid-cols-3"
            }`}
            style={{
              gridColumn: "2 / 12",
              width: "100%",
              // Four columns in 900px leaves each one too narrow to hold
              // "Up to 15,000 transactions/mo" on a single line.
              maxWidth: tiers.length === 4 ? "1140px" : "900px",
              margin: "0 auto",
            }}
          >
            {tiers.map((tier, i) => (
              <div
                key={tier.name}
                className={`py-8 px-4 md:px-6 flex flex-col ${
                  i === 0 ? "" : "border-t md:border-t-0 md:border-l border-cn-border"
                }`}
              >
                <h3 className="text-[18px] font-bold text-cn-muted">{tier.name}</h3>
                <div className="mt-1 flex items-baseline gap-1">
                  <span className="text-[28px] font-bold text-cn-muted">
                    $<AnimatedPrice value={yearly ? Math.round(tier.monthly * YEARLY_DISCOUNT) : tier.monthly} />
                  </span>
                  <span className="text-[12px] text-cn-muted">/month</span>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <button
                    onClick={() => setYearly(!yearly)}
                    aria-label="Toggle yearly billing"
                    className={`relative w-[34px] h-[18px] rounded-full transition-colors ${yearly ? "bg-[#00A859]" : "bg-gray-200"}`}
                  >
                    <span className={`absolute top-[2px] left-[2px] w-[14px] h-[14px] rounded-full bg-white shadow transition-transform ${yearly ? "translate-x-[16px]" : ""}`} />
                  </button>
                  <span className="text-[11px] text-cn-muted">Billed yearly</span>
                </div>
                <p className="mt-4 text-[12px] text-cn-muted" style={{ lineHeight: "1.4" }}>{tier.desc}</p>
                <p className="mt-1 text-[11px] font-medium" style={{ color: ACCENTS[i % ACCENTS.length] }}>
                  {tier.unit}
                </p>
                <div className="border-t border-cn-border mt-5 mb-5" />
                <ul className="space-y-2.5">
                  {(FEATURES[tab][i] ?? []).map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <svg className="w-4 h-4 shrink-0 mt-0.5" viewBox="0 0 20 20" fill="none">
                        <circle cx="10" cy="10" r="10" fill="#E5E7EB" />
                        <path d="M6 10l3 3 5-5" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <span className="text-[12px] text-cn-muted">{f}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-auto pt-8">
                  <a
                    href="https://books.caribnexusai.com/signup"
                    className="block w-full py-2 text-[12px] font-medium text-cn-muted border border-cn-border rounded-full hover:border-cn-muted transition-all text-center"
                  >
                    Get started
                  </a>
                </div>
              </div>
            ))}
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
