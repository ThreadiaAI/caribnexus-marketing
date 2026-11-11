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
 * /terms — the contract.
 *
 * BUILT ON THE PRIVACY PAGE'S CHASSIS, DELIBERATELY. Same server component,
 * same SECTIONS-as-single-source idiom, same 15px body, same sticky contents
 * rail in columns 2-3 with the document in 5-11, same numbered clauses. A
 * reader who has just come from /privacy should not be able to tell that these
 * are two documents rather than two halves of one. The reasoning in that
 * file's header applies here unchanged and is not repeated.
 *
 * THE ONE STRUCTURAL DIFFERENCE is that this document is shorter per section
 * and longer in the tail: a privacy notice is mostly description, and a
 * contract is mostly obligation. Sections 5, 8, 9 and 15 carry most of the
 * weight and the rest exist to make those four unambiguous.
 *
 * EVERY OPERATIONAL CLAIM HERE WAS READ OUT OF THE RUNNING SYSTEM, not
 * drafted from a template:
 *
 *   * the tiers and their allowances — caribbooks-frontend-design/src/lib/
 *     stripe/tiers.ts, which is what actually charges the card
 *   * the seven-day grace after a failed card — _PAST_DUE_GRACE_DAYS in
 *     caribbooks/src/caribbooks/runtime/capacity.py
 *   * a practice's clients posting through the whole dunning window —
 *     _FIRM_GRACE in the same file
 *   * add-on transactions surviving the period roll — _addon_balance, ibid.
 *   * the ten-year post-closure retention — caribbooks/docs/
 *     retention_and_deletion.md
 *
 * That bar is the same one the privacy page set for itself, and it is the
 * whole reason either document is worth publishing: a term describing
 * behaviour the software does not have is not a protection, it is a liability.
 *
 * NOT A SUBSTITUTE FOR COUNSEL. Sections 7 and 15 in particular — the
 * controller/processor split and the liability cap — should be read by a
 * Jamaican lawyer before anybody relies on them.
 */

const EFFECTIVE = "11 November 2026";

/**
 * One source for the contents rail and the document body, so a clause cannot
 * exist in the navigation and not in the text, or be renumbered in one place.
 */
const SECTIONS = [
  { id: "parties", n: "1", title: "Who these terms are between" },
  { id: "the-service", n: "2", title: "What CaribBooks is, and is not" },
  { id: "accounts", n: "3", title: "Your account, and who may use it" },
  { id: "your-obligations", n: "4", title: "What you are responsible for" },
  { id: "ai-output", n: "5", title: "AI output, and the limits of it" },
  { id: "documents", n: "6", title: "Documents issued under your name" },
  { id: "practices", n: "7", title: "Accounting practices and their clients" },
  { id: "whatsapp", n: "8", title: "Your WhatsApp number" },
  { id: "fees", n: "9", title: "Fees, billing and renewal" },
  { id: "capacity", n: "10", title: "Transaction capacity and fair use" },
  { id: "acceptable-use", n: "11", title: "Acceptable use" },
  { id: "suspension", n: "12", title: "Suspension and termination" },
  { id: "your-data", n: "13", title: "Your data, during and after" },
  { id: "availability", n: "14", title: "Availability and change" },
  { id: "ip", n: "15", title: "Intellectual property" },
  { id: "liability", n: "16", title: "Liability" },
  { id: "law", n: "17", title: "Governing law, and changes to these terms" },
] as const;

export const metadata: Metadata = {
  title: "Terms of Service",
  description: `The agreement between ${ORG_NAME} and the businesses and accounting practices that use CaribBooks — what the service does, what it does not do, how it is billed, and where responsibility sits.`,
  alternates: { canonical: `${ORG_URL}/terms` },
  openGraph: {
    title: `Terms of Service | ${ORG_NAME}`,
    description: `The agreement between ${ORG_NAME} and the businesses and accounting practices that use CaribBooks.`,
    url: `${ORG_URL}/terms`,
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
      <h2
        className="text-[20px] font-bold tracking-tight"
        style={{ marginTop: "4px", lineHeight: "1.2" }}
      >
        {s.title}
      </h2>
      {children}
    </section>
  );
}

/** Definition rows, used where a table would be heavier than the content warrants. */
function Row({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div
      className="md:grid md:grid-cols-[200px_1fr] md:gap-4"
      style={{ marginTop: "10px" }}
    >
      <div className="text-[13px] font-medium text-cn-dark">{k}</div>
      <div className="text-[15px] text-cn-muted" style={LEAD}>
        {v}
      </div>
    </div>
  );
}

export default function TermsPage() {
  return (
    <>
      <Nav />
      <main className="pt-[var(--nav-h)]">
        <section className="mx-auto max-w-[var(--content-max-w)] product-section-mobile md:page-grid pt-[48px] md:pt-[96px] pb-[24px]">
          <div style={{ gridColumn: "2 / 11" }} className="col-span-full md:col-auto">
            <span className="text-[10px] font-medium text-cn-muted tracking-wide uppercase">
              Legal
            </span>
            <h1
              className="mt-2 text-[28px] md:text-[40px] font-semibold tracking-tight"
              style={{ lineHeight: "1" }}
            >
              <span className="text-cn-muted">Terms of</span>{" "}
              <span className="bg-gradient-to-r from-[#0077B6] to-[#00A859] bg-clip-text text-transparent">
                Service
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
            style={{
              gridColumn: "2 / 4",
              position: "sticky",
              top: "72px",
              alignSelf: "start",
            }}
            aria-label="Contents"
          >
            <span className="text-[10px] font-medium text-cn-muted tracking-wide uppercase">
              Contents
            </span>
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

          <details
            className="md:hidden no-print col-span-full"
            style={{
              marginBottom: "24px",
              borderTop: "1px solid var(--cn-border)",
              borderBottom: "1px solid var(--cn-border)",
              padding: "12px 0",
            }}
          >
            <summary
              className="text-[10px] font-medium text-cn-muted tracking-wide uppercase"
              style={{ cursor: "pointer" }}
            >
              Contents — {SECTIONS.length} sections
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
              These terms are the agreement between {ORG_NAME} and you. They say what
              CaribBooks does, what it will not do, who is answerable for what, and on what
              terms it is paid for. They are written in the same spirit as our privacy
              policy: plainly, with the reasoning left in, and describing the system as it
              actually runs rather than as a template imagines it. Where a clause places a
              limit on us, it is because the software genuinely behaves that way; where one
              places a limit on you, the reason is given.
            </p>

            {/* ── 1 ─────────────────────────────────────────────── */}
            <Section s={SECTIONS[0]}>
              <P>
                These terms are between {ORG_NAME}, a company based in Montego Bay, Saint
                James, Jamaica, founded in 2024 by {FOUNDER_NAME} (“we”,
                “us”), and the business or accounting practice holding the
                account (“you”). They take effect when you first use CaribBooks
                or complete sign-up, whichever is earlier.
              </P>
              <Row k="Supplier" v={`${ORG_NAME}, Montego Bay, Saint James, Jamaica`} />
              <Row
                k="Contact"
                v={
                  <a className="underline" href={`mailto:${ORG_EMAIL}`}>
                    {ORG_EMAIL}
                  </a>
                }
              />
              <Row k="Telephone" v={ORG_PHONE_DISPLAY} />
              <P>
                <strong>Two kinds of customer, one set of terms.</strong> A{" "}
                <em>business</em> uses CaribBooks to keep its own books. An{" "}
                <em>accounting practice</em> uses it to keep books on behalf of its clients.
                Everything below applies to both unless a clause says otherwise; section 7
                exists because the second arrangement puts a third party’s data in our
                hands and that needs saying out loud.
              </P>
              <P>
                Our{" "}
                <a className="underline" href="/privacy">
                  privacy policy
                </a>{" "}
                forms part of these terms. Where the two documents touch the same subject,
                such as retention or deletion, the privacy policy is the fuller statement and
                is the one to rely on.
              </P>
            </Section>

            {/* ── 2 ─────────────────────────────────────────────── */}
            <Section s={SECTIONS[1]}>
              <P>
                <strong>What it is.</strong> CaribBooks is a bookkeeper and financial
                administrator that works over WhatsApp. You send it a photograph of a receipt,
                a voice note about a payment, or a line of text. It records the transaction,
                asks when something does not add up, issues the quotation, invoice or receipt
                that goes with it, chases what is owed, and produces the reports an accountant
                would expect. The conversation is the interface.
              </P>
              <P>
                <strong>What it is not.</strong> This matters more than the sentence above,
                so it is stated flatly. CaribBooks is not an accountant, not an auditor, and
                not a tax agent. It does not give accounting, tax, legal or financial advice,
                it does not file anything with any revenue authority on your behalf, and it
                does not sign off on anything. It is a tool you operate. The books remain
                yours, and so does responsibility for them.
              </P>
              <P>
                <strong>It does not replace your accountant.</strong> If anything, it is
                built to make that relationship cheaper: a practice that receives a clean,
                current ledger spends its time on judgement rather than on data entry. A
                business using CaribBooks without an accountant is making that choice on its
                own assessment, not on our recommendation.
              </P>
              <P>
                Two structural facts worth knowing before you rely on it. A posted transaction
                cannot be deleted by the agent — reversing one leaves both entries in
                the ledger, so the audit trail stays whole. And each business is a separate
                partition, with no means for the agent to name another.
              </P>
            </Section>

            {/* ── 3 ─────────────────────────────────────────────── */}
            <Section s={SECTIONS[2]}>
              <P>
                An account belongs to a business, not to a person. Within it, two kinds of
                access exist and they are not the same thing.
              </P>
              <Row
                k="Dashboard seats"
                v="People who sign in at books.caribnexusai.com. Sign-in is a one-time code to a registered email address; we hold no password for you."
              />
              <Row
                k="Authorised numbers"
                v="Telephone numbers permitted to instruct CaribBooks over WhatsApp on your behalf. A number that is not on this list is not answered, and its messages do not reach your books."
              />
              <P>
                <strong>Anyone on that list can post to your ledger.</strong> CaribBooks
                authenticates the number, not the human holding the handset. If a phone is
                lost, sold, or passes to a former employee, remove the number from your
                dashboard immediately — until you do, whoever has it can instruct
                CaribBooks as you. We are not able to tell the difference and do not accept
                responsibility for entries made by a number you left authorised.
              </P>
              <P>
                You are responsible for everything done under your account, by your staff or by
                anyone you permitted. Tell us promptly at{" "}
                <a className="underline" href={`mailto:${ORG_EMAIL}`}>
                  {ORG_EMAIL}
                </a>{" "}
                if you believe your account or a registered number has been compromised.
              </P>
              <P>
                You must be at least 18 and have authority to bind the business you are signing
                up. CaribBooks is a business product and is not offered to consumers or to
                children.
              </P>
            </Section>

            {/* ── 4 ─────────────────────────────────────────────── */}
            <Section s={SECTIONS[3]}>
              <P>
                <strong>The accuracy of what you send.</strong> CaribBooks records what it is
                given. A receipt photographed so the total is illegible, a voice note naming
                the wrong supplier, or a figure typed with a digit missing will produce an
                entry that is wrong in exactly that way. We do not independently verify your
                source documents and have no means of doing so.
              </P>
              <P>
                <strong>Reviewing what comes back.</strong> Section 5 says this at length. In
                short: CaribBooks’ entries and documents are drafts for you to check, and
                the obligation to check them is yours.
              </P>
              <P>
                <strong>The right to share what you share.</strong> When you send us a
                customer’s name, a supplier’s bank details or an employee’s
                pay, you confirm you are entitled to. Where an accounting practice sends a
                client’s records, section 7 applies.
              </P>
              <P>
                <strong>Your own legal obligations.</strong> Filing returns, keeping statutory
                records, paying what you owe and meeting the requirements of the Jamaica Data
                Protection Act or any other law that applies to you remain yours. CaribBooks
                helps you do them. It does not do them for you and does not know whether you
                have.
              </P>
            </Section>

            {/* ── 5 ─────────────────────────────────────────────── */}
            <Section s={SECTIONS[4]}>
              <P>
                <strong>CaribBooks is built on large language models, and they are wrong
                sometimes.</strong> Not often, and less often than the alternative it usually
                replaces, which is a shoebox of receipts and a weekend in March. But a system
                that reads a blurred photograph and decides which account a cost belongs to is
                making a judgement, and a judgement can be mistaken in ways that look entirely
                ordinary on the page.
              </P>
              <P>
                So, clearly: <strong>every entry CaribBooks posts, every figure it extracts
                and every document it drafts is a draft for your review.</strong> It is not
                verified, not checked by a human at {ORG_NAME}, and not warranted to be
                correct. Treat it as you would work handed to you by a competent and fast
                junior: useful, usually right, and never filed without a look.
              </P>
              <P>
                <strong>It is not advice.</strong> Nothing CaribBooks says is accounting,
                audit, tax, legal, investment or financial advice, including when it answers a
                direct question, suggests a categorisation, or produces a report that looks
                authoritative. Where the answer matters — a return, a filing, a
                disclosure, a decision with money behind it — take it to a qualified
                professional in your jurisdiction.
              </P>
              <P>
                <strong>You remain the author of your books.</strong> If an entry is
                miscategorised and flows into a return, the return is yours and the error is
                yours to correct. This is not us disclaiming a defect; it is the ordinary
                position of anyone who uses a tool to prepare their own records, and it is the
                same position you occupy using a spreadsheet.
              </P>
              <P>
                We do not train models on your books. That is a privacy commitment and it is
                stated in full in section 6 of the{" "}
                <a className="underline" href="/privacy">
                  privacy policy
                </a>
                .
              </P>
            </Section>

            {/* ── 6 ─────────────────────────────────────────────── */}
            <Section s={SECTIONS[5]}>
              <P>
                On the Micro tier and above, CaribBooks issues quotations, invoices and
                receipts. These go out under <em>your</em> business name, with your logo, your
                address and your payment details, to <em>your</em> customer.
              </P>
              <P>
                <strong>They are your documents.</strong> You are the issuer, we are the
                instrument. The prices, the terms, the tax treatment and the obligation they
                create between you and your customer are yours; so is the consequence of
                sending one that is wrong. A document number, once issued, is burned and not
                reused — that is a deliberate property of the ledger, and it means a
                document sent in error is corrected by issuing a credit or a replacement, not
                by pretending the first never existed.
              </P>
              <P>
                CaribBooks will refuse to issue certain documents rather than guess: an invoice
                with no payment details on file, a tax rate nobody has confirmed, a price with
                hidden precision. Those refusals are a feature, and working around one by
                supplying a figure you have not checked puts the result squarely in section 5.
              </P>
            </Section>

            {/* ── 7 ─────────────────────────────────────────────── */}
            <Section s={SECTIONS[6]}>
              <P>
                This section applies where you are an accounting practice, bookkeeping firm or
                similar, using CaribBooks to serve your own clients. It is written to satisfy
                the Jamaica Data Protection Act, 2020, and is intended to do the same work
                under the comparable regimes elsewhere in the region.
              </P>
              <P>
                <strong>You are the controller; we are your processor.</strong> Your
                clients’ data is yours to govern. We process it on your documented
                instructions, which are the instructions implicit in your use of the product,
                and we do not use it for our own purposes.
              </P>
              <P>
                <strong>This section is the written contract the Act requires.</strong> The
                Jamaica Data Protection Act obliges a controller who engages a processor to
                have an arrangement made or evidenced in writing, under which the processor
                acts only on the controller’s instructions and is bound by security
                obligations equivalent to those the Act places on the controller itself. That
                is what the undertakings below are, and they are given to you.
              </P>
              <Row
                k="Instructions only"
                v="We process your clients' personal data only on your instructions, and for no purpose of our own. Your books are never used to train a model."
              />
              <Row
                k="Equivalent security"
                v="We apply technical and organisational measures equivalent to those the Act requires of you as controller. They are described in the data protection page, which is written from the running system rather than from intent."
              />
              <Row
                k="Our people"
                v="Anyone with access is bound by confidentiality that survives the end of their engagement."
              />
              <Row
                k="Sub-processors"
                v={
                  <>
                    Named in the{" "}
                    <a className="underline" href="/privacy">
                      privacy policy
                    </a>
                    . We impose these same obligations on each of them, and we remain
                    answerable to you for what they do. We will tell you before adding or
                    replacing one, and you may object.
                  </>
                }
              />
              <Row
                k="Breaches"
                v="We notify you without undue delay on becoming aware of a personal data breach affecting your clients, with enough detail for you to meet your own duty to report to the Office of the Information Commissioner. The duty to notify the Commissioner is yours, because the Act places it on the controller."
              />
              <Row
                k="Helping you answer"
                v="We assist you, so far as we reasonably can, with requests from your clients or their data subjects to access, correct, or object to processing, and with any assessment or consultation the Act requires of you."
              />
              <Row
                k="At the end"
                v={
                  <>
                    On closure we return or delete your clients’ data on the schedule in
                    section 13 and in the{" "}
                    <a className="underline" href="/privacy">
                      privacy policy
                    </a>
                    .
                  </>
                }
              />
              <Row
                k="Audit"
                v="We make available the information you reasonably need to satisfy yourself that these obligations are met."
              />
              <P>
                <strong>Where the data goes, and on what basis.</strong> The eighth data
                protection standard bars a transfer out of Jamaica unless the receiving
                territory affords an adequate level of protection, or an exception applies.
                CaribBooks runs on Amazon Web Services and reasons using third-party model
                providers, and there is no Jamaican cloud region behind either — so your
                clients’ data does leave Jamaica. Where it goes, which providers hold it and
                the contractual safeguards those transfers are made under are set out in the{" "}
                <a className="underline" href="/privacy">
                  privacy policy
                </a>
                . You are the controller, so the transfer is made on your instruction and you
                should satisfy yourself it is one you can lawfully give. We will give you
                whatever detail you need to make that assessment.
              </P>
              <P>
                <strong>You warrant that you may share what you share.</strong> When you bring
                a client onto CaribBooks you confirm you have the authority and the lawful
                basis to have their records processed by us and by the sub-processors we name,
                that you have given your clients whatever notice their own law requires, and
                that you are registered with the Office of the Information Commissioner where
                the Act requires it of you. We have no relationship with your client and no way
                to verify any of this; we rely on you.
              </P>
              <P>
                <strong>Elsewhere in the region.</strong> If your clients sit outside Jamaica
                — Barbados, Trinidad and Tobago, The Bahamas, the Cayman Islands, Guyana or
                the OECS states — their own data protection legislation may apply to you as
                controller, and the duties it places on you are not identical to Jamaica’s.
                The undertakings above are given in the same terms whichever regime applies,
                but assessing which one governs you, and registering where you must, is yours
                to do.
              </P>
              <P>
                <strong>Your client is not our customer.</strong> They do not hold an account
                with us, cannot be billed by us and cannot instruct us directly. If your
                relationship with them ends, their data remains under your account until you
                tell us otherwise. Under the Act a person who suffers damage through a
                contravention claims against the <em>controller</em>, which is you — so the
                undertakings in this section are the protection you hold, and they are owed to
                you directly.
              </P>
              <P>
                One practical consequence of that split, which we have deliberately built
                around: if your card fails, your clients keep posting. They are third parties,
                they cannot fix your card, and they usually do not know it failed — so cutting
                them off on the first decline would stop their bookkeeping mid-month over
                something that is usually transient. See section 9.
              </P>
            </Section>

            {/* ── 8 ─────────────────────────────────────────────── */}
            <Section s={SECTIONS[7]}>
              <P>
                CaribBooks can work over a WhatsApp number we provide, or over a number you own
                and connect yourself. This section is about the second.
              </P>
              <P>
                <strong>The number stays yours.</strong> Connecting it grants us permission to
                send and receive messages on it for the purpose of operating CaribBooks for
                you. It does not transfer it, and you can disconnect it from your dashboard at
                any time, which ends that permission.
              </P>
              <P>
                <strong>Meta’s rules apply to you directly.</strong> A number on the
                WhatsApp Business Platform is governed by WhatsApp’s own Business Terms
                and Meta’s policies, and messaging charges levied by Meta for
                conversations on your number are billed by Meta to you, not by us. Those terms
                are between you and Meta. We cannot waive them, and where Meta requires us to
                suspend or disconnect a number — a policy breach, a quality rating
                falling too far, an instruction we are given — we will comply, and will
                tell you.
              </P>
              <P>
                <strong>Where you keep using the number yourself.</strong> If your number is
                connected in a way that lets you continue to use the WhatsApp Business app
                alongside CaribBooks, two things follow and both have bitten people before.
                Messages you send by hand are yours, not ours, and will not always be visible
                to CaribBooks or reflected in your books. And group conversations do not reach
                the platform at all — anything agreed in a group is invisible to
                CaribBooks and will not be recorded.
              </P>
              <P>
                You remain responsible for the messages sent from your number, including those
                CaribBooks sends on your instruction, and for having a lawful basis to message
                the people you ask it to contact.
              </P>
            </Section>

            {/* ── 9 ─────────────────────────────────────────────── */}
            <Section s={SECTIONS[8]}>
              <P>
                CaribBooks is sold as a monthly subscription in United States dollars, by tier.
                Business tiers run from Nano to Medium; practice tiers from Starter to
                Professional, where the transaction allowance is pooled across your clients
                rather than fixed per client. Current prices and allowances are published on
                the{" "}
                <a className="underline" href="/services/caribbooks/pricing">
                  pricing page
                </a>{" "}
                and are the ones that apply.
              </P>
              <Row
                k="Billing"
                v="Monthly in advance, by card, through Stripe. We do not store your card details; Stripe does."
              />
              <Row
                k="Annual"
                v="Where offered, an annual term is charged at a reduced monthly-equivalent rate, paid in one instalment for the year."
              />
              <Row
                k="Renewal"
                v="Automatic, at the same tier, until cancelled. Cancel from your dashboard at any time; it takes effect at the end of the period you have paid for."
              />
              <Row
                k="Taxes"
                v="Prices exclude GCT and any other tax that applies. Where we are required to charge it, it is added."
              />
              <P>
                <strong>Refunds.</strong> We do not refund part-months. If you cancel, you keep
                the service until the period you paid for ends.
              </P>
              <P>
                <strong>If a card fails.</strong> We do not stop your bookkeeping on the first
                decline, because a bank’s fraud check that clears two days later would
                otherwise have taken your records away in the meantime — and the
                transactions are yours.
              </P>
              <Row
                k="A business"
                v="You keep posting for seven days after the first failed charge, which is roughly the point Stripe stops retrying. After that, posting is blocked until the card is fixed."
              />
              <Row
                k="A practice's clients"
                v="They keep posting for the whole of the retry window, and stop only when the subscription is finally cancelled. See section 7 for why."
              />
              <P>
                Blocked posting is not deletion. Your books stay where they are and come back
                when payment succeeds. Section 13 governs what happens if the account closes.
              </P>
              <P>
                We may change prices with at least 30 days’ notice by email. A change
                takes effect at your next renewal, and if you do not want it you may cancel
                before then.
              </P>
            </Section>

            {/* ── 10 ────────────────────────────────────────────── */}
            <Section s={SECTIONS[9]}>
              <P>
                Each tier includes a monthly transaction allowance. It resets at the start of
                each billing period and does not roll over.
              </P>
              <P>
                If you need more, additional transactions can be bought on demand. These behave
                differently on purpose: <strong>purchased transactions are not cleared by the
                period roll.</strong> Someone who buys a hundred on the 28th and uses forty
                keeps the other sixty. Your plan allowance is always consumed first, so paid
                credits are never burned while free headroom remains.
              </P>
              <P>
                CaribBooks warns you as you approach the limit rather than stopping without
                notice. If an allowance is exhausted and not topped up, posting pauses until
                the period rolls or you add capacity; nothing already recorded is affected.
              </P>
              <P>
                The allowances are generous for ordinary use and are not a trap. They are there
                because the cost of running the system scales with volume, and a flat price with
                no ceiling eventually means honest customers subsidising one that is using the
                product as a data pipeline.
              </P>
            </Section>

            {/* ── 11 ────────────────────────────────────────────── */}
            <Section s={SECTIONS[10]}>
              <P>You agree not to use CaribBooks to:</P>
              <Row k="Break the law" v="Including recording transactions you know to be fabricated, or producing documents intended to mislead a revenue authority, a lender or a court." />
              <Row k="Send messages you have no right to send" v="Unsolicited bulk messaging from a connected number is a breach of Meta's policies as well as these terms, and it is the fastest way to lose a WhatsApp number permanently." />
              <Row k="Reach another business's data" v="Including attempting to, whether or not you succeed." />
              <Row k="Resell the service" v="Unless you are an accounting practice serving your own clients under section 7, which is exactly what the practice tiers are for." />
              <Row k="Probe, scrape or overload it" v="Automated access beyond ordinary use, or anything intended to extract the system's prompts, models or internal structure." />
              <P>
                CaribBooks will also decline instructions of its own accord in some cases
                — it will not issue a document it cannot stand behind, and it will not
                delete a posted entry. Persistently working around those refusals is a breach
                of this section.
              </P>
            </Section>

            {/* ── 12 ────────────────────────────────────────────── */}
            <Section s={SECTIONS[11]}>
              <P>
                <strong>You may leave at any time.</strong> Cancel from your dashboard. The
                service runs to the end of the period you have paid for, and section 13 then
                applies.
              </P>
              <P>
                <strong>We may suspend an account</strong> where payment has failed and the
                grace in section 9 has run out, where section 11 has been breached, or where we
                are required to by Meta, a payment provider or the law. Except where the breach
                is serious or we have no choice, we will tell you first and give you a
                reasonable chance to put it right.
              </P>
              <P>
                <strong>We may end the agreement</strong> on 30 days’ notice, or
                immediately for a serious breach. If we end it for our own convenience, we will
                refund the unused portion of anything you have paid in advance — the
                exception to section 9’s no-part-refunds rule, because the decision was
                ours and not yours.
              </P>
              <P>
                Suspension does not delete anything. The difference between suspension and
                closure is the whole subject of the next section.
              </P>
            </Section>

            {/* ── 13 ────────────────────────────────────────────── */}
            <Section s={SECTIONS[12]}>
              <P>
                <strong>Your books are yours.</strong> Not ours, and not ours to withhold. You
                can export your data from the dashboard while the account is live, and we will
                help if the export you need is not one the dashboard offers.
              </P>
              <P>
                <strong>After closure, the accounting records are kept for ten years</strong>,
                then destroyed. That is deliberately above the statutory floor in Jamaica:
                revenue authorities can reach back further than seven years in a dispute, some
                practices ask for ten, and nobody should have to stay subscribed to satisfy a
                records request. Conversation history, reasoning traces and reminders are
                deleted within 30 days of closure.
              </P>
              <P>
                The full schedule, including what is retained while an account is live and what
                “deletion” actually means in each store, is in the{" "}
                <a className="underline" href="/privacy">
                  privacy policy
                </a>
                . Where these terms and that schedule differ, the schedule governs.
              </P>
              <P>
                A posted journal entry cannot be erased on request, because removing one side of
                a double entry falsifies a ledger. An erasure request against live books is met
                by reversal and redaction, which is explained in the privacy policy.
              </P>
            </Section>

            {/* ── 14 ────────────────────────────────────────────── */}
            <Section s={SECTIONS[13]}>
              <P>
                We work to keep CaribBooks available and we monitor it, but we do not offer a
                contractual uptime guarantee, and you should not treat it as infrastructure you
                can fail over to. It is provided as it is.
              </P>
              <P>
                <strong>It depends on things we do not control.</strong> WhatsApp and Meta
                carry every message. Amazon Web Services runs the system. Third-party model
                providers do the reasoning. An outage at any of them is an outage for you, and
                we cannot undertake to prevent it. What we can undertake is to be honest about
                it when it happens.
              </P>
              <P>
                We improve the product continuously and may change how features work. Where a
                change materially reduces what you are getting, we will give you reasonable
                notice. We will not remove your ability to export your own data.
              </P>
            </Section>

            {/* ── 15 ────────────────────────────────────────────── */}
            <Section s={SECTIONS[14]}>
              <P>
                <strong>You own your data.</strong> Your transactions, documents, chart of
                accounts, customers, vendors, messages and logo remain yours. We claim no
                ownership of them and acquire no licence beyond what is needed to run the
                service for you and to meet our legal obligations.
              </P>
              <P>
                <strong>We own the software.</strong> CaribBooks, its interfaces, its prompts,
                its models as configured, its documentation and the {ORG_NAME} and CaribBooks
                names and marks are ours. Using the service does not transfer any of it, and
                nothing here grants you a licence to copy, reverse engineer or build a
                competing product from it.
              </P>
              <P>
                If you send us feedback or a suggestion, we may act on it without owing you
                anything for it. This is not a claim on your ideas generally; it means we do not
                have to track whose suggestion led to which improvement.
              </P>
            </Section>

            {/* ── 16 ────────────────────────────────────────────── */}
            <Section s={SECTIONS[15]}>
              <P>
                Nothing in these terms limits liability for death or personal injury caused by
                negligence, for fraud or fraudulent misrepresentation, or for anything else
                that cannot lawfully be limited. Everything below is subject to that.
              </P>
              <P>
                <strong>That carve-out includes data protection, and it is meant literally.</strong>{" "}
                Nothing here limits or excludes any right a data subject has under the Jamaica
                Data Protection Act, 2020 or under the comparable law of another territory,
                affects the Information Commissioner’s powers against either of us, or
                relieves us of the processor undertakings in section 7. A data subject is not
                a party to this contract and their statutory rights are not ours to cap. Where
                a court or the Commissioner finds any part of this section unenforceable, the
                rest of it stands.
              </P>
              <P>
                <strong>The cap.</strong> Our total liability to you, for all claims arising in
                any twelve-month period, is limited to the fees you paid us in the twelve months
                before the claim arose.
              </P>
              <P>
                <strong>What we are not liable for.</strong> Indirect or consequential loss;
                loss of profit, revenue, goodwill or anticipated savings; and — stated
                explicitly because it is the one that matters here — penalties, interest
                or assessments imposed on you by a revenue authority, and the cost of
                professional work to correct or restate records.
              </P>
              <P>
                That last exclusion is the commercial substance of section 5 and we would rather
                be blunt about it than bury it. A subscription costing a few hundred US dollars a
                year cannot stand behind the tax position of a business, and any supplier who
                tells you otherwise has not thought about the arithmetic. The protection against
                a miscategorised entry reaching a return is your review of the books and your
                accountant’s, not this contract.
              </P>
              <P>
                <strong>Provided as it is.</strong> To the extent the law allows, we exclude
                implied warranties of merchantability, fitness for a particular purpose and
                non-infringement. We do not warrant that CaribBooks will be uninterrupted,
                error-free, or that its output will be accurate.
              </P>
              <P>
                <strong>You indemnify us</strong> against claims brought by a third party
                — including your own client, your customer, or a person you messaged
                — arising from your use of CaribBooks in breach of these terms, from data
                you had no right to share with us, or from a document issued under your name.
              </P>
            </Section>

            {/* ── 17 ────────────────────────────────────────────── */}
            <Section s={SECTIONS[16]}>
              <P>
                These terms are governed by the laws of Jamaica, and the courts of Jamaica have
                exclusive jurisdiction. Before either of us goes to court, we each agree to raise
                the problem in writing and give the other 30 days to resolve it. Most things are
                a misunderstanding and a telephone call.
              </P>
              <P>
                <strong>Changes.</strong> We may update these terms. Where a change materially
                affects your rights we will give at least 30 days’ notice by email to your
                registered address, and it takes effect at your next renewal. Continuing to use
                CaribBooks after that is acceptance. The effective date at the top of this page
                always reflects the current version.
              </P>
              <P>
                If a clause is found unenforceable, the rest stands. A delay in enforcing a term
                is not a waiver of it. These terms, with the privacy policy, are the whole
                agreement between us about CaribBooks and replace anything said beforehand.
              </P>
              <Row
                k="Questions"
                v={
                  <a className="underline" href={`mailto:${ORG_EMAIL}`}>
                    {ORG_EMAIL}
                  </a>
                }
              />
              <Row k="Telephone" v={ORG_PHONE_DISPLAY} />
              <Row k="Post" v={`${ORG_NAME}, Montego Bay, Saint James, Jamaica`} />
            </Section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
