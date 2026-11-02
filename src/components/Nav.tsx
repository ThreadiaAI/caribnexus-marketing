"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const NAV_LINKS: { label: string; href: string }[] = [
  { label: "Services", href: "/services" },
  { label: "CaribBooks", href: "/services/caribbooks" },
  { label: "Automations", href: "/services/automations" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
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
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[var(--cn-paper-deep)]/85 backdrop-blur-xl border-b border-cn-border">
        <div
          className="mx-auto max-w-[var(--content-max-w)] py-3 md:h-[var(--nav-h)] grid items-center"
          style={{
            gridTemplateColumns: "repeat(12, 1fr)",
            columnGap: "var(--grid-gap)",
            paddingInline: "var(--grid-padding)",
          }}
        >
          <Link href="/" className="flex items-center" style={{ gridColumn: "2 / 6" }}>
            <img
              src="/logo/caribnexus-wordmark.svg"
              alt="CaribNexus AI"
              className="w-[150px] md:w-[164px] h-auto"
            />
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-baseline gap-6" style={{ gridColumn: "8 / 12", justifySelf: "end", position: "relative", top: "3px" }}>
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[16px] font-medium text-cn-muted hover:text-[#FF5733] transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Mobile: Hamburger */}
          <div className="md:hidden flex items-center justify-end gap-3" style={{ gridColumn: "7 / 12" }}>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 hover:bg-gray-100 rounded-md transition relative z-50"
              aria-label="Toggle menu"
            >
              {!mobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="#1C1C1C" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="#1C1C1C" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Full-screen mobile menu overlay */}
      <div
        className={`fixed inset-0 bg-[var(--cn-paper-deep)] z-40 md:hidden transition-all duration-300 ease-out ${
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

        </div>
      </div>
    </>
  );
}
