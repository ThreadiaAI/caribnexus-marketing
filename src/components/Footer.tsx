"use client";

import { ORG_LINKEDIN } from "@/lib/structuredData";
import Link from "next/link";

export function Footer() {
  // The footer sits on the same deeper paper as the nav, so the page is
  // bookended by the same tone rather than fading out into the ground.
  return (
    <div className="bg-[var(--cn-paper-deep)]">
      <div className="border-t border-cn-border w-full" />
      <footer className="mx-auto max-w-[var(--content-max-w)] page-grid pt-[48px] pb-[48px] md:[display:grid]">
        {/* Mobile: one column, left aligned, airy.

            Columns are the wrong idea on a phone. Three across gave each
            about 110px and every label wrapped; two across still forces the
            eye between two edges. A single stack gives one left edge, lets
            every link sit at a readable 15px, and spends the space a phone
            has most of — vertical. Group labels stay small and grey so the
            links are the only thing with weight. */}
        <div className="md:hidden px-4">
          <img src="/icon.png" alt="CaribNexus AI" style={{ height: "26px", width: "26px", marginBottom: "40px" }} />

          <div className="space-y-10">
            <div>
              <h4 className="text-[12px] text-cn-muted" style={{ marginBottom: "18px" }}>Products</h4>
              <ul className="space-y-[18px]">
                <li><a href="/services/caribbooks" className="text-[15px] text-cn-dark hover:text-[#FF5733] transition-colors">CaribBooks</a></li>
                <li><a href="/services/automations" className="text-[15px] text-cn-dark hover:text-[#FF5733] transition-colors">Automations</a></li>
                <li><a href="https://books.caribnexusai.com/login" className="text-[15px] text-cn-dark hover:text-[#FF5733] transition-colors">Sign in</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-[12px] text-cn-muted" style={{ marginBottom: "18px" }}>Services</h4>
              <ul className="space-y-[18px]">
                <li><a href="/services" className="text-[15px] text-cn-dark hover:text-[#FF5733] transition-colors">Overview</a></li>
                <li><a href="/services/caribbooks" className="text-[15px] text-cn-dark hover:text-[#FF5733] transition-colors">AI Bookkeeping</a></li>
                <li><a href="/services/automations" className="text-[15px] text-cn-dark hover:text-[#FF5733] transition-colors">AI Automations</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-[12px] text-cn-muted" style={{ marginBottom: "18px" }}>Company</h4>
              <ul className="space-y-[18px]">
                <li><a href="/about" className="text-[15px] text-cn-dark hover:text-[#FF5733] transition-colors">About</a></li>
                <li><a href="/privacy" className="text-[15px] text-cn-dark hover:text-[#FF5733] transition-colors">Privacy</a></li>
                <li><a href="/terms" className="text-[15px] text-cn-dark hover:text-[#FF5733] transition-colors">Terms</a></li>
                <li><a href="/data-protection" className="text-[15px] text-cn-dark hover:text-[#FF5733] transition-colors">Data protection</a></li>
                <li><Link href="/contact" className="text-[15px] text-cn-dark hover:text-[#FF5733] transition-colors">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-[12px] text-cn-muted" style={{ marginBottom: "18px" }}>Connect</h4>
              <ul className="space-y-[18px]">
                <li><a href={ORG_LINKEDIN} target="_blank" rel="me noopener noreferrer" className="text-[15px] text-cn-dark hover:text-[#FF5733] transition-colors">LinkedIn</a></li>
                <li><a href="tel:+18767706900" className="text-[15px] text-cn-dark hover:text-[#FF5733] transition-colors">1 876 770-6900</a></li>
                <li><a href="mailto:admin@caribnexusai.com" className="text-[15px] text-cn-dark hover:text-[#FF5733] transition-colors">Email</a></li>
              </ul>
            </div>
          </div>

          {/* The registered name and address sit in the footer because Meta's
              business verification cross-checks the website against what the
              business portfolio claims. Keep both identical to that record. */}
          <div style={{ marginTop: "48px" }}>
            <address className="not-italic text-[13px] text-cn-muted leading-relaxed">
              CaribNexus AI<br />
              Montego Bay #1 P.O., St. James, Jamaica
            </address>
            <p className="text-[13px] text-cn-muted" style={{ marginTop: "10px" }}>&copy; 2026 CaribNexus AI. All rights reserved.</p>
          </div>
        </div>

        {/* Desktop: grid layout */}
        <div className="hidden md:contents">
        <div className="hidden md:block" style={{ gridColumn: "2 / 3" }}>
          <img src="/icon.png" alt="CaribNexus AI" style={{ height: "28px", width: "28px" }} />
        </div>

        <div style={{ gridColumn: "4 / 6" }}>
          <h4 className="text-[14px] font-bold text-cn-dark" style={{ marginBottom: "16px" }}>Products</h4>
          <ul className="space-y-2">
            <li><a href="/services/caribbooks" className="text-[14px] text-cn-muted hover:text-[#FF5733] transition-colors">CaribBooks</a></li>
            <li><a href="/services/automations" className="text-[14px] text-cn-muted hover:text-[#FF5733] transition-colors">Automations</a></li>
            <li><a href="https://books.caribnexusai.com/login" className="text-[14px] text-cn-muted hover:text-[#FF5733] transition-colors">Sign in</a></li>
          </ul>
        </div>

        <div style={{ gridColumn: "6 / 8" }}>
          <h4 className="text-[14px] font-bold text-cn-dark" style={{ marginBottom: "16px" }}>Services</h4>
          <ul className="space-y-2">
            <li><a href="/services" className="text-[14px] text-cn-muted hover:text-[#FF5733] transition-colors">Overview</a></li>
            <li><a href="/services/caribbooks" className="text-[14px] text-cn-muted hover:text-[#FF5733] transition-colors">AI Bookkeeping</a></li>
            <li><a href="/services/automations" className="text-[14px] text-cn-muted hover:text-[#FF5733] transition-colors">AI Automations</a></li>
          </ul>
        </div>

        <div style={{ gridColumn: "8 / 10" }}>
          <h4 className="text-[14px] font-bold text-cn-dark" style={{ marginBottom: "16px" }}>Company</h4>
          <ul className="space-y-2">
            <li><a href="/about" className="text-[14px] text-cn-muted hover:text-[#FF5733] transition-colors">About</a></li>
            <li><a href="/privacy" className="text-[14px] text-cn-muted hover:text-[#FF5733] transition-colors">Privacy</a></li>
            <li><a href="/terms" className="text-[14px] text-cn-muted hover:text-[#FF5733] transition-colors">Terms</a></li>
            <li><a href="/data-protection" className="text-[14px] text-cn-muted hover:text-[#FF5733] transition-colors">Data protection</a></li>
            <li><Link href="/contact" className="text-[14px] text-cn-muted hover:text-[#FF5733] transition-colors">Contact</Link></li>
            <li><a href="mailto:admin@caribnexusai.com" className="text-[14px] text-cn-muted hover:text-[#FF5733] transition-colors">Email</a></li>
          </ul>
        </div>

        {/* The number lives here on desktop, not in Company as well. Mobile has
            no Connect column, so it carries the number under Company instead. */}
        <div style={{ gridColumn: "10 / 12" }}>
          <h4 className="text-[14px] font-bold text-cn-dark" style={{ marginBottom: "16px" }}>Connect</h4>
          <ul className="space-y-2">
            <li><a href={ORG_LINKEDIN} target="_blank" rel="me noopener noreferrer" className="text-[14px] text-cn-muted hover:text-[#FF5733] transition-colors">LinkedIn</a></li>
            <li><a href="tel:+18767706900" className="text-[14px] text-cn-muted hover:text-[#FF5733] transition-colors">1 876 770-6900</a></li>
            <li><a href="mailto:admin@caribnexusai.com" className="text-[14px] text-cn-muted hover:text-[#FF5733] transition-colors">Email</a></li>
          </ul>
        </div>

        <div style={{ gridColumn: "4 / 12", marginTop: "48px" }}>
          <address className="not-italic text-[14px] text-cn-muted" style={{ marginBottom: "6px" }}>
            CaribNexus AI &middot; Montego Bay #1 P.O., St. James, Jamaica
          </address>
          <p className="text-[14px] text-cn-muted">
            &copy; 2026 CaribNexus AI. All rights reserved.
          </p>
        </div>
        </div>
      </footer>
    </div>
  );
}
