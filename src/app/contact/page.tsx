import type { Metadata } from "next";
import { ORG_URL } from "@/lib/site";
import Link from "next/link";
import { FadeIn } from "@/components/Animate";
import { NetworkDiagram } from "@/components/NetworkDiagram";
import { ContactForm } from "./ContactForm";

export const metadata: Metadata = {
  title: "Book a consultation | CaribNexus AI",
  description:
    "Tell us about your business and what you would like to improve. A thirty-minute introductory consultation, about two minutes to request.",
  // check-canonicals fails the build without this: any route that exports
  // metadata has to say, once, which URL it is.
  alternates: { canonical: `${ORG_URL}/contact` },
  openGraph: {
    title: "Book a consultation | CaribNexus AI",
    description:
      "Tell us about your business and what you would like to improve. A thirty-minute introductory consultation, about two minutes to request.",
    url: `${ORG_URL}/contact`,
    type: "website",
  },
};

/**
 * A page with one job.
 *
 * No nav and no footer: every other link on this page is a way to not finish
 * the form. The wordmark stays as the one way back, because a page with no
 * exit at all is a trap rather than a focus.
 */
export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[var(--cn-paper)]">
      {/* The submark, not the wordmark. The headline below already says the
          company's name and says it large; a second lockup above it was the
          same words twice.

          It takes the SAME container as the section below — the old one was
          px-6/md:px-0 while the section carries the grid's own padding, so
          the mark sat about 130px to the left of the heading it was meant to
          line up with. */}
      <div className="mx-auto max-w-[var(--content-max-w)] product-section-mobile md:page-grid
                      pt-10 md:pt-[56px]">
        <Link
          href="/"
          className="inline-block hover:opacity-70 transition-opacity"
          style={{ gridColumn: "2 / 6" }}
          aria-label="CaribNexus AI — back to the home page"
        >
          <img
            src="/icon.png"
            alt="CaribNexus AI"
            className="w-[42px] h-[42px] md:w-[48px] md:h-[48px]"
          />
        </Link>
      </div>

      <section className="mx-auto max-w-[var(--content-max-w)] product-section-mobile md:page-grid pt-[28px] md:pt-[44px] pb-[56px] md:pb-[80px]">
        {/* LEFT: what this is, and the drawing. Still — movement beside a
            form pulls the eye off the fields. */}
        <FadeIn
          className="hidden md:flex flex-col"
          style={{ gridColumn: "2 / 7" }}
          duration={0.8}
        >
          <div className="md:sticky md:top-[36px]">
            <h1
              className="text-[30px] lg:text-[38px] font-bold tracking-tight"
              style={{ lineHeight: 1.1, letterSpacing: "-0.02em" }}
            >
              <span className="text-cn-muted">Let&apos;s see how we can</span>{" "}
              <span className="bg-gradient-to-r from-[#0077B6] via-[#00A859] to-[#FF5733] bg-clip-text text-transparent">
                work for your business
              </span>
            </h1>
            <p
              className="text-[16px] text-cn-muted max-w-[420px] mt-5"
              style={{ lineHeight: 1.55 }}
            >
              Tell us a little about your business and what you&apos;d like to
              improve. We use it to prepare, so the first call is a
              conversation rather than an interview.
            </p>
            <p className="text-[14px] text-cn-muted mt-4" style={{ lineHeight: 1.5 }}>
              30-minute introductory consultation · about two minutes to request
            </p>

            <NetworkDiagram still className="w-full h-auto max-h-[320px] mt-8 -ml-2" />
          </div>
        </FadeIn>

        <div
          className="hidden md:block w-px bg-cn-border justify-self-center"
          style={{ gridColumn: "7 / 8" }}
          aria-hidden="true"
        />

        {/* RIGHT: the form. On a phone it is the whole page. */}
        <div style={{ gridColumn: "8 / 13" }}>
          <div className="md:hidden mb-8">
            <h1
              className="text-[28px] font-bold tracking-tight"
              style={{ lineHeight: 1.1, letterSpacing: "-0.02em" }}
            >
              <span className="text-cn-muted">Let&apos;s see how we can</span>{" "}
              <span className="bg-gradient-to-r from-[#0077B6] via-[#00A859] to-[#FF5733] bg-clip-text text-transparent">
                work for your business
              </span>
            </h1>
            <p className="text-[15px] text-cn-muted mt-4" style={{ lineHeight: 1.55 }}>
              30-minute introductory consultation · about two minutes to request
            </p>
          </div>

          <FadeIn delay={0.1} duration={0.7}>
            <ContactForm />
          </FadeIn>
        </div>
      </section>
    </main>
  );
}
