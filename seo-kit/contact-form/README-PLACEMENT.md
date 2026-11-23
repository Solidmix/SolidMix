# Book Us form: what goes where

This folder holds the working code for the Book Us page (the contact page). It has no separate Appointments page and no separate Areas We Serve page: the plants and areas are on this one page.

## 1. Copy the files (paths match the repo's `src/` folder)

| From `contact-form/` | To the repo | What it is |
|---|---|---|
| `src/data/plants.ts` | `src/data/plants.ts` | Three plants, addresses, phone, areas by group (client-confirmed 2026-11-21). Generated from `plants.template.json`. |
| `src/data/bookingOptions.ts` | `src/data/bookingOptions.ts` | Every dropdown list in one place. |
| `src/lib/leadId.ts` | `src/lib/leadId.ts` | Makes Lead IDs like `SM-261121-A4F9`. |
| `src/lib/validateBooking.ts` | `src/lib/validateBooking.ts` | Server-side check of every field. |
| `src/lib/leadStore.ts` | `src/lib/leadStore.ts` | **Stub. Needs step 4.** |
| `src/app/api/book-us/route.ts` | `src/app/api/book-us/route.ts` | Receives the form, saves the lead, sends the notification. |
| `src/components/book-us/BookUsForm.tsx` | same path | The form (client component). |
| `src/components/book-us/PlantCards.tsx` | same path | Plant cards: address, phone, map, area lists. |
| `src/app/ready-mix-concrete-contact-in-raipur/page.tsx` | same path | The Book Us page. If this URL already exists, merge into it and keep the URL. |

The `@/` import alias must point at `src/`. If the repo has no `src/` folder, adjust the paths and the alias.

## 2. Page layout (top to bottom)
1. Breadcrumb, H1, one-line answer, Call and WhatsApp buttons.
2. Booking form.
3. Plant cards (name, address as confirmed, phone, map, areas by group).
4. Small FAQ (visible text equals the JSON-LD).
5. JSON-LD: ContactPage, BreadcrumbList, FAQPage, one LocalBusiness per plant.

Client decisions (2026-11-23):
- The CEO video section STAYS on the Book Us page. Do not remove it. Keep it below the FAQ.
- Required fields (marked * on the form): Your name, Mobile number, What is this about?, I am a, Grade, Pump needed?, Nearest plant. Also required when they apply: Delivery area (once a plant is chosen), Site location (plant "Not sure" or area "Other"), "Tell us what you expect" (Others), "Write the grade you need" (Other grade). Everything else is optional.
- Field labels: "I am a" (not "Customer category") and "Pump needed?" (not "Pump requirement").

## 3. Menu and links
- Contact Us dropdown: "Book Us" (this page) and "Careers" (`/careers/`). The header button and the mobile bar say "Book Us" and link here.
- Add the redirects in `03-redirects.md`: `/appointments/`, `/appointment/`, `/book-appointment/` go to this page with a 301.
- Add the page to `sitemap.ts`. The title and description come from `01-seo-meta.csv`.

## 4. The lead store (decided 2026-11-23)
`src/lib/leadStore.ts` has two empty functions, `saveLead` and `notifyTeam`. The form will not work until they are filled.
- Client decision: enquiries go to the CRM being built, and into the database the developer has already built. Write each lead to that database (the CRM reads from it). Do not add a new service.
- Send every field the form collects, including Lead ID, plant, area, pump, grade, category, organisation and designation.
- If the CRM needs a different shape or an API call, ask the human before inventing one.
- `saveLead` must return `false` (not throw) if the Lead ID already exists. The route retries with a new ID.
- The email subject is already built as `Lead ID | Plant | Topic | Pump`. Put keys in environment variables only.

## 5. Rules built into the form (do not remove)
- No promises: the status line only says the area is "on our served list" or "We'll check this location". No delivery times, charges or distances anywhere.
- "Use my location" asks the browser only when the visitor presses it. If allowed, the coordinates travel with the lead. It does NOT pick a plant (plant coordinates are not confirmed). If refused, the form still works.
- The honeypot field `website` must stay hidden and empty.
- The dataLayer event `generate_lead` carries the Lead ID and plain choices. No name, phone or email. The Lead ID never goes in a URL.

## 6. Check before saying it is done
1. Choose Others: the "Tell us what you expect" box appears, is required (10+ characters), and the grade field is hidden.
2. Choose Ready Mix Concrete, grade "Other grade": a required text box appears.
3. Pick each plant: the area list changes to that plant's groups. Pick "Other area": the site location becomes required.
4. Press "Use my location" and deny it: the form still submits.
5. Submit a test lead: the confirmation shows a Lead ID, the same ID is in the stored lead and in the email subject, and `generate_lead` appears in GTM preview without personal data.
6. Open each map. Plant 3 must show the right place. Do NOT use Plus Code `5PJ6+FHJ`. Note any problem in `BUILD-LOG.md`.
7. Google Rich Results Test shows no errors on the page. Phone width: no sideways scroll, tap targets 44px.

## 7. Still waiting for the client (do not guess)
- Grade list: client confirmed M5 to M80 plus a custom grade for the form (2026-11-23). Steps of 5 are still assumed. The website pages still say M20 to M40, so do not publish a grade range on product pages yet.
- Plants 2 and 3 have area-only addresses; get full addresses and plant coordinates.
- Email address and hours for the page.
