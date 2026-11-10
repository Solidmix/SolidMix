// Company-wide content (no WordPress code copied; text/links only).
// Internal links point directly at live targets, never at redirecting URLs.

export const PRODUCTS_BASE = "/ready-mix-concrete-in-raipur";

export const site = {
  name: "SolidMix RMC",
  legalName: "Solidmixrmc",
  tagline:
    "SolidMix RMC is your trusted ready mix concrete partner in Raipur, delivering quality concrete solutions with strength, durability and dependable service for every project.",
  phoneDisplay: "+91 9893111201",
  phoneHref: "tel:+919893111201",
  whatsappNumber: "919893111201",
  whatsappHref: "https://wa.me/919893111201",
  emails: [
    { display: "info@solidmixrmc.com", href: "mailto:info@solidmixrmc.com" },
    { display: "support@solidmixrmc.com", href: "mailto:support@solidmixrmc.com" },
  ],
  // Both addresses exactly as in the design doc (section 10).
  officeAddress: {
    label: "Office Address",
    lines: [
      "Office no. 418, 4th floor, Lalganga Business Park, Pachpedi Naka, Raipur, C.G. 492001",
    ],
  },
  plantAddress: {
    label: "Plant Address",
    lines: ["PH No. 77, Khasra No. 365/5, Serikhedi, Raipur, Chhattisgarh – 492101"],
  },
  socials: [
    { label: "Facebook", href: "https://www.facebook.com/share/15mzWCbLrx/", icon: "facebook" },
    { label: "Youtube", href: "https://youtube.com/@solidmixrmc?si=8Lvy9cF8Jz3hKgKP", icon: "youtube" },
    {
      label: "Instagram",
      href: "https://www.instagram.com/solidmixrmc/profilecard/?igsh=YmI0d213ZDA1Zmx5",
      icon: "instagram",
    },
    { label: "Linkedin", href: "https://www.linkedin.com/company/solidmixrmc/", icon: "linkedin" },
  ],
} as const;

export type MenuItem = {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
};

// Menu tree exactly as the original (design doc section 5). Hrefs are live targets.
export const menu: MenuItem[] = [
  { label: "Home", href: "/" },
  {
    label: "About Us",
    href: "/trusted-concrete-supplier-in-raipur/",
    children: [{ label: "Our Team", href: "/our-team/" }],
  },
  {
    label: "Products",
    href: `${PRODUCTS_BASE}/`,
    children: [
      { label: "Standard Concrete", href: `${PRODUCTS_BASE}/standard-concrete/` },
      { label: "Steel Fiber Concrete", href: `${PRODUCTS_BASE}/steel-fiber-concrete/` },
      { label: "PP Fiber Concrete", href: `${PRODUCTS_BASE}/pp-fiber-concrete-in-kumhari-raipur/` },
      { label: "Waterproof Concrete", href: `${PRODUCTS_BASE}/waterproof-concrete-in-mandir-hasaud-raipur/` },
      { label: "Heat Resistant Concrete", href: `${PRODUCTS_BASE}/heat-resistant-concrete-2/` },
      { label: "Stamped Concrete", href: `${PRODUCTS_BASE}/stamped-concrete-in-atal-nagar-raipur/` },
      { label: "Bagged Concrete", href: `${PRODUCTS_BASE}/bagged-concrete-in-farfaud-raipur/` },
      { label: "Permeable Concrete", href: `${PRODUCTS_BASE}/permeable-concrete-in-kotni-raipur/` },
      { label: "Eco Friendly Concrete", href: `${PRODUCTS_BASE}/eco-friendly-concrete-in-saddu-raipur/` },
      { label: "Lightweight Concrete", href: `${PRODUCTS_BASE}/lightweight-concrete-in-sejbahar-raipur/` },
      { label: "Self Compacting Concrete", href: `${PRODUCTS_BASE}/self-compacting-concrete-in-bhanpuri-raipur/` },
      { label: "High Strength Concrete", href: `${PRODUCTS_BASE}/high-strength-concrete-in-sarona-raipur/` },
    ],
  },
  {
    label: "Our Services",
    href: "/rmc-services-in-raipur/",
    children: [
      { label: "Our Work", href: "/our-work/" },
      { label: "Calculator", href: "/calculator/" },
      { label: "Safety", href: "/safety/" },
    ],
  },
  {
    label: "Blogs",
    href: "/concrete-blog-in-raipur/",
    children: [{ label: "Gallery", href: "/rmc-gallery-in-raipur/" }],
  },
  {
    label: "Contact Us",
    href: "/ready-mix-concrete-contact-in-raipur/",
    children: [
      { label: "Appointments", href: "/appointments/" },
      { label: "Careers", href: "/careers/" },
    ],
  },
  {
    label: "Legal",
    href: "/legal/",
    children: [{ label: "Privacy Policy", href: "/privacy-policy/" }],
  },
];

// Footer "Useful Links" column (live targets; brochure is a static PDF).
export const footerUsefulLinks = [
  { label: "About Us", href: "/trusted-concrete-supplier-in-raipur/" },
  { label: "Careers", href: "/careers/" },
  { label: "Safety", href: "/safety/" },
  { label: "Contact", href: "/ready-mix-concrete-contact-in-raipur/" },
  { label: "Download Brochure", href: "/brochure/solidmix-brochure.pdf" },
  { label: "Terms & Policy", href: "/privacy-policy/" },
  { label: "Blogs", href: "/concrete-blog-in-raipur/" },
];

export const footer = {
  blurb:
    "SolidMix RMC is your trusted ready mix concrete partner in Raipur, delivering quality concrete solutions with strength, durability and dependable service for every project.",
  tagline:
    "Serving Raipur with quality ready mix concrete for residential, commercial and infrastructure projects.",
  copyright: "Copyright © 2025, All rights reserved",
  poweredBy: { label: "DigitalWingzz", href: "https://www.digitalwingzz.com/" },
};
