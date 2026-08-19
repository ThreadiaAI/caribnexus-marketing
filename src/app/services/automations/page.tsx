"use client";

import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { FadeIn, ScaleIn } from "@/components/Animate";

export default function AutomationsPage() {
  return (
    <>
      <Nav />
      <main className="pt-[var(--nav-h)]">

        {/* Act 1: The hook */}
        <section className="mx-auto max-w-[var(--content-max-w)] product-section-mobile md:page-grid pt-[48px] md:pt-[160px] pb-[48px]">
          <FadeIn style={{ gridColumn: "2 / 10" }} y={32} duration={0.8}>
            <h1
              className="text-[28px] md:text-[40px] font-bold tracking-tight"
              style={{ lineHeight: "1" }}
            >
              <span className="text-cn-muted" style={{ position: "relative", top: "5px" }}>Introducing</span><br className="md:hidden" />{" "}
              <img src="/logo/logo-caribnexus-automations.svg" alt="CaribNexus AI Automations" className="inline-block h-[24px] md:h-[34px]" style={{ marginTop: "-7px", marginBottom: "-9px" }} /><span className="text-cn-muted" style={{ position: "relative", top: "5px" }}>,</span>
            </h1>
            <p className="text-[28px] md:text-[40px] font-bold tracking-tight mt-2" style={{ lineHeight: "1" }}>
              <span className="text-cn-muted" style={{ position: "relative", top: "-3px" }}>Intelligent agents that run the digital side</span><br className="hidden md:inline" />
              <span className="text-cn-muted" style={{ position: "relative", top: "-3px" }}> of your business.</span>
            </p>
            <p className="text-[13px] text-cn-muted mt-4 max-w-[480px]" style={{ lineHeight: "1.4" }}>
              Social media. Content strategy. Customer service. Appointment booking. All handled by AI agents that see images, hear voice notes, and learn your business over time. Deployed across the channels your customers already use.
            </p>
          </FadeIn>
          <div className="hidden md:flex items-end justify-end" style={{ gridColumn: "10 / 12" }}>
            <button
              onClick={() => window.dispatchEvent(new CustomEvent("open-voice-widget", { detail: "book" }))}
              className="text-[11px] font-medium bg-gradient-to-r from-[#FF5733] to-[#00A859] bg-clip-text text-transparent hover:opacity-80 transition-opacity"
            >
              Interested in this? →
            </button>
          </div>
        </section>

        {/* Channel bar */}
        <section className="mx-auto max-w-[var(--content-max-w)] product-section-mobile md:page-grid pb-[48px]" style={{ marginTop: "-24px" }}>
          <FadeIn style={{ gridColumn: "2 / 12" }}>
            <div className="flex items-center justify-between md:justify-start md:gap-6 overflow-x-auto no-scrollbar">
              <div className="flex items-center gap-1.5 shrink-0">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="#25D366">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                <span className="text-[12px] font-semibold text-[#25D366] tracking-tight">WhatsApp</span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="url(#ig-grad-bar)">
                  <defs>
                    <linearGradient id="ig-grad-bar" x1="0%" y1="100%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#FFDC80" />
                      <stop offset="50%" stopColor="#F56040" />
                      <stop offset="100%" stopColor="#833AB4" />
                    </linearGradient>
                  </defs>
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                <span className="text-[12px] font-semibold text-[#E1306C] tracking-tight">Instagram</span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="#0084FF">
                  <path d="M12 0C5.373 0 0 4.974 0 11.111c0 3.497 1.745 6.616 4.472 8.652V24l4.086-2.242c1.09.301 2.246.464 3.442.464 6.627 0 12-4.974 12-11.111S18.627 0 12 0zm1.193 14.963l-3.056-3.259-5.963 3.259L10.733 8.3l3.13 3.259 5.889-3.259-6.559 6.663z"/>
                </svg>
                <span className="text-[12px] font-semibold text-[#0084FF] tracking-tight">Messenger</span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="#0088cc">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                </svg>
                <span className="text-[12px] font-semibold text-[#0088cc] tracking-tight">Telegram</span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="#EA4335" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="M22 7l-10 6L2 7" />
                </svg>
                <span className="text-[12px] font-semibold text-[#EA4335] tracking-tight">Email</span>
              </div>
            </div>
          </FadeIn>
        </section>

        <div className="border-t border-cn-border w-full" />

        {/* Prose statement — segue into verticals */}
        <section className="mx-auto max-w-[var(--content-max-w)] product-section-mobile md:page-grid pt-[80px] pb-[80px]">
          <FadeIn style={{ gridColumn: "2 / 11" }}>
            <p className="text-[22px] md:text-[30px] font-bold tracking-tight" style={{ lineHeight: "1" }}>
              <span className="text-cn-muted">Whether it&apos;s </span><span className="bg-gradient-to-r from-[#0077B6] to-[#00A859] bg-clip-text text-transparent">social media</span><span className="text-cn-muted">, </span><span className="bg-gradient-to-r from-[#00A859] to-[#FF5733] bg-clip-text text-transparent">content</span><span className="text-cn-muted">, </span><span className="bg-gradient-to-r from-[#0077B6] via-[#009088] to-[#FF5733] bg-clip-text text-transparent">customer service</span><span className="text-cn-muted">, or </span><span className="bg-gradient-to-r from-[#FF5733] to-[#FF8C42] bg-clip-text text-transparent">operations</span><span className="text-cn-muted">.</span><br />
              <span className="text-cn-muted">We have a system we can build for your business.</span>
            </p>
          </FadeIn>
        </section>

        {/* 1. Customer Service — heading left, desc right */}
        <section className="mx-auto max-w-[var(--content-max-w)] product-section-mobile md:page-grid pt-[80px] pb-[24px]">
          <FadeIn style={{ gridColumn: "2 / 6" }}>
            <h2 className="text-[22px] md:text-[30px] font-bold tracking-tight" style={{ lineHeight: "1" }}>
              <span className="text-cn-muted">Your </span><span className="bg-gradient-to-r from-[#0077B6] via-[#009088] to-[#FF5733] bg-clip-text text-transparent">customer service team</span><span className="text-cn-muted">,</span><br />
              <span className="bg-gradient-to-r from-[#0077B6] via-[#009088] to-[#FF5733] bg-clip-text text-transparent">always on</span>
            </h2>
          </FadeIn>
          <FadeIn className="mt-3 md:mt-0" style={{ gridColumn: "7 / 12" }} delay={0.1}>
            <p className="text-[13px] text-cn-muted" style={{ lineHeight: "1.3" }}>
              Every customer message answered in seconds. Voice notes understood. Images read. Across WhatsApp, Instagram, Messenger, Telegram, and Email. It only escalates when a human is genuinely needed.
            </p>
          </FadeIn>
        </section>

        {/* Customer Service — panel */}
        <section className="mx-auto max-w-[var(--content-max-w)] product-section-mobile md:page-grid pt-[32px] pb-[80px]">
          <ScaleIn style={{ gridColumn: "2 / 12" }} className="panel-peek-mobile">
            <div className="grid grid-cols-2 gap-[1px] bg-cn-border overflow-hidden">
              <div className="p-10 flex items-center justify-center" style={{ minHeight: "480px", background: "linear-gradient(135deg, rgba(0,119,182,0.05), rgba(0,144,136,0.05), rgba(255,87,51,0.05))" }}>
                <img
                  src="/illustrations/auto-customer-service-transparent.png"
                  alt="Customer service agent"
                  style={{ height: "320px", width: "auto", objectFit: "contain", opacity: 0.8 }}
                />
              </div>
              <div className="p-10 flex flex-col justify-center" style={{ minHeight: "480px", background: "linear-gradient(135deg, rgba(0,119,182,0.05), rgba(0,144,136,0.05), rgba(255,87,51,0.05))" }}>
                <div className="space-y-4">
                  <p className="text-[12px] font-semibold bg-gradient-to-r from-[#0077B6] via-[#009088] to-[#FF5733] bg-clip-text text-transparent" style={{ lineHeight: "16px" }}>
                    Every channel. Every format. Handled.
                  </p>
                  <p className="text-[11px] text-cn-muted" style={{ lineHeight: "16px" }}>
                    A customer sends a voice note asking about pricing.<br className="hidden md:inline" />
                    Another DMs a photo asking &ldquo;do you have this?&rdquo;<br className="hidden md:inline" />
                    A third emails about a return.
                  </p>
                  <p className="text-[11px] text-cn-muted" style={{ lineHeight: "16px" }}>
                    The agent handles all three — listens, reads, responds<br className="hidden md:inline" />
                    accurately from your knowledge base. Escalates only<br className="hidden md:inline" />
                    when the situation genuinely needs you.
                  </p>
                  <p className="text-[11px] text-cn-muted" style={{ lineHeight: "16px" }}>
                    A customer service team that costs a fraction of<br className="hidden md:inline" />
                    one salary. Available 24/7.
                  </p>
                </div>
              </div>
            </div>
          </ScaleIn>
        </section>

        <div className="border-t border-cn-border w-full" />

        {/* 2. Social Media — heading left, desc right */}
        <section className="mx-auto max-w-[var(--content-max-w)] product-section-mobile md:page-grid pt-[80px] pb-[24px]">
          <FadeIn style={{ gridColumn: "2 / 6" }}>
            <h2 className="text-[22px] md:text-[30px] font-bold tracking-tight" style={{ lineHeight: "1" }}>
              <span className="text-cn-muted">Your </span><span className="bg-gradient-to-r from-[#0077B6] to-[#00A859] bg-clip-text text-transparent">social media manager</span><span className="text-cn-muted">,</span><br />
              <span className="bg-gradient-to-r from-[#0077B6] to-[#00A859] bg-clip-text text-transparent">fully managed</span>
            </h2>
          </FadeIn>
          <FadeIn className="mt-3 md:mt-0" style={{ gridColumn: "7 / 12" }} delay={0.1}>
            <p className="text-[13px] text-cn-muted" style={{ lineHeight: "1.3" }}>
              Posts created, scheduled, and published to Instagram and Facebook. Comments monitored, DMs answered. Engagement reported back to you on WhatsApp. The social media presence your business needs — without the hire or the agency.
            </p>
          </FadeIn>
        </section>

        {/* Social Media — panel (flipped: text left, image right) */}
        <section className="mx-auto max-w-[var(--content-max-w)] product-section-mobile md:page-grid pt-[32px] pb-[80px]">
          <ScaleIn style={{ gridColumn: "2 / 12" }} className="panel-peek-mobile">
            <div className="grid grid-cols-2 gap-[1px] bg-cn-border overflow-hidden">
              <div className="bg-cn-surface p-10 flex flex-col justify-center" style={{ minHeight: "480px" }}>
                <div className="space-y-4">
                  <p className="text-[12px] font-semibold bg-gradient-to-r from-[#0077B6] to-[#00A859] bg-clip-text text-transparent" style={{ lineHeight: "16px" }}>
                    You text it. It posts.
                  </p>
                  <p className="text-[11px] text-cn-muted" style={{ lineHeight: "16px" }}>
                    Message the agent: &ldquo;Post the Friday special.&rdquo;<br className="hidden md:inline" />
                    It creates the graphic from your brand templates,<br className="hidden md:inline" />
                    writes the caption in your voice, and publishes.
                  </p>
                  <p className="text-[11px] text-cn-muted" style={{ lineHeight: "16px" }}>
                    Comments and DMs that come in from the post?<br className="hidden md:inline" />
                    Handled or forwarded to you. End of week, you<br className="hidden md:inline" />
                    get a performance summary.
                  </p>
                  <p className="text-[11px] text-cn-muted" style={{ lineHeight: "16px" }}>
                    No agency retainer. No social media manager salary.<br className="hidden md:inline" />
                    Just a presence that runs itself.
                  </p>
                </div>
              </div>
              <div className="bg-cn-surface p-10 flex items-center justify-center" style={{ minHeight: "480px" }}>
                <img
                  src="/illustrations/auto-social-media-transparent.png"
                  alt="Social media agent"
                  style={{ height: "280px", width: "auto", objectFit: "contain", opacity: 0.8 }}
                />
              </div>
            </div>
          </ScaleIn>
        </section>

        <div className="border-t border-cn-border w-full" />

        {/* 3. Content Strategy — heading left, desc right */}
        <section className="mx-auto max-w-[var(--content-max-w)] product-section-mobile md:page-grid pt-[80px] pb-[24px]">
          <FadeIn style={{ gridColumn: "2 / 6" }}>
            <h2 className="text-[22px] md:text-[30px] font-bold tracking-tight" style={{ lineHeight: "1" }}>
              <span className="text-cn-muted">Your </span><span className="bg-gradient-to-r from-[#00A859] to-[#FF5733] bg-clip-text text-transparent">content strategist</span><span className="text-cn-muted">,</span><br />
              <span className="bg-gradient-to-r from-[#00A859] to-[#FF5733] bg-clip-text text-transparent">on autopilot</span>
            </h2>
          </FadeIn>
          <FadeIn className="mt-3 md:mt-0" style={{ gridColumn: "7 / 12" }} delay={0.1}>
            <p className="text-[13px] text-cn-muted" style={{ lineHeight: "1.3" }}>
              A full month of content planned, designed, and scheduled. The agent builds your calendar, sends proofs to WhatsApp for approval, and publishes on the date you agreed. You say yes or ask for changes. That&apos;s it.
            </p>
          </FadeIn>
        </section>

        {/* Content Strategy — panel */}
        <section className="mx-auto max-w-[var(--content-max-w)] product-section-mobile md:page-grid pt-[32px] pb-[80px]">
          <ScaleIn style={{ gridColumn: "2 / 12" }} className="panel-peek-mobile">
            <div className="grid grid-cols-2 gap-[1px] bg-cn-border overflow-hidden">
              <div className="p-10 flex items-center justify-center" style={{ minHeight: "480px", background: "linear-gradient(135deg, rgba(0,168,89,0.05), rgba(255,87,51,0.05))" }}>
                <img
                  src="/illustrations/auto-content-strategy-transparent.png"
                  alt="Content strategy agent"
                  style={{ height: "320px", width: "auto", objectFit: "contain", opacity: 0.8 }}
                />
              </div>
              <div className="p-10 flex flex-col justify-center" style={{ minHeight: "480px", background: "linear-gradient(135deg, rgba(0,168,89,0.05), rgba(255,87,51,0.05))" }}>
                <div className="space-y-4">
                  <p className="text-[12px] font-semibold bg-gradient-to-r from-[#00A859] to-[#FF5733] bg-clip-text text-transparent" style={{ lineHeight: "16px" }}>
                    Plan. Approve. Publish. Repeat.
                  </p>
                  <p className="text-[11px] text-cn-muted" style={{ lineHeight: "16px" }}>
                    The agent studies your audience and what&apos;s<br className="hidden md:inline" />
                    working. It builds a content calendar — posts,<br className="hidden md:inline" />
                    stories, captions, timing.
                  </p>
                  <p className="text-[11px] text-cn-muted" style={{ lineHeight: "16px" }}>
                    Each piece sent to you on WhatsApp for approval.<br className="hidden md:inline" />
                    You say yes, or you say &ldquo;change the photo.&rdquo;<br className="hidden md:inline" />
                    Approved content publishes on schedule.
                  </p>
                  <p className="text-[11px] text-cn-muted" style={{ lineHeight: "16px" }}>
                    No Canva. No forgetting to post.<br className="hidden md:inline" />
                    Your content pipeline runs without you.
                  </p>
                </div>
              </div>
            </div>
          </ScaleIn>
        </section>

        <div className="border-t border-cn-border w-full" />

        {/* 4. Operations — heading left, desc right */}
        <section className="mx-auto max-w-[var(--content-max-w)] product-section-mobile md:page-grid pt-[80px] pb-[24px]">
          <FadeIn style={{ gridColumn: "2 / 6" }}>
            <h2 className="text-[22px] md:text-[30px] font-bold tracking-tight" style={{ lineHeight: "1" }}>
              <span className="text-cn-muted">Your </span><span className="bg-gradient-to-r from-[#FF5733] to-[#FF8C42] bg-clip-text text-transparent">receptionist</span><span className="text-cn-muted">,</span><br />
              <span className="bg-gradient-to-r from-[#FF5733] to-[#FF8C42] bg-clip-text text-transparent">handled</span>
            </h2>
          </FadeIn>
          <FadeIn className="mt-3 md:mt-0" style={{ gridColumn: "7 / 12" }} delay={0.1}>
            <p className="text-[13px] text-cn-muted" style={{ lineHeight: "1.3" }}>
              Appointments booked. Leads qualified. Documents collected. Reminders sent. The operational work that eats your day — gone. The agent checks your calendar, asks the right questions, and organizes everything that comes in.
            </p>
          </FadeIn>
        </section>

        {/* Operations — panel (flipped: text left, image right) */}
        <section className="mx-auto max-w-[var(--content-max-w)] product-section-mobile md:page-grid pt-[32px] pb-[80px]">
          <ScaleIn style={{ gridColumn: "2 / 12" }} className="panel-peek-mobile">
            <div className="grid grid-cols-2 gap-[1px] bg-cn-border overflow-hidden">
              <div className="bg-cn-surface p-10 flex flex-col justify-center" style={{ minHeight: "480px" }}>
                <div className="space-y-4">
                  <p className="text-[12px] font-semibold bg-gradient-to-r from-[#FF5733] to-[#FF8C42] bg-clip-text text-transparent" style={{ lineHeight: "16px" }}>
                    Book. Qualify. Collect. Follow up.
                  </p>
                  <p className="text-[11px] text-cn-muted" style={{ lineHeight: "16px" }}>
                    Someone messages asking to book a consultation.<br className="hidden md:inline" />
                    The agent checks your availability, offers times,<br className="hidden md:inline" />
                    confirms the slot, sends a reminder the day before.
                  </p>
                  <p className="text-[11px] text-cn-muted" style={{ lineHeight: "16px" }}>
                    A lead comes in — the agent asks qualifying questions,<br className="hidden md:inline" />
                    scores the opportunity, and routes hot ones to you<br className="hidden md:inline" />
                    immediately.
                  </p>
                  <p className="text-[11px] text-cn-muted" style={{ lineHeight: "16px" }}>
                    Documents needed from a client? Requested, followed<br className="hidden md:inline" />
                    up on, organized. The admin disappears.
                  </p>
                </div>
              </div>
              <div className="bg-cn-surface p-10 flex items-center justify-center" style={{ minHeight: "480px" }}>
                <img
                  src="/illustrations/auto-operations-transparent.png"
                  alt="Operations agent"
                  style={{ height: "280px", width: "auto", objectFit: "contain", opacity: 0.8 }}
                />
              </div>
            </div>
          </ScaleIn>
        </section>

        <div className="border-t border-cn-border w-full" />

        {/*
          THE DATA QUESTION, ANSWERED ON THIS PAGE TOO.

          An agent that reads a customer's DMs, listens to their voice notes and
          answers on a business's behalf touches more personal data than the
          bookkeeper does, not less. Leaving the governance to the CaribBooks
          page would imply it only applies there.

          Automations isolates differently and the copy says so rather than
          borrowing CaribBooks' argument: each system is built for one business,
          so there is no second tenant in it to reach.
        */}
        <section className="mx-auto max-w-[var(--content-max-w)] product-section-mobile md:page-grid pt-[80px] pb-[80px]">
          <FadeIn style={{ gridColumn: "2 / 6" }}>
            <h2 className="text-[22px] md:text-[30px] font-bold tracking-tight" style={{ lineHeight: "1" }}>
              <span className="text-cn-muted">Your customers&rsquo; messages</span><br />
              <span className="bg-gradient-to-r from-[#0077B6] to-[#00A859] bg-clip-text text-transparent">stay yours.</span>
            </h2>
          </FadeIn>
          <FadeIn className="mt-3 md:mt-0" style={{ gridColumn: "7 / 12" }} delay={0.1}>
            <p className="text-[13px] text-cn-muted" style={{ lineHeight: "1.3" }}>
              An agent that answers your customers reads what they send you. We hold that to the
              same rules as everything else we build: encrypted in transit and at rest, held in
              jurisdictions we name, kept to a published schedule, and deleted when you ask.
            </p>
            <p className="text-[13px] text-cn-muted" style={{ lineHeight: "1.3", marginTop: "12px" }}>
              Each system we build serves one business. There is no shared pool, no second
              client inside it, and nothing of yours is used to train foundation models.
            </p>
            <p style={{ marginTop: "16px" }}>
              <span className="text-[10px] font-medium text-cn-muted">5.0</span>{" "}
              <a href="/data-protection" className="text-[11px] font-medium bg-gradient-to-r from-[#0077B6] to-[#00A859] bg-clip-text text-transparent hover:opacity-80 transition-opacity">
                How we protect your data +
              </a>
            </p>
          </FadeIn>
        </section>

        {/* Segue */}
        <section className="mx-auto max-w-[var(--content-max-w)] product-section-mobile md:page-grid pt-[48px] pb-[80px]">
          <FadeIn style={{ gridColumn: "2 / 12" }}>
            <p className="text-[22px] md:text-[30px] font-bold tracking-tight" style={{ lineHeight: "1" }}>
              <span className="text-cn-muted">...and whatever else your business needs. </span>
              <button
                onClick={() => window.dispatchEvent(new CustomEvent("open-voice-widget", { detail: "book" }))}
                className="bg-gradient-to-r from-[#00A859] to-[#0077B6] bg-clip-text text-transparent hover:opacity-80 transition-opacity inline-flex items-baseline gap-1"
              >
                Tell us <span className="text-[16px]">→</span>
              </button>
            </p>
          </FadeIn>
        </section>

        <div className="border-t border-cn-border w-full" />

        {/* CTA */}
        <section className="mx-auto max-w-[var(--content-max-w)] product-section-mobile md:page-grid py-[80px]">
          <FadeIn style={{ gridColumn: "2 / 12" }} className="text-center">
            <h2 className="text-[22px] md:text-[30px] font-bold tracking-tight text-cn-muted" style={{ lineHeight: "1.1" }}>
              Imagine what your business could look like?
            </h2>
            <button
              onClick={() => window.dispatchEvent(new CustomEvent("open-voice-widget", { detail: "book" }))}
              className="mt-4 text-[11px] font-medium text-white px-5 py-[7px] rounded-full transition-all hover:opacity-90"
              style={{ background: "linear-gradient(135deg, #00A859, #0077B6)" }}
            >
              Get started
            </button>
          </FadeIn>
        </section>

        <Footer />
      </main>
    </>
  );
}
