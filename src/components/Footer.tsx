import Image from "next/image";
import Link from "next/link";
import { site, footer, footerUsefulLinks } from "@/content/site";
import { nav } from "@/data/navigation";
import { plants } from "@/data/plants";
import { SocialIcons } from "./SocialIcons";

// "Main product links" (seo-kit brief Phase 1): every Ready Mix Concrete
// product link, read straight from src/data/navigation.ts so the footer can
// never drift from the header menu or list a product that isn't live.
const productLinks =
  nav.find((item) => item.label === "Ready Mix Concrete")?.groups?.flatMap((g) => g.links) ?? [];

export function Footer() {
  return (
    <footer>
      <div className="bg-primary text-white">
        <div className="container-content grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-6">
          <div className="lg:col-span-1">
            <span className="inline-flex w-full max-w-[260px] items-center justify-center rounded-md bg-white p-8">
              <Image
                src="/images/solidmix-logo-footer.webp"
                alt="SolidMix RMC logo"
                width={200}
                height={107}
                className="h-auto w-[180px]"
              />
            </span>
            <p className="mt-5 text-sm leading-relaxed text-white/90">{footer.blurb}</p>
            <SocialIcons
              className="mt-5"
              linkClassName="flex h-9 w-9 items-center justify-center rounded-full border border-white/40 text-white transition-colors hover:bg-white hover:text-primary"
            />
          </div>

          <div>
            <h2 className="mb-4 text-[20px] font-semibold">Useful Links</h2>
            <ul className="space-y-2.5 text-[16px] font-medium">
              {footerUsefulLinks.map((link) => (
                <li key={link.label} className="flex items-center gap-2.5">
                  <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-secondary">
                    <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="white" strokeWidth="3" aria-hidden="true">
                      <path d="m9 6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  {link.href.startsWith("/brochure/") ? (
                    <a href={link.href} target="_blank" rel="noopener noreferrer" className="hover:underline">
                      {link.label}
                    </a>
                  ) : (
                    <Link href={link.href} className="hover:underline">
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="mb-4 text-[20px] font-semibold">Phone Number</h2>
            <a href={site.phoneHref} className="flex items-center gap-2 text-sm hover:underline">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
                <path d="M6.6 10.8a15.6 15.6 0 0 0 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.4.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1A17 17 0 0 1 3 4c0-.6.4-1 1-1h3.4c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.4 0 .8-.3 1l-2.1 2.2Z" />
              </svg>
              {site.phoneDisplay}
            </a>

            <h2 className="mb-4 mt-7 text-[20px] font-semibold">WhatsApp</h2>
            <a href={site.whatsappHref} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm hover:underline">
              <svg viewBox="0 0 32 32" width="16" height="16" fill="currentColor" aria-hidden="true">
                <path d="M16 3C9 3 3.3 8.7 3.3 15.7c0 2.4.7 4.7 1.9 6.7L3 29l6.8-2.1c1.9 1 4.1 1.6 6.2 1.6 7 0 12.7-5.7 12.7-12.7S23 3 16 3Zm0 23.1c-1.9 0-3.8-.5-5.4-1.5l-.4-.2-4 1.2 1.2-3.9-.3-.4a10.4 10.4 0 0 1-1.6-5.6c0-5.8 4.7-10.5 10.5-10.5s10.5 4.7 10.5 10.5-4.7 10.4-10.5 10.4Zm5.8-7.8c-.3-.2-1.9-.9-2.2-1s-.5-.2-.7.2-.8 1-1 1.2-.4.2-.7.1a8.6 8.6 0 0 1-2.5-1.6 9.5 9.5 0 0 1-1.8-2.2c-.2-.3 0-.5.1-.6l.5-.6c.2-.2.2-.3.3-.5s0-.4 0-.6-.7-1.7-1-2.3c-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.2.2 2.2 3.4 5.3 4.7.7.3 1.3.5 1.8.6.7.2 1.4.2 1.9.1.6-.1 1.9-.8 2.1-1.5.3-.8.3-1.4.2-1.5-.1-.2-.3-.3-.6-.4Z" />
              </svg>
              {site.phoneDisplay}
            </a>

            <h2 className="mb-4 mt-7 text-[20px] font-semibold">Email Address</h2>
            <a href={site.emails[0].href} className="flex items-center gap-2 text-sm hover:underline">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
                <path d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Zm0 4-8 5-8-5V6l8 5 8-5v2Z" />
              </svg>
              {site.emails[0].display}
            </a>
          </div>

          <div>
            <h2 className="mb-4 text-[20px] font-semibold">Our Products</h2>
            <ul className="space-y-2.5 text-[16px] font-medium">
              {productLinks.map((link) => (
                <li key={link.href} className="flex items-center gap-2.5">
                  <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-secondary">
                    <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="white" strokeWidth="3" aria-hidden="true">
                      <path d="m9 6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <Link href={link.href} className="hover:underline">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="mb-4 text-[20px] font-semibold">{site.officeAddress.label}</h2>
            {site.officeAddress.lines.map((line) => (
              <p key={line} className="text-sm leading-relaxed text-white/90">
                {line}
              </p>
            ))}
          </div>

          <div>
            <h2 className="mb-4 text-[20px] font-semibold">Plant Address</h2>
            {plants.map((plant, i) => (
              <p
                key={plant.id}
                className={`text-sm leading-relaxed text-white/90 ${i === 0 ? "" : "mt-3"}`}
              >
                <strong className="font-bold">Plant {i + 1}</strong> – {plant.address}
              </p>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-secondary text-white">
        <div className="container-content py-6 text-center text-sm">
          <p>{footer.tagline}</p>
          <p className="mt-2">
            {footer.copyright} {new Date().getFullYear()}, All rights reserved{" "}
            <Link href="/" className="font-bold hover:underline">
              {site.legalName}.
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
