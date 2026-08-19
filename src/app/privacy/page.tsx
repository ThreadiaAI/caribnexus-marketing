import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { ORG_URL } from "@/lib/site";
import {
  FOUNDER_NAME,
  ORG_EMAIL,
  ORG_NAME,
  ORG_PHONE_DISPLAY,
} from "@/lib/structuredData";

/**
 * /privacy — the legal baseline.
 *
 * A SERVER COMPONENT ON PURPOSE, with no animation anywhere. Every other page
 * on this site fades its content in, and that is right for marketing. It is
 * wrong here: this document exists to be read in full, printed, quoted back at
 * us, and indexed. All of it is in the initial HTML with no JavaScript run.
 *
 * WHY IT LOOKS DIFFERENT FROM THE REST OF THE SITE, AND WHY IT STILL LOOKS
 * LIKE US. Same tokens, same 12-column grid, same numbering idiom, same
 * hairline rules. Three deliberate deviations, each for a reason:
 *
 *   1. Body is 15px, not the site's 13px. Thirteen is right for a forty-word
 *      marketing paragraph and punishing across three thousand words of legal
 *      text that people genuinely read line by line.
 *   2. A sticky contents rail in columns 2-3 with the document in 4-11,
 *      instead of the site's 2/6 heading against 7/12 prose. That split
 *      assumes a short heading beside short prose; over long-form it strands
 *      an empty column.
 *   3. Section headings at 20px rather than the marketing 22/30px, because
 *      there are fifteen of them.
 *
 * THE NUMBERING IS NOT DECORATION. The site already labels things 1.1, 2.1 and
 * FIG 0.3. Legal documents are numbered clauses, so the existing idiom does
 * real work: a partner's compliance officer can write "your section 6.2" and
 * both sides know exactly what is meant.
 *
 * EVERY FACTUAL CLAIM HERE WAS MEASURED, not assumed. The residency, the
 * encryption, the retention periods and the sub-processor list come from
 * caribbooks/docs/data_protection_audit.md and
 * caribbooks/docs/retention_and_deletion.md, both of which were written from
 * the running system rather than from intent.
 */

const EFFECTIVE = "18 August 2026";

/**
 * One source for the contents rail and the document body, so a section cannot
 * exist in the navigation and not in the text, or be renumbered in one place.
 */
const SECTIONS = [
  { id: "who-we-are", n: "1", title: "Who we are" },
  { id: "what-we-collect", n: "2", title: "What we collect" },
  { id: "legal-basis", n: "3", title: "Why we are allowed to process it" },
  { id: "client-data", n: "4", title: "Your clients' data, and our role" },
  { id: "ai-processing", n: "5", title: "How AI processing works" },
  { id: "sub-processors", n: "6", title: "Sub-processors" },
  { id: "residency", n: "7", title: "Where your data is held" },
  { id: "retention", n: "8", title: "How long we keep it" },
  { id: "deletion", n: "9", title: "Deletion and erasure" },
  { id: "your-rights", n: "10", title: "Your rights" },
  { id: "security", n: "11", title: "Security" },
  { id: "breaches", n: "12", title: "Personal data breaches" },
  { id: "cookies", n: "13", title: "Cookies" },
  { id: "children", n: "14", title: "Children" },
  { id: "changes", n: "15", title: "Changes and contact" },
] as const;

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${ORG_NAME} collects, uses, stores and deletes personal data, including data processed by CaribBooks on behalf of accounting practices and their clients.`,
  alternates: { canonical: `${ORG_URL}/privacy` },
  openGraph: {
    title: `Privacy Policy | ${ORG_NAME}`,
    description: `How ${ORG_NAME} collects, uses, stores and deletes personal data.`,
    url: `${ORG_URL}/privacy`,
  },
};

const BODY = "text-[15px] text-cn-dark";
const LEAD = { lineHeight: "1.6" } as const;

function P({ children }: { children: React.ReactNode }) {
  return (
    <p className={BODY} style={{ ...LEAD, marginTop: "14px" }}>
      {children}
    </p>
  );
}

function Section({
  s,
  children,
}: {
  s: (typeof SECTIONS)[number];
  children: React.ReactNode;
}) {
  return (
    <section id={s.id} style={{ marginTop: "48px", scrollMarginTop: "72px" }}>
      <span className="text-[10px] font-medium text-cn-muted tracking-wide uppercase">
        Section {s.n}
      </span>
      <h2 className="text-[20px] font-bold tracking-tight" style={{ marginTop: "4px", lineHeight: "1.2" }}>
        {s.title}
      </h2>
      {children}
    </section>
  );
}

/** Definition rows, used where a table would be heavier than the content warrants. */
function Row({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div className="md:grid md:grid-cols-[200px_1fr] md:gap-4" style={{ marginTop: "10px" }}>
      <div className="text-[13px] font-medium text-cn-dark">{k}</div>
      <div className="text-[15px] text-cn-muted" style={LEAD}>{v}</div>
    </div>
  );
}

export default function PrivacyPage() {
  return (
    <>
      <Nav />
      <main className="pt-[var(--nav-h)]">
        <section className="mx-auto max-w-[var(--content-max-w)] product-section-mobile md:page-grid pt-[48px] md:pt-[96px] pb-[24px]">
          <div style={{ gridColumn: "2 / 11" }} className="col-span-full md:col-auto">
            <span className="text-[10px] font-medium text-cn-muted tracking-wide uppercase">Legal</span>
            <h1 className="mt-2 text-[28px] md:text-[40px] font-bold tracking-tight" style={{ lineHeight: "1" }}>
              <span className="text-cn-muted">Privacy</span>{" "}
              <span className="bg-gradient-to-r from-[#0077B6] to-[#00A859] bg-clip-text text-transparent">
                Policy
              </span>
            </h1>
            <p className="text-[13px] text-cn-muted" style={{ marginTop: "12px" }}>
              Effective {EFFECTIVE} &nbsp;·&nbsp; Last updated {EFFECTIVE}
            </p>
          </div>
        </section>

        <div className="border-t border-cn-border w-full" />

        <div className="mx-auto max-w-[var(--content-max-w)] product-section-mobile md:page-grid pt-[40px] pb-[96px]">
          {/* Contents rail. Sticky, and hidden from print — it is navigation. */}
          <nav
            className="hidden md:block no-print"
            style={{ gridColumn: "2 / 4", position: "sticky", top: "72px", alignSelf: "start" }}
            aria-label="Contents"
          >
            <span className="text-[10px] font-medium text-cn-muted tracking-wide uppercase">Contents</span>
            <ol style={{ marginTop: "12px" }}>
              {SECTIONS.map((s) => (
                <li key={s.id} style={{ marginBottom: "6px" }}>
                  <a
                    href={`#${s.id}`}
                    className="text-[12px] text-cn-muted hover:text-[#0077B6] transition-colors"
                  >
                    <span className="tabular-nums">{s.n}.</span> {s.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          {/* Starts at 5, not 4, so a full empty column separates the contents rail
              from the document. It also narrows the measure from roughly 100
              characters to 88, which is the direction a 5,700-word read wants to
              go anyway. The right edge is unchanged. */}
          <details className="md:hidden no-print col-span-full" style={{ marginBottom: "24px", borderTop: "1px solid var(--cn-border)", borderBottom: "1px solid var(--cn-border)", padding: "12px 0" }}>
            <summary className="text-[10px] font-medium text-cn-muted tracking-wide uppercase" style={{ cursor: "pointer" }}>
              Contents &mdash; 15 sections
            </summary>
            <ol style={{ marginTop: "12px" }}>
              {SECTIONS.map((sec) => (
                <li key={sec.id} style={{ marginBottom: "8px" }}>
                  <a href={`#${sec.id}`} className="text-[13px] text-cn-muted">
                    <span className="tabular-nums">{sec.n}.</span> {sec.title}
                  </a>
                </li>
              ))}
            </ol>
          </details>

          <div className="print-full" style={{ gridColumn: "5 / 12" }}>
            <p className={BODY} style={LEAD}>
              {ORG_NAME} builds artificial intelligence systems for businesses across the
              Caribbean. This policy explains what personal data we handle, why, where it is
              held, how long we keep it, and what you can ask us to do with it. It is written
              to be read rather than to be survived, and every factual statement in it
              describes the system as it actually runs.
            </p>

            <Section s={SECTIONS[0]}>
              <P>
                <strong>This policy governs everything we build.</strong>{" "}
                That is CaribBooks, the AI bookkeeper; CaribNexus Automations, the agents we
                deploy across messaging channels; the voice agents we embed on business
                websites; and any custom system we build through consulting. The rules below do
                not change from one to the next.
              </P>
              <P>
                The lines isolate differently, and it is worth saying how rather than flattening
                it. CaribBooks is one system serving many businesses, so isolation is a property
                of its architecture: each business is a separate partition and the agent has no
                means of naming another. An Automations system is built for a single business,
                so there is no second business inside it to reach.
              </P>
              <P>
                <strong>This policy governs everything we build.</strong>{" "}
                That is CaribBooks, the AI bookkeeper; CaribNexus Automations, the agents we
                deploy across messaging channels; the voice agents we embed on business
                websites; and any custom system we build through consulting. The rules below do
                not change from one to the next.
              </P>
              <P>
                The two lines isolate differently, and it is worth saying how. CaribBooks is a
                single system serving many businesses, so isolation is a property of its
                architecture: each business is a separate partition and the agent has no means
                of naming another. An Automations system is built for one business, so there is
                no second business inside it to reach.
              </P>
              <P>
                {ORG_NAME} is a company based in Montego Bay, Saint James, Jamaica, founded in
                2024 by {FOUNDER_NAME}. We are the data controller for information you give us
                directly, such as when you enquire about our services or hold an account with us.
              </P>
              <Row k="Controller" v={`${ORG_NAME}, Montego Bay, Saint James, Jamaica`} />
              <Row k="Privacy contact" v={<a className="underline" href={`mailto:${ORG_EMAIL}`}>{ORG_EMAIL}</a>} />
              <Row k="Telephone" v={ORG_PHONE_DISPLAY} />
              <P>
                Where an accounting practice uses CaribBooks to keep books on behalf of its own
                clients, that practice is the controller of its clients&rsquo; data and we act as
                its processor. Section 4 explains what that means in practice.
              </P>
            </Section>

            <Section s={SECTIONS[1]}>
              <Row k="Identity and contact" v="Name, business name, role, email address, telephone number." />
              <Row k="Account data" v="Email address used to sign in, authentication tokens, and the name displayed for your seat. We do not hold a password for you: sign-in is a one-time code sent to your email." />
              <Row k="Business data" v="The transactions, receipts, invoices, chart of accounts, customers and vendors that CaribBooks records for a business." />
              <Row k="Conversation data" v="Messages, voice notes and images sent to CaribBooks over WhatsApp, and the replies it sends back." />
              <Row k="Technical data" v="IP address, request identifiers and timestamps, held in server logs for 30 days." />
              <P>
                We do not collect special category data, and CaribBooks is not designed to
                receive it. If it arrives in a message, it is treated the same as any other
                message content and is subject to the same retention and deletion terms.
              </P>
            </Section>

            <Section s={SECTIONS[2]}>
              <Row k="Contract" v="Providing the service you or your practice has engaged us for: recording transactions, producing reports, keeping your account working." />
              <Row k="Legal obligation" v="Retaining accounting records for the statutory period, and meeting tax and audit requirements." />
              <Row k="Legitimate interests" v="Keeping the service secure, preventing abuse, and diagnosing faults. We do this in a way that does not override your rights." />
              <Row k="Consent" v="Marketing email, where you have asked to receive it. You can withdraw it at any time and the link is in every message." />
            </Section>

            <Section s={SECTIONS[3]}>
              <P>
                When an accounting practice runs CaribBooks across its client list, we process
                those clients&rsquo; data <strong>on the practice&rsquo;s instructions</strong>. The
                practice decides which clients are onboarded, who at the firm may see them, and
                what happens to the data. We do not use it for anything else.
              </P>
              <P>
                Each business is isolated from every other. A business is identified internally
                by an identifier that the AI agent has no ability to supply, choose or alter:
                the identity is bound by our systems from the phone number the message arrived
                from, before the agent runs at all. The agent has no means of reading, naming or
                referring to another business&rsquo;s records.
              </P>
              <P>
                Within a practice, the right to erase data belongs to the firm&rsquo;s owner or an
                administrator. A staff member seat cannot delete a client&rsquo;s history.
              </P>
            </Section>

            <Section s={SECTIONS[4]}>
              <P>
                CaribBooks learns your business, your vendors, your categories and the way you
                describe things, so that it asks fewer questions over time. That learning stays
                inside your business and is never pooled with anyone else&rsquo;s.
              </P>
              <P>
                <strong>We do not train foundation models on your data.</strong>{" "}
                We are not a model developer. Where we would like to use anonymised examples to
                improve CaribBooks generally, we ask first, and the answer is no until you say
                otherwise.
              </P>
              <P>
                Where we act as processor for an accounting practice, we use that
                practice&rsquo;s client data only on the practice&rsquo;s instructions, and never
                for our own product improvement. A practice&rsquo;s clients are not our
                customers, and we do not treat their books as ours to learn from.
              </P>
              <P>
                Producing a reply does require sending the content of a message to a model
                provider, in the same way that sending an email requires a mail server. That
                provider generates a response and returns it. We select and configure providers
                on the basis that submitted content is not retained for training.
              </P>
              <P>
                CaribBooks does not make decisions with legal effect about anyone. It records
                transactions, asks questions when something is unclear, and proposes entries for
                approval. A posted transaction cannot be deleted by the agent: to reverse one it
                must post a reversing entry, so the original remains in the ledger and the audit
                trail stays intact.
              </P>
            </Section>

            <Section s={SECTIONS[5]}>
              <P>
                We use a small number of providers to run the service. Each is bound by its own
                contract and processes data only to deliver the function described.
              </P>
              <Row k="Amazon Web Services" v="Hosting, databases, file storage, queues and email delivery. United States." />
              <Row
                k="Unipile"
                v={
                  <>
                    The WhatsApp connection carrying messages between a business and CaribBooks.
                    A French company acting as data processor under the GDPR, SOC 2 Type II and
                    CASA Tier II certified, with annual third-party penetration testing. Message
                    content is encrypted at rest with AES-256-GCM and in transit with TLS 1.3,
                    and is hosted exclusively in France. Data associated with an account is
                    removed when that account is deleted. See their{" "}
                    <a className="underline" href="https://www.unipile.com/security-compliance/" target="_blank" rel="noopener noreferrer">
                      security documentation
                    </a>{" "}
                    and{" "}
                    <a className="underline" href="https://www.unipile.com/privacy-policy/" target="_blank" rel="noopener noreferrer">
                      privacy policy
                    </a>.
                  </>
                }
              />
              <Row k="OpenRouter" v="Routes an inference request to a model provider. Does not host models itself." />
              <Row k="Fireworks AI" v="Model inference. United States." />
              <Row k="Vercel" v="Hosting for this website and the dashboard." />
              <P>
                We keep this list current. If we add a sub-processor that materially changes how
                data is handled, we will say so here and, for partner firms, in writing.
              </P>
            </Section>

            <Section s={SECTIONS[6]}>
              <P>
                Your data is held in two places, and we would rather name both than generalise.
              </P>
              <P>
                <strong>The books themselves</strong>{" "}
                — transactions, ledgers, reports, receipt
                images and your account — are held by Amazon Web Services in the United States,
                in regions in Northern Virginia and Ohio.
              </P>
              <P>
                <strong>WhatsApp message content</strong>{" "}
                passes through and is stored by
                Unipile, a French company, on Scaleway infrastructure in France. Unipile states
                that this data is hosted exclusively in the European Union with no transfer
                outside it, so your clients&rsquo; messages sit under the GDPR.
              </P>
              <P>
                There is no Jamaican cloud region behind either provider. A claim of local
                storage would not be true, so we do not make one.
              </P>
              <P>
                Transfers out of Jamaica are made under contractual safeguards with each
                provider. If your practice requires a specific arrangement for cross-border
                transfer, we will discuss it as part of a data processing agreement.
              </P>
            </Section>

            <Section s={SECTIONS[7]}>
              <div style={{ marginTop: "14px", overflowX: "auto" }}>
                <table className="text-[14px]" style={{ borderCollapse: "collapse", width: "100%" }}>
                  <thead>
                    <tr className="text-[11px] uppercase tracking-wide text-cn-muted">
                      <th style={{ textAlign: "left", padding: "8px 12px 8px 0", borderBottom: "1px solid var(--cn-border)" }}>Data</th>
                      <th style={{ textAlign: "left", padding: "8px 0", borderBottom: "1px solid var(--cn-border)" }}>Retention</th>
                    </tr>
                  </thead>
                  <tbody className="text-cn-dark">
                    {[
                      ["Accounting records: journal entries, ledger, chart of accounts, invoices", "Life of the account, then 10 years"],
                      ["Receipt and document images", "Life of the account, then 10 years"],
                      ["WhatsApp message history", "24 months"],
                      ["What CaribBooks has learned about a business", "Life of the account, erasable on request"],
                      ["Reminders", "Until cancelled or fired, erasable on request"],
                      ["Agent reasoning records", "90 days"],
                      ["Server logs", "30 days"],
                      ["Backups and point-in-time recovery", "35 days"],
                    ].map(([a, b]) => (
                      <tr key={a}>
                        <td style={{ padding: "10px 12px 10px 0", borderBottom: "1px solid var(--cn-border)", verticalAlign: "top" }}>{a}</td>
                        <td style={{ padding: "10px 0", borderBottom: "1px solid var(--cn-border)", verticalAlign: "top" }}>{b}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <P>
                Ten years on the accounting record is deliberate, and longer than the statutory
                minimum in Jamaica. A business is required by law to keep its accounting records,
                and a practice should never have to leave us in order to answer a records
                request.
              </P>
            </Section>

            <Section s={SECTIONS[8]}>
              <P>
                You can ask us to erase the message history, the facts CaribBooks has learned
                about your operations, and your reminders, at any time. We will do it and
                confirm when it is done.
              </P>
              <P>
                Worth knowing before you ask: erasing what CaribBooks has learned makes it worse
                at your business. Vendor recognition, category memory and the patterns that let
                it post without asking all come from that data. It will go back to asking
                questions it had stopped needing to ask.
              </P>
              <P>
                We cannot erase the accounting record itself while the statutory retention period
                runs. Deleting it would put the business, and any practice acting for it, in
                breach of its own obligations. This is the limit that data protection law itself
                recognises, and it applies to every provider of accounting software.
              </P>
              <P>
                Two honest qualifications about what deletion means. Backups hold a copy for up
                to 35 days and expire on their own, and server logs may contain identifiers for
                up to 30 days. Deletion is therefore prompt rather than instantaneous everywhere,
                and we would rather say so than claim otherwise.
              </P>
            </Section>

            <Section s={SECTIONS[9]}>
              <P>
                Under the Jamaica Data Protection Act, and under the GDPR where it applies to
                you, you may ask us to give you a copy of your data, correct it, erase it,
                restrict how we use it, provide it in a portable format, or object to a
                particular use. You may also withdraw consent where our basis was consent.
              </P>
              <P>
                Write to <a className="underline" href={`mailto:${ORG_EMAIL}`}>{ORG_EMAIL}</a>. We
                will respond within 30 days. We may need to confirm who you are before acting,
                which is a protection for you rather than an obstacle.
              </P>
              <P>
                If you are a client of an accounting practice that uses CaribBooks, please
                contact the practice first. They are the controller of your data and we will
                support them in answering you.
              </P>
              <P>
                You have the right to complain to the Office of the Information Commissioner in
                Jamaica, or to your own supervisory authority if you are elsewhere.
              </P>
            </Section>

            <Section s={SECTIONS[10]}>
              <Row k="In transit" v="TLS 1.2 and 1.3. Every request between your device, our systems and our providers is encrypted. Plain HTTP is refused." />
              <Row k="At rest" v="AES-256 across databases and file storage." />
              <Row k="Access" v="Sign-in is a one-time code to a verified email address; no password exists to be stolen or reused. Access is scoped by role, and a staff seat cannot delete data." />
              <Row k="Isolation" v="Each business is a separate partition. The AI agent cannot name or reach another business's records." />
              <Row k="Network" v="The service is reachable only through our content delivery network; the systems behind it accept no direct connections from the internet." />
              <Row k="Recovery" v="Continuous backups with 35-day point-in-time recovery, and deletion protection on every database." />
              <P>
                No system is perfectly secure, and anyone who tells you otherwise is selling
                something. What we can tell you is what we actually do, which is written above,
                and that we review it rather than assume it.
              </P>
            </Section>

            <Section s={SECTIONS[11]}>
              <P>
                If a breach occurs that is likely to put anyone at risk, we will notify the
                Office of the Information Commissioner promptly, and within 72 hours where that
                obligation applies. We will tell affected people directly where the risk is high,
                and we will tell any affected practice what happened, what data was involved and
                what we did about it.
              </P>
            </Section>

            <Section s={SECTIONS[12]}>
              <P>
                This website uses only what is necessary to serve pages and remember your session.
                We do not use advertising cookies and we do not sell or share data with
                advertisers. The dashboard uses a session cookie to keep you signed in.
              </P>
            </Section>

            <Section s={SECTIONS[13]}>
              <P>
                Our services are for businesses and are not directed at children. We do not
                knowingly collect data from anyone under 16. If we learn that we have, we will
                delete it.
              </P>
            </Section>

            <Section s={SECTIONS[14]}>
              <P>
                If we change this policy in a way that materially affects you, we will update the
                date at the top, post a notice on this page, and tell partner firms in writing.
              </P>
              <Row k="Email" v={<a className="underline" href={`mailto:${ORG_EMAIL}`}>{ORG_EMAIL}</a>} />
              <Row k="Telephone" v={ORG_PHONE_DISPLAY} />
              <Row k="Post" v={`${ORG_NAME}, Montego Bay, Saint James, Jamaica`} />
              <P>
                Partner firms who need a data processing agreement for their own compliance file
                should write to us and we will provide one.
              </P>
            </Section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
