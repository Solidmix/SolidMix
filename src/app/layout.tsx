import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import Script from "next/script";
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
import { TrackingEvents } from "@/components/TrackingEvents";

// seo-kit/00-CLAUDE-BUILD-BRIEF.md Phase 7 + seo-kit/05-tracking.md: only
// loads if the client's GTM container ID is set (Vercel Production env var).
const GTM = process.env.NEXT_PUBLIC_GTM_ID;
if (!GTM) {
  console.info("GTM: NEXT_PUBLIC_GTM_ID not set, tracking skipped");
}

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-poppins",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://solidmixrmc.com";
// Same condition as src/app/robots.ts — launch is a human step (brief hard
// rule #2): only Production, and only once Saidul sets SITE_INDEXABLE=true.
const indexable = process.env.VERCEL_ENV === "production" && process.env.SITE_INDEXABLE === "true";

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
  robots: indexable
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
        {GTM && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${GTM}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            />
          </noscript>
        )}
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
        <TrackingEvents />
        {GTM && (
          <Script id="gtm" strategy="afterInteractive">
            {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM}');`}
          </Script>
        )}
      </body>
    </html>
  );
}
