"use client";

import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { FadeIn, ScaleIn } from "@/components/Animate";
import Link from "next/link";

export default function CaribBooksPage() {
  return (
    <>
      <Nav />
      <main className="pt-[var(--nav-h)]">

        {/* Hero — Linear-style massive headline + descriptor */}
        <section className="mx-auto max-w-[var(--content-max-w)] product-section-mobile md:page-grid pt-[48px] md:pt-[160px] pb-[48px]">
          <FadeIn style={{ gridColumn: "2 / 10" }} y={32} duration={0.8}>
            <h1
              className="text-[28px] md:text-[40px] font-bold tracking-tight"
              style={{ lineHeight: "1" }}
            >
              <span className="text-cn-muted">Introducing</span>{" "}
              <img src="/logo/logo-caribbooks.svg" alt="CaribBooks" className="inline-block h-[28px] md:h-[32px] align-baseline" style={{ marginBottom: "-2px" }} /><span className="text-cn-muted">,</span><br className="hidden md:inline" />
              <span className="text-cn-muted"> your AI bookkeeper that works in WhatsApp</span>
            </h1>
            <p className="text-[13px] text-cn-muted mt-3 max-w-[420px]" style={{ lineHeight: "1.3" }}>
              Message your transactions in plain English or patois. Every report updates in real time. No setup. No training. Just start texting.
            </p>
          </FadeIn>
          <div className="hidden md:flex items-end justify-end" style={{ gridColumn: "10 / 12" }}>
            <Link
              href="https://books.caribnexusai.com/signup"
              className="text-[11px] font-medium bg-gradient-to-r from-[#0077B6] via-[#00A859] to-[#FF5733] bg-clip-text text-transparent hover:opacity-80 transition-opacity"
            >
              Start free →
            </Link>
          </div>
        </section>

        {/* Product hero — recreated dashboard with WhatsApp overlay */}
        <section className="mx-auto max-w-[var(--content-max-w)] product-section-mobile md:page-grid pb-[80px]">
          <ScaleIn className="relative" style={{ gridColumn: "2 / 12" }}>
            {/* Mobile: WhatsApp first → then dashboard (flow: message → result) */}
            <div className="md:hidden flex flex-col items-center gap-4">
              <div className="w-[240px] shadow-xl" style={{ borderRadius: "12px", overflow: "hidden", border: "1px solid rgba(0,0,0,0.08)" }}>
                <img
                  src="/screenshots/unnamed.jpg"
                  alt="WhatsApp — Paid internet bill 15,000 → Posted to Utilities Expense"
                  className="w-full h-auto"
                />
              </div>
              <svg className="w-8 h-12 text-cn-muted" viewBox="0 0 32 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 4 C9 14, 25 14, 25 24 C25 33, 10 33, 13 37 C14 39, 15 40, 15 42" />
                <path d="M11 39 L15 44 L19 39" />
              </svg>
              <div className="w-full p-4" style={{ background: "#f5faf7", borderRadius: "4px" }}>
                <img
                  src="/screenshots/scrnli_GwpXkzC7ktrWYB.png"
                  alt="CaribBooks dashboard — transactions view showing internet bill posted"
                  className="w-full h-auto shadow-lg"
                  style={{ borderRadius: "2px" }}
                />
              </div>
            </div>

            {/* Desktop: Dashboard with WhatsApp overlay */}
            <div className="hidden md:block">
              <div
                className="p-10"
                style={{ background: "#f5faf7", borderRadius: "4px" }}
              >
                <img
                  src="/screenshots/scrnli_GwpXkzC7ktrWYB.png"
                  alt="CaribBooks dashboard — transactions view showing internet bill posted"
                  className="w-full h-auto shadow-lg"
                  style={{ borderRadius: "2px" }}
                />
              </div>
              <div
                className="absolute shadow-2xl"
                style={{
                  left: "4px",
                  bottom: "40px",
                  width: "220px",
                  borderRadius: "12px",
                  overflow: "hidden",
                  border: "1px solid rgba(0,0,0,0.08)",
                }}
              >
                <img
                  src="/screenshots/unnamed.jpg"
                  alt="WhatsApp — Paid internet bill 15,000 → Posted to Utilities Expense"
                  className="w-full h-auto"
                />
              </div>
            </div>
          </ScaleIn>
        </section>

        <div className="border-t border-cn-border w-full" />

        {/* Prose statement */}
        <section className="mx-auto max-w-[var(--content-max-w)] product-section-mobile md:page-grid pt-[80px] pb-[80px]">
          <FadeIn style={{ gridColumn: "2 / 11" }}>
            <p className="text-[22px] md:text-[30px] font-bold tracking-tight" style={{ lineHeight: "1" }}>
              <span className="text-cn-muted">Made for the Caribbean to understand your </span><span className="bg-gradient-to-r from-[#0077B6] to-[#00A859] bg-clip-text text-transparent">texts and voicenotes</span><span className="text-cn-muted">,</span><br className="hidden md:inline" />
              <span className="text-cn-muted"> and keep your </span><span className="bg-gradient-to-r from-[#0077B6] to-[#00A859] bg-clip-text text-transparent">books current</span><span className="text-cn-muted">, all from a </span><span className="bg-gradient-to-r from-[#00A859] to-[#FF5733] bg-clip-text text-transparent">WhatsApp message</span><span className="text-cn-muted">.</span>
            </p>
            <p className="text-[22px] md:text-[30px] font-bold tracking-tight mt-4" style={{ lineHeight: "1" }}>
              <span className="text-cn-muted">No app to download or spreadsheet to maintain.</span>
            </p>
          </FadeIn>
        </section>

        {/* FIG cards — three-column desktop, scroll on mobile */}
        <section className="mx-auto max-w-[var(--content-max-w)] product-section-mobile md:page-grid pb-[80px]">
          {/* Mobile: horizontal scroll */}
          <div className="md:hidden flex overflow-x-auto gap-4 snap-x snap-mandatory no-scrollbar pb-2">
            {[
              { fig: "FIG 0.1", img: "/illustrations/cb-fig-double-entry.svg", title: "Double-entry from a message", color: "#0077B6", desc: "One text produces a debit and a credit of equal amounts. The math is always balanced." },
              { fig: "FIG 0.2", img: "/illustrations/cb-fig-memory.svg", title: "Memory that compounds", color: "#00A859", desc: "CB learns your vendors and patterns. Week 1 it asks questions. Week 4 it posts automatically." },
              { fig: "FIG 0.3", img: "/illustrations/cb-fig-reports.svg", title: "Reports delivered in-chat", color: "#FF5733", desc: "\"Send me the P&L\" → branded PDF in your WhatsApp. No login required." },
            ].map((card) => (
              <div key={card.fig} className="flex flex-col border border-cn-border rounded-lg p-4 min-w-[240px] max-w-[240px] snap-start shrink-0 bg-white">
                <span className="text-[9px] font-medium text-cn-muted uppercase tracking-wider">{card.fig}</span>
                <div className="flex items-center justify-center my-3">
                  <img src={card.img} alt="" style={{ height: "120px", width: "auto" }} />
                </div>
                <h3 className="text-[12px] font-bold" style={{ color: card.color }}>{card.title}</h3>
                <p className="text-[10px] text-cn-muted mt-1" style={{ lineHeight: "14px" }}>{card.desc}</p>
              </div>
            ))}
          </div>
          {/* Desktop: three columns */}
          <div className="hidden md:grid md:grid-cols-[1fr_1px_1fr_1px_1fr] md:gap-0" style={{ gridColumn: "2 / 12" }}>
            <div className="pl-4 pr-2">
              <span className="text-[9px] font-medium text-cn-muted uppercase tracking-wider block" style={{ lineHeight: "16px" }}>FIG 0.1</span>
              <div className="flex items-center justify-center" style={{ height: "220px", marginTop: "16px", marginBottom: "20px" }}>
                <img src="/illustrations/cb-fig-double-entry.svg" alt="" style={{ height: "200px", width: "auto" }} />
              </div>
              <h3 className="text-[13px] font-bold" style={{ lineHeight: "24px", color: "#0077B6" }}>Double-entry from a message</h3>
              <p className="text-[11px] text-cn-muted" style={{ marginTop: "8px", lineHeight: "16px" }}>One text produces a debit and a credit of equal amounts. The math is always balanced. Every report updates instantly.</p>
            </div>
            <div className="bg-cn-border" />
            <div className="pl-4 pr-2">
              <span className="text-[9px] font-medium text-cn-muted uppercase tracking-wider block" style={{ lineHeight: "16px" }}>FIG 0.2</span>
              <div className="flex items-center justify-center" style={{ height: "220px", marginTop: "16px", marginBottom: "20px" }}>
                <img src="/illustrations/cb-fig-memory.svg" alt="" style={{ height: "200px", width: "auto" }} />
              </div>
              <h3 className="text-[13px] font-bold" style={{ lineHeight: "24px", color: "#00A859" }}>Memory that compounds</h3>
              <p className="text-[11px] text-cn-muted" style={{ marginTop: "8px", lineHeight: "16px" }}>CB learns your vendors and patterns. Week 1 it asks questions. Week 4 it posts automatically.</p>
            </div>
            <div className="bg-cn-border" />
            <div className="pl-4 pr-2">
              <span className="text-[9px] font-medium text-cn-muted uppercase tracking-wider block" style={{ lineHeight: "16px" }}>FIG 0.3</span>
              <div className="flex items-center justify-center" style={{ height: "220px", marginTop: "16px", marginBottom: "20px" }}>
                <img src="/illustrations/cb-fig-reports.svg" alt="" style={{ height: "200px", width: "auto" }} />
              </div>
              <h3 className="text-[13px] font-bold" style={{ lineHeight: "24px", color: "#FF5733" }}>Reports delivered in-chat</h3>
              <p className="text-[11px] text-cn-muted" style={{ marginTop: "8px", lineHeight: "16px" }}>&ldquo;Send me the P&amp;L&rdquo; → branded PDF in your WhatsApp. No login, no dashboard required. The reports come to you.</p>
            </div>
          </div>
        </section>

        <div className="border-t border-cn-border w-full" />

        {/* Send anything — vision + audio explanation */}
        <section className="mx-auto max-w-[var(--content-max-w)] product-section-mobile md:page-grid pt-[80px] pb-[48px]">
          <FadeIn style={{ gridColumn: "2 / 6" }}>
            <h2 className="text-[22px] md:text-[30px] font-bold tracking-tight" style={{ lineHeight: "1" }}>
              <span className="bg-gradient-to-r from-[#0077B6] via-[#00A859] to-[#FF5733] bg-clip-text text-transparent">Send a photo, a voice note,</span><br className="hidden md:inline" />
              <span className="bg-gradient-to-r from-[#0077B6] via-[#00A859] to-[#FF5733] bg-clip-text text-transparent"> or just type it out.</span>
            </h2>
          </FadeIn>
          <FadeIn className="mt-3 md:mt-0" style={{ gridColumn: "7 / 12" }} delay={0.1}>
            <p className="text-[13px] text-cn-muted" style={{ lineHeight: "1.3" }}>
              Snap a receipt, photograph an invoice, take a picture of a handwritten note — CB reads it and posts the entry. On the go? Leave a voice note describing the transaction and CB listens and records it instantly. No forms, no data entry, no waiting.
            </p>
          </FadeIn>
        </section>

        {/* Voice note demo — Transaction Detail report + video overlay */}
        <section className="mx-auto max-w-[var(--content-max-w)] product-section-mobile md:page-grid pb-[80px]">
          <ScaleIn className="relative" style={{ gridColumn: "2 / 12" }}>
            {/* Mobile: WhatsApp first → then dashboard (flow: voice note → result) */}
            <div className="md:hidden flex flex-col items-center gap-4">
              <div className="w-[240px] shadow-xl" style={{ borderRadius: "12px", overflow: "hidden", border: "1px solid rgba(0,0,0,0.08)" }}>
                <img
                  src="/screenshots/cb-voicenote-frame.jpg"
                  alt="Voice note transaction posted via WhatsApp"
                  className="w-full h-auto"
                />
              </div>
              <svg className="w-8 h-12 text-cn-muted" viewBox="0 0 32 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 4 C9 14, 25 14, 25 24 C25 33, 10 33, 13 37 C14 39, 15 40, 15 42" />
                <path d="M11 39 L15 44 L19 39" />
              </svg>
              <div className="w-full p-4" style={{ background: "#f0f7fa", borderRadius: "4px" }}>
                <img
                  src="/screenshots/scrnli_V3sXa5N3o2o9KB.png"
                  alt="CaribBooks dashboard — Transaction Detail report"
                  className="w-full h-auto shadow-lg"
                  style={{ borderRadius: "2px" }}
                />
              </div>
            </div>

            {/* Desktop: Dashboard with voice note overlay */}
            <div className="hidden md:block">
              <div
                className="p-10"
                style={{ background: "#f0f7fa", borderRadius: "4px" }}
              >
                <img
                  src="/screenshots/scrnli_V3sXa5N3o2o9KB.png"
                  alt="CaribBooks dashboard — Transaction Detail report"
                  className="w-full h-auto shadow-lg"
                  style={{ borderRadius: "2px" }}
                />
              </div>
              <div
                className="absolute shadow-2xl"
                style={{
                  left: "4px",
                  bottom: "12px",
                  width: "220px",
                  borderRadius: "12px",
                  overflow: "hidden",
                  border: "1px solid rgba(0,0,0,0.08)",
                }}
              >
                <img
                  src="/screenshots/cb-voicenote-frame.jpg"
                  alt="Voice note transaction posted via WhatsApp"
                  className="w-full h-auto"
                />
              </div>
            </div>
          </ScaleIn>
        </section>

        {/* Reports continuation — same section as "Send a photo" */}
        <section className="mx-auto max-w-[var(--content-max-w)] product-section-mobile md:page-grid pb-[48px]">
          <FadeIn style={{ gridColumn: "2 / 12" }}>
            <p className="text-[22px] md:text-[30px] font-bold tracking-tight" style={{ lineHeight: "1" }}>
              <span className="text-cn-muted">...and every entry auto-syncs to your </span><span className="bg-gradient-to-r from-[#0077B6] via-[#00A859] to-[#FF5733] bg-clip-text text-transparent">11 financial reports.</span>
            </p>
          </FadeIn>
        </section>

        {/* Reports index screenshot */}
        <section className="mx-auto max-w-[var(--content-max-w)] product-section-mobile md:page-grid pb-[80px]">
          <ScaleIn style={{ gridColumn: "2 / 12" }}>
            <div className="overflow-hidden shadow-xl" style={{ border: "1px solid #e5e5e5" }}>
              <img
                src="/screenshots/scrnli_7J5rvOPXPtNwkM.png"
                alt="CaribBooks dashboard — 11 accounting reports available"
                className="w-full h-auto"
              />
            </div>
          </ScaleIn>
        </section>

        <div className="border-t border-cn-border w-full" />

        {/*
          ISOLATION, PLACED IMMEDIATELY BEFORE THE AUDIENCE SPLIT.

          The next thing on this page is a card asking "do you manage clients
          who need their books kept?" A partner reading that has one unspoken
          question, which is whether their clients' books are safe with us.
          Answering it one beat before they are asked to click is the whole
          reason this section sits here rather than at the foot of the page.
        */}
        <section className="mx-auto max-w-[var(--content-max-w)] product-section-mobile md:page-grid pt-[80px] pb-[80px]">
          <FadeIn style={{ gridColumn: "2 / 6" }}>
            <h2 className="text-[22px] md:text-[30px] font-bold tracking-tight" style={{ lineHeight: "1" }}>
              <span className="text-cn-muted">Every client&rsquo;s books</span><br />
              <span className="bg-gradient-to-r from-[#0077B6] via-[#00A859] to-[#FF5733] bg-clip-text text-transparent">stay their own.</span>
            </h2>
          </FadeIn>
          <FadeIn className="mt-3 md:mt-0" style={{ gridColumn: "7 / 12" }} delay={0.1}>
            <p className="text-[13px] text-cn-muted" style={{ lineHeight: "1.3" }}>
              CB cannot name another business. The client is bound by the system from the number
              their message arrived on, before the agent runs at all, so there is no field and no
              phrasing through which it could ask for someone else&rsquo;s ledger. It is not a
              rule CB follows. It is a capability it was never given.
            </p>
            <p className="text-[13px] text-cn-muted" style={{ lineHeight: "1.3", marginTop: "12px" }}>
              It cannot delete a posted transaction either. To undo one it posts a reversing
              entry, so the original stays in the ledger and the audit trail survives the
              correction.
            </p>
            <p className="text-[13px] text-cn-muted" style={{ lineHeight: "1.3", marginTop: "12px" }}>
              Encrypted in transit and at rest, and deleted when you ask for it.
            </p>
            <p style={{ marginTop: "16px" }}>
              <span className="text-[10px] font-medium text-cn-muted">4.0</span>{" "}
              <Link href="/data-protection" className="text-[11px] font-medium bg-gradient-to-r from-[#0077B6] to-[#00A859] bg-clip-text text-transparent hover:opacity-80 transition-opacity">
                How we protect your data +
              </Link>
            </p>
          </FadeIn>
        </section>

        <div className="border-t border-cn-border w-full" />

        {/* Built for */}
        <section className="mx-auto max-w-[var(--content-max-w)] product-section-mobile md:page-grid pt-[80px] pb-[24px]">
          <FadeIn style={{ gridColumn: "2 / 12" }}>
            <h2 className="text-[22px] md:text-[30px] font-bold tracking-tight text-cn-muted">Built for how you <span className="bg-gradient-to-r from-[#0077B6] to-[#FF5733] bg-clip-text text-transparent">work</span></h2>
          </FadeIn>
        </section>

        {/* Cards — mobile: swipeable squares. Desktop: side by side in panel */}
        <section className="mx-auto max-w-[var(--content-max-w)] product-section-mobile md:page-grid pb-[80px]">
          {/* Mobile — edge-to-edge, first card dominant, second peeks */}
          <div className="md:hidden">
            <div className="flex overflow-x-auto gap-3 pl-4 no-scrollbar">
              <Link href="/services/caribbooks/pricing" className="shrink-0 w-[80vw] min-h-[380px] rounded-2xl p-7 flex flex-col justify-between relative overflow-hidden" style={{ background: "linear-gradient(160deg, #f5f5f5 0%, #ebebeb 100%)" }}>
                <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(circle at 85% 20%, rgba(0,119,182,0.35) 0%, transparent 50%), radial-gradient(circle at 15% 80%, rgba(0,119,182,0.28) 0%, transparent 45%), radial-gradient(circle at 50% 50%, rgba(0,168,89,0.20) 0%, transparent 40%), radial-gradient(circle at 60% 55%, rgba(0,119,182,0.20) 0%, transparent 40%)" }} />
                <p className="text-[18px] font-bold text-cn-muted" style={{ lineHeight: "1.3" }}>
                  Are you a business owner doing your own books after hours? Or paying someone monthly for work that takes them minutes?
                </p>
                <div className="flex items-center gap-3">
                  <img src="/logo/logo-caribbooks.svg" alt="CaribBooks" className="h-[16px] w-auto" />
                  <div className="w-px h-[28px] bg-cn-border" />
                  <div>
                    <p className="text-[12px] font-bold text-cn-muted leading-tight">For Businesses</p>
                    <p className="text-[11px] text-cn-muted/60 leading-tight mt-0.5">View our pricing</p>
                  </div>
                </div>
              </Link>
              <Link href="/services/caribbooks/pricing?tab=partner" className="shrink-0 w-[80vw] min-h-[380px] rounded-2xl p-7 flex flex-col justify-between mr-4 relative overflow-hidden" style={{ background: "linear-gradient(160deg, #f5f5f5 0%, #ebebeb 100%)" }}>
                <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(circle at 20% 30%, rgba(255,87,51,0.35) 0%, transparent 50%), radial-gradient(circle at 80% 75%, rgba(255,87,51,0.28) 0%, transparent 45%), radial-gradient(circle at 50% 50%, rgba(0,168,89,0.20) 0%, transparent 40%), radial-gradient(circle at 50% 10%, rgba(255,87,51,0.20) 0%, transparent 40%)" }} />
                <p className="text-[18px] font-bold text-cn-muted" style={{ lineHeight: "1.3" }}>
                  Do you manage clients who need their books kept?
                </p>
                <div className="flex items-center gap-3">
                  <img src="/logo/logo-caribbooks.svg" alt="CaribBooks" className="h-[16px] w-auto" />
                  <div className="w-px h-[28px] bg-cn-border" />
                  <div>
                    <p className="text-[12px] font-bold text-cn-muted leading-tight">For Partners</p>
                    <p className="text-[11px] text-cn-muted/60 leading-tight mt-0.5">View our pricing</p>
                  </div>
                </div>
              </Link>
            </div>
          </div>

          {/* Desktop */}
          <FadeIn className="hidden md:block" style={{ gridColumn: "2 / 12" }}>
            <div className="rounded-2xl border border-cn-border p-3 flex flex-row gap-3">
              <Link href="/services/caribbooks/pricing" className="overflow-hidden rounded-2xl p-10 flex flex-col justify-between flex-[2] hover:opacity-95 transition-opacity relative" style={{ background: "linear-gradient(160deg, #f5f5f5 0%, #ebebeb 100%)", minHeight: "380px" }}>
                <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(circle at 90% 15%, rgba(0,119,182,0.35) 0%, transparent 50%), radial-gradient(circle at 10% 85%, rgba(0,119,182,0.28) 0%, transparent 45%), radial-gradient(circle at 55% 50%, rgba(0,119,182,0.20) 0%, transparent 40%)" }} />
                <p className="text-[20px] font-bold text-cn-muted" style={{ lineHeight: "1.3" }}>
                  Are you a business owner doing your own books after hours? Or paying someone monthly for work that takes them minutes?
                </p>
                <div className="flex items-center gap-3">
                  <img src="/logo/logo-caribbooks.svg" alt="CaribBooks" className="h-[14px] w-auto" />
                  <div className="w-px h-[28px] bg-cn-border" />
                  <div>
                    <p className="text-[11px] font-bold text-cn-muted leading-tight">For Businesses</p>
                    <p className="text-[10px] text-cn-muted/60 leading-tight mt-1">View our pricing</p>
                  </div>
                </div>
              </Link>
              <Link href="/services/caribbooks/pricing?tab=partner" className="overflow-hidden rounded-2xl p-10 flex flex-col justify-between flex-[1] hover:opacity-95 transition-opacity relative" style={{ background: "linear-gradient(160deg, #f5f5f5 0%, #ebebeb 100%)", minHeight: "380px" }}>
                <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(circle at 25% 25%, rgba(255,87,51,0.35) 0%, transparent 50%), radial-gradient(circle at 75% 80%, rgba(255,87,51,0.28) 0%, transparent 45%), radial-gradient(circle at 50% 15%, rgba(255,87,51,0.20) 0%, transparent 40%)" }} />
                <p className="text-[20px] font-bold text-cn-muted" style={{ lineHeight: "1.3" }}>
                  Do you manage clients who need their books kept?
                </p>
                <div className="flex items-center gap-3">
                  <img src="/logo/logo-caribbooks.svg" alt="CaribBooks" className="h-[14px] w-auto" />
                  <div className="w-px h-[28px] bg-cn-border" />
                  <div>
                    <p className="text-[11px] font-bold text-cn-muted leading-tight">For Partners</p>
                    <p className="text-[10px] text-cn-muted/60 leading-tight mt-1">View our pricing</p>
                  </div>
                </div>
              </Link>
            </div>
          </FadeIn>
        </section>

        <Footer />
      </main>
    </>
  );
}


function DashboardMockup() {
  const transactions = [
    {
      memo: "Bi-weekly salary payment — NCB bank transfer",
      date: "Fri, Aug 1",
      ref: "msg:evt_8df06ac",
      dr: { account: "Labor Expense", category: "Expenses" },
      cr: { account: "Bank Account (NCB)", category: "Assets" },
      amount: "47,500",
      currency: "JMD",
    },
    {
      memo: "Marcus wired JMD 150,000 for agentic system workflow — contract revenue, landed in Scotia account",
      date: "Fri, Jul 31",
      ref: "msg:evt_3a9eb80",
      dr: { account: "Bank Account (Scotia)", category: "Assets" },
      cr: { account: "Contract Revenue", category: "Revenue" },
      amount: "150,000",
      currency: "JMD",
    },
    {
      memo: "Mechanic — van tire repair, JMD 12,000 paid from owner's personal cash (not business Cash account)",
      date: "Fri, Jul 31",
      ref: "msg:evt_8e14804",
      dr: { account: "Vehicle Maintenance", category: "Expenses" },
      cr: { account: "Owner's Capital", category: "Capital" },
      amount: "12,000",
      currency: "JMD",
    },
    {
      memo: "Payment to Denroy Thompson for consulting services, paid in cash",
      date: "Fri, Jul 31",
      ref: "msg:evt_d35cca1",
      dr: { account: "Labor Expense", category: "Expenses" },
      cr: { account: "Cash", category: "Assets" },
      amount: "45,000",
      currency: "JMD",
    },
  ];

  return (
    <div className="flex bg-white" style={{ minHeight: "560px", zoom: 0.83 }}>
      {/* ══ Sidebar — 208px, bg-neutral-50, border-[#ededed] ══ */}
      <div className="w-[208px] border-r flex flex-col shrink-0" style={{ borderColor: "#ededed", background: "#fafafa" }}>
        {/* Header bar */}
        <div className="h-10 shrink-0 flex items-center justify-between px-2.5 border-b" style={{ borderColor: "#ededed" }}>
          <span className="text-[13px] font-bold tracking-tight pl-1" style={{ color: "#0077B6" }}>CaribBooks</span>
          <div className="flex items-center gap-0.5">
            <span className="p-1 rounded hover:bg-neutral-100 text-neutral-500">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            </span>
          </div>
        </div>

        {/* Greeting */}
        <div className="px-3 pt-8 pb-2">
          <div className="pl-1">
            <div className="text-[10px] text-neutral-500 leading-none">Good afternoon</div>
            <div className="text-[20px] font-bold leading-tight tracking-tight mt-0.5 bg-gradient-to-r from-[#0077B6] via-[#009088] to-[#00A859] bg-clip-text text-transparent">
              Harbour View Roasters
            </div>
          </div>
        </div>

        {/* Client filter list */}
        <div className="flex-1 flex flex-col px-1.5" style={{ zoom: 0.85 }}>
          {/* Filter header */}
          <div className="px-3 pt-2.5 pb-4 flex items-center gap-1.5">
            <span className="p-0.5 -ml-0.5 rounded text-neutral-500">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M15 18l-6-6 6-6"/></svg>
            </span>
            <span className="text-[11px] font-bold truncate" style={{ color: "#0077B6" }}>Clients</span>
            <span className="ml-auto p-0.5 rounded text-neutral-500">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            </span>
          </div>

          {/* Client items */}
          <div className="space-y-px">
            <div className="flex items-start gap-1.5 pl-2 pr-1.5 py-1 rounded-md bg-neutral-200/70">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="mt-0.5 text-neutral-500 shrink-0"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              <div className="min-w-0">
                <div className="text-[10px] leading-tight truncate text-neutral-900 font-semibold">Harbour View Roasters</div>
                <div className="text-[8px] text-neutral-500 truncate mt-0.5 leading-tight">Food & Beverage</div>
              </div>
            </div>
          </div>
        </div>

        {/* Add new client */}
        <div className="shrink-0 px-2 pb-2 pt-1 border-t mt-1" style={{ borderColor: "#ededed" }}>
          <div className="flex items-center justify-center gap-1 py-1.5 px-2 rounded-full text-[10px] font-semibold bg-white border" style={{ borderColor: "#E4E4E4" }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#0077B6" strokeWidth="2.5" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>
            <span className="bg-gradient-to-r from-[#0077B6] via-[#009088] to-[#00A859] bg-clip-text text-transparent">Add new client</span>
          </div>
        </div>

        {/* Log out */}
        <div className="border-t p-2 shrink-0" style={{ borderColor: "#ededed", zoom: 0.85 }}>
          <div className="h-7 rounded-lg flex items-center gap-2 pl-2.5 pr-2 text-neutral-500">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" className="text-neutral-400"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16,17 21,12 16,7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            <span className="text-[13px] leading-normal whitespace-nowrap">Log out</span>
          </div>
        </div>
      </div>

      {/* ══ Main content area ══ */}
      <div className="flex-1 overflow-hidden">
        <div className="mx-auto px-4 pt-6 pb-24" style={{ maxWidth: "900px", zoom: 1.15 }}>
          {/* Client header */}
          <div className="border-b border-neutral-100 pb-3">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-[20px] font-bold leading-tight tracking-tight bg-gradient-to-r from-[#0077B6] via-[#009088] to-[#00A859] bg-clip-text text-transparent">
                  Harbour View Roasters
                </div>
                <div className="text-[11px] text-neutral-500 mt-1">Food & Beverage · Kingston, Jamaica</div>
              </div>
              <div className="text-[10px] text-neutral-400 font-mono">biz_harbour_view</div>
            </div>
          </div>

          {/* Tab nav */}
          <div className="mt-3 flex flex-wrap gap-1">
            {["Overview", "Transactions", "Invoices", "Bills", "Reports", "Vendors", "Messages", "Chart of Accounts"].map((tab) => (
              <span
                key={tab}
                className={`rounded-full px-2.5 py-1 text-[10px] font-medium whitespace-nowrap ${
                  tab === "Transactions"
                    ? "bg-neutral-100 text-neutral-900"
                    : "text-neutral-600"
                }`}
              >
                {tab}
              </span>
            ))}
          </div>

          {/* Transactions header */}
          <div className="flex items-center justify-between pb-3 border-b border-neutral-100 mb-4 mt-4">
            <div>
              <div className="text-[13px] font-bold text-neutral-900">Transactions as of August 1, 2026</div>
              <div className="text-[10px] text-neutral-500 mt-0.5">23 journal entries</div>
            </div>
            {/* Date picker pills */}
            <div className="flex items-center gap-1.5">
              <div className="flex items-center gap-1.5 rounded-full border px-3 py-1.5" style={{ borderColor: "#E4E4E4" }}>
                <span className="text-[9px] text-neutral-400">From</span>
                <span className="text-[10px] font-medium text-neutral-800">Jul 2, 2026</span>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#9B9B9B" strokeWidth="2" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
              </div>
              <span className="text-[9px] text-neutral-300">–</span>
              <div className="flex items-center gap-1.5 rounded-full border px-3 py-1.5" style={{ borderColor: "#E4E4E4" }}>
                <span className="text-[9px] text-neutral-400">To</span>
                <span className="text-[10px] font-medium text-neutral-800">Aug 1, 2026</span>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#9B9B9B" strokeWidth="2" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
              </div>
            </div>
          </div>

          {/* Month header */}
          <div className="text-[9px] font-semibold uppercase tracking-wider text-neutral-400 mb-1">August 2026</div>

          {/* Transaction rows */}
          <div className="divide-y divide-neutral-100">
            {transactions.map((txn, i) => (
              <div key={i} className="py-2.5 flex items-start gap-3">
                <div className="shrink-0 mt-0.5">
                  <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
                    <defs>
                      <linearGradient id={`txn-hero-${i}`} x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#0077B6" />
                        <stop offset="50%" stopColor="#009088" />
                        <stop offset="100%" stopColor="#00A859" />
                      </linearGradient>
                    </defs>
                    <circle cx="12" cy="12" r="9" stroke={`url(#txn-hero-${i})`} strokeWidth="0.75" />
                    <path d="M8 10H16M8 14H13" stroke={`url(#txn-hero-${i})`} strokeWidth="0.75" strokeLinecap="round" />
                  </svg>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[10px] font-medium text-neutral-900 leading-snug">{txn.memo}</div>
                  <div className="text-[9px] text-neutral-500 mt-1">
                    <span className="text-neutral-600 font-medium">{txn.date}</span>
                    <span className="text-neutral-300 mx-1">·</span>
                    <span className="text-neutral-400">{txn.ref}</span>
                  </div>
                  <div className="text-[9px] mt-0.5">
                    <span className="inline-block w-[14px] text-[8px] font-semibold text-[#FF5733]">DR</span>
                    <span>{txn.dr.account}</span>
                    <span className="text-neutral-300 ml-1">({txn.dr.category})</span>
                  </div>
                  <div className="text-[9px]">
                    <span className="inline-block w-[14px] text-[8px] font-semibold text-green-600/80">CR</span>
                    <span>{txn.cr.account}</span>
                    <span className="text-neutral-300 ml-1">({txn.cr.category})</span>
                  </div>
                </div>
                <div className="shrink-0 text-right">
                  <div className="text-[11px] font-semibold tabular-nums text-neutral-800">J${txn.amount}</div>
                  <div className="text-[8px] text-neutral-400 mt-0.5 uppercase">{txn.currency}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
