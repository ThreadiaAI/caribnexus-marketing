"use client";

import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { CaribbeanScene } from "@/components/CaribbeanScene";
import { FadeIn, ScaleIn } from "@/components/Animate";

export default function HomePage() {
  return (
    <>
      <Nav />
      <main className="pt-[var(--nav-h)]">
        {/* Hero */}
        <section className="mx-auto max-w-[var(--content-max-w)] product-section-mobile md:page-grid pt-[48px] md:pt-[160px] pb-[24px] md:pb-[80px]">
          <FadeIn className="flex-1" style={{ gridColumn: "2 / 8" }} y={32} duration={0.8}>
            <h1 className="text-[28px] md:text-[40px] font-bold tracking-tight" style={{ lineHeight: "1.1" }}>
              <span className="text-cn-muted">
                Intelligent systems for
              </span>
              <br />
              <span className="bg-gradient-to-r from-[#0077B6] via-[#00A859] to-[#FF5733] bg-clip-text text-transparent">
                Caribbean businesses
              </span>
            </h1>
            <p className="text-[13px] text-cn-muted max-w-[440px]" style={{ marginTop: "24px", lineHeight: "1.3" }}>
              We work with Caribbean businesses <span className="bg-gradient-to-r from-[#0077B6] via-[#00A859] to-[#FF5733] bg-clip-text text-transparent font-medium">who want to do more with less.</span> We analyze your operations, identify the waste, and build AI systems so your team focuses on what grows revenue.
            </p>
            <div className="flex items-center gap-3" style={{ marginTop: "16px" }}>
              <button
                onClick={() => window.dispatchEvent(new CustomEvent("open-voice-widget", { detail: "book" }))}
                className="text-[11px] font-medium text-white px-4 py-[6px] rounded-full transition-all hover:opacity-90"
                style={{ background: "linear-gradient(135deg, #0077B6, #009088, #00A859, #FF5733)" }}
              >
                Book a consultation
              </button>
              <a
                href="/services"
                className="text-[11px] font-medium text-cn-muted px-4 py-[6px] rounded-full border border-cn-border hover:text-[#FF5733] transition-colors"
              >
                See our services
              </a>
            </div>
          </FadeIn>
          <div className="hidden md:block" style={{ gridColumn: "7 / 13", marginTop: "-300px" }}>
            <CaribbeanScene />
          </div>
        </section>

        <div className="border-t border-cn-border w-full" />

        {/* Product Section — heading left, desc right */}
        <section className="mx-auto max-w-[var(--content-max-w)] product-section-mobile md:page-grid pt-[80px] pb-[24px]">
          <FadeIn style={{ gridColumn: "2 / 6" }}>
            <h2 className="text-[22px] md:text-[30px] font-bold tracking-tight" style={{ lineHeight: "1.15", position: "relative", top: "-1px" }}>
              <span className="text-cn-muted">Introducing </span>
              <img src="/logo/logo-caribbooks.svg" alt="CaribBooks" className="inline-block h-[20px] md:h-[26px] align-baseline" style={{ marginBottom: "-2px" }} /><span className="text-cn-muted">,</span><br />
              <span className="text-cn-muted" style={{ position: "relative", top: "-3px" }}>our flagship product</span>
            </h2>
          </FadeIn>
          <FadeIn className="mt-3 md:mt-0" style={{ gridColumn: "7 / 12" }} delay={0.1}>
            <p className="text-[13px] text-cn-muted" style={{ lineHeight: "1.3" }}>
              AI bookkeeping via WhatsApp. One message posts a journal entry. Every report updates in real time. Built for JMD, GCT, and TRN compliance.
            </p>

            <div className="flex items-center gap-3" style={{ marginTop: "16px" }}>
              <a
                href="https://books.caribnexusai.com/signup"
                className="text-[11px] font-medium text-white px-4 py-[6px] rounded-full transition-all hover:opacity-90"
                style={{ background: "linear-gradient(135deg, #0077B6, #009088, #00A859)" }}
              >
                Sign up
              </a>
              <a
                href="/services/caribbooks"
                className="text-[11px] font-medium text-cn-muted px-4 py-[6px] rounded-full border border-cn-border hover:text-[#FF5733] transition-colors"
              >
                Learn more
              </a>
            </div>
          </FadeIn>
        </section>

        {/* Cards: desktop = 3 cols inside grid. Mobile = horizontal scroll */}
        <section className="mx-auto max-w-[var(--content-max-w)] product-section-mobile md:page-grid pb-[64px]">
          <div className="hidden md:grid md:grid-cols-[1fr_1px_1fr_1px_1fr] md:gap-0" style={{ gridColumn: "2 / 12", marginTop: "40px" }}>
            <Card
              fig="FIG 0.1"
              img="/illustrations/feature-1-message.svg"
              title="Message to ledger"
              titleColor="#0077B6"
              desc="Text your transaction on WhatsApp. CB posts the double-entry journal entry automatically."
            />
            <div className="bg-cn-border" />
            <Card
              fig="FIG 0.2"
              img="/illustrations/feature-2-scales.svg"
              title="Double-entry by default"
              titleColor="#00A859"
              desc="Every transaction creates one debit and one credit of equal amounts. The math is always balanced."
            />
            <div className="bg-cn-border" />
            <Card
              fig="FIG 0.3"
              img="/illustrations/feature-3-reports.svg"
              title="One entry, every report"
              titleColor="#FF5733"
              desc="A single journal entry feeds all 11 financial reports. P&L, Balance Sheet, Trial Balance — all live."
            />
          </div>
        </section>

        {/* Mobile cards */}
        <div className="md:hidden px-4 pb-[40px] mt-[8px]">
          <div className="flex overflow-x-auto gap-4 snap-x snap-mandatory no-scrollbar pb-2">
            <MobileCard fig="FIG 0.1" img="/illustrations/feature-1-message.svg" title="Message to ledger" titleColor="#0077B6" desc="Text your transaction on WhatsApp. CB posts the double-entry journal entry automatically." />
            <MobileCard fig="FIG 0.2" img="/illustrations/feature-2-scales.svg" title="Double-entry by default" titleColor="#00A859" desc="Every transaction creates one debit and one credit of equal amounts. The math is always balanced." />
            <MobileCard fig="FIG 0.3" img="/illustrations/feature-3-reports.svg" title="One entry, every report" titleColor="#FF5733" desc="A single journal entry feeds all 11 financial reports. P&L, Balance Sheet, Trial Balance — all live." />
          </div>
        </div>

        <div className="border-t border-cn-border w-full" />

        {/* Automations Section — heading left, desc right */}
        <section className="mx-auto max-w-[var(--content-max-w)] product-section-mobile md:page-grid pt-[80px] pb-[24px]">
          <FadeIn style={{ gridColumn: "2 / 6" }}>
            <h2 className="text-[22px] md:text-[30px] font-bold tracking-tight" style={{ lineHeight: "1.15" }}>
              <img src="/logo/logo-caribnexus-automations.svg" alt="CaribNexus AI Automations" className="inline-block h-[24px] md:h-[32px]" style={{ marginBottom: "-4px" }} />

            </h2>
            <p className="text-[13px] text-cn-muted mt-1 pb-3 border-b border-cn-border" style={{ lineHeight: "1.3", position: "relative", top: "4px" }}>
              Built for businesses that want to do more without hiring more.
            </p>
          </FadeIn>
          <FadeIn className="mt-3 md:mt-0" style={{ gridColumn: "7 / 12" }} delay={0.1}>
            <p className="text-[13px] text-cn-muted" style={{ lineHeight: "1.3" }}>
              Intelligent systems that run the digital side of your business. Social media, content, customer service, operations — deployed across WhatsApp, Instagram, and every channel your customers use.
            </p>
            <div className="flex items-center gap-3" style={{ marginTop: "16px" }}>
              <button
                onClick={() => window.dispatchEvent(new CustomEvent("open-voice-widget", { detail: "book" }))}
                className="text-[11px] font-medium text-white px-4 py-[6px] rounded-full transition-all hover:opacity-90"
                style={{ background: "linear-gradient(135deg, #FF5733, #00A859)" }}
              >
                Get started
              </button>
              <a
                href="/services/automations"
                className="text-[11px] font-medium text-[#0077B6] px-4 py-[6px] rounded-full border border-[#0077B6]/30 hover:border-[#0077B6] transition-colors"
              >
                Learn more
              </a>
            </div>
          </FadeIn>
        </section>

        {/* Automations Cards: desktop = 3 cols inside grid. Mobile = horizontal scroll */}
        <section className="mx-auto max-w-[var(--content-max-w)] product-section-mobile md:page-grid pb-[64px]">
          <div className="hidden md:grid md:grid-cols-[1fr_1px_1fr_1px_1fr] md:gap-0" style={{ gridColumn: "2 / 12", marginTop: "40px" }}>
            <Card
              fig="FIG 1.1"
              img="/illustrations/auto-customer-service-transparent.png"
              title="Customer service, always on"
              titleColor="#0077B6"
              desc="Every message answered — voice notes, images, text. Across every channel. Escalates only when needed."
            />
            <div className="bg-cn-border" />
            <Card
              fig="FIG 1.2"
              img="/illustrations/auto-social-media-transparent.png"
              title="Social media, fully managed"
              titleColor="#00A859"
              desc="Posts created, published, and monitored. Comments replied to. DMs handled. Your social presence runs without you."
            />
            <div className="bg-cn-border" />
            <Card
              fig="FIG 1.3"
              img="/illustrations/auto-content-strategy-transparent.png"
              title="Content, on autopilot"
              titleColor="#FF5733"
              desc="A month of content planned, designed, and scheduled. Sent to you for approval. Published on the date you agreed."
            />
          </div>
        </section>

        {/* Automations Mobile cards */}
        <div className="md:hidden px-4 pb-[40px] mt-[8px]">
          <div className="flex overflow-x-auto gap-4 snap-x snap-mandatory no-scrollbar pb-2">
            <MobileCard fig="FIG 1.1" img="/illustrations/auto-customer-service-transparent.png" title="Customer service, always on" titleColor="#0077B6" desc="Every message answered in seconds — voice notes, images, text. Across WhatsApp, Instagram, and Email." />
            <MobileCard fig="FIG 1.2" img="/illustrations/auto-social-media-transparent.png" title="Social media, fully managed" titleColor="#00A859" desc="Posts created, published, and monitored. Comments replied to. DMs handled." />
            <MobileCard fig="FIG 1.3" img="/illustrations/auto-content-strategy-transparent.png" title="Content, on autopilot" titleColor="#FF5733" desc="A month of content planned, designed, and scheduled. Published on the date you agreed." />
          </div>
        </div>

        <div className="border-t border-cn-border w-full" />

        {/* Consultancy Section — heading left, desc right */}
        <section className="mx-auto max-w-[var(--content-max-w)] product-section-mobile md:page-grid pt-[80px] pb-[24px]">
          <div style={{ gridColumn: "2 / 6" }}>
            <h2 className="text-[22px] md:text-[30px] font-bold tracking-tight" style={{ lineHeight: "1.15" }}>
              <span className="text-cn-muted">We build AI systems</span><br />
              <span className="text-cn-muted">that </span>
              <span className="bg-gradient-to-r from-[#0077B6] via-[#00A859] to-[#FF5733] bg-clip-text text-transparent">cut costs by 50%.</span>
            </h2>
          </div>
          <div className="mt-3 md:mt-0" style={{ gridColumn: "7 / 12" }}>
            <p className="text-[13px] text-cn-muted" style={{ lineHeight: "1.3" }}>
              We walk in, analyze your operations, and identify where AI can eliminate repetitive work — saving hours per week and reducing overhead. Custom-built systems, not off-the-shelf tools.
            </p>
            <p style={{ marginTop: "16px" }}>
              <span className="text-[10px] font-medium text-cn-muted">1.0</span>{" "}
              <button onClick={() => window.dispatchEvent(new CustomEvent("open-voice-widget", { detail: "book" }))} className="text-[11px] font-medium bg-gradient-to-r from-[#0077B6] via-[#00A859] to-[#FF5733] bg-clip-text text-transparent hover:opacity-80 transition-opacity">
                Get a consultation +
              </button>
            </p>
          </div>
        </section>

        {/* Consultancy — dark panel (image LEFT, text RIGHT) */}
        <section className="mx-auto max-w-[var(--content-max-w)] product-section-mobile md:page-grid pt-[40px] pb-[80px]">
          <div
            className="relative rounded-none overflow-hidden flex flex-col justify-between panel-scale-mobile"
            style={{
              gridColumn: "2 / 12",
              background: "linear-gradient(160deg, #0A0A0A 0%, #111827 40%, #0d1a2e 100%)",
              minHeight: "680px",
              padding: "48px",
            }}
          >
            <div className="flex h-full flex-1 items-stretch">
              {/* Left: illustration */}
              <div className="flex items-center justify-center flex-1 pr-8">
                <img
                  src="/illustrations/feature-neural-pathway-transparent.png"
                  alt="AI operations network"
                  style={{
                    height: "380px",
                    width: "auto",
                    objectFit: "contain",
                    filter: "invert(1) brightness(1.5)",
                    opacity: 0.8,
                  }}
                />
              </div>

              {/* Divider */}
              <div className="w-px bg-white/10 self-stretch" />

              {/* Right: vertically centered text */}
              <div className="flex flex-col justify-center w-[45%] shrink-0 pr-[10%] pl-8 space-y-4">
                <p className="text-[12px] font-semibold text-white" style={{ lineHeight: "15px" }}>
                  From analysis to production
                </p>
                <p className="text-[11px] text-white/50" style={{ lineHeight: "16px" }}>
                  We map your operations end-to-end. Every<br />
                  bottleneck, every repetitive task, every decision<br />
                  that doesn&apos;t need a human.
                </p>
                <p className="text-[11px] text-white/50" style={{ lineHeight: "16px" }}>
                  Then we build the system — purpose-built AI<br />
                  that plugs into your existing workflow. Not a<br />
                  demo. A production system you own.
                </p>
                <p className="text-[11px] text-white/50" style={{ lineHeight: "16px" }}>
                  Bookkeeping, customer service, lead qualification,<br />
                  internal ops — wherever repetition lives, AI<br />
                  replaces it.
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className="border-t border-cn-border w-full" />

        <div className="border-t border-cn-border w-full" />

        {/*
          DATA PROTECTION, LAST AND SHORT.

          It sits here rather than beside CaribBooks because the objection forms
          on its own by this point: the reader has seen we would hold their
          clients' books. Answering it after the case is made reads as
          confidence; answering it during reads as pre-emptive defence.

          One section, no cards, no badges. A home page that starts listing
          security features sounds like one that expects to be doubted.
        */}

        <div className="border-t border-cn-border w-full" />

        {/*
          GOVERNANCE IS COMPANY LEVEL, NOT PRODUCT LEVEL.

          An earlier draft put this line inside the CaribBooks block, which
          quietly said the rules were a bookkeeping feature. They are not. The
          same handling applies to every system we build, and this section sits
          after both product lines for that reason.

          The two lines isolate differently and the copy says so rather than
          flattening it. CaribBooks is one multi-tenant system, so isolation is
          a property of its architecture. An Automations system is built for a
          single business, so there is no second tenant for it to reach.
        */}
        <section className="mx-auto max-w-[var(--content-max-w)] product-section-mobile md:page-grid pt-[80px] pb-[24px]">
          <FadeIn style={{ gridColumn: "2 / 6" }}>
            <h2 className="text-[22px] md:text-[30px] font-bold tracking-tight" style={{ lineHeight: "1.15" }}>
              <span className="text-cn-muted">Your data, and what</span><br />
              <span className="bg-gradient-to-r from-[#0077B6] via-[#00A859] to-[#FF5733] bg-clip-text text-transparent">we do with it.</span>
            </h2>
          </FadeIn>
          <FadeIn className="mt-3 md:mt-0" style={{ gridColumn: "7 / 12" }} delay={0.1}>
            <p className="text-[13px] text-cn-muted" style={{ lineHeight: "1.3" }}>
              The same rules govern everything we build. Encrypted in transit and at rest, held
              in jurisdictions we name rather than gesture at, kept to a published schedule, and
              deleted when you ask. We do not train foundation models on your data.
            </p>
            <p className="text-[13px] text-cn-muted" style={{ lineHeight: "1.3", marginTop: "12px" }}>
              In CaribBooks, every business sits in its own partition and the agent has no way to
              name another one. In CaribNexus Automations, each system is built for a single
              business, so there is no second business for it to reach.
            </p>
            <p style={{ marginTop: "16px" }}>
              <span className="text-[10px] font-medium text-cn-muted">2.0</span>{" "}
              <a href="/data-protection" className="text-[11px] font-medium bg-gradient-to-r from-[#0077B6] to-[#00A859] bg-clip-text text-transparent hover:opacity-80 transition-opacity">
                How we protect your data +
              </a>
            </p>
          </FadeIn>
        </section>

        {/* Closing CTA */}
        <section className="py-[80px] text-center">
          <h2 className="text-[22px] md:text-[30px] font-bold tracking-tight text-cn-muted">Built for how you work. Available today.</h2>
        </section>

        <Footer />
      </main>
    </>
  );
}

function Card({ fig, img, title, titleColor, desc }: { fig: string; img: string; title: string; titleColor: string; desc: string }) {
  return (
    <div className="pl-4 pr-2">
      <span className="text-[9px] font-medium text-cn-muted uppercase tracking-wider block" style={{ lineHeight: "16px" }}>{fig}</span>
      <div className="flex items-center justify-center" style={{ height: "180px", marginTop: "16px", marginBottom: "20px" }}>
        <img src={img} alt="" style={{ height: "190px", width: "auto" }} />
      </div>
      <h3 className="text-[13px] font-bold" style={{ lineHeight: "24px", color: titleColor }}>{title}</h3>
      <p className="text-[11px] text-cn-muted" style={{ marginTop: "8px", lineHeight: "16px" }}>{desc}</p>
    </div>
  );
}

function MobileCard({ fig, img, title, titleColor, desc }: { fig: string; img: string; title: string; titleColor: string; desc: string }) {
  return (
    <div className="flex flex-col border border-cn-border rounded-none p-4 shadow-sm min-w-[220px] max-w-[220px] h-[320px] snap-start shrink-0 bg-white">
      <div className="flex-1 mb-3">
        <span className="text-[9px] font-medium text-cn-muted uppercase tracking-wider block mb-2">{fig}</span>
        <h3 className="text-[13px] font-bold" style={{ color: titleColor }}>{title}</h3>
        <p className="text-[11px] text-cn-muted mt-1 leading-relaxed">{desc}</p>
      </div>
      <div className="flex items-center justify-center mt-auto mb-2">
        <img src={img} alt="" style={{ height: "180px", width: "auto" }} />
      </div>
    </div>
  );
}
