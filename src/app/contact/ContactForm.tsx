"use client";

import { useState } from "react";

/**
 * The consultation request, asked a section at a time.
 *
 * WHY IT IS STEPPED
 *   Twelve fields on one screen reads as work and gets abandoned. The same
 *   twelve, four at a time behind a Next button, reads as a short
 *   conversation. Nothing is hidden — the step count says how far it goes.
 *
 * WHY NO SPECIFIC TIME SLOTS
 *   Offering 10:00 and 10:30 without real calendar availability promises
 *   something that cannot be held: someone picks a slot, it is already
 *   taken, and the first thing that happens is a reschedule. A day and a
 *   part of the day gives the same scheduling signal and stays honest.
 *
 * WHY NOTHING ASKS WHAT THEY SPEND
 *   Asking what someone pays their accountant before they have spoken to
 *   anyone reads as qualifying their wallet. It belongs in the call.
 */

type State = "idle" | "sending" | "sent" | "failed";

const STEPS = ["You", "Business", "What you need", "When"] as const;

const INDUSTRIES = [
  "Construction & trades", "Retail & wholesale", "Restaurant & hospitality",
  "Professional services", "Health & wellness", "Transport & logistics",
  "Agriculture", "Manufacturing", "Education", "Technology", "Other",
];

/* The bands used to stop at "21 or more", which lumped a team of 25 in
   with a team of 200. Most of who we want to talk to sits between, so
   the range now carries to 50 and over. */
const SIZES = ["Just me", "2–5", "6–20", "21–50", "More than 50"];

/**
 * The choice is between the two things on offer, shown as themselves.
 *
 * It replaced "what do you keep your books in today?", which assumed every
 * visitor had come about bookkeeping. Plenty arrive for the automations
 * side and that question reads as the wrong shop.
 *
 * The third option is there because a consultancy's best lead is often
 * someone who knows the problem and not the product.
 */
const PRODUCTS = [
  {
    fig: "FIG 1.0",
    value: "CaribBooks",
    logo: "/logo/logo-caribbooks.svg",
    accent: "#00A859",
    desc: "Bookkeeping and financial admin, on WhatsApp. Entries, reports, invoices and receipts.",
  },
  {
    fig: "FIG 2.0",
    value: "CaribNexus AI Automations",
    logo: "/logo/logo-caribnexus-automations.svg",
    accent: "#0077B6",
    desc: "Customer service, communications and internal operations — wherever repetition lives.",
  },
  {
    fig: "FIG 3.0",
    value: "Not sure yet",
    logo: null,
    accent: "#FF5733",
    desc: "Tell us the problem and we'll say which one fits, or whether neither does.",
  },
];

const WHENS = ["Morning", "Afternoon", "Either"];

/** Two clear days before the earliest bookable one. */
const LEAD_DAYS = 2;

/**
 * The first day anyone may ask for, as YYYY-MM-DD.
 *
 * Worked in JAMAICA time regardless of where the browser thinks it is: the
 * business day that matters is ours, and a visitor in Tokyo would otherwise
 * get a floor a day off. `en-CA` formats as YYYY-MM-DD, which is both what a
 * date input wants and a string that sorts correctly — so the check below is
 * a plain comparison.
 */
function earliest(): string {
  const today = new Intl.DateTimeFormat("en-CA", { timeZone: "America/Jamaica" })
    .format(new Date());
  const d = new Date(`${today}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + LEAD_DAYS);
  return d.toISOString().slice(0, 10);
}

/** "Thursday, 5 November" — for saying the floor out loud. */
function spoken(iso: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "long", day: "numeric", month: "long", timeZone: "UTC",
  }).format(new Date(`${iso}T00:00:00Z`));
}
const FORMATS = ["Video call", "Phone or WhatsApp call", "In person, if you're near Kingston"];

export function ContactForm() {
  const [step, setStep] = useState(0);
  const [state, setState] = useState<State>("idle");
  const [error, setError] = useState("");
  const [form, setForm] = useState<Record<string, string>>({});

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  /** Recomputed every render, so a page left open overnight does not go on
      offering yesterday's floor. */
  const minDay = earliest();

  const complete = [
    () => !!(form.name && form.company && form.phone),
    () => !!form.industry,
    () => !!(form.interest && form.goal && form.goal.trim().length > 2),
    () => !!(form.day && form.day >= minDay && form.consent),
  ];

  async function submit() {
    setState("sending");
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "That didn't send.");
      }
      setState("sent");
    } catch (err) {
      // What they typed stays exactly where it is. A failed send that also
      // empties the form costs someone the whole message, and they do not
      // write it twice.
      setState("failed");
      setError(err instanceof Error ? err.message : "That didn't send.");
    }
  }

  if (state === "sent") {
    return (
      <div className="border border-cn-border bg-[var(--cn-paper-deep)] rounded-[28px] p-8 md:p-10">
        <h2 className="text-[24px] font-bold tracking-tight">Got it, {form.name?.split(" ")[0]}.</h2>
        <p className="text-[16px] text-cn-muted mt-3" style={{ lineHeight: 1.6 }}>
          We&apos;ll call you on{" "}
          <strong className="text-cn-dark font-medium">{form.phone}</strong>{" "}
          within one working day to fix a time — usually sooner.
        </p>
        <p className="text-[15px] text-cn-muted mt-4" style={{ lineHeight: 1.6 }}>
          Nothing else to do. If you&apos;d rather add something, reply to{" "}
          <a className="underline hover:text-[#FF5733]" href="mailto:admin@caribnexusai.com">
            admin@caribnexusai.com
          </a>.
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Every other control on this page is a pill, so the rail is too:
          filled where you are, tinted green behind you, outlined ahead. */}
      <ol className="flex flex-wrap items-center gap-2 mb-6" aria-label="Progress">
        {STEPS.map((label, i) => {
          const now = i === step;
          const done = i < step;
          return (
            <li key={label}>
              <span
                aria-current={now ? "step" : undefined}
                className="block text-[13px] font-medium px-4 py-[6px] rounded-full
                           border transition-colors whitespace-nowrap"
                style={now
                  ? { background: "#0077B6", borderColor: "#0077B6", color: "#fff" }
                  : done
                    ? { background: "rgba(0,168,89,0.08)", borderColor: "rgba(0,168,89,0.35)", color: "#00A859" }
                    : { borderColor: "var(--cn-border)", color: "#9CA3AF" }}
              >
                {label}
              </span>
            </li>
          );
        })}
      </ol>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (step < STEPS.length - 1) setStep(step + 1);
          else if (complete[step]()) submit();
        }}
        className="flex flex-col gap-5"
      >
        {/* Off-screen, out of the tab order and hidden from screen readers.
            It was called `website` and a browser autofilled it, which binned
            a real enquiry — so it now has a name no autofill heuristic
            recognises, and the route only FLAGS what lands in it rather than
            discarding the request. */}
        <input
          type="text"
          name="cn_hp"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          value={form.cn_hp ?? ""}
          onChange={(e) => set("cn_hp", e.target.value)}
          style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }}
        />

        {step === 0 && (
          <>
            <Text label="Full name" name="name" value={form.name} onChange={set} autoComplete="name" />
            <Text label="Business name" name="company" value={form.company} onChange={set} autoComplete="organization" />

            {/* One number and nothing else. The Email/Phone toggle that used
                to sit here made every visitor answer a question about our
                admin before they could answer one about their business, and
                the reply is a call either way. */}
            <Text label="Telephone number" name="phone" type="tel"
                  hint="We'll call or WhatsApp this number to fix a time."
                  value={form.phone} onChange={set} autoComplete="tel"
                  placeholder="876 000 0000" />
          </>
        )}

        {step === 1 && (
          <>
            <Select label="What industry are you in?" name="industry" value={form.industry}
                    onChange={set} options={INDUSTRIES} />
            <Choice label="How many people work in the business?" name="size"
                    value={form.size} onChange={set} options={SIZES} />
          </>
        )}

        {step === 2 && (
          <>
            <Products value={form.interest} onChange={set} />

            {/* The bar is one line tall, so this gets the rest of the
                step. It is the answer the call is actually prepared from
                and the only one worth the room. */}
            <div className="flex flex-col gap-3 pt-1">
              <label htmlFor="goal" className="text-[20px] font-semibold text-cn-dark"
                     style={{ lineHeight: 1.3 }}>
                What would you most like to achieve?
              </label>
              <p className="text-[15px] text-cn-muted" style={{ lineHeight: 1.6 }}>
                In your own words, and take your time. A few sentences here
                is worth more than everything else on this form.
              </p>
              <textarea
                id="goal"
                name="goal"
                rows={6}
                value={form.goal ?? ""}
                onChange={(e) => set("goal", e.target.value)}
                className={`${AREA} mt-1`}
                placeholder="We spend two days a month chasing invoices and it still slips…"
              />
            </div>
          </>
        )}

        {step === 3 && (
          <>
            {/* Stacked, not side by side. Sharing the line left the three
                times about 56% of the column and "Afternoon" ran under
                "Either"; full width they sit clear of each other. */}
            <Text label="Preferred day" name="day" type="date"
                  min={minDay}
                  hint={`Earliest is ${spoken(minDay)} — we keep two clear days to prepare.`}
                  value={form.day} onChange={set} />
            <Segments label="Time of day" name="when" value={form.when}
                      onChange={set} options={WHENS} />

            {/* We never asked for an email, so we cannot promise one. The
                number they gave is the only way back to them. */}
            <p className="text-[14px] text-cn-muted -mt-1" style={{ lineHeight: 1.5 }}>
              Jamaica time. We&apos;ll call to confirm the exact time rather
              than hold a slot you can&apos;t see.
            </p>

            {/* A dropdown, not three pills: the options are full sentences
                and only one of them is ever true. */}
            <Select label="How would you like to meet?" name="format"
                    value={form.format} onChange={set} options={FORMATS} />

            <label className="flex gap-3 items-start cursor-pointer">
              <input
                type="checkbox"
                checked={form.consent === "yes"}
                onChange={(e) => set("consent", e.target.checked ? "yes" : "")}
                className="mt-[3px] w-[18px] h-[18px] accent-[#0077B6] shrink-0"
              />
              <span className="text-[15px] text-cn-muted" style={{ lineHeight: 1.5 }}>
                CaribNexus AI may contact me about this request. See our{" "}
                <a href="/privacy" className="underline hover:text-[#FF5733]">privacy notice</a>.
              </span>
            </label>
          </>
        )}

        {state === "failed" && (
          <p role="alert"
             className="text-[15px] rounded-[22px] border px-6 py-4"
             style={{ color: "#B3310F", borderColor: "rgba(255,87,51,0.35)", background: "rgba(255,87,51,0.06)", lineHeight: 1.55 }}>
            {error} Try again, or email{" "}
            <a className="underline" href="mailto:admin@caribnexusai.com">admin@caribnexusai.com</a>{" "}
            — nothing you typed has been lost.
          </p>
        )}

        <div className="flex items-center gap-3 pt-2">
          {step > 0 && (
            <button type="button" onClick={() => setStep(step - 1)}
                    className="text-[16px] font-medium text-cn-muted px-7 py-[14px] rounded-full
                               border border-cn-border bg-white hover:text-[#FF5733]
                               hover:border-[#FF5733] transition-colors shrink-0">
              Back
            </button>
          )}
          {/* Solid brand blue and full width of what is left, like the
              Continue on the CaribBooks sign-in. A gradient here would be a
              third thing competing with the headline and the drawing. */}
          <button
            type="submit"
            disabled={!complete[step]() || state === "sending"}
            className="flex-1 text-[16px] font-semibold text-white px-7 py-[14px] rounded-full
                       bg-[#0077B6] transition-all hover:bg-[#00649B]
                       disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {state === "sending"
              ? "Sending…"
              : step < STEPS.length - 1
                ? "Next"
                : "Request consultation"}
          </button>
        </div>
      </form>
    </div>
  );
}

/* ── fields ──────────────────────────────────────────────────────────── */

/** The CaribBooks sign-in sets a field as a pill with room in it: fully
    rounded, generous horizontal padding, a hairline border, and the brand
    blue on focus. Same language here, so the two products feel like one
    company. */
const INPUT =
  "border border-cn-border bg-white rounded-full px-6 py-[14px] text-[16px] text-cn-dark " +
  "focus:outline-none focus:border-[#0077B6] focus:ring-1 focus:ring-[#0077B6] " +
  "transition-colors w-full";

/** A textarea cannot be a pill and stay readable, so it takes the same
    radius at its corners instead. */
const AREA =
  "border border-cn-border bg-white rounded-[22px] px-6 py-4 text-[16px] text-cn-dark " +
  "focus:outline-none focus:border-[#0077B6] focus:ring-1 focus:ring-[#0077B6] " +
  "transition-colors w-full resize-y placeholder:text-cn-muted/60";

function Label({ htmlFor, children, hint }: { htmlFor: string; children: React.ReactNode; hint?: string }) {
  return (
    <>
      <label htmlFor={htmlFor} className="text-[15px] font-medium text-cn-dark">{children}</label>
      {hint && <p className="text-[14px] text-cn-muted" style={{ lineHeight: 1.5 }}>{hint}</p>}
    </>
  );
}

function Text({ label, name, value, onChange, hint, ...rest }: {
  label: string; name: string; value?: string; hint?: string;
  onChange: (k: string, v: string) => void;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value" | "name">) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={name} hint={hint}>{label}</Label>
      <input id={name} name={name} value={value ?? ""} className={INPUT}
             onChange={(e) => onChange(name, e.target.value)} {...rest} />
    </div>
  );
}

function Area({ label, name, value, onChange, hint, placeholder }: {
  label: string; name: string; value?: string; hint?: string; placeholder?: string;
  onChange: (k: string, v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={name} hint={hint}>{label}</Label>
      <textarea id={name} name={name} rows={5} value={value ?? ""} placeholder={placeholder}
                className={AREA}
                onChange={(e) => onChange(name, e.target.value)} />
    </div>
  );
}

function Select({ label, name, value, onChange, options }: {
  label: string; name: string; value?: string; options: string[];
  onChange: (k: string, v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={name}>{label}</Label>
      <select id={name} name={name} value={value ?? ""} className={INPUT}
              onChange={(e) => onChange(name, e.target.value)}>
        <option value="">Choose one…</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

/**
 * The product choice as a segmented bar.
 *
 * It is the same control as the Email/Phone toggle this form used to carry
 * — one pill, divided — so nothing new is introduced at the point where it
 * asks its most important question. Three cards, three plates or a picker
 * wheel all took a third of the step and still read as work; this takes a
 * line, and the room goes to the question underneath it.
 *
 * The chosen segment is TINTED rather than filled. The marks are coloured
 * artwork and a solid brand fill behind them is unreadable, which is the
 * one place this cannot copy the rest of the page exactly.
 *
 * The line of explanation lives below the bar rather than inside it, so the
 * segments stay short enough to sit side by side.
 */
function Products({ value, onChange }: {
  value?: string; onChange: (k: string, v: string) => void;
}) {
  const chosen = PRODUCTS.find((p) => p.value === value);

  return (
    <div>
      <p className="text-[15px] font-medium text-cn-dark mb-1" id="interest-label">
        Which are you here about?
      </p>
      <p className="text-[14px] text-cn-muted mb-3" style={{ lineHeight: 1.5 }}>
        Pick the nearer one. We&apos;ll say on the call if it&apos;s the other.
      </p>

      <div
        role="radiogroup"
        aria-labelledby="interest-label"
        className="flex flex-col sm:flex-row w-full p-1 gap-1 rounded-[26px] sm:rounded-full
                   border border-cn-border bg-white"
      >
        {PRODUCTS.map((p) => {
          const on = value === p.value;
          return (
            <button
              key={p.value}
              type="button"
              role="radio"
              aria-checked={on}
              aria-label={p.value}
              onClick={() => onChange("interest", p.value)}
              className="flex-1 min-w-0 flex items-center justify-center px-3 py-[11px]
                         rounded-full transition-all duration-200"
              style={on
                ? { background: `${p.accent}14`, boxShadow: `inset 0 0 0 1px ${p.accent}4D` }
                : undefined}
            >
              {p.logo ? (
                /* Sized by HEIGHT and not allowed to shrink: the two marks
                   are different shapes, and matching their widths would set
                   one at twice the weight of the other. */
                <img
                  src={p.logo}
                  alt=""
                  className="h-[15px] sm:h-[13px] w-auto shrink-0 transition-opacity duration-200"
                  style={{ opacity: on ? 1 : 0.45 }}
                />
              ) : (
                <span
                  className="text-[14px] font-medium whitespace-nowrap transition-colors"
                  style={{ color: on ? "#0A0A0A" : "#6B7280" }}
                >
                  Not sure yet
                </span>
              )}
            </button>
          );
        })}
      </div>

      {chosen && (
        <p className="text-[14px] text-cn-muted mt-3" style={{ lineHeight: 1.55 }}>
          <span className="font-medium uppercase tracking-wider text-[11px] mr-2"
                style={{ color: chosen.accent }}>
            {chosen.fig}
          </span>
          {chosen.desc}
        </p>
      )}
    </div>
  );
}

/**
 * A segmented pill for options short enough to sit side by side. Solid fill
 * on the chosen one — these are words, not artwork, so unlike the product
 * bar it can take the brand blue straight.
 */
function Segments({ label, name, value, onChange, options }: {
  label: string; name: string; value?: string; options: string[];
  onChange: (k: string, v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-[15px] font-medium text-cn-dark" id={`${name}-label`}>{label}</span>
      <div role="radiogroup" aria-labelledby={`${name}-label`}
           className="flex w-full p-1 gap-1 rounded-full border border-cn-border bg-white">
        {options.map((o) => {
          const on = value === o;
          return (
            <button
              key={o} type="button" role="radio" aria-checked={on}
              onClick={() => onChange(name, o)}
              className="flex-1 min-w-0 text-[15px] font-medium px-3 py-[9px]
                         rounded-full transition-colors whitespace-nowrap"
              style={on ? { background: "#0077B6", color: "#fff" } : { color: "#6B7280" }}
            >
              {o}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/** Real radios, so a keyboard and a screen reader both work. */
function Choice({ label, name, value, onChange, options }: {
  label: string; name: string; value?: string; options: string[];
  onChange: (k: string, v: string) => void;
}) {
  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="text-[15px] font-medium text-cn-dark mb-1">{label}</legend>
      <div className="flex flex-col gap-2">
        {options.map((o) => (
          <label key={o}
                 className="flex items-center gap-3 border border-cn-border rounded-full bg-white
                            px-6 py-[13px] cursor-pointer hover:border-[#0077B6] transition-colors"
                 style={value === o ? { borderColor: "#0077B6", background: "rgba(0,119,182,0.04)" } : undefined}>
            <input type="radio" name={name} value={o} checked={value === o}
                   onChange={() => onChange(name, o)}
                   className="w-[16px] h-[16px] accent-[#0077B6] shrink-0" />
            <span className="text-[15px] text-cn-dark">{o}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
