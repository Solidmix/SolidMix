// SolidMix RMC: single source of truth for the menu.
// Every href below is a page that is LIVE today (checked against the deployed site and its sitemap).
// Do not add a link to a page that does not exist yet; a menu link that 404s hurts SEO.
// Slugs are the existing indexed URLs, so no redirects are needed for the menu.

export type NavLink = { label: string; href: string };
export type NavGroup = { heading?: string; links: NavLink[] };
export type NavItem = {
  label: string; // text shown in the menu
  href: string; // the parent label is itself a real link (overview page)
  overview?: NavLink; // first line inside the dropdown (bold). Required when groups exist.
  groups?: NavGroup[]; // dropdown content; 3-4 groups render as a wide menu
};

export const site = {
  phoneDisplay: '+91 9893111201',
  phoneHref: 'tel:+919893111201',
  whatsappHref: 'https://wa.me/919893111201',
};

// Highlighted button on the right of the header, and in the mobile drawer.
export const cta: NavLink = { label: 'Book Us', href: '/ready-mix-concrete-contact-in-raipur/' };

export const nav: NavItem[] = [
  { label: 'Home', href: '/' },
  {
    label: 'Ready Mix Concrete',
    href: '/ready-mix-concrete-in-raipur/',
    overview: { label: 'All Ready Mix Concrete Products', href: '/ready-mix-concrete-in-raipur/' },
    groups: [
      {
        heading: 'Structural',
        links: [
          { label: 'Standard Concrete', href: '/ready-mix-concrete-in-raipur/standard-concrete/' },
          { label: 'High Strength Concrete', href: '/ready-mix-concrete-in-raipur/high-strength-concrete-in-sarona-raipur/' },
          { label: 'Self Compacting Concrete', href: '/ready-mix-concrete-in-raipur/self-compacting-concrete-in-bhanpuri-raipur/' },
          { label: 'Lightweight Concrete', href: '/ready-mix-concrete-in-raipur/lightweight-concrete-in-sejbahar-raipur/' },
        ],
      },
      {
        heading: 'Fiber Reinforced',
        links: [
          { label: 'Steel Fiber Concrete', href: '/ready-mix-concrete-in-raipur/steel-fiber-concrete/' },
          { label: 'PP Fiber Concrete', href: '/ready-mix-concrete-in-raipur/pp-fiber-concrete-in-kumhari-raipur/' },
        ],
      },
      {
        heading: 'Special Purpose',
        links: [
          { label: 'Waterproof Concrete', href: '/ready-mix-concrete-in-raipur/waterproof-concrete-in-mandir-hasaud-raipur/' },
          { label: 'Heat Resistant Concrete', href: '/ready-mix-concrete-in-raipur/heat-resistant-concrete-2/' },
          { label: 'Permeable Concrete', href: '/ready-mix-concrete-in-raipur/permeable-concrete-in-kotni-raipur/' },
          { label: 'Eco Friendly Concrete', href: '/ready-mix-concrete-in-raipur/eco-friendly-concrete-in-saddu-raipur/' },
        ],
      },
      {
        heading: 'Decorative & Bagged',
        links: [
          { label: 'Stamped Concrete', href: '/ready-mix-concrete-in-raipur/stamped-concrete-in-atal-nagar-raipur/' },
          { label: 'Bagged Concrete', href: '/ready-mix-concrete-in-raipur/bagged-concrete-in-farfaud-raipur/' },
        ],
      },
    ],
  },
  {
    label: 'RMC Services',
    href: '/rmc-services-in-raipur/',
    overview: { label: 'All RMC Services', href: '/rmc-services-in-raipur/' },
    groups: [
      {
        links: [
          { label: 'Concrete Calculator', href: '/calculator/' },
          { label: 'Quality & Safety', href: '/safety/' },
        ],
      },
    ],
  },
  {
    label: 'Our Projects',
    href: '/our-work/',
    overview: { label: 'Completed Projects', href: '/our-work/' },
    groups: [{ links: [{ label: 'Project Gallery', href: '/rmc-gallery-in-raipur/' }] }],
  },
  {
    label: 'Guides & Blog',
    href: '/concrete-blog-in-raipur/',
    overview: { label: 'All Concrete Guides & Blog', href: '/concrete-blog-in-raipur/' },
    groups: [
      {
        heading: 'Topics',
        links: [
          { label: 'Concrete 101', href: '/category/concrete-101/' },
          { label: 'Construction', href: '/category/construction/' },
          { label: 'RMC Plant', href: '/category/rmc-plant/' },
        ],
      },
      {
        heading: 'Popular Guides',
        links: [
          { label: 'M20 vs M25 Concrete', href: '/m20-vs-m25-concrete-in-raipur/' },
          { label: 'How to Choose an RMC Supplier', href: '/best-ready-mix-concrete-supplier-in-raipur-what-to-look-for/' },
          { label: 'Weather Impact on Concrete', href: '/weather-impact-on-ready-mix-concrete/' },
          { label: 'Drying Shrinkage Cracks', href: '/drying-shrinkage-cracks-in-raipur/' },
        ],
      },
    ],
  },
  {
    label: 'About Us',
    href: '/trusted-concrete-supplier-in-raipur/',
    overview: { label: 'About SolidMix RMC', href: '/trusted-concrete-supplier-in-raipur/' },
    groups: [
      {
        links: [
          { label: 'Our Team', href: '/our-team/' },
        ],
      },
    ],
  },
  {
    label: 'Contact Us',
    href: '/ready-mix-concrete-contact-in-raipur/',
    overview: { label: 'Book Us', href: '/ready-mix-concrete-contact-in-raipur/' },
    groups: [
      {
        links: [
          { label: 'Careers', href: '/careers/' },
        ],
      },
    ],
  },
];

// Legal pages move out of the main menu into the footer.
export const footerLegal: NavLink[] = [
  { label: 'Privacy Policy', href: '/privacy-policy/' },
  { label: 'Legal Information', href: '/legal/' },
];

// Add these to `nav` ONLY after the page is built and returns 200:
//   Concrete FAQ            /concrete-faq/            (Guides & Blog > Topics)
//   Concrete Grades Guide   /concrete-grades-guide/   [needs confirmed grades]
