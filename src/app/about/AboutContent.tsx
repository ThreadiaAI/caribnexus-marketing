"use client";

import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { FadeIn, ScaleIn } from "@/components/Animate";
import {
  FAQ,
  FOUNDED,
  FOUNDER_NAME,
  FOUNDER_PROFILES,
  FOUNDER_ROLE,
} from "@/lib/structuredData";

/**
 * /about — what the company is, then who built it.
 *
 * THE COMPANY LEADS. The H1 defines CaribNexus AI; the founder is section 4.0,
 * after the work. That ordering is a judgement about the company and it happens
 * to be the better ordering for retrieval too: a page whose first heading is a
 * person's name reads as a personal profile, and Google resolves it as one.
 * A page that defines an organisation, evidences it with four product lines and
 * a market, and THEN names its founder is an organisation page with a founder
 * attached — which is the entity we actually want in the Knowledge Graph.
 *
 * THE FOUNDER FACT STILL SITS HIGH. It is in the lede directly under the H1, in
 * the meta description, in the Organization graph on every page of the site, in
 * the Person graph here, and as the first question in the FAQ. Moving it out of
 * the H1 costs nothing; there are five other places a retriever reads it from.
 *
 * WHAT CHANGED FROM THE FIRST DRAFT. It described a bookkeeping company. That
 * was the flagship mistaken for the firm. CaribNexus AI runs four lines —
 * CaribBooks, Automations, voice agents and consulting — across two audiences,
 * MSMEs and the accounting practices that serve them. A page that names one of
 * four teaches every model that reads it a company three-quarters too small.
 *
 * WHY IT LOOKS LIKE EVERY OTHER PAGE. Same 2/6 heading and 7/12 prose columns,
 * same 13px muted body, same FIG-labelled card rows, same hairline dividers,
 * same dark panel. A page that reads as a different site reads as a landing
 * page bolted on for search, which is the thing Google has spent twenty years
 * learning to discount.
 */

const HEAD = "text-[22px] md:text-[30px] font-bold tracking-tight";
const BODY = "text-[13px] text-cn-muted";
const LINE = { lineHeight: "1.3" };

/**
 * The four lines of work, in the order they were built.
 *
 * DESC IS WRITTEN TO A CHARACTER BUDGET, not to taste. Four cards across a
 * 2/12 span gives each one 238px, and 24px of padding leaves ~214px of text.
 * At 11px that is about 39 characters a line, so 4 lines is a ~150 character
 * ceiling — and the first draft's CaribBooks entry ran 160, which is 4.1
 * lines, and a tenth of a line is a whole fifth line. Every entry below is
 * held near 130 so the row renders four-up.
 *
 * DESC_MIN_H is the belt to that braces. Character budgets are computed at one
 * viewport; a card row has many. Pinning the paragraph to four lines means a
 * wrap at some other width lengthens a card without stepping the row.
 *
 * LOGO, WHERE THERE IS ONE. CaribBooks and CaribNexus Automations are brands
 * with marks, and the marks carry them better than the words do — which is
 * already how the home page and services page set them, inline in a heading.
 * Voice agents and AI consulting are capabilities rather than products, so
 * they stay as type. The split is the point: two things you can buy by name,
 * two things we do.
 */
const DESC_MIN_H = 64; // 4 lines at the 16px line-height these cards use

const LINES = [
  {
    fig: "FIG 2.1",
    img: "/illustrations/cb-fig-double-entry.svg",
    title: "CaribBooks",
    logo: "/logo/logo-caribbooks.svg",
    color: "#0077B6",
    desc: "Bookkeeping inside WhatsApp. A message, a voice note or a photo of a receipt becomes a double-entry journal entry. Every report updates from it.",
  },
  {
    fig: "FIG 2.2",
    img: "/illustrations/service-messaging.png",
    title: "CaribNexus Automations",
    logo: "/logo/logo-caribnexus-automations.svg",
    color: "#00A859",
    desc: "Customer service, social media, content and operations, run by agents across WhatsApp, Instagram, Messenger, Telegram and email.",
  },
  /* FIG number and colour stay with the SLOT, not the card. The row runs
     blue → green → teal → orange left to right, the same progression every
     other card row on the site runs; moving a colour with its content would
     break that for the sake of a reorder. */
  {
    fig: "FIG 2.3",
    img: "/illustrations/service-consulting.png",
    title: "AI consulting",
    logo: null,
    color: "#009088",
    desc: "We audit an operation, find the repetitive work, and build a custom system for it. A production system you own, not a demo.",
  },
  {
    fig: "FIG 2.4",
    img: "/illustrations/service-voice.png",
    title: "Voice agents",
    logo: null,
    color: "#FF5733",
    desc: "An embeddable widget. Customers speak to your business the way they would speak to your front desk. It books, answers and routes.",
  },
];

export function AboutContent() {
  return (
    <>
      <Nav />
      <main className="pt-[var(--nav-h)]">
        {/* ═══════════════════════════════════════════════════════════════
            HERO — the definition, then the record.

            The H1 is what the company IS. The paragraph under it carries the
            three facts a retriever needs (what, when, who) in flat declarative
            clauses, which is the shape a model can lift an answer out of.
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
          <div className="relative mx-auto max-w-[var(--content-max-w)] product-section-mobile md:page-grid pt-[48px] md:pt-[160px] pb-[48px] md:pb-[80px]">
            <FadeIn
              style={{ gridColumn: "2 / 9" }}
              className="col-span-full md:col-auto"
              y={32}
              duration={0.8}
            >
              <span className="text-[10px] font-medium text-cn-muted tracking-wide uppercase">
                About
              </span>
              <h1
                className="mt-2 text-[28px] md:text-[40px] font-bold tracking-tight"
                style={{ lineHeight: "1" }}
              >
                <span className="text-cn-muted">An artificial intelligence company</span>
                <br />
                <span className="bg-gradient-to-r from-[#0077B6] via-[#00A859] to-[#FF5733] bg-clip-text text-transparent">
                  from within the Caribbean
                </span>
              </h1>
              <p className={`${BODY} max-w-[520px]`} style={{ ...LINE, marginTop: "24px" }}>
                CaribNexus AI builds artificial intelligence systems for micro, small and
                medium enterprises across the Caribbean. The company was founded in {FOUNDED} by{" "}
                <span className="font-medium text-cn-dark">{FOUNDER_NAME}</span>, who serves as{" "}
                {FOUNDER_ROLE}, and is based in Montego Bay, Jamaica.
              </p>
            </FadeIn>
          </div>
        </section>

        <div className="border-t border-cn-border w-full" />

        {/* ═══════════════════════════════════════════════════════════════
            THE MISSION, set as a statement band.

            Same construction the Automations page uses between its hero and
            its numbered sections: one paragraph at heading size across 2/11,
            muted with the claim carried in gradient. It is given a band of its
            own rather than a section heading because it is not a section — it
            is the sentence the other five are evidence for.

            "One node at a time" is not decoration. Nexus means the point where
            things connect; a node is one business joined to the network. The
            company name and the mission are the same idea said twice, and the
            last section of prose below closes that loop explicitly.
        ═══════════════════════════════════════════════════════════════ */}
        <section className="mx-auto max-w-[var(--content-max-w)] product-section-mobile md:page-grid pt-[48px] md:pt-[80px] pb-[48px] md:pb-[80px]">
          <FadeIn style={{ gridColumn: "2 / 11" }}>
            <p className={HEAD} style={{ lineHeight: "1" }}>
              <span className="text-cn-muted">We build technology that </span>
              <span className="bg-gradient-to-r from-[#0077B6] via-[#00A859] to-[#FF5733] bg-clip-text text-transparent">
                caribifies human potential
              </span>
              <span className="text-cn-muted">.</span>
              <br />
              <span className="text-cn-muted">One node at a time.</span>
            </p>
          </FadeIn>
        </section>

        <div className="border-t border-cn-border w-full" />

        {/* ═══════════════════════════════════════════════════════════════
            1.0 The thesis — amplification, not replacement
        ═══════════════════════════════════════════════════════════════ */}
        <section className="mx-auto max-w-[var(--content-max-w)] product-section-mobile md:page-grid pt-[40px] md:pt-[80px] pb-[24px]">
          <FadeIn style={{ gridColumn: "2 / 6" }}>
            <h2 className={HEAD} style={{ lineHeight: "1" }}>
              <span className="text-cn-muted">It meets us where</span>
              <br />
              <span className="bg-gradient-to-r from-[#0077B6] to-[#00A859] bg-clip-text text-transparent">
                we already are
              </span>
            </h2>
          </FadeIn>
          <FadeIn className="mt-3 md:mt-0" style={{ gridColumn: "7 / 12" }} delay={0.1}>
            <p className={BODY} style={LINE}>
              Most software asks the Caribbean to come to it. Download this app, learn this
              workflow, sit at this desk, connect a bank feed that does not exist here. We
              build the opposite — technology that arrives where people already are, inside
              the tools already open on their phone, in the language they already speak.
            </p>
            <p className={BODY} style={{ ...LINE, marginTop: "12px" }}>
              CaribBooks lives inside WhatsApp for that reason. It is not a new system to
              adopt. It is the system already in your hand, made capable of keeping a proper
              set of books, so nothing about how a business already trades has to change to
              use it. The same holds for every line of work we run.
            </p>
            <p className={BODY} style={{ ...LINE, marginTop: "12px" }}>
              That is what we mean by amplification. Technology that is uniquely ours because
              it is shaped around how we actually do things — improving the industries and
              the people already doing the work rather than asking them to become someone
              else. Every business that joins is one more node.
            </p>
          </FadeIn>
        </section>

        <div className="border-t border-cn-border w-full" />

        {/* ═══════════════════════════════════════════════════════════════
            2.0 The four lines
        ═══════════════════════════════════════════════════════════════ */}
        <section className="mx-auto max-w-[var(--content-max-w)] product-section-mobile md:page-grid pt-[40px] md:pt-[80px] pb-[24px]">
          <FadeIn style={{ gridColumn: "2 / 6" }}>
            <h2 className={HEAD} style={{ lineHeight: "1" }}>
              <span className="text-cn-muted">Four lines of</span>
              <br />
              <span>work</span>
            </h2>
          </FadeIn>
          <FadeIn className="mt-3 md:mt-0" style={{ gridColumn: "7 / 12" }} delay={0.1}>
            <p className={BODY} style={LINE}>
              Bookkeeping, messaging, voice and custom systems. Each one is deployed and
              running for businesses today, not a roadmap item. They share one idea: the
              work a business repeats every week should not need a person doing it every
              week.
            </p>
            <p style={{ marginTop: "16px" }}>
              <span className="text-[10px] font-medium text-cn-muted">2.1</span>{" "}
              <Link
                href="/services"
                className="text-[11px] font-medium bg-gradient-to-r from-[#00A859] to-[#FF5733] bg-clip-text text-transparent hover:opacity-80 transition-opacity"
              >
                Our services →
              </Link>
            </p>
          </FadeIn>
        </section>

        {/* Four across on desktop. The site's card row is three wide with 1px
            border columns between; this is the same construction with one more
            pair, so the hairlines stay identical rather than being restyled. */}
        <section className="mx-auto max-w-[var(--content-max-w)] product-section-mobile md:page-grid pb-[64px]">
          <div
            className="hidden md:grid md:grid-cols-[1fr_1px_1fr_1px_1fr_1px_1fr] md:gap-0"
            style={{ gridColumn: "2 / 12", marginTop: "40px" }}
          >
            {LINES.map((l, i) => (
              <Card key={l.title} {...l} sep={i > 0} />
            ))}
          </div>
        </section>

        <div className="md:hidden px-4 pb-[40px] mt-[8px]">
          <div className="flex overflow-x-auto gap-4 snap-x snap-mandatory no-scrollbar pb-2">
            {LINES.map((l) => (
              <MobileCard key={l.title} {...l} />
            ))}
          </div>
        </div>

        <div className="border-t border-cn-border w-full" />

        {/* ═══════════════════════════════════════════════════════════════
            3.0 Who we serve
        ═══════════════════════════════════════════════════════════════ */}
        <section className="mx-auto max-w-[var(--content-max-w)] product-section-mobile md:page-grid pt-[40px] md:pt-[80px] pb-[24px]">
          <FadeIn style={{ gridColumn: "2 / 6" }}>
            <h2 className={HEAD} style={{ lineHeight: "1" }}>
              <span className="text-cn-muted">Micro, small and</span>
              <br />
              <span className="bg-gradient-to-r from-[#00A859] to-[#FF5733] bg-clip-text text-transparent">
                medium enterprises
              </span>
            </h2>
          </FadeIn>
          <FadeIn className="mt-3 md:mt-0" style={{ gridColumn: "7 / 12" }} delay={0.1}>
            <p className={BODY} style={LINE}>
              MSMEs are the overwhelming majority of employers in the Caribbean and the
              least served by business software. They are too small to carry a finance team,
              an agency retainer or a full-time receptionist, and too busy to do that work
              themselves at night. That is the gap we build into.
            </p>
            <p className={BODY} style={{ ...LINE, marginTop: "12px" }}>
              We also build for the practices that serve them. Accountants and bookkeeping
              firms run CaribBooks across their client book, review the work from a partner
              dashboard, and stop doing data entry for it.
            </p>
          </FadeIn>
        </section>

        {/* The dark panel. Same construction as the consultancy panel on the
            home page — illustration left, hairline, copy right — so the weight
            lands where the site already puts weight. */}
        <section className="mx-auto max-w-[var(--content-max-w)] product-section-mobile md:page-grid pt-[16px] md:pt-[32px] pb-[40px] md:pb-[80px]">
          <ScaleIn
            style={{ gridColumn: "2 / 12" }}
            className="panel-scale-mobile"
          >
            <div
              className="relative overflow-hidden flex flex-col justify-between"
              style={{
                background: "linear-gradient(160deg, #0A0A0A 0%, #111827 40%, #0d1a2e 100%)",
                minHeight: "560px",
                padding: "48px",
              }}
            >
              <div className="flex h-full flex-1 items-stretch">
                <div className="hidden md:flex items-center justify-center flex-1 pr-8">
                  <img
                    src="/illustrations/feature-neural-pathway-transparent.png"
                    alt="AI systems deployed across a business"
                    style={{
                      height: "340px",
                      width: "auto",
                      objectFit: "contain",
                      filter: "invert(1) brightness(1.5)",
                      opacity: 0.8,
                    }}
                  />
                </div>
                <div className="hidden md:block w-px bg-white/10 self-stretch" />
                <div className="flex flex-col justify-center w-full md:w-[45%] shrink-0 md:pr-[10%] md:pl-8 space-y-4">
                  <p className="text-[12px] font-semibold text-white" style={{ lineHeight: "15px" }}>
                    The businesses we build for
                  </p>
                  <p className="text-[11px] text-white/50" style={{ lineHeight: "16px" }}>
                    A hardware store in Montego Bay. A tour operator in Negril. A salon, a
                    trucking outfit, a café with three staff and one point of sale, a small
                    manufacturer selling into two islands.
                  </p>
                  <p className="text-[11px] text-white/50" style={{ lineHeight: "16px" }}>
                    Businesses that trade in cash, negotiate over WhatsApp, and file GCT.
                    Businesses where the owner is also the bookkeeper, the receptionist and
                    the person answering Instagram at eleven at night.
                  </p>
                  <p className="text-[11px] text-white/50" style={{ lineHeight: "16px" }}>
                    And the accountants who keep books for twenty of them at once.
                  </p>
                </div>
              </div>
            </div>
          </ScaleIn>
        </section>

        <div className="border-t border-cn-border w-full" />

        {/* ═══════════════════════════════════════════════════════════════
            4.0 The founder — after the work, not before it
        ═══════════════════════════════════════════════════════════════ */}
        <section
          id="founder"
          className="mx-auto max-w-[var(--content-max-w)] product-section-mobile md:page-grid pt-[40px] md:pt-[80px] pb-[24px]"
        >
          <FadeIn style={{ gridColumn: "2 / 6" }}>
            <h2 className={HEAD} style={{ lineHeight: "1" }}>
              <span className="text-cn-muted">Founder and CEO</span>
              <br />
              <span>{FOUNDER_NAME}</span>
            </h2>
          </FadeIn>
          <FadeIn className="mt-3 md:mt-0" style={{ gridColumn: "7 / 12" }} delay={0.1}>
            <p className={BODY} style={LINE}>
              {FOUNDER_NAME} is the founder and Chief Executive Officer of CaribNexus AI. He
              founded the company in {FOUNDED} and leads its product and engineering work,
              including CaribBooks, the AI bookkeeper that runs inside WhatsApp.
            </p>
            {FOUNDER_PROFILES.length > 0 && (
              <p style={{ marginTop: "16px" }}>
                <span className="text-[10px] font-medium text-cn-muted">4.1</span>{" "}
                <a
                  href={FOUNDER_PROFILES[0]}
                  target="_blank"
                  rel="me noopener noreferrer"
                  className="text-[11px] font-medium bg-gradient-to-r from-[#0077B6] to-[#00A859] bg-clip-text text-transparent hover:opacity-80 transition-opacity"
                >
                  LinkedIn →
                </a>
              </p>
            )}
          </FadeIn>
        </section>

        {/*
          rel="me" on the LinkedIn link and the photograph here do the same job
          from two directions: they tie this page to a profile that already
          exists and is already trusted. An entity is confirmed by independent
          sources agreeing, never by one page insisting.
        */}
        <section className="mx-auto max-w-[var(--content-max-w)] product-section-mobile md:page-grid pt-[16px] md:pt-[32px] pb-[40px] md:pb-[80px]">
          <ScaleIn style={{ gridColumn: "2 / 12" }} className="panel-peek-mobile">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[1px] bg-cn-border overflow-hidden">
              <div
                className="flex items-center justify-center overflow-hidden"
                style={{ minHeight: "480px", background: "rgba(0,119,182,0.04)" }}
              >
                <img
                  src="/about/dominic-waite.png"
                  alt={`${FOUNDER_NAME}, ${FOUNDER_ROLE} of CaribNexus AI`}
                  style={{
                    height: "480px",
                    width: "100%",
                    objectFit: "cover",
                    objectPosition: "center top",
                  }}
                />
              </div>
              <div
                className="p-10 flex flex-col justify-center"
                style={{ minHeight: "480px", background: "rgba(0,168,89,0.04)" }}
              >
                <span
                  className="text-[9px] font-medium text-cn-muted uppercase tracking-wider block"
                  style={{ lineHeight: "16px" }}
                >
                  FIG 4.1
                </span>
                <div className="space-y-4" style={{ marginTop: "20px" }}>
                  <p
                    className="text-[12px] font-semibold bg-gradient-to-r from-[#0077B6] to-[#00A859] bg-clip-text text-transparent"
                    style={{ lineHeight: "16px" }}
                  >
                    Why the company exists
                  </p>
                  <p className="text-[11px] text-cn-muted" style={{ lineHeight: "16px" }}>
                    The people this was built for are not behind. They run entire businesses
                    from a single phone — taking orders, answering customers, posting,
                    chasing payments, keeping the books — and they do it well. What they have
                    never had is technology built around any of it.
                  </p>
                  <p className="text-[11px] text-cn-muted" style={{ lineHeight: "16px" }}>
                    So we build it the other way round. Not software that asks a Caribbean
                    business to become something else before it can be served, but systems
                    that arrive where the work already happens and make the person doing it
                    more capable.
                  </p>
                  <p className="text-[11px] text-cn-muted" style={{ lineHeight: "16px" }}>
                    That is the whole company. To caribify human potential, one node at a time.
                  </p>
                </div>
                <div style={{ marginTop: "28px" }}>
                  <p className="text-[11px] font-semibold" style={{ lineHeight: "16px" }}>
                    {FOUNDER_NAME}
                  </p>
                  <p className="text-[11px] text-cn-muted" style={{ lineHeight: "16px" }}>
                    {FOUNDER_ROLE}, CaribNexus AI
                  </p>
                </div>
              </div>
            </div>
          </ScaleIn>
        </section>

        <div className="border-t border-cn-border w-full" />

        {/* ═══════════════════════════════════════════════════════════════
            5.0 Frequently asked

            Question in the heading column, answer in the prose column — the
            same two-column rhythm every section above runs. Nothing bespoke was
            invented for it. The copy comes from FAQ in structuredData.ts, the
            same array that generates the FAQPage graph.
        ═══════════════════════════════════════════════════════════════ */}
        <section className="mx-auto max-w-[var(--content-max-w)] product-section-mobile md:page-grid pt-[40px] md:pt-[80px] pb-[24px]">
          <FadeIn style={{ gridColumn: "2 / 6" }}>
            <h2 className={HEAD} style={{ lineHeight: "1" }}>
              <span className="text-cn-muted">Frequently</span>
              <br />
              <span>asked</span>
            </h2>
          </FadeIn>
        </section>

        {FAQ.map(({ q, a }, i) => (
          <section
            key={q}
            className="mx-auto max-w-[var(--content-max-w)] product-section-mobile md:page-grid pt-[24px] pb-[24px]"
          >
            <FadeIn style={{ gridColumn: "2 / 6" }}>
              <span className="text-[10px] font-medium text-cn-muted">5.{i + 1}</span>
              <h3
                className="text-[15px] md:text-[17px] font-bold tracking-tight"
                style={{ lineHeight: "1.15", marginTop: "4px" }}
              >
                {q}
              </h3>
            </FadeIn>
            <FadeIn className="mt-2 md:mt-0" style={{ gridColumn: "7 / 12" }} delay={0.1}>
              <p className={BODY} style={LINE}>
                {a}
              </p>
            </FadeIn>
          </section>
        ))}

        <div className="border-t border-cn-border w-full" style={{ marginTop: "40px" }} />

        <section className="py-[80px] text-center">
          <h2 className="text-[22px] md:text-[30px] font-bold tracking-tight text-cn-muted">
            Built for how you work. Available today.
          </h2>
        </section>
      </main>
      <Footer />
    </>
  );
}

type CardProps = (typeof LINES)[number] & { sep?: boolean };

/**
 * The title row is a fixed 20px box whatever it holds, so a mark and a word
 * sit on the same baseline and the four descriptions start at the same y.
 *
 * 14px of mark height, not 13. The CaribBooks wordmark's cap is 0.823 of its
 * artboard, so cap-matching 13px type would put it at 12px — measurably right
 * and visibly timid. 14 gives the mark a cap of 11.5 against type's 9.2, which
 * is the same ratio the home page runs, and it clears the widest case: the
 * Automations lockup is 11.06:1, so 14px tall is 155px wide inside 214px.
 */
function Title({ logo, title, color }: Pick<CardProps, "logo" | "title" | "color">) {
  return (
    <div className="flex items-center" style={{ height: "20px" }}>
      {logo ? (
        <img src={logo} alt={title} style={{ height: "14px", width: "auto" }} />
      ) : (
        <h3 className="text-[13px] font-bold" style={{ lineHeight: "20px", color }}>
          {title}
        </h3>
      )}
    </div>
  );
}

function Card({ fig, img, title, logo, color, desc, sep }: CardProps) {
  return (
    <>
      {sep && <div className="bg-cn-border" />}
      <div className="pl-4 pr-2">
        <span
          className="text-[9px] font-medium text-cn-muted uppercase tracking-wider block"
          style={{ lineHeight: "16px" }}
        >
          {fig}
        </span>
        <div
          className="flex items-center justify-center"
          style={{ height: "160px", marginTop: "16px", marginBottom: "20px" }}
        >
          <img
            src={img}
            alt=""
            style={{
              height: "160px",
              width: "auto",
              maxWidth: "100%",
              objectFit: "contain",
              opacity: 0.85,
              mixBlendMode: "multiply",
            }}
          />
        </div>
        <Title logo={logo} title={title} color={color} />
        <p
          className="text-[11px] text-cn-muted"
          style={{ marginTop: "8px", lineHeight: "16px", minHeight: DESC_MIN_H }}
        >
          {desc}
        </p>
      </div>
    </>
  );
}

function MobileCard({ fig, img, title, logo, color, desc }: CardProps) {
  return (
    <div className="flex flex-col border border-cn-border rounded-none p-4 shadow-sm min-w-[220px] max-w-[220px] h-[340px] snap-start shrink-0 bg-white">
      <div className="flex-1 mb-3">
        <span className="text-[9px] font-medium text-cn-muted uppercase tracking-wider block mb-2">
          {fig}
        </span>
        <Title logo={logo} title={title} color={color} />
        <p className="text-[11px] text-cn-muted mt-1 leading-relaxed">{desc}</p>
      </div>
      <div className="flex items-center justify-center mt-auto mb-2">
        <img
          src={img}
          alt=""
          style={{ height: "120px", width: "auto", objectFit: "contain", mixBlendMode: "multiply" }}
        />
      </div>
    </div>
  );
}
