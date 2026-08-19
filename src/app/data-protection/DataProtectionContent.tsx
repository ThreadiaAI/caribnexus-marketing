"use client";

import { Fragment } from "react";
import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { FadeIn, ScaleIn } from "@/components/Animate";

/**
 * The argument, in the site's own grammar.
 *
 * WHY THE DIAGRAM IS DRAWN IN HTML RATHER THAN GENERATED. An architecture
 * diagram is mostly labels, and image models garble small text — a picture of
 * a security boundary with a misspelt label is worse than no picture. Built in
 * markup it is crisp at any zoom, readable by a screen reader, indexable, and
 * it cannot drift from the truth without someone editing the words.
 *
 * THE ONE RULE FOR THIS PAGE: every claim traces to a measurement in
 * caribbooks/docs/data_protection_audit.md. Where a control is policy rather
 * than a shipped mechanism, it is described as policy.
 */

const HEAD = "text-[22px] md:text-[30px] font-bold tracking-tight";
const BODY = "text-[13px] text-cn-muted";
const LINE = { lineHeight: "1.3" };

/** The eight standards, as the Office of the Information Commissioner sets them
 *  out, against the mechanism that satisfies each. Mechanism, not intention. */
const STANDARDS: { n: string; standard: string; how: string }[] = [
  {
    n: "1",
    standard: "Processed fairly and lawfully",
    how: "We process on the basis of the contract with you, and on your practice's documented instructions where we act as processor. We do not repurpose your data, and we do not sell it.",
  },
  {
    n: "2",
    standard: "Obtained for specified, lawful purposes",
    how: "CaribBooks exists to record transactions and produce reports. Data collected for that is not used for anything else, and a practice's client data is never used to improve our products.",
  },
  {
    n: "3",
    standard: "Adequate, relevant and not excessive",
    how: "We hold what a set of books requires: the transaction, its evidence, the accounts it touches. We ask for no demographic data, and CaribBooks is not designed to receive special category data.",
  },
  {
    n: "4",
    standard: "Accurate and kept up to date",
    how: "Entries are proposed and confirmed rather than assumed. When CaribBooks is unsure it asks, and it names the account it would add rather than guessing. Corrections post as reversing entries, so the record shows both the error and the fix.",
  },
  {
    n: "5",
    standard: "Not kept longer than necessary",
    how: "A published retention schedule: message history 24 months, reasoning records 90 days, server logs 30 days. The accounting record is held for the statutory period because the law requires it of you.",
  },
  {
    n: "6",
    standard: "Processed in accordance with the rights of data subjects",
    how: "Access, correction, erasure, restriction, portability and objection, answered within 30 days. Erasure covers message history, learned facts and reminders; the statutory accounting record is exempt, as the Act allows.",
  },
  {
    n: "7",
    standard: "Appropriate technical and organisational measures",
    how: "AES-256 at rest, TLS 1.2 and 1.3 in transit, no plaintext path anywhere. Passwordless sign-in, role-scoped access, and tenant isolation the agent cannot address around. Backups with 35-day recovery and deletion protection on every table.",
  },
  {
    n: "8",
    standard: "Not transferred without adequate protection",
    how: "Named jurisdictions rather than vagueness: the books in AWS United States, message content in the European Union with Unipile under the GDPR. Each transfer under contractual safeguards, and a data processing agreement for practices that need one.",
  },
];

/** Jurisdictions we serve and the instrument that governs each. */
const JURISDICTIONS: { place: string; law: string }[] = [
  { place: "Jamaica", law: "Data Protection Act, 2020" },
  { place: "Barbados", law: "Data Protection Act, 2019" },
  { place: "Bermuda", law: "Personal Information Protection Act, 2016" },
  { place: "Trinidad and Tobago", law: "Data Protection Act, 2011" },
  { place: "The Bahamas", law: "Data Protection (Privacy of Personal Information) Act" },
  { place: "Cayman Islands", law: "Data Protection Act" },
];

export function DataProtectionContent() {
  return (
    <>
      <Nav />
      <main className="pt-[var(--nav-h)]">
        {/* ── Hero ─────────────────────────────────────────────────────── */}
        <section className="mx-auto max-w-[var(--content-max-w)] product-section-mobile md:page-grid pt-[48px] md:pt-[140px] pb-[48px] md:pb-[72px]">
          <FadeIn style={{ gridColumn: "2 / 9" }} className="col-span-full md:col-auto" y={32} duration={0.8}>
            <span className="text-[10px] font-medium text-cn-muted tracking-wide uppercase">
              Data protection
            </span>
            <h1 className="mt-2 text-[28px] md:text-[40px] font-bold tracking-tight" style={{ lineHeight: "1" }}>
              <span className="text-cn-muted">Your clients&rsquo; books are</span>
              <br />
              <span className="bg-gradient-to-r from-[#0077B6] via-[#00A859] to-[#FF5733] bg-clip-text text-transparent">
                isolated by design
              </span>
            </h1>
            <p className={`${BODY} max-w-[520px]`} style={{ ...LINE, marginTop: "24px" }}>
              Everything below describes the system as it actually runs, checked against it
              rather than intended. Where something is policy rather than a shipped mechanism,
              we say so.
            </p>
          </FadeIn>
        </section>

        <div className="border-t border-cn-border w-full" />

        {/* ── 1.0 The isolation claim ──────────────────────────────────── */}
        <section className="mx-auto max-w-[var(--content-max-w)] product-section-mobile md:page-grid pt-[40px] md:pt-[80px] pb-[24px]">
          <FadeIn style={{ gridColumn: "2 / 6" }}>
            <h2 className={HEAD} style={{ lineHeight: "1" }}>
              <span className="text-cn-muted">The agent cannot</span>
              <br />
              <span className="bg-gradient-to-r from-[#0077B6] to-[#00A859] bg-clip-text text-transparent">
                name another business
              </span>
            </h2>
          </FadeIn>
          <FadeIn className="mt-3 md:mt-0" style={{ gridColumn: "7 / 12" }} delay={0.1}>
            <p className={BODY} style={LINE}>
              Most AI systems keep tenants apart by telling the model which business it is
              working for, and trusting it to stay there. That is a rule, and a rule can be
              argued with. A carefully written message can talk a model out of a rule.
            </p>
            <p className={BODY} style={{ ...LINE, marginTop: "12px" }}>
              CaribBooks does it differently. The identity of the business is not something the
              agent is told. It is bound by the system, from the phone number the message
              arrived on, before the agent runs at all. There is no field, no parameter and no
              phrasing through which it can ask for another business&rsquo;s ledger, because no
              such input exists.
            </p>
            <p className={BODY} style={{ ...LINE, marginTop: "12px" }}>
              It is not a rule the agent follows. It is a capability it was never given.
            </p>
          </FadeIn>
        </section>

        {/* The idea, illustrated. The mechanism lives in the dark panel below;
            this carries the shape of the thing so the words land faster. */}
        <section className="mx-auto max-w-[var(--content-max-w)] product-section-mobile md:page-grid pt-[16px] md:pt-[24px] pb-[8px]">
          <ScaleIn style={{ gridColumn: "2 / 12" }} className="panel-peek-mobile">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[1px] bg-cn-border overflow-hidden">
              <div className="flex items-center justify-center p-8" style={{ minHeight: "380px", background: "rgba(0,119,182,0.04)" }}>
                <img
                  src="/illustrations/dp-isolation.png"
                  alt="Three sealed enclosures, each holding one business's ledger, each reached by its own phone, with no path between them"
                  style={{ width: "100%", maxWidth: "420px", height: "auto", mixBlendMode: "multiply" }}
                />
              </div>
              <div className="p-10 flex flex-col justify-center" style={{ minHeight: "380px", background: "rgba(0,168,89,0.04)" }}>
                <span className="text-[9px] font-medium text-cn-muted uppercase tracking-wider block" style={{ lineHeight: "16px" }}>
                  FIG 1.0
                </span>
                <div className="space-y-4" style={{ marginTop: "20px" }}>
                  <p className="text-[12px] font-semibold bg-gradient-to-r from-[#0077B6] to-[#00A859] bg-clip-text text-transparent" style={{ lineHeight: "16px" }}>
                    One business, one enclosure
                  </p>
                  <p className="text-[11px] text-cn-muted" style={{ lineHeight: "16px" }}>
                    Every business sits in its own partition, reached by its own
                    authorised numbers. Nothing crosses between them, because there
                    is no line to cross on.
                  </p>
                  <p className="text-[11px] text-cn-muted" style={{ lineHeight: "16px" }}>
                    A practice sees its own client list from the dashboard. The agent
                    working inside any one of those clients has no view of the others
                    and no way to ask for one.
                  </p>
                </div>
              </div>
            </div>
          </ScaleIn>
        </section>

        {/* The mechanism. Drawn in markup, not generated — see the note at the top. */}
        <section className="mx-auto max-w-[var(--content-max-w)] product-section-mobile md:page-grid pt-[16px] md:pt-[24px] pb-[40px] md:pb-[80px]">
          <ScaleIn style={{ gridColumn: "2 / 12" }} className="panel-scale-mobile">
            <div
              className="relative overflow-hidden"
              style={{
                background: "linear-gradient(160deg, #0A0A0A 0%, #111827 40%, #0d1a2e 100%)",
                padding: "40px 32px",
              }}
            >
              <span className="text-[9px] font-medium uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.45)" }}>
                FIG 1.1 &nbsp;·&nbsp; How a business is identified
              </span>

              {/*
                A LEDGER REGISTER, NOT A ROW OF STEP CARDS.

                The four-across card layout is what every SaaS page reaches for,
                and it says nothing about what this company does. A register does:
                reference column, event, what is known after the line. It is the
                form an accountant reads without being taught it.

                THE DOUBLE RULE IS A REAL BORROWING. In bookkeeping a double
                underline closes a total: nothing below it changes what is above.
                Here it marks the boundary the agent runs behind, which is the
                same idea. Everything above the double rule happens before the
                model is invoked at all.
              */}
              <div style={{ marginTop: "28px" }}>
                {/* Column heads */}
                <div
                  className="hidden md:grid md:grid-cols-[56px_minmax(0,1.05fr)_minmax(0,1fr)] md:gap-6"
                  style={{ paddingBottom: "10px" }}
                >
                  {["Ref", "Event", "Known after this line"].map((h) => (
                    <span key={h} className="text-[9px] font-medium uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.35)" }}>
                      {h}
                    </span>
                  ))}
                </div>

                <div style={{ borderTop: "1px solid rgba(255,255,255,0.22)" }} />

                {[
                  { ref: "01", event: "A message arrives", sub: "WhatsApp, inbound", known: "a phone number" },
                  { ref: "02", event: "The number is looked up", sub: "against the authorised senders", known: "a business" },
                  { ref: "03", event: "The business is bound", sub: "resolved by the system", known: "fixed for the whole turn" },
                ].map((r) => (
                  <div
                    key={r.ref}
                    className="md:grid md:grid-cols-[56px_minmax(0,1.05fr)_minmax(0,1fr)] md:gap-6"
                    style={{ padding: "16px 0", borderBottom: "1px solid rgba(255,255,255,0.08)" }}
                  >
                    <span className="text-[11px] tabular-nums" style={{ color: "rgba(255,255,255,0.35)" }}>{r.ref}</span>
                    <div>
                      <p className="text-[13px] font-semibold text-white" style={{ lineHeight: "18px" }}>{r.event}</p>
                      <p className="text-[11px]" style={{ color: "rgba(255,255,255,0.4)", lineHeight: "16px", marginTop: "3px" }}>{r.sub}</p>
                    </div>
                    <p className="text-[12px] mt-2 md:mt-0" style={{ color: "rgba(255,255,255,0.62)", lineHeight: "18px" }}>{r.known}</p>
                  </div>
                ))}

                {/* The closing rule. Two lines, 3px apart, exactly as a ledger
                    draws a final total. This is the security boundary. */}
                <div style={{ marginTop: "18px" }}>
                  <div style={{ borderTop: "1px solid rgba(255,255,255,0.55)" }} />
                  <div style={{ height: "3px" }} />
                  <div style={{ borderTop: "1px solid rgba(255,255,255,0.55)" }} />
                </div>
                <p className="text-[10px]" style={{ color: "rgba(255,255,255,0.4)", marginTop: "10px" }}>
                  Everything above this rule happens before the model is invoked.
                </p>

                <div
                  className="md:grid md:grid-cols-[56px_minmax(0,1.05fr)_minmax(0,1fr)] md:gap-6"
                  style={{ padding: "16px 0 0" }}
                >
                  <span className="text-[11px] tabular-nums" style={{ color: "rgba(255,255,255,0.35)" }}>04</span>
                  <div>
                    <p className="text-[13px] font-semibold" style={{ lineHeight: "18px", color: "#00A859" }}>The agent runs</p>
                    <p className="text-[11px]" style={{ color: "rgba(255,255,255,0.4)", lineHeight: "16px", marginTop: "3px" }}>
                      it cannot change it, name another, or ask
                    </p>
                  </div>
                  <p className="text-[12px] mt-2 md:mt-0" style={{ color: "rgba(255,255,255,0.62)", lineHeight: "18px" }}>
                    one business, and only that one
                  </p>
                </div>
              </div>

              <div style={{ height: "1px", background: "rgba(255,255,255,0.12)", margin: "32px 0 20px" }} />

              <div className="md:grid md:grid-cols-2 md:gap-10">
                <p className="text-[11px]" style={{ color: "rgba(255,255,255,0.5)", lineHeight: "16px" }}>
                  Every record CaribBooks holds is partitioned by business. Reaching
                  another business&rsquo;s data is not a filter someone could forget to
                  apply. It is a different partition, and nothing in the agent&rsquo;s
                  vocabulary points at it.
                </p>
                <p className="text-[11px] mt-3 md:mt-0" style={{ color: "rgba(255,255,255,0.5)", lineHeight: "16px" }}>
                  A posted transaction cannot be deleted by the agent either. To undo
                  one it posts a reversing entry, so the original stays in the ledger
                  and the audit trail survives the correction.
                </p>
              </div>
            </div>
          </ScaleIn>
        </section>

        <div className="border-t border-cn-border w-full" />

        {/* ── 2.0 The three-up ─────────────────────────────────────────── */}
        <section className="mx-auto max-w-[var(--content-max-w)] product-section-mobile md:page-grid pt-[40px] md:pt-[80px] pb-[24px]">
          <FadeIn style={{ gridColumn: "2 / 6" }}>
            <h2 className={HEAD} style={{ lineHeight: "1" }}>
              <span className="text-cn-muted">Encryption, residency</span>
              <br />
              <span>and access</span>
            </h2>
          </FadeIn>
          <FadeIn className="mt-3 md:mt-0" style={{ gridColumn: "7 / 12" }} delay={0.1}>
            <p className={BODY} style={LINE}>
              Three questions every practice asks, answered with specifics rather than
              adjectives.
            </p>
          </FadeIn>
        </section>

        <section className="mx-auto max-w-[var(--content-max-w)] product-section-mobile md:page-grid pb-[64px]">
          <div className="hidden md:grid md:grid-cols-[1fr_1px_1fr_1px_1fr] md:gap-0" style={{ gridColumn: "2 / 12", marginTop: "24px" }}>
            {[
              {
                fig: "FIG 2.1",
                title: "Encrypted, both ways",
                img: "/illustrations/dp-encryption.png",
                color: "#0077B6",
                desc: "AES-256 at rest across every database and file store. TLS 1.2 and 1.3 in transit, with no plaintext path anywhere in the chain. Requests over plain HTTP are refused rather than upgraded.",
              },
              {
                fig: "FIG 2.2",
                title: "Named jurisdictions",
                img: "/illustrations/dp-residency.png",
                color: "#00A859",
                desc: "The books sit with Amazon Web Services in the United States. WhatsApp message content sits with Unipile in France, inside the European Union, under the GDPR. No Caribbean provider offers a local region, so we name the real ones.",
              },
              {
                fig: "FIG 2.3",
                title: "No password to steal",
                img: "/illustrations/dp-access.png",
                color: "#FF5733",
                desc: "Sign-in is a one-time code to a verified address; no password exists to be reused or leaked. Access is scoped by role, and a staff seat at a practice cannot delete a client's history.",
              },
            ].map((c, i) => (
              <Fragment key={c.fig}>
                {i > 0 && <div className="bg-cn-border" />}
                <div className="pl-4 pr-2">
                  <span className="text-[9px] font-medium text-cn-muted uppercase tracking-wider block" style={{ lineHeight: "16px" }}>
                    {c.fig}
                  </span>
                  <div className="flex items-center justify-center" style={{ height: "150px", marginTop: "12px", marginBottom: "8px" }}>
                    <img src={c.img} alt="" style={{ height: "150px", width: "auto", objectFit: "contain", mixBlendMode: "multiply" }} />
                  </div>
                  <h3 className="text-[13px] font-bold" style={{ lineHeight: "24px", color: c.color }}>
                    {c.title}
                  </h3>
                  <p className="text-[11px] text-cn-muted" style={{ marginTop: "8px", lineHeight: "16px" }}>
                    {c.desc}
                  </p>
                </div>
              </Fragment>
            ))}
          </div>
        </section>

        <div className="border-t border-cn-border w-full" />

        {/* ── 3.0 Jamaica DPA ──────────────────────────────────────────── */}
        <section className="mx-auto max-w-[var(--content-max-w)] product-section-mobile md:page-grid pt-[40px] md:pt-[80px] pb-[24px]">
          <FadeIn style={{ gridColumn: "2 / 6" }}>
            <h2 className={HEAD} style={{ lineHeight: "1" }}>
              <span className="text-cn-muted">The Jamaica Data</span>
              <br />
              <span className="bg-gradient-to-r from-[#00A859] to-[#FF5733] bg-clip-text text-transparent">
                Protection Act
              </span>
            </h2>
            <div className="flex items-center gap-4" style={{ marginTop: "20px" }}>
              <img src="/logo/logo-caribbooks.svg" alt="CaribBooks" style={{ height: "16px", width: "auto" }} />
              <span style={{ width: "1px", height: "16px", background: "var(--cn-border)" }} />
              <img src="/logo/logo-caribnexus-automations.svg" alt="CaribNexus AI Automations" style={{ height: "13px", width: "auto" }} />
            </div>
          </FadeIn>
          <FadeIn className="mt-3 md:mt-0" style={{ gridColumn: "7 / 12" }} delay={0.1}>
            <p className={BODY} style={LINE}>
              The Act sets eight standards every data controller must meet. Below is each one
              against the mechanism in our products that satisfies it. We have written
              mechanisms rather than assurances, because a mechanism can be checked.
            </p>
            <p className={BODY} style={{ ...LINE, marginTop: "12px" }}>
              This applies across everything we build. CaribBooks isolates by partition,
              because it is one system serving many businesses. An Automations system is built
              for a single business, so there is no second business inside it to reach. The
              standards are the same either way; only the mechanism differs.
            </p>
          </FadeIn>
        </section>

        <section className="mx-auto max-w-[var(--content-max-w)] product-section-mobile md:page-grid pb-[64px]">
          <div style={{ gridColumn: "2 / 12", marginTop: "16px" }}>
            {STANDARDS.map((s) => (
              <FadeIn key={s.n}>
                <div
                  className="md:grid md:grid-cols-[28px_260px_1fr] md:gap-6"
                  style={{ padding: "18px 0", borderTop: "1px solid var(--cn-border)" }}
                >
                  <span className="text-[10px] font-medium text-cn-muted tabular-nums">{s.n}</span>
                  <p className="text-[13px] font-semibold text-cn-dark" style={{ lineHeight: "1.35" }}>
                    {s.standard}
                  </p>
                  <p className="text-[13px] text-cn-muted mt-1 md:mt-0" style={{ lineHeight: "1.45" }}>
                    {s.how}
                  </p>
                </div>
              </FadeIn>
            ))}
            <div style={{ borderTop: "1px solid var(--cn-border)" }} />
          </div>
        </section>

        <div className="border-t border-cn-border w-full" />

        {/* ── 4.0 The wider Caribbean ──────────────────────────────────── */}
        <section className="mx-auto max-w-[var(--content-max-w)] product-section-mobile md:page-grid pt-[40px] md:pt-[80px] pb-[24px]">
          <FadeIn style={{ gridColumn: "2 / 6" }}>
            <h2 className={HEAD} style={{ lineHeight: "1" }}>
              <span className="text-cn-muted">One standard,</span>
              <br />
              <span>every island</span>
            </h2>
          </FadeIn>
          <FadeIn className="mt-3 md:mt-0" style={{ gridColumn: "7 / 12" }} delay={0.1}>
            <p className={BODY} style={LINE}>
              The region does not have one data protection law, it has many, at different stages
              of force. Rather than build a different posture for each, we hold every business
              to the strictest standard that applies to any of them, and meet the local
              instrument where it asks for more.
            </p>
            <div style={{ marginTop: "20px" }}>
              {JURISDICTIONS.map((j) => (
                <div
                  key={j.place}
                  className="flex items-baseline justify-between"
                  style={{ padding: "10px 0", borderTop: "1px solid var(--cn-border)" }}
                >
                  <span className="text-[13px] font-medium text-cn-dark">{j.place}</span>
                  <span className="text-[12px] text-cn-muted">{j.law}</span>
                </div>
              ))}
              <div style={{ borderTop: "1px solid var(--cn-border)" }} />
            </div>
            <p className={BODY} style={{ ...LINE, marginTop: "16px" }}>
              Serving somewhere not listed? Tell us and we will confirm the position before you
              onboard a single client.
            </p>
          </FadeIn>
        </section>

        <div className="border-t border-cn-border w-full" />

        {/* ── 5.0 Close ────────────────────────────────────────────────── */}
        <section className="mx-auto max-w-[var(--content-max-w)] product-section-mobile md:page-grid pt-[40px] md:pt-[80px] pb-[80px]">
          <FadeIn style={{ gridColumn: "2 / 6" }}>
            <h2 className={HEAD} style={{ lineHeight: "1" }}>
              <span className="text-cn-muted">Ask us</span>
              <br />
              <span>anything</span>
            </h2>
          </FadeIn>
          <FadeIn className="mt-3 md:mt-0" style={{ gridColumn: "7 / 12" }} delay={0.1}>
            <p className={BODY} style={LINE}>
              Practices reviewing us for their own compliance file can have a data processing
              agreement, the full retention schedule, and a written answer to anything here. We
              would rather answer a hard question than have it go unasked.
            </p>
            <p style={{ marginTop: "16px" }}>
              <span className="text-[10px] font-medium text-cn-muted">5.1</span>{" "}
              <Link
                href="/privacy"
                className="text-[11px] font-medium bg-gradient-to-r from-[#0077B6] to-[#00A859] bg-clip-text text-transparent hover:opacity-80 transition-opacity"
              >
                Read the privacy policy →
              </Link>
            </p>
          </FadeIn>
        </section>
      </main>
      <Footer />
    </>
  );
}
