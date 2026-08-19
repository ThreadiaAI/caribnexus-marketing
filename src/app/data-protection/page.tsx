import type { Metadata } from "next";
import { DataProtectionContent } from "./DataProtectionContent";
import { ORG_NAME, ORG_URL } from "@/lib/site";

/**
 * /data-protection — not a legal page.
 *
 * /privacy is the disclosure document: what we hold, why, and what your rights
 * are. This page is the argument, and it exists because the question a partner
 * actually asks is not "what is your policy" but "why should I trust you with
 * my clients' books".
 *
 * So it gets the marketing design language rather than the legal one: FIG-
 * labelled cards, the dark panel, gradient emphasis. And it leads with the one
 * claim no competitor can copy, which is that the agent has no parameter
 * through which to name another tenant.
 *
 * EVERY NUMBER AND MECHANISM HERE WAS MEASURED against the running system and
 * recorded in caribbooks/docs/data_protection_audit.md. Nothing on this page
 * describes an intention.
 */

export const metadata: Metadata = {
  title: "Data Protection",
  description: `How ${ORG_NAME} isolates, encrypts and retains the data CaribBooks holds for Caribbean businesses and the accounting practices that serve them, and how that maps to the Jamaica Data Protection Act.`,
  alternates: { canonical: `${ORG_URL}/data-protection` },
  openGraph: {
    title: `Data Protection | ${ORG_NAME}`,
    description: `Tenant isolation, encryption, residency and retention — measured against the running system, not asserted.`,
    url: `${ORG_URL}/data-protection`,
  },
};

export default function DataProtectionPage() {
  return <DataProtectionContent />;
}
