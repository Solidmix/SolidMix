import type { Metadata } from "next";
import { getPageContent, resolvePageH1 } from "@/lib/content";
import { PageHero } from "@/components/PageHero";
import { JsonLd } from "@/components/JsonLd";
import { pageMetadata, breadcrumbLd } from "@/lib/seo";
import { site } from "@/content/site";
import { ContactForm } from "@/components/forms/ContactForm";
import { InlineText } from "@/components/InlineText";
import { PhoneIcon, ClockIcon, MailIcon, MapPinIcon, MapIcon } from "@/components/icons";

const content = getPageContent("ready-mix-concrete-contact-in-raipur");
const h1 = resolvePageH1(content);
const [plantMapSrc, officeMapSrc] = content.blocks
  .filter((b) => b.type === "embed")
  .map((b) => (b as { src: string }).src);
const introHeading = content.blocks.find(
  (b) => b.type === "heading" && b.text === "Ready Mix Concrete Contact in Raipur",
) as { text: string } | undefined;
const introPara = content.blocks.find(
  (b) => b.type === "p" && b.text.startsWith("Looking for reliable"),
) as { text: string } | undefined;

const PLANT_MAP_LINK = "https://maps.app.goo.gl/fKV4jRPBj6jGieLb6";
const OFFICE_MAP_LINK = "https://maps.app.goo.gl/yo8k21fiZhfwBQpt7";

export const metadata: Metadata = pageMetadata(content, "/ready-mix-concrete-contact-in-raipur/");

export default function ContactPage() {
  return (
    <>
      <JsonLd data={[breadcrumbLd([{ name: "Home", url: "/" }, { name: "Contact Us" }])]} />
      <PageHero title={h1} crumbs={[{ label: "Home", href: "/" }, { label: "Contact Us" }]} />

      <section className="py-10 md:py-14">
        <div className="container-content grid gap-6 lg:grid-cols-2">
          <div className="overflow-hidden rounded-lg border border-grey-line">
            <iframe
              title="SolidMix RMC plant location"
              src={plantMapSrc}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-96 w-full"
            />
          </div>
          <div className="overflow-hidden rounded-lg border border-grey-line">
            <iframe
              title="SolidMix RMC office location"
              src={officeMapSrc}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-96 w-full"
            />
          </div>
        </div>
      </section>

      <section className="pb-10 md:pb-14">
        <div className="container-content grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-xl border border-secondary p-8 text-center shadow-sm">
            <PhoneIcon className="mx-auto h-9 w-9 text-secondary" />
            <h3 className="mt-4 text-[28px] font-semibold text-primary">Phone Number</h3>
            <p className="mt-3 space-x-1">
              <a href={site.phoneHref} className="text-ink hover:text-primary">
                {site.phoneDisplay}
              </a>
              <span className="text-grey-2">·</span>
              <a href="tel:+919111109642" className="text-ink hover:text-primary">
                +91 9111109642
              </a>
            </p>
          </div>
          <div className="rounded-xl border border-secondary p-8 text-center shadow-sm">
            <ClockIcon className="mx-auto h-9 w-9 text-secondary" />
            <h3 className="mt-4 text-[28px] font-semibold text-primary">Working Hour</h3>
            <p className="mt-3 text-ink">We Are Open 24*7</p>
          </div>
          <div className="rounded-xl border border-secondary p-8 text-center shadow-sm">
            <MailIcon className="mx-auto h-9 w-9 text-secondary" />
            <h3 className="mt-4 text-[28px] font-semibold text-primary">Office Email</h3>
            <p className="mt-3 space-x-1">
              {site.emails.map((email, i) => (
                <span key={email.href}>
                  {i > 0 && <span className="text-grey-2">· </span>}
                  <a href={email.href} className="text-ink hover:text-primary">
                    {email.display}
                  </a>
                </span>
              ))}
            </p>
          </div>
          <div className="rounded-xl border border-secondary p-8 text-center shadow-sm">
            <MapPinIcon className="mx-auto h-9 w-9 text-secondary" />
            <h3 className="mt-4 text-[28px] font-semibold text-primary">
              <a href={PLANT_MAP_LINK} target="_blank" rel="noopener noreferrer" className="hover:underline">
                Plant Address
              </a>
            </h3>
            <p className="mt-3 text-ink">{site.plantAddress.lines.join(", ")}</p>
          </div>
          <div className="rounded-xl border border-secondary p-8 text-center shadow-sm">
            <MapIcon className="mx-auto h-9 w-9 text-secondary" />
            <h3 className="mt-4 text-[28px] font-semibold text-primary">
              <a href={OFFICE_MAP_LINK} target="_blank" rel="noopener noreferrer" className="hover:underline">
                Office Address
              </a>
            </h3>
            <p className="mt-3 text-ink">{site.officeAddress.lines.join(", ")}</p>
          </div>
        </div>
      </section>

      {/* Plain light-grey section on the original — no photo background at
          all here (confirmed against the screenshot), unlike Home's
          contact-details block. */}
      <section className="bg-[#f5f5f5] py-12 md:py-16">
        <div className="container-content grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="text-[28px] font-semibold text-primary md:text-[40px]">
              {introHeading ? <InlineText text={introHeading.text} /> : "Ready Mix Concrete Contact in Raipur"}
            </h2>
            {introPara && (
              <p className="mt-4 leading-relaxed text-[#292929]">
                <InlineText text={introPara.text} />
              </p>
            )}
            <div className="mt-6">
              <ContactForm />
            </div>
          </div>
          <video
            controls
            preload="metadata"
            poster="/images/ceo-vinit-poster.webp"
            className="aspect-video w-full rounded-lg bg-dark"
          >
            <source src="/videos/ceo-vinit.mp4" type="video/mp4" />
          </video>
        </div>
      </section>
    </>
  );
}
