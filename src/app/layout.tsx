import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { site } from "@/content/site";
import { SmoothScroll } from "@/components/SmoothScroll";
import { TopBar } from "@/components/TopBar";
import Header from "@/components/header/Header";
import MobileActionBar from "@/components/header/MobileActionBar";
import NavSchema from "@/components/header/NavSchema";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { CallButton } from "@/components/CallButton";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-poppins",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://solidmixrmc.com";
const indexingOn = process.env.INDEXING === "on";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "RMC Plant in Raipur | Ready Mix Concrete Supplier — SolidMix",
    template: "%s | SolidMix RMC",
  },
  // Sitewide fallback description — every page sets its own, so this rarely
  // renders, but kept clean of "24/7"/"M20 to M40" per hard rule #1. Same
  // text as Home's (seo-kit/01-seo-meta.csv, Phase 2).
  description:
    "SolidMix RMC supplies ready mix concrete in Raipur for residential, commercial and infrastructure projects. Call or contact us.",
  robots: indexingOn
    ? { index: true, follow: true }
    : { index: false, follow: false },
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={poppins.variable}>
      <body className="pb-16 lg:pb-0">
        <SmoothScroll />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:text-[#cc3366]"
        >
          Skip to content
        </a>
        <TopBar />
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <WhatsAppButton />
        <CallButton />
        <MobileActionBar />
        <NavSchema />
      </body>
    </html>
  );
}
