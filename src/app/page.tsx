"use client";

import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { FadeIn, ScaleIn } from "@/components/Animate";
import { NetworkDiagram } from "@/components/NetworkDiagram";
import Link from "next/link";

export default function HomePage() {
  return (
    <>
      <Nav />
      <main className="pt-[var(--nav-h)]">
        {/* Hero */}
        <section className="mx-auto max-w-[var(--content-max-w)] product-section-mobile md:page-grid pt-[48px] md:pt-[104px] pb-[40px] md:pb-[72px]">
          <FadeIn className="flex-1" style={{ gridColumn: "2 / 8" }} y={32} duration={0.8}>
            <h1 className="text-[30px] md:text-[42px] font-semibold tracking-tight" style={{ lineHeight: "1.1", letterSpacing: "-0.025em" }}>
              <span className="text-cn-muted">
                We build AI teams for
              </span>
              <br />
              <span className="bg-gradient-to-r from-[#0077B6] via-[#00A859] to-[#FF5733] bg-clip-text text-transparent">
                Caribbean businesses
              </span>
            </h1>
            <p className="text-[15px] md:text-[16px] text-cn-muted max-w-[520px]" style={{ marginTop: "20px", lineHeight: "1.6" }}>
              We work with Caribbean businesses <span className="bg-gradient-to-r from-[#0077B6] via-[#00A859] to-[#FF5733] bg-clip-text text-transparent font-medium">who want to do more with less.</span> We analyze your operations, identify the waste, and build AI systems so your team focuses on what grows revenue.
            </p>
            <div className="flex items-center gap-3" style={{ marginTop: "26px" }}>
              <Link href="/contact"
                className="text-[14px] font-medium text-white px-5 py-[10px] rounded-full transition-all hover:opacity-90"
                style={{ background: "linear-gradient(135deg, #0077B6, #009088, #00A859, #FF5733)" }}
              >
                Book a consultation
              </Link>
              <a
                href="/services"
                className="text-[14px] font-medium text-cn-muted px-5 py-[10px] rounded-full border border-cn-border hover:text-[#FF5733] transition-colors"
              >
                See our services
              </a>
            </div>
          </FadeIn>

          {/* Beside the headline on a wide screen; UNDER it on a phone,
              where side by side would squeeze the words. It was hidden
              outright on mobile, which meant most visitors never saw the one
              thing on the page that moves. */}
          <FadeIn
            className="flex items-center justify-center mt-8 md:mt-0"
            style={{ gridColumn: "8 / 13" }}
            delay={0.15}
            duration={0.9}
          >
            <NetworkDiagram className="w-full h-auto max-h-[min(62vw,300px)] md:max-h-[min(42vw,400px)]" />
          </FadeIn>
        </section>

        <div className="border-t border-cn-border w-full" />

        {/* Product Section — heading left, desc right */}
        <section className="mx-auto max-w-[var(--content-max-w)] product-section-mobile md:page-grid pt-[64px] pb-[20px]">
          <FadeIn style={{ gridColumn: "2 / 6" }}>
            <h2 className="text-[22px] md:text-[28px] font-semibold tracking-tight" style={{ lineHeight: "1.15", position: "relative", top: "-1px" }}>
              <span className="text-cn-muted">Introducing</span><br />
              <span className="inline-flex items-baseline">
                <img src="/logo/logo-caribbooks.svg" alt="CaribBooks" className="block h-[16px] md:h-[21px]" style={{ marginBottom: "-4px" }} />
                <span className="text-cn-muted">,</span>
              </span><br />
              <span className="text-cn-muted">our flagship product</span>
            </h2>
          </FadeIn>
          <FadeIn className="mt-3 md:mt-0" style={{ gridColumn: "7 / 12" }} delay={0.1}>
            <p className="text-[15px] text-cn-muted" style={{ lineHeight: "1.5" }}>
              A bookkeeper and a financial administrator on WhatsApp. One message posts the entry, updates every report, and writes the quotation, invoice or receipt that goes with it. Built for the Caribbean, in your currency and your tax.
            </p>

            <div className="flex items-center gap-3" style={{ marginTop: "16px" }}>
              <a
                href="https://books.caribnexusai.com/signup"
                className="text-[14px] font-medium text-white px-4 py-[6px] rounded-full transition-all hover:opacity-90"
                style={{ background: "linear-gradient(135deg, #0077B6, #009088, #00A859)" }}
              >
                Sign up
              </a>
              <a
                href="/services/caribbooks"
                className="text-[14px] font-medium text-cn-muted px-4 py-[6px] rounded-full border border-cn-border hover:text-[#FF5733] transition-colors"
              >
                Learn more
              </a>
            </div>
          </FadeIn>
        </section>

        {/* Cards: desktop = 3 cols inside grid. Mobile = horizontal scroll */}
        <section className="mx-auto max-w-[var(--content-max-w)] product-section-mobile md:page-grid pb-[52px]">
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

        {/* The Automations block sits on the deeper paper, so the three
            sections that make it up — heading, desktop cards, mobile cards —
            read as one surface rather than three stacked bands. */}
        <div className="bg-[var(--cn-paper-deep)]">
        {/* Automations Section — heading left, desc right */}
        <section className="mx-auto max-w-[var(--content-max-w)] product-section-mobile md:page-grid pt-[64px] pb-[20px]">
          <FadeIn style={{ gridColumn: "2 / 6" }}>
            <h2 className="text-[22px] md:text-[28px] font-semibold tracking-tight" style={{ lineHeight: "1.15" }}>
              <img src="/logo/logo-caribnexus-automations.svg" alt="CaribNexus AI Automations" className="inline-block h-[20px] md:h-[26px]" style={{ marginBottom: "-4px" }} />

            </h2>
            <p className="text-[15px] text-cn-muted mt-1 pb-3 border-b border-cn-border" style={{ lineHeight: "1.5", position: "relative", top: "4px" }}>
              Built for businesses that want to do more without hiring more.
            </p>
          </FadeIn>
          <FadeIn className="mt-3 md:mt-0" style={{ gridColumn: "7 / 12" }} delay={0.1}>
            <p className="text-[15px] text-cn-muted" style={{ lineHeight: "1.5" }}>
              Intelligent systems that run the digital side of your business. Social media, content, customer service, operations — deployed across WhatsApp, Instagram, and every channel your customers use.
            </p>
            <div className="flex items-center gap-3" style={{ marginTop: "16px" }}>
              <Link href="/contact"
                className="text-[14px] font-medium text-white px-4 py-[6px] rounded-full transition-all hover:opacity-90"
                style={{ background: "linear-gradient(135deg, #FF5733, #00A859)" }}
              >
                Get started
              </Link>
              <a
                href="/services/automations"
                className="text-[14px] font-medium text-[#0077B6] px-4 py-[6px] rounded-full border border-[#0077B6]/30 hover:border-[#0077B6] transition-colors"
              >
                Learn more
              </a>
            </div>
          </FadeIn>
        </section>

        {/* Automations Cards: desktop = 3 cols inside grid. Mobile = horizontal scroll */}
        <section className="mx-auto max-w-[var(--content-max-w)] product-section-mobile md:page-grid pb-[52px]">
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

        </div>

        <div className="border-t border-cn-border w-full" />

        {/* Consultancy Section — heading left, desc right */}
        <section className="mx-auto max-w-[var(--content-max-w)] product-section-mobile md:page-grid pt-[64px] pb-[20px]">
          <div style={{ gridColumn: "2 / 6" }}>
            <h2 className="text-[22px] md:text-[28px] font-semibold tracking-tight" style={{ lineHeight: "1.15" }}>
              <span className="text-cn-muted">We build AI systems</span><br />
              <span className="text-cn-muted">that </span>
              <span className="bg-gradient-to-r from-[#0077B6] via-[#00A859] to-[#FF5733] bg-clip-text text-transparent">cut costs by 50%.</span>
            </h2>
          </div>
          <div className="mt-3 md:mt-0" style={{ gridColumn: "7 / 12" }}>
            <p className="text-[15px] text-cn-muted" style={{ lineHeight: "1.5" }}>
              We walk in, analyze your operations, and identify where AI can eliminate repetitive work — saving hours per week and reducing overhead. Custom-built systems, not off-the-shelf tools.
            </p>
            <p style={{ marginTop: "16px" }}>
              <span className="text-[14px] font-medium text-cn-muted">1.0</span>{" "}
              <Link href="/contact" className="text-[14px] font-medium bg-gradient-to-r from-[#0077B6] via-[#00A859] to-[#FF5733] bg-clip-text text-transparent hover:opacity-80 transition-opacity">
                Get a consultation +
              </Link>
            </p>
          </div>
        </section>

        {/* Consultancy panel. On the deeper paper rather than near-black:
            a black slab between two warm sections reads as a different site
            for the length of one screen. Same tone as the nav and footer, so
            the page is held together by three uses of one colour. */}
        <section className="mx-auto max-w-[var(--content-max-w)] product-section-mobile md:page-grid pt-[32px] pb-[64px]">
          <div
            className="relative rounded-none overflow-hidden flex flex-col justify-between panel-scale-mobile"
            style={{
              gridColumn: "2 / 12",
              background: "var(--cn-paper-deep)",
              border: "1px solid var(--cn-border)",
              minHeight: "480px",
              padding: "40px",
            }}
          >
            <div className="flex h-full flex-1 items-stretch">
              {/* Left: illustration */}
              <div className="flex items-center justify-center flex-1 pr-8">
                <img
                  src="/illustrations/feature-neural-pathway-transparent.png"
                  alt="AI operations network"
                  style={{
                    height: "320px",
                    width: "auto",
                    objectFit: "contain",
                    opacity: 0.9,
                  }}
                />
              </div>

              {/* Divider */}
              <div className="w-px bg-cn-border self-stretch" />

              {/* Right: vertically centered text */}
              <div className="flex flex-col justify-center w-[46%] shrink-0 pr-[4%] pl-10 space-y-4">
                <p className="text-[16px] font-semibold text-cn-dark" style={{ lineHeight: "1.3" }}>
                  From analysis to production
                </p>
                <p className="text-[14px] text-cn-muted" style={{ lineHeight: "1.6" }}>
                  We map your operations end-to-end — every bottleneck, every
                  repetitive task, every decision that doesn&apos;t need a human.
                </p>
                <p className="text-[14px] text-cn-muted" style={{ lineHeight: "1.6" }}>
                  Then we build the system: purpose-built AI that plugs into the
                  workflow you already have. Not a demo. A production system you own.
                </p>
                <p className="text-[14px] text-cn-muted" style={{ lineHeight: "1.6" }}>
                  Bookkeeping, customer service, lead qualification, internal ops.
                  Wherever repetition lives, AI replaces it.
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
        <section className="mx-auto max-w-[var(--content-max-w)] product-section-mobile md:page-grid pt-[64px] pb-[96px]">
          <FadeIn style={{ gridColumn: "2 / 6" }}>
            <h2 className="text-[22px] md:text-[28px] font-semibold tracking-tight" style={{ lineHeight: "1.15" }}>
              <span className="text-cn-muted">Your data, and what</span><br />
              <span className="bg-gradient-to-r from-[#0077B6] via-[#00A859] to-[#FF5733] bg-clip-text text-transparent">we do with it.</span>
            </h2>
          </FadeIn>
          <FadeIn className="mt-3 md:mt-0" style={{ gridColumn: "7 / 12" }} delay={0.1}>
            <p className="text-[15px] text-cn-muted" style={{ lineHeight: "1.5" }}>
              The same rules govern everything we build. Encrypted in transit and at rest, held
              in jurisdictions we name rather than gesture at, kept to a published schedule, and
              deleted when you ask. We do not train foundation models on your data.
            </p>
            <p className="text-[15px] text-cn-muted" style={{ lineHeight: "1.5", marginTop: "12px" }}>
              In CaribBooks, every business sits in its own partition and the agent has no way to
              name another one. In CaribNexus Automations, each system is built for a single
              business, so there is no second business for it to reach.
            </p>
            <p style={{ marginTop: "16px" }}>
              <span className="text-[14px] font-medium text-cn-muted">2.0</span>{" "}
              <a href="/data-protection" className="text-[14px] font-medium bg-gradient-to-r from-[#0077B6] to-[#00A859] bg-clip-text text-transparent hover:opacity-80 transition-opacity">
                How we protect your data +
              </a>
            </p>
          </FadeIn>
        </section>

        {/* Closing CTA — on the deeper paper, the same tone the nav and the
            footer use. The heading and the two buttons, nothing else to read. */}
        <div className="border-t border-cn-border w-full" />
        <section className="py-[80px] md:py-[100px] text-center bg-[var(--cn-paper-deep)]">
          <h2 className="text-[22px] md:text-[28px] font-semibold tracking-tight text-cn-muted">
            Built for how you work. Available today.
          </h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-7 px-6">
            <Link
              href="/contact"
              className="w-full sm:w-auto text-[15px] font-semibold text-white px-7 py-[13px]
                         rounded-full transition-all hover:opacity-90"
              style={{ background: "linear-gradient(135deg, #0077B6, #009088, #00A859, #FF5733)" }}
            >
              Book a consultation
            </Link>
            <Link
              href="/services/caribbooks"
              className="w-full sm:w-auto text-[15px] font-medium text-cn-dark px-7 py-[13px]
                         rounded-full border border-cn-border bg-white
                         hover:border-cn-muted transition-colors"
            >
              See CaribBooks
            </Link>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}

function Card({ fig, img, title, titleColor, desc }: { fig: string; img: string; title: string; titleColor: string; desc: string }) {
  return (
    <div className="pl-4 pr-2">
      <span className="text-[11px] font-medium text-cn-muted uppercase tracking-wider block" style={{ lineHeight: "16px" }}>{fig}</span>
      {/* A 190px picture used to sit in a 180px box and hang out of it by
          ten. It is contained now, so the card cannot be the wrong size for
          the drawing in it. */}
      <div className="flex items-center justify-center" style={{ height: "160px", marginTop: "14px", marginBottom: "16px" }}>
        <img src={img} alt="" className="max-h-full w-auto object-contain" />
      </div>
      <h3 className="text-[15px] font-semibold" style={{ lineHeight: "22px", color: titleColor }}>{title}</h3>
      <p className="text-[14px] text-cn-muted" style={{ marginTop: "8px", lineHeight: "1.5" }}>{desc}</p>
    </div>
  );
}

function MobileCard({ fig, img, title, titleColor, desc }: { fig: string; img: string; title: string; titleColor: string; desc: string }) {
  return (
    // The text sizes its own block and the picture takes whatever is left.
    // It was the other way round — text on flex-1 with a FIXED 180px image
    // after it — so the two together outgrew the card and the illustration
    // fell out of the bottom. min-h-0 is what lets the image shrink at all.
    <div className="flex flex-col border border-cn-border rounded-none p-4 shadow-sm min-w-[240px] max-w-[240px] h-[360px] snap-start shrink-0 bg-[var(--cn-paper)]">
      <div className="shrink-0">
        <span className="text-[11px] font-medium text-cn-muted uppercase tracking-wider block mb-2">{fig}</span>
        <h3 className="text-[15px] font-semibold" style={{ color: titleColor }}>{title}</h3>
        <p className="text-[14px] text-cn-muted mt-1 leading-relaxed">{desc}</p>
      </div>
      <div className="flex-1 min-h-0 flex items-center justify-center pt-3">
        <img src={img} alt="" className="max-h-full w-auto object-contain" />
      </div>
    </div>
  );
}
