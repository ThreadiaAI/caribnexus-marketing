import type { Metadata } from "next";
import { GridlinesGate } from "@/components/dev/Gridlines";
import { VoiceWidget } from "@/components/VoiceWidget";
import "./globals.css";

export const metadata: Metadata = {
  title: "CaribNexus AI",
  description: "Building intelligent systems for Caribbean businesses. CaribBooks: AI-powered bookkeeping via WhatsApp.",
  metadataBase: new URL("https://caribnexusai.com"),
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
  },
  openGraph: {
    title: "CaribNexus AI",
    description: "Building intelligent systems for Caribbean businesses.",
    url: "https://caribnexusai.com",
    siteName: "CaribNexus AI",
    images: [{ url: "/logo/caribnexus-main.png", width: 1500, height: 1500 }],
    type: "website",
  },
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
