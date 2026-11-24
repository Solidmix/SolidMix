import type { Metadata } from 'next';
import BookUsForm from '@/components/book-us/BookUsForm';
import PlantCards from '@/components/book-us/PlantCards';
import { plants, mainPhone, mainPhoneHref, whatsappHref } from '@/data/plants';

const SITE = 'https://solidmixrmc.com';
const PATH = '/ready-mix-concrete-contact-in-raipur/';

// Title and description: take the final text from 01-seo-meta.csv (contact row). Brand is added by the root template.
export const metadata: Metadata = {
  title: 'Contact SolidMix RMC, Raipur',
  description: 'Call, WhatsApp or send a booking request to SolidMix RMC. See our three plants near Raipur and the areas each one serves.',
  alternates: { canonical: `${SITE}${PATH}` },
};

// FAQ: keep the visible text and the JSON-LD identical. Add only answers the client has confirmed.
const faqs = [
  {
    q: 'How do I book ready mix concrete from SolidMix?',
    a: 'Fill in the booking form on this page, or call or WhatsApp us. Our team will confirm the grade, mix and availability for your site.',
  },
  {
    q: 'Which plant serves my site?',
    a: 'Choose the nearest plant in the form and pick your delivery area. Our team will confirm availability for your site.',
  },
];

export default function BookUsPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ContactPage',
        '@id': `${SITE}${PATH}#page`,
        url: `${SITE}${PATH}`,
        name: 'Contact SolidMix RMC',
        isPartOf: { '@id': `${SITE}/#website` },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/` },
          { '@type': 'ListItem', position: 2, name: 'Contact Us', item: `${SITE}${PATH}` },
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: faqs.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      },
      // One LocalBusiness per plant, confirmed data only.
      ...plants.map((p) => ({
        '@type': 'LocalBusiness',
        '@id': `${SITE}${PATH}#${p.id}`,
        name: p.name,
        telephone: p.phone,
        address: { '@type': 'PostalAddress', streetAddress: p.address, addressCountry: 'IN' },
        parentOrganization: { '@id': `${SITE}/#organization` },
        areaServed: p.areaGroups.flatMap((g) => g.areas).map((a) => ({ '@type': 'Place', name: a })),
      })),
    ],
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <nav aria-label="Breadcrumb" className="text-sm text-neutral-600">
        <a href="/">Home</a> / <span>Contact Us</span>
      </nav>

      <h1 className="mt-3 text-3xl font-bold">Book Us: Ready Mix Concrete in Raipur</h1>
      <p className="mt-2 max-w-3xl text-neutral-800">
        Call, WhatsApp or send the form below. Tell us your site, grade and pump need, and our team will get back to you.
      </p>

      <div className="mt-4 flex flex-wrap gap-3">
        <a href={mainPhoneHref} className="min-h-[44px] rounded-lg bg-[#9f1481] px-5 py-3 font-semibold text-white">
          Call {mainPhone}
        </a>
        <a
          href={whatsappHref}
          className="min-h-[44px] rounded-lg border border-[#9f1481] px-5 py-3 font-semibold text-[#9f1481]"
        >
          WhatsApp us
        </a>
      </div>

      <section aria-labelledby="form-h" className="mt-10 max-w-3xl">
        <h2 id="form-h" className="text-2xl font-semibold">Booking form</h2>
        <div className="mt-4">
          <BookUsForm />
        </div>
      </section>

      <section aria-labelledby="plants-h" className="mt-12">
        <h2 id="plants-h" className="text-2xl font-semibold">Our plants and the areas we serve</h2>
        <div className="mt-4">
          <PlantCards />
        </div>
      </section>

      <section aria-labelledby="faq-h" className="mt-12 max-w-3xl">
        <h2 id="faq-h" className="text-2xl font-semibold">Questions</h2>
        {faqs.map((f) => (
          <div key={f.q} className="mt-4">
            <h3 className="font-semibold">{f.q}</h3>
            <p className="mt-1 text-neutral-800">{f.a}</p>
          </div>
        ))}
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </main>
  );
}
