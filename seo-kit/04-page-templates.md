# Page templates and starter content

Rule: use only facts the client has confirmed. Where a fact is missing the template says `[CONFIRM]`. Leave the line out of the page until it is confirmed; never publish the bracket.

## A. Product page template (12 pages under /ready-mix-concrete-in-raipur/)

```
H1: <Product name> in Raipur

[Direct answer, 1-2 sentences, first paragraph]
<Product name> is <plain definition>. SolidMix RMC supplies it in Raipur. [CONFIRM product facts]

[Facts box: short table, only confirmed rows]
Product | <name>
Typical uses | [CONFIRM]
Supplied in | Raipur [add areas only after confirmed]
How to order | Call <phone>, WhatsApp, or contact us
Contact | <NAP>

H2: What is <product name>?
2-3 short paragraphs. Plain words.

H2: Where is <product name> used?
Bulleted list of uses [CONFIRM]

H2: How do I order <product name> from SolidMix RMC?
1. Tell us the quantity and site location.
2. We confirm availability.
3. Schedule delivery.
(Edit to match the real process [CONFIRM])

[Button] Book Us   [Button] Use the Concrete Calculator

H2: Frequently asked questions
4-6 Q&As (see section E). Answers are real HTML. Same text in the FAQPage JSON-LD.

[Related products: 3 links]   [Back to all products link]
Breadcrumbs: Home > Ready Mix Concrete > <Product>
```

Internal links on every product page: up to the overview, across to 2-3 related products, and to Book Us, Calculator and FAQ (once built).

The place names in some product slugs (sarona, kumhari, kotni...) must not drive the page copy. The page is about Raipur; mention the place name only if the client confirms it is a real delivery area or plant location.

## B. Overview pages
Pages: `/ready-mix-concrete-in-raipur/`, `/rmc-services-in-raipur/`, `/our-work/`, `/concrete-blog-in-raipur/`.
H1 from the CSV. One intro paragraph that answers what the section is. Then a card per child page: name (link), one-sentence description, button. No thin pages: each card links to a real page.

## C. Contact page (/ready-mix-concrete-contact-in-raipur/)
H1 Contact SolidMix RMC in Raipur. NAP block (exact), click-to-call, WhatsApp, embedded Google Map of the plant, hours, form (name, phone, email, project location, message). JSON-LD: ContactPage + LocalBusiness.

## D. Contact / Book Us page
Book Us page: booking form (customer category, grade, plant and area, pump requirement, pour date, quantity, auto Lead ID), plant + delivery-area dropdowns, a map, address and number per plant, and the areas served per plant. Full spec: Phase 5C in `00-CLAUDE-BUILD-BRIEF.md`.

## E. Starter FAQ (generic, safe to publish after client approval)
Use for the home page and the planned `/concrete-faq/`. Group under H2s: Ordering, Grades and mixes, Delivery, Quality and testing. Answers in brackets need client facts; delete any question whose answer is unconfirmed.

**Ordering**
- What is ready mix concrete? Ready mix concrete is concrete mixed at a plant and delivered to your site in a transit mixer, ready to pour. SolidMix RMC supplies it in Raipur.
- How do I order ready mix concrete from SolidMix RMC? Call or WhatsApp us, or contact us, with your quantity, grade and site location. [CONFIRM process, advance notice]
- How much concrete do I need? Use our concrete calculator for slabs, beams and columns, or ask our team to estimate from your drawings.

**Grades and mixes**
- Which concrete grade do I need? It depends on the structure and the engineer's design. [CONFIRM grades offered. Resolve M5-M80 vs M20-M40 conflict first]
- Do you supply special mixes such as waterproof, fiber reinforced or self compacting concrete? Yes, see the product pages. [CONFIRM each]

**Delivery**
- Which areas of Raipur do you deliver to? [CONFIRM delivery areas]
- How long does delivery take? [CONFIRM]
- Do you provide a concrete pump? [CONFIRM]

**Quality and testing**
- How do you control concrete quality? [CONFIRM actual practices: batching, cube testing, lab]
- Can I get test certificates? [CONFIRM]

**Pricing and payment** (publish only if the client approves)
- How is ready mix concrete priced? Price depends on grade, quantity, distance and delivery timing. Contact us or call for a quote. [Do not state rates unless confirmed]

## F. Homepage structure
1. H1 + 2-sentence answer + Book Us, Call, WhatsApp buttons
2. Product groups (4 cards linking to products)
3. Why SolidMix (only confirmed claims, with proof: plant photo, certificates)
4. Projects strip (3 real projects)
5. How ordering works (3 steps)
6. Google reviews (real, linked to the profile)
7. FAQ (4-6, with JSON-LD)
8. Contact block with NAP and map

## G. Next.js notes
- Answer paragraph, facts box and FAQ must be in the server-rendered HTML. View Source must show them. Do not load them in `useEffect`.
- FAQ accordion: use `<details><summary>` or a button accordion that keeps the answer text in the HTML.
- Images: `next/image` with real `alt`, width and height set, `priority` only for the first image on a page.
- Fonts: Poppins through `next/font`, only the weights used.
- Do not hide content behind tabs that render only on click.
