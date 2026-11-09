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
import { AboutTabs } from "@/components/home/AboutTabs";
import { ServicesCarousel } from "@/components/home/ServicesCarousel";
import { HomeContactForm } from "@/components/home/HomeContactForm";
import { FaqAccordion } from "@/components/FaqAccordion";
import { Reveal } from "@/components/Reveal";
import { Tilt } from "@/components/Tilt";
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

      {/* Hero */}
      <section className="overflow-hidden bg-gradient-to-b from-tint-cyan-2 to-white">
        <div className="container-content grid items-center gap-8 py-10 md:py-14 lg:grid-cols-2">
          <div className="order-2 text-center lg:order-1 lg:text-left">
            <h1 className="text-3xl font-extrabold leading-tight text-primary md:text-4xl lg:text-[2.75rem]">
              {hero.h1}
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-lg text-ink lg:mx-0">{hero.subtitle}</p>
          </div>
          <Reveal variant="slide-right" className="order-1 lg:order-2">
            <Tilt>
              <Image
                src="/images/mixer-truck.webp"
                alt="SolidMix RMC transit mixer truck delivering ready mix concrete in Raipur"
                width={648}
                height={385}
                priority
                className="mx-auto h-auto w-full max-w-xl"
              />
            </Tilt>
          </Reveal>
        </div>
      </section>

      {/* About / Mission / Vision tabs */}
      <section className="py-14">
        <div className="container-content">
          <AboutTabs />
        </div>
      </section>

      {/* Quality Works */}
      <section className="bg-dark py-16 text-white">
        <div className="container-content text-center">
          <p className="font-semibold text-primary">{qualityWorks.eyebrow}</p>
          <h2 className="mt-2 text-3xl font-extrabold text-primary md:text-4xl">
            {qualityWorks.heading}
          </h2>
          <p className="mx-auto mt-5 max-w-3xl leading-relaxed text-white/90">{qualityWorks.body}</p>
        </div>
      </section>

      {/* Services carousel */}
      <section className="py-16">
        <div className="container-content text-center">
          <h2 className="text-3xl font-extrabold text-primary md:text-4xl">{servicesCarousel.heading}</h2>
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
            <h2 className="text-3xl font-extrabold text-primary md:text-4xl">{whyChoose.heading}</h2>
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
            <h2 className="text-center text-3xl font-extrabold text-primary md:text-4xl">
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
                    <td className="border-b border-grey-line px-6 py-4 text-grey">{day}</td>
                    <td className="border-b border-grey-line px-6 py-4 text-grey">{hours}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Let's Build Stronger Together */}
      <section className="bg-dark py-16 text-center text-white">
        <div className="container-content">
          <h2 className="text-3xl font-extrabold md:text-4xl">{buildTogether.heading}</h2>
          <p className="mx-auto mt-4 max-w-2xl text-white/90">{buildTogether.body}</p>
          <a
            href={buildTogether.cta.href}
            className="mt-8 inline-block rounded-md bg-primary px-8 py-4 font-semibold text-white transition-colors hover:bg-primary/90"
          >
            {buildTogether.cta.label}
          </a>
        </div>
      </section>

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
            <h2 className="mb-8 text-3xl font-extrabold text-primary md:text-4xl">{faq.heading}</h2>
            <FaqAccordion items={faq.items} />
          </div>
        </div>
      </section>

      {/* Our Core Skills + video */}
      <section className="py-16">
        <div className="container-content grid items-center gap-12 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-extrabold text-primary md:text-4xl">{coreSkills.heading}</h2>
            <p className="mt-5 leading-relaxed text-ink">{coreSkills.body}</p>
            <a
              href={coreSkills.cta.href}
              className="mt-7 inline-block rounded-md bg-secondary px-6 py-3.5 font-semibold text-white transition-colors hover:bg-secondary/90"
            >
              {coreSkills.cta.label}
            </a>
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
      <section className="bg-tint-cyan-2/40 py-16">
        <div className="container-content grid gap-12 lg:grid-cols-2">
          <div>
            <h2 className="flex items-center gap-2 text-xl font-semibold text-secondary">
              {contactBlock.detailsHeading}
            </h2>
            <div className="mt-6 space-y-5 border-l-2 border-primary/40 pl-5">
              <p className="font-semibold text-ink">{contactBlock.address}</p>
              <p className="font-semibold text-ink">{contactBlock.number}</p>
              <p className="font-semibold text-ink">{contactBlock.emailLine}</p>
            </div>
            <h2 className="mt-8 flex items-center gap-2 text-xl font-semibold text-secondary">
              {contactBlock.hoursHeading}
            </h2>
            <p className="mt-4 border-l-2 border-primary/40 pl-5 font-semibold text-ink">
              {contactBlock.hours}
            </p>
          </div>
          <HomeContactForm />
        </div>
      </section>
    </>
  );
}
