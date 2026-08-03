"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const NAV_LINKS: { label: string; href: string; action?: string }[] = [
  { label: "Services", href: "/services" },
  { label: "CaribBooks", href: "/services/caribbooks" },
  { label: "Automations", href: "/services/messaging" },
  { label: "Contact", href: "#", action: "open-widget-book" },
];

export function Nav() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [mobileMenuOpen]);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-cn-border">
        <div
          className="mx-auto max-w-[var(--content-max-w)] h-[36px] md:h-[var(--nav-h)] grid items-center"
          style={{
            gridTemplateColumns: "repeat(12, 1fr)",
            columnGap: "var(--grid-gap)",
            paddingInline: "var(--grid-padding)",
          }}
        >
          <Link href="/" className="flex items-center" style={{ gridColumn: "2 / 5" }}>
            <img
              src="/logo/caribnexus-wordmark.svg"
              alt="CaribNexus AI"
              style={{ height: "33px", width: "auto" }}
            />
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-baseline gap-4" style={{ gridColumn: "8 / 12", justifySelf: "end" }}>
            {NAV_LINKS.map((link) => (
              link.action ? (
                <button
                  key={link.label}
                  onClick={() => window.dispatchEvent(new CustomEvent("open-voice-widget", { detail: "book" }))}
                  className="text-[11px] font-medium text-cn-muted hover:text-[#FF5733] transition-colors"
                >
                  {link.label}
                </button>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-[11px] font-medium text-cn-muted hover:text-[#FF5733] transition-colors"
                >
                  {link.label}
                </Link>
              )
            ))}
            <span className="w-px h-3 bg-cn-border self-center" />
            <Link
              href="https://books.caribnexusai.com/login"
              className="text-[11px] font-medium text-cn-muted hover:text-[#FF5733] transition-colors whitespace-nowrap"
            >
              Log in
            </Link>
            <Link
              href="https://books.caribnexusai.com/signup"
              className="text-[11px] font-medium text-white px-3 py-[3px] rounded-full transition-all hover:bg-[#FF5733] whitespace-nowrap"
              style={{ background: "linear-gradient(135deg, #0077B6, #009088, #00A859, #FF5733)" }}
            >
              Sign up
            </Link>
          </div>

          {/* Mobile: Log in + Sign up + Hamburger */}
          <div className="md:hidden flex items-center justify-end gap-3" style={{ gridColumn: "7 / 12" }}>
            <Link
              href="https://books.caribnexusai.com/login"
              className="text-[9px] font-medium text-cn-muted hover:text-[#FF5733] transition-colors whitespace-nowrap"
            >
              Log in
            </Link>
            <Link
              href="https://books.caribnexusai.com/signup"
              className="text-[9px] font-medium text-white px-2 py-[2px] rounded-full whitespace-nowrap"
              style={{ background: "linear-gradient(135deg, #0077B6, #009088, #00A859, #FF5733)" }}
            >
              Sign up
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 hover:bg-gray-100 rounded-md transition relative z-50"
              aria-label="Toggle menu"
            >
              {!mobileMenuOpen ? (
                <svg className="w-5 h-5" fill="none" stroke="#1C1C1C" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="#1C1C1C" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Full-screen mobile menu overlay */}
      <div
        className={`fixed inset-0 bg-white z-40 md:hidden transition-all duration-300 ease-out ${
          mobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex flex-col items-center justify-center min-h-screen px-6 py-20">
          <nav className="flex flex-col items-center space-y-6">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-2xl font-medium text-cn-muted hover:text-[#FF5733] transition-all duration-200"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="mt-12 flex flex-col items-center space-y-4 w-full max-w-xs">
            <Link
              href="https://books.caribnexusai.com/login"
              className="w-full py-3 text-center text-lg font-medium text-cn-muted border border-cn-border rounded-full hover:bg-gray-50 transition-all duration-200"
              onClick={() => setMobileMenuOpen(false)}
            >
              Log in
            </Link>
            <Link
              href="https://books.caribnexusai.com/signup"
              className="w-full py-3 text-center text-lg font-medium text-white rounded-full transition-all duration-200 hover:opacity-90"
              style={{ background: "linear-gradient(135deg, #0077B6, #009088, #00A859, #FF5733)" }}
              onClick={() => setMobileMenuOpen(false)}
            >
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
