import type { Metadata } from "next";
import { GridlinesGate } from "@/components/dev/Gridlines";
import { VoiceWidget } from "@/components/VoiceWidget";
import "./globals.css";

export const metadata: Metadata = {
  title: "CaribNexus AI",
  description: "Building intelligent systems for Caribbean businesses. CaribBooks: AI-powered bookkeeping via WhatsApp.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <VoiceWidget />
        <GridlinesGate />
      </body>
    </html>
  );
}
