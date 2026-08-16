"use client";

import { ORG_LINKEDIN } from "@/lib/structuredData";

export function Footer() {
  return (
    <>
      <div className="border-t border-cn-border w-full" />
      <footer className="mx-auto max-w-[var(--content-max-w)] page-grid pt-[32px] pb-[32px] md:[display:grid]">
        {/* Mobile: grid centered */}
        <div className="md:hidden px-4 flex flex-col items-center">
          <div className="flex justify-center gap-8">
            <div>
              <h4 className="text-[10px] font-bold text-cn-dark" style={{ marginBottom: "10px" }}>Products</h4>
              <ul className="space-y-1.5">
                <li><a href="/services/caribbooks" className="text-[9px] text-cn-muted hover:text-[#FF5733] transition-colors">CaribBooks</a></li>
                <li><a href="/services/automations" className="text-[9px] text-cn-muted hover:text-[#FF5733] transition-colors">Automations</a></li>
                <li><a href="https://books.caribnexusai.com/login" className="text-[9px] text-cn-muted hover:text-[#FF5733] transition-colors">Sign in</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-[10px] font-bold text-cn-dark" style={{ marginBottom: "10px" }}>Services</h4>
              <ul className="space-y-1.5">
                <li><a href="/services" className="text-[9px] text-cn-muted hover:text-[#FF5733] transition-colors">Overview</a></li>
                <li><a href="/services/caribbooks" className="text-[9px] text-cn-muted hover:text-[#FF5733] transition-colors">AI Bookkeeping</a></li>
                <li><a href="/services/automations" className="text-[9px] text-cn-muted hover:text-[#FF5733] transition-colors">AI Automations</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-[10px] font-bold text-cn-dark" style={{ marginBottom: "10px" }}>Company</h4>
              <ul className="space-y-1.5">
                <li><a href="/about" className="text-[9px] text-cn-muted hover:text-[#FF5733] transition-colors">About</a></li>
                <li><button onClick={() => window.dispatchEvent(new CustomEvent("open-voice-widget", { detail: "book" }))} className="text-[9px] text-cn-muted hover:text-[#FF5733] transition-colors">Contact</button></li>
                <li><a href={ORG_LINKEDIN} target="_blank" rel="me noopener noreferrer" className="text-[9px] text-cn-muted hover:text-[#FF5733] transition-colors">LinkedIn</a></li>
                <li><a href="tel:+18767706900" className="text-[9px] text-cn-muted hover:text-[#FF5733] transition-colors">1 876 770-6900</a></li>
                <li><a href="mailto:hello@caribnexusai.com" className="text-[9px] text-cn-muted hover:text-[#FF5733] transition-colors">Email</a></li>
              </ul>
            </div>
          </div>
          <p className="text-[9px] text-cn-muted mt-6 text-center">&copy; 2026 CaribNexus AI. All rights reserved.</p>
        </div>

        {/* Desktop: grid layout */}
        <div className="hidden md:contents">
        <div className="hidden md:block" style={{ gridColumn: "2 / 3" }}>
          <img src="/icon.png" alt="CaribNexus AI" style={{ height: "28px", width: "28px" }} />
        </div>

        <div style={{ gridColumn: "4 / 6" }}>
          <h4 className="text-[11px] font-bold text-cn-dark" style={{ marginBottom: "16px" }}>Products</h4>
          <ul className="space-y-2">
            <li><a href="/services/caribbooks" className="text-[11px] text-cn-muted hover:text-[#FF5733] transition-colors">CaribBooks</a></li>
            <li><a href="/services/automations" className="text-[11px] text-cn-muted hover:text-[#FF5733] transition-colors">Automations</a></li>
            <li><a href="https://books.caribnexusai.com/login" className="text-[11px] text-cn-muted hover:text-[#FF5733] transition-colors">Sign in</a></li>
          </ul>
        </div>

        <div style={{ gridColumn: "6 / 8" }}>
          <h4 className="text-[11px] font-bold text-cn-dark" style={{ marginBottom: "16px" }}>Services</h4>
          <ul className="space-y-2">
            <li><a href="/services" className="text-[11px] text-cn-muted hover:text-[#FF5733] transition-colors">Overview</a></li>
            <li><a href="/services/caribbooks" className="text-[11px] text-cn-muted hover:text-[#FF5733] transition-colors">AI Bookkeeping</a></li>
            <li><a href="/services/automations" className="text-[11px] text-cn-muted hover:text-[#FF5733] transition-colors">AI Automations</a></li>
          </ul>
        </div>

        <div style={{ gridColumn: "8 / 10" }}>
          <h4 className="text-[11px] font-bold text-cn-dark" style={{ marginBottom: "16px" }}>Company</h4>
          <ul className="space-y-2">
            <li><a href="/about" className="text-[11px] text-cn-muted hover:text-[#FF5733] transition-colors">About</a></li>
            <li><button onClick={() => window.dispatchEvent(new CustomEvent("open-voice-widget", { detail: "book" }))} className="text-[11px] text-cn-muted hover:text-[#FF5733] transition-colors">Contact</button></li>
            <li><a href="mailto:hello@caribnexusai.com" className="text-[11px] text-cn-muted hover:text-[#FF5733] transition-colors">Email</a></li>
          </ul>
        </div>

        {/* The number lives here on desktop, not in Company as well. Mobile has
            no Connect column, so it carries the number under Company instead. */}
        <div style={{ gridColumn: "10 / 12" }}>
          <h4 className="text-[11px] font-bold text-cn-dark" style={{ marginBottom: "16px" }}>Connect</h4>
          <ul className="space-y-2">
            <li><a href={ORG_LINKEDIN} target="_blank" rel="me noopener noreferrer" className="text-[11px] text-cn-muted hover:text-[#FF5733] transition-colors">LinkedIn</a></li>
            <li><a href="tel:+18767706900" className="text-[11px] text-cn-muted hover:text-[#FF5733] transition-colors">1 876 770-6900</a></li>
            <li><a href="mailto:hello@caribnexusai.com" className="text-[11px] text-cn-muted hover:text-[#FF5733] transition-colors">Email</a></li>
          </ul>
        </div>

        <div style={{ gridColumn: "4 / 12", marginTop: "48px" }}>
          <p className="text-[10px] text-cn-muted">
            &copy; 2026 CaribNexus AI. All rights reserved.
          </p>
        </div>
        </div>
      </footer>
    </>
  );
}
