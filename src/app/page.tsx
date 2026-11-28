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
import { Tilt } from "@/components/Tilt";
import { HeroSlider } from "@/components/home/HeroSlider";
import { AboutTabs } from "@/components/home/AboutTabs";
import { ServicesCarousel } from "@/components/home/ServicesCarousel";
import { HomeContactForm } from "@/components/home/HomeContactForm";
import { FaqAccordion } from "@/components/FaqAccordion";
import { InlineText } from "@/components/InlineText";
import { JsonLd } from "@/components/JsonLd";
import { SITE_URL, organizationLd, faqPageLd } from "@/lib/seo";

// Title/description from seo-kit/01-seo-meta.csv (Phase 2, 2026-11-21) — base
// title only, no template suffix (the CSV's own note for this row), and the
// description no longer claims "24/7" or "M20 to M40" (hard rule #1).
export const metadata: Metadata = {
  title: "Ready Mix Concrete Supplier in Raipur",
  description:
    "SolidMix RMC supplies ready mix concrete in Raipur for residential, commercial and infrastructure projects. Call or contact us.",
  alternates: { canonical: SITE_URL + "/" },
  openGraph: {
    title: "Ready Mix Concrete Supplier in Raipur",
    description:
      "SolidMix RMC supplies ready mix concrete in Raipur for residential, commercial and infrastructure projects. Call or contact us.",
    url: SITE_URL + "/",
    type: "website",
  },
};

export default function HomePage() {
  return (
    <>
      <JsonLd data={[...organizationLd(), faqPageLd(faq.items)]} />

      {/* Hero slider — 3 original promotional slides */}
      <HeroSlider />

      {/* Hero heading */}
      <section className="bg-gradient-to-b from-tint-cyan-2 to-white">
        <div className="container-content py-10 text-center md:py-14">
          <h1 className="text-[25px] font-semibold leading-tight text-primary lg:text-[32px]">
            {hero.h1}
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg text-ink">{hero.subtitle}</p>
        </div>
      </section>

      {/* About / Mission / Vision tabs */}
      <section className="pb-20 pt-14">
        <div className="container-content">
          <AboutTabs />
        </div>
      </section>

      {/* Quality Works */}
      <BgSection image="/images/bg/quality-works.webp" overlayOpacity={0.8} className="pb-16 pt-24 text-white">
        <div className="container-content text-center">
          <p className="font-semibold text-primary">{qualityWorks.eyebrow}</p>
          <h2 className="mt-2 text-[28px] font-semibold text-primary md:text-[40px]">
            {qualityWorks.heading}
          </h2>
          <p className="mx-auto mt-5 max-w-3xl font-medium leading-relaxed text-white/90">{qualityWorks.body}</p>
        </div>
      </BgSection>

      {/* Services carousel */}
      <section className="pb-16 pt-24">
        <div className="container-content text-center">
          <h2 className="text-[28px] font-semibold text-primary md:text-[40px]">{servicesCarousel.heading}</h2>
          <p className="mx-auto mt-4 max-w-2xl text-grey">{servicesCarousel.intro}</p>
        </div>
        <div className="container-content mt-12">
          <ServicesCarousel />
        </div>
      </section>

      {/* Why Raipur's Contractors Choose + Working hours */}
      <section className="relative overflow-hidden py-[50px] px-[10px] md:px-[20px] lg:px-0 lg:py-[100px]">
        <Image
          src="/images/bg/triangle-pattern.webp"
          alt=""
          aria-hidden="true"
          fill
          className="pointer-events-none object-cover object-top opacity-20"
        />
        <div className="relative mx-auto grid w-full max-w-[1360px] gap-12 lg:grid-cols-2">
          <div>
            <h2 className="text-center text-[28px] font-semibold text-primary md:text-[40px]">{whyChoose.heading}</h2>
            <div className="mt-8 space-y-7">
              {whyChoose.items.map((item) => (
                <div key={item.title}>
                  <h3 className="text-lg font-semibold text-secondary">{item.title}</h3>
                  <p className="mt-2 leading-relaxed text-grey">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="lg:flex lg:flex-col lg:justify-center">
            <h2 className="text-center text-[28px] font-semibold text-primary md:text-[40px]">
              {workingHours.heading}
            </h2>
            <p className="mt-4 mb-4 text-center text-xl font-bold text-primary md:mb-6 md:text-2xl">
              24x7x365 days
            </p>
          </div>
        </div>
      </section>

      {/* Let's Build Stronger Together */}
      <BgSection image="/images/bg/build-together.webp" overlayOpacity={0.88} className="pb-16 pt-8 text-center text-white">
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
          {/* Original has a mouse-tilt motion effect on this photo
              (motion_fx_tilt_effect, confirmed in the captured home page
              CSS) — rendered as a shadowed card, same treatment as the
              rmc-services FAQ image. */}
          <Tilt className="mx-auto w-full max-w-md">
            <Image
              src="/images/faq-first-pour.webp"
              alt="SolidMix RMC site engineer in front of transit mixer trucks — From the first pour to the final floor"
              width={620}
              height={775}
              className="h-auto w-full rounded-lg object-contain shadow-lg"
            />
          </Tilt>
          <div>
            <h2 className="mb-8 text-center text-[28px] font-semibold text-primary md:text-[40px]">{faq.heading}</h2>
            <FaqAccordion
              items={faq.items}
              questionColor="primary"
              firstAnswerColor="secondary"
              openQuestionColor="text-[#1f2124]"
              hoverQuestionColorClass="[@media(hover:hover)]:hover:text-secondary"
              questionSizeClass="text-[20px]"
            />
          </div>
        </div>
      </section>

      {/* Our Core Skills + video */}
      <section className="py-16">
        <div className="container-content grid items-center gap-12 lg:grid-cols-2">
          <div>
            <h2 className="text-[28px] font-semibold text-primary md:text-[40px]">{coreSkills.heading}</h2>
            <p className="mt-5 leading-relaxed text-ink">
              <InlineText text={coreSkills.body} />
            </p>
            <div className="mt-7 text-center">
              <a
                href={coreSkills.cta.href}
                className="inline-block rounded-md bg-secondary px-6 py-3.5 text-[15px] font-medium text-white transition-colors hover:bg-secondary/90"
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

      {/* Contact details + form — the original has no overlay here at all
          (verified against the captured CSS: --background-overlay:'') and
          dark text directly on the photo, not a white-on-dark banner. */}
      <BgSection image="/images/bg/contact-details.webp" overlayOpacity={0} className="py-16">
        <div className="container-content grid gap-12 lg:grid-cols-2">
          <div>
            <h2 className="flex items-center gap-2 text-[16px] font-normal text-ink">
              {contactBlock.detailsHeading}
            </h2>
            <div className="mt-6 space-y-5 border-l-2 border-primary pl-5">
              <p className="text-[20px] font-medium text-[#292929]">{contactBlock.address}</p>
              <p className="text-[20px] font-medium text-[#292929]">{contactBlock.number}</p>
              <p className="text-[20px] font-medium text-[#292929]">{contactBlock.emailLine}</p>
            </div>
          </div>
          <HomeContactForm />
        </div>
      </BgSection>
    </>
  );
}
