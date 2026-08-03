"use client";

import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { FadeIn, ScaleIn, FadeInStagger, StaggerChild } from "@/components/Animate";
import { motion, useInView } from "motion/react";
import { useRef } from "react";
import Link from "next/link";

export default function ServicesPage() {
  return (
    <>
      <Nav />
      <main className="pt-[var(--nav-h)]">

        {/* ═══════════════════════════════════════════════════════════════
            HERO
        ═══════════════════════════════════════════════════════════════ */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.06]">
            <img
              src="/illustrations/service-hero.png"
              alt=""
              className="w-full h-full object-cover"
              style={{ filter: "contrast(1.4)" }}
            />
          </div>
          <div className="relative mx-auto max-w-[var(--content-max-w)] product-section-mobile md:page-grid pt-[48px] md:pt-[160px] pb-[24px] md:pb-[80px]">
            <FadeIn style={{ gridColumn: "2 / 8" }} className="col-span-full md:col-auto" y={32} duration={0.8}>
              <span className="text-[10px] font-medium text-cn-muted tracking-wide uppercase">Our Services</span>
              <h1
                className="mt-2 text-[28px] md:text-[40px] font-bold tracking-tight"
                style={{ lineHeight: "1" }}
              >
                <span className="text-cn-muted">AI infrastructure for</span><br />
                <span className="bg-gradient-to-r from-[#0077B6] via-[#00A859] to-[#FF5733] bg-clip-text text-transparent">
                  Caribbean businesses
                </span>
              </h1>
            </FadeIn>
          </div>
        </section>

        <div className="border-t border-cn-border w-full" />


        {/* ═══════════════════════════════════════════════════════════════
            1.0 CaribBooks
        ═══════════════════════════════════════════════════════════════ */}
        <section className="mx-auto max-w-[var(--content-max-w)] product-section-mobile md:page-grid pt-[40px] pb-[24px]">
          <FadeIn style={{ gridColumn: "2 / 6" }}>
            <h2 className="text-[22px] md:text-[30px] font-bold tracking-tight" style={{ lineHeight: "1" }}>
              <span className="text-cn-muted" style={{ position: "relative", top: "5px" }}>AI bookkeeping</span><br />
              <span className="relative" style={{ top: "7px" }}><span className="text-cn-muted">with </span><img src="/logo/logo-caribbooks.svg" alt="CaribBooks" className="inline-block h-[18px] md:h-[24px] align-baseline" style={{ marginBottom: "-2px" }} /></span>
            </h2>
          </FadeIn>
          <FadeIn className="mt-3 md:mt-0" style={{ gridColumn: "7 / 12" }} delay={0.1}>
            <p className="text-[13px] text-cn-muted" style={{ lineHeight: "1.3" }}>
              Message your transaction in plain English — or patois — and CB posts the journal entry instantly. Every financial report updates in real time. Built for Caribbean compliance.
            </p>
            <p style={{ marginTop: "16px" }}>
              <span className="text-[10px] font-medium text-cn-muted">1.1</span>{" "}
              <Link href="/services/caribbooks" className="text-[11px] font-medium bg-gradient-to-r from-[#00A859] to-[#FF5733] bg-clip-text text-transparent hover:opacity-80 transition-opacity">
                Learn more →
              </Link>
            </p>
          </FadeIn>
        </section>

        {/* CaribBooks — dark panel with epic sequenced animation */}
        <CaribBooksPanel />

        <div className="border-t border-cn-border w-full" />

        {/* ═══════════════════════════════════════════════════════════════
            2.0 Messaging Automation
        ═══════════════════════════════════════════════════════════════ */}
        <section className="mx-auto max-w-[var(--content-max-w)] product-section-mobile md:page-grid pt-[80px] pb-[24px]">
          <FadeIn style={{ gridColumn: "2 / 6" }}>
            <h2 className="text-[22px] md:text-[30px] font-bold tracking-tight" style={{ lineHeight: "1" }}>
              <span className="text-cn-muted" style={{ position: "relative", top: "-1px" }}>Intelligent systems</span><br />
              <span className="relative" style={{ top: "-3px" }}>
                <span className="text-cn-muted">with </span>
                <img src="/logo/caribnexus-wordmark.svg" alt="CaribNexus AI" className="inline h-[32px] md:h-[42px]" style={{ verticalAlign: "middle", position: "relative", top: "-1px" }} />
                <span className="text-[16px] md:text-[22px] font-normal text-[#8A8A8A]"> Automations</span>
              </span>
            </h2>
          </FadeIn>
          <FadeIn className="mt-3 md:mt-0" style={{ gridColumn: "7 / 12" }} delay={0.1}>
            <p className="text-[13px] text-cn-muted" style={{ lineHeight: "1.3" }}>
              Intelligent agents deployed across WhatsApp, Instagram, and Telegram. Not just text — voice notes transcribed, images read, documents extracted. One knowledge base powers customer support, appointment booking, lead qualification, and FAQ handling.
            </p>
            <p style={{ marginTop: "16px" }}>
              <span className="text-[10px] font-medium text-cn-muted">2.1</span>{" "}
              <Link href="/services/messaging" className="text-[11px] font-medium bg-gradient-to-r from-[#00A859] to-[#0077B6] bg-clip-text text-transparent hover:opacity-80 transition-opacity">
                Learn more →
              </Link>
            </p>
          </FadeIn>
        </section>

        {/* Messaging — two bordered cards */}
        <section className="mx-auto max-w-[var(--content-max-w)] product-section-mobile md:page-grid pt-[32px] pb-[80px]">
          <ScaleIn style={{ gridColumn: "2 / 12" }} className="panel-scale-mobile">
            <div className="grid grid-cols-2 gap-[1px] bg-cn-border overflow-hidden">
              <div className="p-10 flex items-center justify-center" style={{ minHeight: "480px", background: "rgba(0,119,182,0.04)" }}>
                <img
                  src="/illustrations/service-messaging.png"
                  alt="Multi-channel messaging hub"
                  style={{ height: "320px", width: "auto", objectFit: "contain", opacity: 0.8, mixBlendMode: "multiply" }}
                />
              </div>
              <div className="p-10 flex flex-col justify-center" style={{ minHeight: "480px", background: "rgba(0,119,182,0.04)" }}>
                <div className="space-y-4">
                  <p className="text-[12px] font-semibold bg-gradient-to-r from-[#00A859] to-[#0077B6] bg-clip-text text-transparent" style={{ lineHeight: "16px" }}>
                    One brain, every channel
                  </p>
                  <p className="text-[11px] text-cn-muted" style={{ lineHeight: "16px" }}>
                    Your customers message on WhatsApp, Instagram,<br className="hidden md:inline" />
                    and Telegram. One AI agent handles all three —<br className="hidden md:inline" />
                    same knowledge, same tone, same intelligence.
                  </p>
                  <p className="text-[11px] text-cn-muted" style={{ lineHeight: "16px" }}>
                    Customers send voice notes — transcribed instantly.<br className="hidden md:inline" />
                    Photos of documents — read and extracted. Not just<br className="hidden md:inline" />
                    text. Every format your customers actually use.
                  </p>
                  <p className="text-[11px] text-cn-muted" style={{ lineHeight: "16px" }}>
                    It books appointments, answers FAQs, qualifies<br />
                    leads, and escalates only when a human is needed.
                  </p>
                  <p className="text-[11px] text-cn-muted" style={{ lineHeight: "16px" }}>
                    Not a chatbot. An agent that remembers context,<br />
                    understands intent, and gets better over time.
                  </p>
                </div>
              </div>
            </div>
          </ScaleIn>
        </section>

        <div className="border-t border-cn-border w-full" />

        {/* ═══════════════════════════════════════════════════════════════
            3.0 Voice Agent
        ═══════════════════════════════════════════════════════════════ */}
        <section className="mx-auto max-w-[var(--content-max-w)] product-section-mobile md:page-grid pt-[80px] pb-[24px]">
          <FadeIn style={{ gridColumn: "2 / 6" }}>
            <h2 className="text-[22px] md:text-[30px] font-bold tracking-tight" style={{ lineHeight: "1" }}>
              <span className="bg-gradient-to-r from-[#FF5733] to-[#009088] bg-clip-text text-transparent">Voice agents,</span><br />
              <span className="bg-gradient-to-r from-[#FF5733] to-[#009088] bg-clip-text text-transparent">not voice bots</span>
            </h2>
          </FadeIn>
          <FadeIn className="mt-3 md:mt-0" style={{ gridColumn: "7 / 12" }} delay={0.1}>
            <p className="text-[13px] text-cn-muted" style={{ lineHeight: "1.3" }}>
              Embeddable voice widget for any website. Customers speak naturally — the agent handles customer service, booking, reminders, and team updates. Trained on your business context.
            </p>
            <p style={{ marginTop: "16px" }}>
              <span className="text-[10px] font-medium text-cn-muted">3.1</span>{" "}
              <button
                onClick={() => window.dispatchEvent(new CustomEvent("open-voice-widget", { detail: "ask" }))}
                className="text-[11px] font-medium bg-gradient-to-r from-[#FF5733] to-[#009088] bg-clip-text text-transparent hover:opacity-80 transition-opacity"
              >
                Try it live +
              </button>
            </p>
          </FadeIn>
        </section>

        {/* Voice — dark panel (image LEFT, text RIGHT) */}
        <section className="mx-auto max-w-[var(--content-max-w)] product-section-mobile md:page-grid pt-[32px] pb-[80px]">
          <ScaleIn style={{ gridColumn: "2 / 12" }} className="panel-scale-mobile">
            <div
              className="relative overflow-hidden flex flex-col justify-between"
              style={{
                background: "linear-gradient(160deg, #1a0a0a 0%, #2d1a0d 40%, #0a1a2e 100%)",
                minHeight: "680px",
                padding: "48px",
              }}
            >
              <div className="flex h-full flex-1 items-stretch">
                <div className="flex items-center justify-center flex-1 pr-8">
                  <img
                    src="/illustrations/service-voice.png"
                    alt="Voice AI agent"
                    style={{
                      height: "380px",
                      width: "auto",
                      objectFit: "contain",
                      filter: "invert(1) opacity(0.85)",
                      mixBlendMode: "screen",
                    }}
                  />
                </div>

                <div className="w-px bg-white/10 self-stretch" />

                <div className="flex flex-col justify-center w-[45%] shrink-0 pr-[10%] pl-8 space-y-4">
                  <p className="text-[12px] font-semibold text-white" style={{ lineHeight: "16px" }}>
                    Speak, don&apos;t type
                  </p>
                  <p className="text-[11px] text-white/50" style={{ lineHeight: "16px" }}>
                    Your customers talk to your website like they<br />
                    would talk to your front desk. The agent listens,<br />
                    understands, and responds in real time.
                  </p>
                  <p className="text-[11px] text-white/50" style={{ lineHeight: "16px" }}>
                    It books appointments, answers questions about<br />
                    your services, sends reminders, and routes urgent<br />
                    requests to your team instantly.
                  </p>
                  <p className="text-[11px] text-white/50" style={{ lineHeight: "16px" }}>
                    Trained on your business — your hours, your<br />
                    services, your pricing, your team structure.<br />
                    Not a generic chatbot reading a script.
                  </p>
                </div>
              </div>
            </div>
          </ScaleIn>
        </section>

        <div className="border-t border-cn-border w-full" />

        {/* ═══════════════════════════════════════════════════════════════
            4.0 AI Consulting
        ═══════════════════════════════════════════════════════════════ */}
        <section className="mx-auto max-w-[var(--content-max-w)] product-section-mobile md:page-grid pt-[80px] pb-[24px]">
          <FadeIn style={{ gridColumn: "2 / 6" }}>
            <h2 className="text-[22px] md:text-[30px] font-bold tracking-tight" style={{ lineHeight: "1" }}>
              <span className="bg-gradient-to-r from-[#FF5733] to-[#009088] bg-clip-text text-transparent">AI consulting,</span><br />
              <span className="bg-gradient-to-r from-[#FF5733] to-[#009088] bg-clip-text text-transparent">not guesswork</span>
            </h2>
          </FadeIn>
          <FadeIn className="mt-3 md:mt-0" style={{ gridColumn: "7 / 12" }} delay={0.1}>
            <p className="text-[13px] text-cn-muted" style={{ lineHeight: "1.3" }}>
              We audit your operations, identify where AI eliminates repetitive work, and deliver a custom proposal within 7 days. Specific systems, projected savings, implementation timeline.
            </p>
            <p style={{ marginTop: "16px" }}>
              <span className="text-[10px] font-medium text-cn-muted">4.1</span>{" "}
              <button
                onClick={() => window.dispatchEvent(new CustomEvent("open-voice-widget", { detail: "book" }))}
                className="text-[11px] font-medium bg-gradient-to-r from-[#FF5733] to-[#009088] bg-clip-text text-transparent hover:opacity-80 transition-opacity"
              >
                Book a consultation +
              </button>
            </p>
          </FadeIn>
        </section>

        {/* Consulting — 2x2 grid */}
        <section className="mx-auto max-w-[var(--content-max-w)] product-section-mobile md:page-grid pt-[32px] pb-[80px]">
          <FadeInStagger style={{ gridColumn: "2 / 12" }} className="mx-auto panel-scale-mobile" stagger={0.12}>
            <div
              className="overflow-hidden border border-cn-border"
              style={{ background: "var(--cn-surface)" }}
            >
              <div className="grid grid-cols-2">
                {[
                  {
                    title: "Map your operations in 48 hours",
                    desc: "We walk through every process, identify bottlenecks, and find the repetitive tasks that don't need a human.",
                    img: "/illustrations/consulting-audit.png",
                    color: "#FF5733",
                  },
                  {
                    title: "Design the system, not a demo",
                    desc: "Architecture that fits your existing workflow. What gets automated, what gets augmented, what stays manual.",
                    img: "/illustrations/consulting-design.png",
                    color: "#007A73",
                  },
                  {
                    title: "Proposal with projected savings",
                    desc: "Specific systems, timelines, and cost savings. You approve before we write a single line of code.",
                    img: "/illustrations/consulting-propose.png",
                    color: "#009088",
                  },
                  {
                    title: "Ship in under 30 days. You own it.",
                    desc: "We build it. We deploy it. We support it. No vendor lock-in. The system is yours.",
                    img: "/illustrations/consulting-ship.png",
                    color: "#E04A2B",
                  },
                ].map((cell, i) => (
                  <div
                    key={i}
                    className="flex flex-col justify-between p-3"
                    style={{
                      aspectRatio: "1 / 1",
                      borderTop: i >= 2 ? "1px solid var(--cn-border)" : "none",
                      borderLeft: i % 2 === 1 ? "1px solid var(--cn-border)" : "none",
                    }}
                  >
                      <div className="flex items-center justify-center flex-1">
                        <img
                          src={cell.img}
                          alt=""
                          className="w-[60%] h-auto"
                          style={{ objectFit: "contain", opacity: 0.75, mixBlendMode: "multiply" }}
                        />
                      </div>
                      <div>
                        <p className="text-[12px] font-semibold" style={{ lineHeight: "16px", color: cell.color }}>{cell.title}</p>
                        <p className="text-[11px] text-cn-muted mt-1" style={{ lineHeight: "16px" }}>{cell.desc}</p>
                      </div>
                  </div>
                ))}
              </div>
            </div>
          </FadeInStagger>
        </section>

        <div className="border-t border-cn-border w-full" />

        {/* ═══════════════════════════════════════════════════════════════
            5.0 Custom AI Builds
        ═══════════════════════════════════════════════════════════════ */}
        <section className="mx-auto max-w-[var(--content-max-w)] product-section-mobile md:page-grid pt-[80px] pb-[24px]">
          <FadeIn style={{ gridColumn: "2 / 6" }}>
            <h2 className="text-[22px] md:text-[30px] font-bold tracking-tight" style={{ lineHeight: "1" }}>
              <span className="bg-gradient-to-r from-[#0077B6] via-[#FF5733] to-[#00A859] bg-clip-text text-transparent">Custom AI builds,</span><br />
              <span className="bg-gradient-to-r from-[#0077B6] via-[#FF5733] to-[#00A859] bg-clip-text text-transparent">purpose-built</span>
            </h2>
          </FadeIn>
          <FadeIn className="mt-3 md:mt-0" style={{ gridColumn: "7 / 12" }} delay={0.1}>
            <p className="text-[13px] text-cn-muted" style={{ lineHeight: "1.3" }}>
              Bespoke AI systems for your specific workflows. Not off-the-shelf tools — agents that integrate with your existing processes and scale with your business.
            </p>
            <p style={{ marginTop: "16px" }}>
              <span className="text-[10px] font-medium text-cn-muted">5.1</span>{" "}
              <button
                onClick={() => window.dispatchEvent(new CustomEvent("open-voice-widget", { detail: "book" }))}
                className="text-[11px] font-medium bg-gradient-to-r from-[#0077B6] to-[#FF5733] bg-clip-text text-transparent hover:opacity-80 transition-opacity"
              >
                Discuss your project +
              </button>
            </p>
          </FadeIn>
        </section>

        {/* Custom builds — dark panel (text LEFT, image RIGHT) */}
        <section className="mx-auto max-w-[var(--content-max-w)] product-section-mobile md:page-grid pt-[32px] pb-[80px]">
          <ScaleIn style={{ gridColumn: "2 / 12" }} className="panel-scale-mobile">
            <div
              className="relative overflow-hidden flex flex-col justify-between"
              style={{
                background: "linear-gradient(160deg, #0a0a1a 0%, #0d1a2e 40%, #1a0d0a 100%)",
                minHeight: "680px",
                padding: "48px",
              }}
            >
              <div className="flex h-full flex-1 items-stretch">
                <div className="flex flex-col justify-center w-[45%] shrink-0 pl-[10%] pr-8 space-y-4">
                  <p className="text-[12px] font-semibold text-white" style={{ lineHeight: "16px" }}>
                    We&apos;ve shipped systems that run businesses
                  </p>
                  <p className="text-[11px] text-white/50" style={{ lineHeight: "16px" }}>
                    AI bookkeepers that understand Caribbean<br />
                    patois and post journal entries from WhatsApp.
                  </p>
                  <p className="text-[11px] text-white/50" style={{ lineHeight: "16px" }}>
                    Voice agents handling customer service, booking,<br />
                    and lead qualification — 24/7, no hold music.
                  </p>
                  <p className="text-[11px] text-white/50" style={{ lineHeight: "16px" }}>
                    Messaging systems routing 1000+ conversations<br />
                    daily across WhatsApp, Instagram, and Telegram.
                  </p>
                  <p className="text-[11px] text-white/50" style={{ lineHeight: "16px" }}>
                    Agentic systems with safety layers that ensure<br />
                    the AI never goes off-script or leaks data.
                  </p>
                </div>

                <div className="w-px bg-white/10 self-stretch" />

                <div className="flex items-center justify-center flex-1 pl-8">
                  <img
                    src="/illustrations/service-custom.png"
                    alt="Custom AI engineering"
                    style={{
                      height: "380px",
                      width: "auto",
                      objectFit: "contain",
                      filter: "invert(1) opacity(0.85)",
                      mixBlendMode: "screen",
                    }}
                  />
                </div>
              </div>
            </div>
          </ScaleIn>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
            CTA
        ═══════════════════════════════════════════════════════════════ */}
        <section className="relative border-t border-cn-border overflow-hidden">
          <div className="absolute inset-0 opacity-[0.06]">
            <img
              src="/illustrations/service-hero.png"
              alt=""
              className="w-full h-full object-cover"
              style={{ filter: "contrast(1.4)" }}
            />
          </div>
          <FadeIn className="relative mx-auto max-w-[var(--content-max-w)] px-[var(--grid-padding)] py-[80px] text-center">
            <h2 className="text-[24px] md:text-[30px] font-bold tracking-tight text-cn-muted">Ready to automate?</h2>
            <p className="text-[13px] text-cn-muted mt-2 max-w-md mx-auto">
              Tell us what you&apos;re building or what problem you need solved. We&apos;ll tell you exactly how AI fits.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <button
                onClick={() => window.dispatchEvent(new CustomEvent("open-voice-widget", { detail: "book" }))}
                className="text-[12px] font-medium text-white px-5 py-2.5 rounded-full transition-all hover:opacity-90"
                style={{ background: "linear-gradient(135deg, #0077B6, #009088, #00A859, #FF5733)" }}
              >
                Book a consultation
              </button>
              <Link
                href="https://books.caribnexusai.com/signup"
                className="text-[12px] font-medium text-cn-dark px-5 py-2.5 rounded-full border border-cn-border hover:border-cn-muted transition-colors"
              >
                Try CaribBooks free
              </Link>
            </div>
          </FadeIn>
        </section>

        <Footer />
      </main>
    </>
  );
}

function CaribBooksPanel() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="mx-auto max-w-[var(--content-max-w)] product-section-mobile md:page-grid pt-[32px] pb-[80px]">
      <motion.div
        ref={ref}
        className="panel-scale-mobile"
        style={{ gridColumn: "2 / 12" }}
        initial={{ opacity: 0, scale: 0.97 }}
        animate={isInView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <div
          className="relative overflow-hidden flex flex-col justify-between"
          style={{
            background: "linear-gradient(160deg, #0A0A0A 0%, #111827 40%, #1a1a2e 100%)",
            minHeight: "680px",
            padding: "48px",
          }}
        >
          <div className="flex h-full flex-1 items-stretch">
            <div className="relative flex-1 pr-8" style={{ minHeight: "580px" }}>
              {/* Screenshot 1 — fades in after panel */}
              <motion.img
                src="/screenshots/cb-recurring-reminder.png"
                alt="Recurring reminder setup"
                className="absolute shadow-2xl border border-white/10"
                style={{
                  height: "440px",
                  width: "auto",
                  left: "0",
                  top: "40px",
                  transform: "rotate(-1.5deg)",
                  objectFit: "contain",
                }}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 0.7, y: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
              />
              {/* Screenshot 2 — staggered */}
              <motion.img
                src="/screenshots/cb-report-delivery.png"
                alt="CSV report delivery"
                className="absolute shadow-2xl border border-white/10"
                style={{
                  height: "440px",
                  width: "auto",
                  left: "110px",
                  top: "72px",
                  transform: "rotate(1deg)",
                  objectFit: "contain",
                }}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 0.8, y: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
              />
              {/* Screenshot 3 — front, last to land */}
              <motion.img
                src="/screenshots/cb-salary-payment.png"
                alt="Instant salary journal entry"
                className="absolute shadow-2xl border border-white/10 z-10"
                style={{
                  height: "480px",
                  width: "auto",
                  left: "230px",
                  top: "24px",
                  objectFit: "contain",
                }}
                initial={{ opacity: 0, y: 48 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
              />
            </div>

            <div className="w-px bg-white/10 self-stretch" />

            {/* Text — fades in with screenshots */}
            <motion.div
              className="flex flex-col justify-center w-[45%] shrink-0 pr-[10%] pl-8 space-y-4"
              initial={{ opacity: 0, x: 16 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <p className="text-[12px] font-semibold text-white" style={{ lineHeight: "16px" }}>
                One journal entry feeds all 11 reports
              </p>
              <p className="text-[11px] text-white/50" style={{ lineHeight: "16px" }}>
                Message your bookkeeper on WhatsApp in plain<br />
                English or patois. CB posts the double-entry<br />
                journal entry instantly.
              </p>
              <p className="text-[11px] text-white/50" style={{ lineHeight: "16px" }}>
                That single entry updates every report in real<br />
                time — Balance Sheet, P&amp;L, Cash Flow, GL Register,<br />
                Trial Balance, Aged Receivables, Aged Payables,<br />
                Tax Summary, Budget vs Actual, Revenue by<br />
                Customer, Expense by Vendor.
              </p>
              <p className="text-[11px] text-white/50" style={{ lineHeight: "16px" }}>
                It learns your patterns — same vendor and amount<br />
                seen twice? Next time it posts automatically.<br />
                You just confirm.
              </p>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
