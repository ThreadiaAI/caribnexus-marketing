import { NextResponse } from "next/server";
import { SESv2Client, SendEmailCommand } from "@aws-sdk/client-sesv2";
import { fromIni } from "@aws-sdk/credential-providers";

/**
 * The consultation request, turned into an email a person can read.
 *
 * WHY SES LIVES IN us-east-2 HERE
 *   Production access and the verified caribnexusai.com identity are both in
 *   Ohio. us-east-1 is still sandboxed on this account, so sending from there
 *   silently only works to addresses that happen to be verified. The region
 *   is pinned rather than read from AWS_REGION for that reason.
 *
 * WHY THE CREDENTIALS ARE NAMED
 *   .env.local sets AWS_PROFILE=caribnexus, which points at the old account
 *   and has dead keys, and the voice routes still read it. So this route
 *   never touches the shared names: locally it takes a profile of its own
 *   (CONTACT_AWS_PROFILE), in production a key pair of its own
 *   (CONTACT_AWS_ACCESS_KEY_ID / CONTACT_AWS_SECRET_ACCESS_KEY) belonging to
 *   a user that can do nothing but send this one email. Nothing here can
 *   change which account another route talks to.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const REGION = process.env.SES_REGION || "us-east-2";
const FROM = process.env.CONTACT_FROM || "CaribNexus AI Website <website@caribnexusai.com>";
const TO = process.env.CONTACT_TO || "admin@caribnexusai.com";
const PROFILE = process.env.CONTACT_AWS_PROFILE;
const KEY = process.env.CONTACT_AWS_ACCESS_KEY_ID;
const SECRET = process.env.CONTACT_AWS_SECRET_ACCESS_KEY;

/** Explicit keys win, then a named local profile, then the default chain. */
function credentials() {
  if (KEY && SECRET) return { accessKeyId: KEY, secretAccessKey: SECRET };
  if (PROFILE) return fromIni({ profile: PROFILE });
  return undefined;
}

const ses = new SESv2Client({ region: REGION, credentials: credentials() });

/* ── keeping the endpoint from becoming a mail relay ─────────────────── */

/** A request every this-many-milliseconds per address, at most. */
const THROTTLE_MS = 60_000;
/** And no more than this many from one address in an hour. */
const HOURLY_CAP = 5;
const HOUR_MS = 3_600_000;

/**
 * In-memory, so it survives exactly as long as the lambda does. That is a
 * real limit — a cold start forgets everything, and two instances do not
 * share a count — but it stops the thing that actually happens, which is one
 * script hammering one warm instance. A durable counter belongs in DynamoDB
 * if this ever gets interesting enough to warrant it.
 */
const seen = new Map<string, number[]>();

function tooMuch(ip: string): string | null {
  const now = Date.now();
  const hits = (seen.get(ip) || []).filter((t) => now - t < HOUR_MS);
  if (hits.length && now - hits[hits.length - 1] < THROTTLE_MS) {
    return "You have just sent one. Give us a minute to read it.";
  }
  if (hits.length >= HOURLY_CAP) {
    return "That is several requests in an hour. Call 1 876 770-6900 instead.";
  }
  hits.push(now);
  seen.set(ip, hits);
  // Unbounded growth is the other way this leaks; drop addresses that have
  // gone quiet whenever the map gets large.
  if (seen.size > 5000) {
    for (const [k, v] of seen) if (!v.some((t) => now - t < HOUR_MS)) seen.delete(k);
  }
  return null;
}

function clientIp(request: Request): string {
  const fwd = request.headers.get("x-forwarded-for");
  return (fwd ? fwd.split(",")[0] : "") .trim()
    || request.headers.get("x-real-ip")
    || "unknown";
}

/** Matches the form: two clear days, counted in Jamaica. */
const LEAD_DAYS = 2;

function earliestDay(): string {
  const today = new Intl.DateTimeFormat("en-CA", { timeZone: "America/Jamaica" })
    .format(new Date());
  const d = new Date(`${today}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + LEAD_DAYS);
  return d.toISOString().slice(0, 10);
}

function spokenDay(iso: string): string {
  const d = new Date(`${iso}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "UTC",
  }).format(d);
}

function nowInJamaica(): string {
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "full", timeStyle: "short", timeZone: "America/Jamaica",
  }).format(new Date());
}

/* ── turning answers back into sentences ─────────────────────────────── */

function sizePhrase(size?: string): string {
  if (!size) return "they did not say how many people work in it";
  if (size === "Just me") return "it is just them";
  if (size === "More than 50") return "more than 50 people work there";
  return `${size} people work there`;
}

function timePhrase(when?: string): string {
  if (when === "Morning") return "in the morning";
  if (when === "Afternoon") return "in the afternoon";
  if (when === "Either") return "at any time of day";
  return "at a time they did not specify";
}

const FORMAT_PHRASES: Record<string, string> = {
  "Video call": "a video call",
  "Phone or WhatsApp call": "a phone or WhatsApp call",
  "In person, if you're near Kingston": "to meet in person, if we are near Kingston",
};

function formatPhrase(format?: string): string {
  if (!format) return "a call, though they did not say which kind";
  return FORMAT_PHRASES[format] || format.toLowerCase();
}

function interestPhrase(interest?: string): string {
  if (interest === "Not sure yet") {
    return "They are not yet sure which of our products fits — they would like us to say";
  }
  return `They are interested in ${interest}`;
}

/* ── the letter ──────────────────────────────────────────────────────── */

type Req = Record<string, string | undefined>;

function letter(f: Req): string {
  return `Dear Administrative Agent,

We have received a new consultation request from ${f.name}, of ${f.company}.

${interestPhrase(f.interest)}. Here is what they said they would most like to
achieve, in their own words:

    "${(f.goal || "").trim()}"

About the business. ${f.company} is in ${f.industry || "an industry they did not name"},
and ${sizePhrase(f.size)}.

When they would like to speak. They asked for ${spokenDay(f.day || "")},
${timePhrase(f.when)}, Jamaica time. They would prefer ${formatPhrase(f.format)}.
Nothing has been held or confirmed — we told them we would call to agree the
exact time rather than book a slot they cannot see.

How to reach them. Call or WhatsApp ${f.phone}. That is the only contact
detail we asked for, so there is no email address for this one.

They ticked the box agreeing that CaribNexus AI may contact them about this
request, so we are clear to make the call.

Yours,
The CaribNexus AI website

Received ${nowInJamaica()}, Jamaica time.
`;
}

/** Everything a visitor typed is escaped before it goes anywhere near HTML. */
function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function letterHtml(f: Req): string {
  const body = esc(letter(f))
    .split("\n\n")
    .map((p) => `<p style="margin:0 0 16px">${p.replace(/\n/g, "<br>")}</p>`)
    .join("");
  return `<!doctype html><html><body style="margin:0;padding:24px;background:#FCFBF9">
<div style="max-width:620px;margin:0 auto;font:16px/1.6 -apple-system,Segoe UI,Helvetica,Arial,sans-serif;color:#1a1a1a">
${body}
</div></body></html>`;
}

/* ── the route ───────────────────────────────────────────────────────── */

const REQUIRED = ["name", "company", "phone", "interest", "goal", "day"] as const;

export async function POST(request: Request) {
  let f: Req;
  try {
    f = await request.json();
  } catch {
    return NextResponse.json({ error: "That didn't send." }, { status: 400 });
  }

  /*
    THE HONEYPOT FLAGS. IT NO LONGER DISCARDS.

    The first version dropped anything with text in the hidden field and
    answered 200. A browser then autofilled it — the field was called
    `website`, which is among the most common autofill targets, and
    autoComplete="off" is advisory — and a real consultation request was
    binned with a confirmation screen shown to the person who sent it. That
    is the worst outcome this endpoint has: silent, invisible on both sides,
    and it costs a customer rather than catching a bot.

    So the trap now only marks. A flagged request is still delivered, with
    the subject saying so, and the judgement is left to a person reading
    their own inbox. A false positive costs one odd-looking email; a false
    negative used to cost a lead.
  */
  const suspect = Boolean(f.cn_hp && String(f.cn_hp).trim());
  if (suspect) console.warn("[contact] honeypot flagged", { ip: clientIp(request) });

  const ip = clientIp(request);
  const slowDown = tooMuch(ip);
  if (slowDown) return NextResponse.json({ error: slowDown }, { status: 429 });

  for (const k of REQUIRED) {
    if (!f[k] || !String(f[k]).trim()) {
      return NextResponse.json({ error: "Some answers are missing." }, { status: 400 });
    }
  }
  if (f.consent !== "yes") {
    return NextResponse.json({ error: "We need your agreement to contact you." }, { status: 400 });
  }
  // The form enforces this too, but `min` on a date input is advisory and a
  // posted body is not a form at all.
  if (String(f.day) < earliestDay()) {
    return NextResponse.json(
      { error: `The earliest day we can take is ${spokenDay(earliestDay())}.` },
      { status: 400 },
    );
  }
  // A goal long enough to be prose, and short enough not to be a payload.
  if (String(f.goal).trim().length < 3 || String(f.goal).length > 4000) {
    return NextResponse.json({ error: "Tell us a little more about the goal." }, { status: 400 });
  }

  try {
    await ses.send(new SendEmailCommand({
      FromEmailAddress: FROM,
      Destination: { ToAddresses: [TO] },
      Content: {
        Simple: {
          Subject: {
            Data: suspect
              ? `[check] Consultation request — ${f.name}, ${f.company}`
              : `Consultation request — ${f.name}, ${f.company}`,
            Charset: "UTF-8",
          },
          Body: {
            Text: { Data: letter(f), Charset: "UTF-8" },
            Html: { Data: letterHtml(f), Charset: "UTF-8" },
          },
        },
      },
    }));
  } catch (err) {
    // The visitor is not told which part of our mail setup failed; the log is
    // where that belongs.
    console.error("[contact] SES send failed", err);
    return NextResponse.json(
      { error: "We couldn't send that just now." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
