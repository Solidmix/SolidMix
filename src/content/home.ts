// Home page content, copied exactly from docs/reference/original-site/pages/home/content.md.
// Only run-together phone/email/address rendering is separated; wording is unchanged.
// Internal CTA links point at live targets, never redirecting URLs.

export const CONTACT_URL = "/ready-mix-concrete-contact-in-raipur/";
export const APPOINTMENTS_URL = "/appointments/";
export const OUR_WORK_URL = "/our-work/";
export const ABOUT_URL = "/trusted-concrete-supplier-in-raipur/";
export const SAFETY_URL = "/safety/";

export const hero = {
  h1: "RMC Plant in Raipur | Ready Mix Concrete Supplier — SolidMix",
  subtitle:
    "Raipur’s #1 ready mix concrete plant delivering M20 to M40 grade high-strength concrete directly to your construction site — 24×7 delivery, zero compromise on quality.",
  tabs: [
    { label: "About Us", key: "about" },
    { label: "Our Mission", key: "mission" },
    { label: "Vision", key: "vision" },
  ],
};

export const intro = {
  heading: "Raipur's Most Trusted Ready Mix Concrete Supplier",
  // Paragraph kept verbatim (including the literal ** markers as on the original).
  bodyHtml:
    "Whether you’re building a home, a commercial complex, or an infrastructure project — SolidMix RMC is Raipur’s <a href=\"/trusted-concrete-supplier-in-raipur/\">trusted ready mix concrete plant</a> that has been supplying precision-mixed concrete to <a href=\"/our-work/\">hundreds of projects</a> across Chhattisgarh since 2023. Our advanced concrete batching plant uses computer-controlled mixing technology, ensuring every batch delivers the same quality, strength, and workability. Unlike manually mixed concrete on-site, ready mix concrete eliminates inconsistency — which is why modern contractors and builders across Raipur prefer SolidMix RMC. We deliver concrete across **Raipur, Naya Raipur, Tatibandh, Telibandha, Pachpedi Naka, Ring Road area, Shankar Nagar, Mowa, Pandri, Tikrapara** and all of Chhattisgarh.",
  cta: { label: "Get Instant Quote for Ready Mix Concrete", href: CONTACT_URL },
  mission:
    "To be the leading ready-mix concrete manufacturer in Chhattisgarh by 2027 and the preferred brand among our customers through exceptional quality, innovative solutions, and uncompromising commitment to customer satisfaction.",
  vision:
    "To be the most trusted and sustainable provider of ready-mix concrete solutions, shaping resilient infrastructure and contributing to the growth of our community.",
};

export const qualityWorks = {
  eyebrow: "Quality Works",
  heading: "Reliable Ready-Mix Concrete in Raipur",
  body:
    "At SolidMix RMC, we deliver high-quality ready mix concrete in Raipur with precision and consistency. Our advanced RMC plant and modern concrete batching plant ensure strength, durability, and smooth finishing for every project. From homes to high-rise towers, rely on us for on-time ready mix concrete delivery backed by trust and expertise.",
};

export const servicesCarousel = {
  heading: "Concrete Services You Can Rely On — Every Time",
  intro:
    "High-quality ready mix concrete in Raipur, delivered on time from our advanced RMC plant. Trusted strength, precision, and durability by SolidMix RMC.",
  cards: [
    {
      image: "/images/service-icon-1.webp",
      title: "Versatile Concrete Solutions",
      body:
        "Our advanced RMC plant offers a wide variety of mixes tailored to residential, commercial, and infrastructure needs — making us the trusted concrete supplier in Raipur.",
    },
    {
      image: "/images/service-icon-2.webp",
      title: "Premium Concrete Quality",
      body:
        "Delivering ready mix concrete in Raipur with superior durability, strength, and consistency in every pour.",
    },
    {
      image: "/images/service-icon-3.webp",
      title: "State-of-the-Art Technology",
      body:
        "Our modern RMC plants and advanced concrete batching plants ensure precision, reliability, and on-time delivery.",
    },
    {
      image: "/images/service-icon-4.webp",
      title: "Expert Engineering Support",
      body:
        "Backed by specialists, SolidMix RMC provides seamless project execution and trusted concrete supplier services in Raipur.",
    },
    {
      image: "/images/service-icon-5.webp",
      title: "End-to-End Customer Support",
      body:
        "From order to delivery, SolidMix RMC ensures seamless assistance and ready mix concrete delivery in Raipur that you can rely on.",
    },
  ],
};

export const whyChoose = {
  heading: "Why Raipur's Contractors Choose SolidMix RMC",
  items: [
    {
      title: "1. Computer-Controlled Batching — Zero Human Error",
      body:
        "Our RMC plant runs on a fully automated batching system. The ratio of cement, aggregates, water, and admixtures is controlled by computer — meaning every transit mixer delivers exactly the same quality concrete, every single time. No excess water, no under-cement batches.",
    },
    {
      title: "2. On-Time Delivery — No Idle Time on Site",
      body:
        "A late concrete delivery means your entire crew sits idle. Our fleet of transit mixers delivers to any corner of Raipur within 60–90 minutes. Available 24×7, including weekends and public holidays.",
    },
    {
      title: "3. IS 456:2000 Certified Quality",
      body:
        "All our concrete mixes comply with Bureau of Indian Standards IS 456:2000 guidelines. Every batch goes through slump testing, cube testing, and water-cement ratio verification. See our full quality assurance process",
    },
    {
      title: "4. Free Mix Design Consultation",
      body:
        "Not sure which grade is right for your project? Our experienced engineers assess your project requirements and recommend the ideal concrete mix — completely free of charge. Book your free consultation",
    },
    {
      title: "5. Minimal Wastage — Direct Cost Savings",
      body:
        "With ready mix concrete, you order exactly what you need. Manual site mixing typically wastes 15–20% of material. With RMC, wastage is near zero — which directly reduces your overall project cost.",
    },
  ],
};

export const workingHours = {
  heading: "Working hours",
  columns: ["Day", "Working Hours"],
  rows: [
    ["Sunday", "24 hours"],
    ["Monday", "24 hours"],
    ["Tuesday", "24 hours"],
    ["Wednesday", "24 hours"],
    ["Thursday", "24 hours"],
    ["Friday", "24 hours"],
    ["Saturday", "24 hours"],
  ],
};

export const buildTogether = {
  heading: "Let’s Build Stronger Together",
  body:
    "Partner with [[b]]SolidMix RMC[[/b]], the trusted [[b]]ready mix concrete supplier in Raipur[[/b]], for durable and on-time solutions.",
  cta: { label: "Schedule Your Appointment", href: CONTACT_URL },
};

export const faq = {
  heading: "Frequently Asked Questions",
  items: [
    {
      q: "Where is the SolidMix RMC concrete plant located in Raipur?",
      a: "Our plant is located at Ph.no.77, Kh.no.365/5, Serikhedi, Raipur, Chhattisgarh 492101. Our office is at Lalganga Business Park, Pachpedi Naka, Raipur. Both locations are available on Google Maps.",
    },
    {
      q: "What is the minimum order quantity for ready mix concrete?",
      a: "Our minimum order is 6 cubic meters (one transit mixer load). If you need a smaller quantity, contact our team  we’ll find a solution.",
    },
    {
      q: "How long does concrete delivery take?",
      a: "For most Raipur city areas, delivery takes 60–90 minutes after order confirmation. Delivery time may vary for distant locations. Call us in advance for urgent requirements.",
    },
    {
      q: "What concrete grades does SolidMix RMC supply?",
      a: "We supply M20, M25, M30, M35, and M40 grade ready mix concrete. Free consultation is available to help you choose the right grade for your project.",
    },
    {
      q: "How is concrete quality tested?",
      a: "Every batch undergoes a slump test at the plant. Cube samples are cast at the site and tested for compressive strength at 7 days and 28 days as per IS 456:2000. See our safety and quality page",
    },
    {
      q: "Does SolidMix RMC deliver on Sundays and public holidays?",
      a: "Yes. We operate 24×7, 365 days a year — including Sundays, Diwali, and all public holidays. Construction doesn’t stop, and neither do we.",
    },
  ],
};

export const coreSkills = {
  heading: "Our Core Skills in Concrete Solutions",
  body:
    "At [[b]]SolidMix RMC[[/b]], we specialize in delivering [[b]]ready mix concrete in Raipur[[/b]] that ensures superior strength, durability, and environmental sustainability. With our advanced [[b]]RMC plants[[/b]] and efficient [[b]]concrete batching systems[[/b]], we guarantee smooth project execution — [[b]]on time, every time[[/b]].",
  cta: { label: "Schedule Appointment", href: CONTACT_URL },
  video: {
    src: "/videos/logo-ortho.mp4",
    poster: "/images/logo-ortho-poster.webp",
  },
};

export const contactBlock = {
  detailsHeading: "Contact Details",
  address:
    "Address : Office no.418, 4th floor, Lalganga Business Park Pachpedi naka Raipur C.G Pin code 492001",
  number: "Number : +91 9893111201",
  emailLine: "Email : info@solidmixrmc.com support@solidmixrmc.com",
  hoursHeading: "Working Hours",
  hours: "24*7 Hours Open",
  form: {
    fields: {
      name: "Name",
      contact: "Contact",
      email: "Email",
      message: "Message",
    },
    submit: "Send",
  },
};
