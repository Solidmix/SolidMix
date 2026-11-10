import Image from "next/image";
import type { Metadata } from "next";
import {
  hero,
  qualityWorks,
  servicesCarousel,
  whyChoose,
  workingHours,
  buildTogether,
  faq,
  coreSkills,
  contactBlock,
} from "@/content/home";
import { BgSection } from "@/components/sections/BgSection";
import { HeroSlider } from "@/components/home/HeroSlider";
import { AboutTabs } from "@/components/home/AboutTabs";
import { ServicesCarousel } from "@/components/home/ServicesCarousel";
import { HomeContactForm } from "@/components/home/HomeContactForm";
import { FaqAccordion } from "@/components/FaqAccordion";
import { InlineText } from "@/components/InlineText";
import { JsonLd } from "@/components/JsonLd";
import { SITE_URL, organizationLd, localBusinessLd, faqPageLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "RMC Plant in Raipur | Ready Mix Concrete Supplier — SolidMix",
  description:
    "RMC Plant in Raipur – SolidMix RMC delivers premium M20 to M40 ready mix concrete with 24/7 supply across Raipur, Naya Raipur & Chhattisgarh. Trusted for quality, strength, and on-time delivery. Call +91 9893111201",
  alternates: { canonical: SITE_URL + "/" },
  openGraph: {
    title: "RMC Plant in Raipur | Ready Mix Concrete Supplier — SolidMix",
    description:
      "RMC Plant in Raipur – SolidMix RMC delivers premium M20 to M40 ready mix concrete with 24/7 supply across Raipur, Naya Raipur & Chhattisgarh.",
    url: SITE_URL + "/",
    type: "website",
  },
};

export default function HomePage() {
  return (
    <>
      <JsonLd data={[organizationLd(), localBusinessLd(), faqPageLd(faq.items)]} />

      {/* Hero slider — 3 original promotional slides */}
      <HeroSlider />

      {/* Hero heading */}
      <section className="bg-gradient-to-b from-tint-cyan-2 to-white">
        <div className="container-content py-10 text-center md:py-14">
          <h1 className="text-[25px] font-semibold leading-tight text-primary lg:text-[2.5rem]">
            {hero.h1}
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg text-ink">{hero.subtitle}</p>
        </div>
      </section>

      {/* About / Mission / Vision tabs */}
      <section className="py-14">
        <div className="container-content">
          <AboutTabs />
        </div>
      </section>

      {/* Quality Works */}
      <BgSection image="/images/bg/quality-works.webp" overlayOpacity={0.8} className="py-16">
        <div className="container-content text-center">
          <p className="font-semibold text-primary">{qualityWorks.eyebrow}</p>
          <h2 className="mt-2 text-[28px] font-semibold text-primary md:text-4xl">
            {qualityWorks.heading}
          </h2>
          <p className="mx-auto mt-5 max-w-3xl leading-relaxed text-white/90">{qualityWorks.body}</p>
        </div>
      </BgSection>

      {/* Services carousel */}
      <section className="py-16">
        <div className="container-content text-center">
          <h2 className="text-[28px] font-semibold text-primary md:text-4xl">{servicesCarousel.heading}</h2>
          <p className="mx-auto mt-4 max-w-2xl text-grey">{servicesCarousel.intro}</p>
        </div>
        <div className="container-content mt-12">
          <ServicesCarousel />
        </div>
      </section>

      {/* Why Raipur's Contractors Choose + Working hours */}
      <section className="bg-tint-cyan-2/50 py-16">
        <div className="container-content grid gap-12 lg:grid-cols-2">
          <div>
            <h2 className="text-center text-[28px] font-semibold text-primary md:text-4xl">{whyChoose.heading}</h2>
            <div className="mt-8 space-y-7">
              {whyChoose.items.map((item) => (
                <div key={item.title}>
                  <h3 className="text-lg font-semibold text-secondary">{item.title}</h3>
                  <p className="mt-2 leading-relaxed text-grey">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-center text-[28px] font-semibold text-primary md:text-4xl">
              {workingHours.heading}
            </h2>
            <table className="mt-8 w-full border-collapse overflow-hidden rounded-lg border border-grey-line bg-white text-left">
              <thead>
                <tr>
                  {workingHours.columns.map((col) => (
                    <th key={col} className="border-b border-grey-line px-6 py-4 text-center font-semibold text-ink">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {workingHours.rows.map(([day, hours]) => (
                  <tr key={day}>
                    <td className="border-b border-grey-line px-6 py-4 text-[14.4px] text-grey">{day}</td>
                    <td className="border-b border-grey-line px-6 py-4 text-[14.4px] text-grey">{hours}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Let's Build Stronger Together */}
      <BgSection image="/images/bg/build-together.webp" overlayOpacity={0.88} className="py-16 text-center">
        <div className="container-content">
          <h2 className="text-[35px] font-semibold lg:text-[60px]">{buildTogether.heading}</h2>
          <p className="mx-auto mt-4 max-w-2xl text-white/90">
            <InlineText text={buildTogether.body} />
          </p>
          <a
            href={buildTogether.cta.href}
            className="mt-8 inline-block rounded-md bg-primary px-8 py-4 text-xl font-medium text-white transition-colors hover:bg-primary/90"
          >
            {buildTogether.cta.label}
          </a>
        </div>
      </BgSection>

      {/* FAQ */}
      <section className="py-16">
        <div className="container-content grid items-start gap-12 lg:grid-cols-2">
          <Image
            src="/images/faq-first-pour.webp"
            alt="SolidMix RMC site engineer in front of transit mixer trucks — From the first pour to the final floor"
            width={620}
            height={775}
            className="mx-auto h-auto w-full max-w-md rounded-lg"
          />
          <div>
            <h2 className="mb-8 text-center text-[28px] font-semibold text-primary md:text-4xl">{faq.heading}</h2>
            <FaqAccordion items={faq.items} questionColor="primary" />
          </div>
        </div>
      </section>

      {/* Our Core Skills + video */}
      <section className="py-16">
        <div className="container-content grid items-center gap-12 lg:grid-cols-2">
          <div>
            <h2 className="text-[28px] font-semibold text-primary md:text-4xl">{coreSkills.heading}</h2>
            <p className="mt-5 leading-relaxed text-ink">
              <InlineText text={coreSkills.body} />
            </p>
            <div className="mt-7 text-center">
              <a
                href={coreSkills.cta.href}
                className="inline-block rounded-md bg-secondary px-6 py-3.5 text-xl font-medium text-white transition-colors hover:bg-secondary/90"
              >
                {coreSkills.cta.label}
              </a>
            </div>
          </div>
          <video
            controls
            preload="metadata"
            poster={coreSkills.video.poster}
            className="aspect-video w-full rounded-lg bg-dark"
          >
            <source src={coreSkills.video.src} type="video/mp4" />
          </video>
        </div>
      </section>

      {/* Contact details + form */}
      <BgSection image="/images/bg/contact-details.webp" overlayOpacity={0.7} className="py-16">
        <div className="container-content grid gap-12 lg:grid-cols-2">
          <div>
            <h2 className="flex items-center gap-2 text-xl font-semibold text-white">
              {contactBlock.detailsHeading}
            </h2>
            <div className="mt-6 space-y-5 border-l-2 border-white/40 pl-5">
              <p className="font-semibold text-white/90">{contactBlock.address}</p>
              <p className="font-semibold text-white/90">{contactBlock.number}</p>
              <p className="font-semibold text-white/90">{contactBlock.emailLine}</p>
            </div>
            <h2 className="mt-8 flex items-center gap-2 text-xl font-semibold text-white">
              {contactBlock.hoursHeading}
            </h2>
            <p className="mt-4 border-l-2 border-white/40 pl-5 font-semibold text-white/90">
              {contactBlock.hours}
            </p>
          </div>
          <HomeContactForm />
        </div>
      </BgSection>
    </>
  );
}
