import Image from "next/image";
import Link from "next/link";
import { site, footer, footerUsefulLinks } from "@/content/site";
import { SocialIcons } from "./SocialIcons";

export function Footer() {
  return (
    <footer>
      <div className="bg-primary text-white">
        <div className="container-content grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-1">
            <span className="inline-block rounded-md bg-white p-4">
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
            <h2 className="mb-4 text-lg font-semibold">Useful Links</h2>
            <ul className="space-y-2.5 text-sm">
              {footerUsefulLinks.map((link) => (
                <li key={link.label} className="flex items-center gap-2">
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true" className="flex-shrink-0">
                    <path d="m9 6 6 6-6 6" />
                  </svg>
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
            <h2 className="mb-4 text-lg font-semibold">Phone Number</h2>
            <a href={site.phoneHref} className="flex items-center gap-2 text-sm hover:underline">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
                <path d="M6.6 10.8a15.6 15.6 0 0 0 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.4.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1A17 17 0 0 1 3 4c0-.6.4-1 1-1h3.4c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.4 0 .8-.3 1l-2.1 2.2Z" />
              </svg>
              {site.phoneDisplay}
            </a>

            <h2 className="mb-4 mt-7 text-lg font-semibold">Email Address</h2>
            <a href={site.emails[0].href} className="flex items-center gap-2 text-sm hover:underline">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
                <path d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Zm0 4-8 5-8-5V6l8 5 8-5v2Z" />
              </svg>
              {site.emails[0].display}
            </a>
          </div>

          <div>
            <h2 className="mb-4 text-lg font-semibold">{site.officeAddress.label}</h2>
            {site.officeAddress.lines.map((line) => (
              <p key={line} className="text-sm leading-relaxed text-white/90">
                {line}
              </p>
            ))}
          </div>

          <div>
            <h2 className="mb-4 text-lg font-semibold">{site.plantAddress.label}</h2>
            {site.plantAddress.lines.map((line) => (
              <p key={line} className="text-sm leading-relaxed text-white/90">
                {line}
              </p>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-secondary text-white">
        <div className="container-content py-6 text-center text-sm">
          <p>{footer.tagline}</p>
          <p className="mt-2">
            {footer.copyright}{" "}
            <Link href="/" className="font-medium hover:underline">
              {site.legalName}.
            </Link>{" "}
            Powered by{" "}
            <a href={footer.poweredBy.href} target="_blank" rel="noopener noreferrer" className="font-medium hover:underline">
              {footer.poweredBy.label}.
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
