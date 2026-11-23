import type { Metadata } from "next";
import { getPageContent } from "@/lib/content";
import { PageHero } from "@/components/PageHero";
import { JsonLd } from "@/components/JsonLd";
import { absUrl, SITE_URL } from "@/lib/seo";
import { site } from "@/content/site";
import { InlineText } from "@/components/InlineText";
import { PhoneIcon, MailIcon, MapIcon } from "@/components/icons";
import { BgSection } from "@/components/sections/BgSection";
import { FaqAccordion } from "@/components/FaqAccordion";
import BookUsForm from "@/components/book-us/BookUsForm";
import PlantCards from "@/components/book-us/PlantCards";
import { plants, mainPhone, mainPhoneHref, whatsappHref } from "@/data/plants";

const PATH = "/ready-mix-concrete-contact-in-raipur/";
const H1 = "Contact SolidMix RMC in Raipur";

// Content JSON is kept only for the office map iframe src and the intro
// heading/paragraph next to the CEO video (merge rule: those stay exactly
// as they are now). Title/description/H1 come from seo-kit/01-seo-meta.csv
// instead of this JSON, which fixes the pre-existing duplicated-brand title.
const content = getPageContent("ready-mix-concrete-contact-in-raipur");
const [, officeMapSrc] = content.blocks
  .filter((b) => b.type === "embed")
  .map((b) => (b as { src: string }).src);
const introHeading = content.blocks.find(
  (b) => b.type === "heading" && b.text === "Ready Mix Concrete Contact in Raipur",
) as { text: string } | undefined;
const introPara = content.blocks.find(
  (b) => b.type === "p" && b.text.startsWith("Looking for reliable"),
) as { text: string } | undefined;

const OFFICE_MAP_LINK = "https://maps.app.goo.gl/yo8k21fiZhfwBQpt7";

// Title/description: 01-seo-meta.csv contact row (base title only; the root
// layout's "%s | SolidMix RMC" template adds the single brand suffix).
export const metadata: Metadata = {
  title: "Contact SolidMix RMC Raipur",
  description:
    "Contact SolidMix RMC in Raipur for ready mix concrete enquiries. Call, WhatsApp or send a message.",
  alternates: { canonical: absUrl(PATH) },
  openGraph: {
    title: "Contact SolidMix RMC Raipur",
    description:
      "Contact SolidMix RMC in Raipur for ready mix concrete enquiries. Call, WhatsApp or send a message.",
    url: absUrl(PATH),
    type: "website",
  },
};

// FAQ: visible text and FAQPage JSON-LD are the same array, so they can
// never differ (seo-kit/contact-form page.tsx's 2 Book Us FAQs, unchanged).
const faqs = [
  {
    q: "How do I book ready mix concrete from SolidMix?",
    a: "Fill in the booking form on this page, or call or WhatsApp us. Our team will confirm the grade, mix and availability for your site.",
  },
  {
    q: "Which plant serves my site?",
    a: "Choose the nearest plant in the form and pick your delivery area. Our team will confirm availability for your site.",
  },
];

export default function BookUsPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ContactPage",
        "@id": `${SITE_URL}${PATH}#page`,
        url: `${SITE_URL}${PATH}`,
        name: "Contact SolidMix RMC",
        isPartOf: { "@id": `${SITE_URL}/#website` },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
          { "@type": "ListItem", position: 2, name: "Contact Us", item: `${SITE_URL}${PATH}` },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
      // One LocalBusiness per plant, confirmed data only.
      ...plants.map((p) => ({
        "@type": "LocalBusiness",
        "@id": `${SITE_URL}${PATH}#${p.id}`,
        name: p.name,
        telephone: p.phone,
        address: { "@type": "PostalAddress", streetAddress: p.address, addressCountry: "IN" },
        parentOrganization: { "@id": `${SITE_URL}/#organization` },
        areaServed: p.areaGroups.flatMap((g) => g.areas).map((a) => ({ "@type": "Place", name: a })),
      })),
    ],
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <PageHero title={H1} crumbs={[{ label: "Home", href: "/" }, { label: "Contact Us" }]} />

      <section className="py-10 md:py-14">
        <div className="container-content max-w-3xl">
          <p className="text-[#292929]">
            Call, WhatsApp or send the form below. Tell us your site, grade and pump need, and our team will
            get back to you.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <a
              href={mainPhoneHref}
              className="min-h-[44px] rounded-md bg-primary px-6 py-3 font-semibold text-white hover:bg-primary/90"
            >
              Call {mainPhone}
            </a>
            <a
              href={whatsappHref}
              className="min-h-[44px] rounded-md border border-primary px-6 py-3 font-semibold text-primary hover:bg-tint-pink"
            >
              WhatsApp us
            </a>
          </div>
        </div>
      </section>

      <section className="pb-10 md:pb-14">
        <div className="container-content max-w-3xl">
          <h2 className="text-[28px] font-semibold text-primary md:text-[40px]">Booking form</h2>
          <div className="mt-6">
            <BookUsForm />
          </div>
        </div>
      </section>

      <section className="pb-10 md:pb-14">
        <div className="container-content">
          <h2 className="text-[28px] font-semibold text-primary md:text-[40px]">Our plants and the areas we serve</h2>
          <div className="mt-6">
            <PlantCards />
          </div>
        </div>
      </section>

      <section className="pb-10 md:pb-14">
        <div className="container-content max-w-3xl">
          <h2 className="text-[28px] font-semibold text-primary md:text-[40px]">Questions</h2>
          <div className="mt-6">
            <FaqAccordion items={faqs} />
          </div>
        </div>
      </section>

      <section className="pb-10 md:pb-14">
        <div className="container-content grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-xl border border-secondary p-8 text-center shadow-sm">
            <PhoneIcon className="mx-auto h-9 w-9 text-primary" />
            <h3 className="mt-4 text-[28px] font-semibold text-primary">Phone Number</h3>
            <p className="mt-3 space-x-1 text-[20px]">
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
            <MailIcon className="mx-auto h-9 w-9 text-primary" />
            <h3 className="mt-4 text-[28px] font-semibold text-primary">Office Email</h3>
            <p className="mt-3 text-[20px]">
              <a href={site.emails[0].href} className="text-ink hover:text-primary">
                {site.emails[0].display}
              </a>
            </p>
          </div>
          <div className="rounded-xl border border-secondary p-8 text-center shadow-sm">
            <MapIcon className="mx-auto h-9 w-9 text-primary" />
            <h3 className="mt-4 text-[28px] font-semibold text-primary">
              <a href={OFFICE_MAP_LINK} target="_blank" rel="noopener noreferrer" className="hover:underline">
                Office Address
              </a>
            </h3>
            <p className="mt-3 text-ink">{site.officeAddress.lines.join(", ")}</p>
          </div>
        </div>
      </section>

      <section className="pb-10 md:pb-14">
        <div className="container-content">
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

      {/* Plain light-grey section on the original — no photo background at
          all here (confirmed against the screenshot), unlike Home's
          contact-details block. ContactForm removed (replaced by the
          booking form above); intro heading/paragraph and the CEO video
          stay exactly as they were (merge rule). */}
      <BgSection image="/images/bg/contact-details.webp" overlayOpacity={0} className="py-12 md:py-16">
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
      </BgSection>
    </>
  );
}
