# Book Us page: backend + data layer (seo-kit Phase 5B/5C)

Status: DRAFT — awaiting Saidul's approval before any code is written.

## Scope

Backend and data layer only, built exactly from `seo-kit/contact-form/`:
- `src/data/plants.ts`, `src/data/bookingOptions.ts`
- `src/lib/leadId.ts`, `src/lib/validateBooking.ts`, `src/lib/leadStore.ts`
- `src/app/api/book-us/route.ts`
- Convex: new `leads` table in `convex/schema.ts` + new `convex/leads.ts`
- Convex changes pushed to the **dev** deployment (`small-squid-55`) only, via `npx convex dev --once`. No production deploy.

Not in this step: the Book Us page UI (`page.tsx`, `BookUsForm.tsx`, `PlantCards.tsx`), menu changes, tracking, and — per Saidul's correction — the `/appointments/`, `/appointment/`, `/book-appointment/` redirects in `next.config.ts` and removal of the `/appointments/` page files. All of that moves to the frontend step. `next.config.ts` is not touched in this step.

## Ma'am's answers (2026-11-21), verbatim from the brief

- Plant 1 = Serikhedi (current plant), Plant 2 = Rawabhata (Bilaspur Highway, Kanhera), Plant 3 = Mana.
- Map links: Plant 1 `https://share.google/1Y3KuWNgpgKq1enJj`; Plant 2 `https://maps.app.goo.gl/ZKjqkmcANsNmWBva6?g_st=awb`; Plant 3 `https://share.google/yIhdI97P2jdAzZgnF`.
- Lead storage: Convex. Lead ID shown to the visitor on the confirmation state and stored in Convex.
- No email and no WhatsApp notification for now (a CRM will be connected later), so `notifyTeam` must not send anything.
- Grades M5 to M80 as in the kit. Pump label "Only dump (no pump)" exactly as in the kit.
- Remove `/appointments/` and redirect `/appointments/`, `/appointment/`, `/book-appointment/` to `/ready-mix-concrete-contact-in-raipur/` (old appointment records stay in Convex).
- Keep the Home page form and Careers form unchanged.
- Email to show: `info@solidmixrmc.com` (from the kit). Hours: only if the current site already shows them; otherwise leave out.

## Decisions (final — not open items)

1. **Plants/areas**: use `seo-kit/contact-form/src/data/plants.ts` exactly, unchanged, as the single source of truth. Ma'am's final client-confirmed Excel (2026-11-21) and the kit's `plants.ts` both list "Kandul" only under Plant 2 (Rawabhata), not Plant 1. The current site's `src/lib/areas.ts` dropdown — which does include Kandul under what would be Plant 1's groups — came from an older document (`docs/reference/service-areas.md`) and is **superseded** by the kit for the Book Us page. `src/lib/areas.ts` is untouched (it still drives the existing Home/Contact "Your Area" forms, which are out of scope — protected files).
2. **Map pins**: embed iframe by address text query using the kit's confirmed address for Plant 1 (Serikhedi) and Plant 3 (Mana); for Plant 2 (Rawabhata) use the resolved coordinate pair `21.339633,81.644060` (confirmed by curl against Ma'am's link, a real pin, not a Plus Code). The "Open in Google Maps" plain-text link under each card uses Ma'am's 3 links directly. Plus Code `5PJ6+FHJ` is never used anywhere. Saidul checks all three pins in a real browser before launch (not an open item for this build — a pre-launch human check, same as the kit's own README-PLACEMENT.md step 6 already requires).
3. **Contact details shown**: `info@solidmixrmc.com` only (the kit's confirmed address), no second email, no working-hours line. "24/7" and any other hours claim are removed from the Book Us page content per build-brief rule #4; this applies to the new Book Us content only, not to the existing contact page's "We Are Open 24*7" card or second email, which stay untouched in this step (protected files, content-lock, separate decision for the frontend step).
4. **Internal body links to `/appointments/`**: left as-is in the 10 content JSON files that reference them. They will resolve correctly once the 301 redirect is added in the frontend step; no content edit is made (content-lock rule — editing locked original copy is out of scope here).
5. **Lead storage**: Convex, new `leads` table, implemented this step. `notifyTeam` is a documented no-op.
6. **Redirects and `/appointments/` page removal**: NOT part of this step (Saidul's correction). `next.config.ts` is untouched here; the three redirects and deleting the `/appointments/` page files happen together in the frontend step.

## Convex design

### `convex/schema.ts` — new table (appended, nothing else touched)

```ts
leads: defineTable({
  // BookingInput fields (seo-kit/contact-form/src/lib/validateBooking.ts), all required ones
  // as plain v.string(), everything the kit marks optional as v.optional(v.string())/v.optional(v.number()).
  topic: v.string(),
  othersText: v.optional(v.string()),
  category: v.string(),
  grade: v.optional(v.string()),
  gradeText: v.optional(v.string()),
  plantId: v.string(),
  area: v.string(),
  siteLocation: v.optional(v.string()),
  lat: v.optional(v.number()),
  lng: v.optional(v.number()),
  pump: v.string(),
  quantity: v.optional(v.string()),
  pourDate: v.optional(v.string()),
  pourTime: v.optional(v.string()),
  name: v.string(),
  phone: v.string(),
  email: v.optional(v.string()),
  message: v.optional(v.string()),
  // StoredLead fields added by the route (seo-kit/contact-form/src/lib/leadStore.ts)
  leadId: v.string(),
  createdAt: v.string(), // ISO string, as the kit's route builds it (new Date().toISOString())
  sourcePage: v.string(),
})
  .index("by_leadId", ["leadId"])
  .index("by_phone_createdAt", ["phone", "createdAt"]),
```

Notes:
- `honeypot`/`website` field from `BookingInput` is never stored (the route already strips it via `validateBooking`'s `ok:false` "spam" path before a `StoredLead` exists).
- `createdAt` is stored as the ISO string the kit's route already builds, not `Date.now()` — keeps the stored record identical to what the kit computes, no reformatting.
- Two indexes: `by_leadId` for the uniqueness check the kit's `saveLead` contract requires, `by_phone_createdAt` for rate limiting in the same style as `convex/submissions.ts`'s `by_email_createdAt`.
- Existing tables (`enquiries`, `appointments`, `careerApplications`, team-dashboard tables, `posts`, `postRedirects`) are not modified.

### `convex/leads.ts` — new file, mirrors `convex/submissions.ts`'s pattern

```ts
export const saveLead = mutation({
  args: { /* every leads field above, as the equivalent v.* */ },
  handler: async (ctx, args): Promise<{ ok: true } | { ok: false; reason: string }> => {
    // rate limit: same style as isRateLimited() in submissions.ts, keyed on phone + by_phone_createdAt, 5 / 10 min
    // duplicate check: query by_leadId; if a row exists, return { ok: false, reason: "duplicate" } (never throw)
    // otherwise ctx.db.insert("leads", { ...args })
  },
});
```

`src/lib/leadStore.ts`'s `saveLead(lead)` calls this mutation via `getServerConvexClient()` (the existing helper in `src/lib/convexServer.ts`, read-only reuse, not modified) and returns `false` only when the mutation reports `reason: "duplicate"` — matching the kit's contract that the API route retries with a new Lead ID. Any other failure (rate limit, validation, network) throws, so the route's existing try/catch surfaces an error to the visitor instead of silently retrying forever.

**Honeypot stripping (Saidul's correction)**: the kit's `StoredLead` type is `BookingInput & { leadId; createdAt; sourcePage }`, and `BookingInput` includes `website` (the honeypot field). The `leads` Convex table has no `website` column and Convex mutation args are validated strictly, so sending `website` (or any other key not in the table) would make every call fail. `saveLead` in `leadStore.ts` builds the mutation's `args` object explicitly field-by-field (only the columns listed in the schema above), never a raw spread of the incoming `lead` object, so `website` and any future stray key are dropped before the call. `validateBooking`'s `clean()` returns `""` for empty optional strings rather than `undefined` — that is kept exactly as the kit produces it (an empty string, not omitted or null) since `v.optional(v.string())` accepts `""` fine; no reformatting of the kit's values.

`notifyTeam(lead, subject, body)` is an async no-op:
```ts
export async function notifyTeam(_lead: StoredLead, _subject: string, _body: string): Promise<void> {
  // No email/WhatsApp yet; a CRM will be connected later (Ma'am, 2026-11-21).
}
```

### `src/app/api/book-us/route.ts`

Copied from the kit unchanged except the import of `saveLead`/`notifyTeam` from `src/lib/leadStore.ts` (same signatures, same retry loop, same subject/body building — nothing in the route's logic changes).

## Push plan

`npx convex dev --once` pushes the new schema + `leads.ts` to the dev deployment only (`.env.local`'s dev key → `small-squid-55`, confirmed in the command output, not printed verbatim if it contains any token). No `npx convex deploy`, no `npx convex env`, no login/logout.

## Protected / untouched in this step

`src/app/**` pages, `src/components/**`, `src/content/**`, `src/lib/enquiry.ts`, `src/lib/blogData.ts`, `src/lib/convexServer.ts`, `convex/submissions.ts`, `convex/posts.ts`, `convex/gallery.ts`, `convex/auth*.ts`, `next.config.ts` (redirects move to the frontend step per Saidul's correction — not touched here), `package.json`, `.env.local`, `.local-tools/`, `seo-kit/` (read-only reference).

## Open items

1. **Grade list wording** (M5–M80 in the kit/this form) vs. other existing pages on the site that still say "M20 to M40" — a pre-existing site-wide inconsistency, out of scope for this build step.
2. **Browser pin check**: Plant 1 and Plant 3's `share.google` links need a real browser to resolve to a final place/coordinates (confirmed not resolvable via `curl` in the earlier audit). Saidul checks this before launch, per the kit's own README-PLACEMENT.md step 6.

## Build 2 (frontend) — approved 2026-11-22

Scope: the Book Us page UI (Phase 5B/5C), restyled to the current site, plus `/appointments/` removal with redirects. Backend/data layer (Build 1) is untouched here except where explicitly listed.

### Decisions

1. Copy `seo-kit/contact-form/src/components/book-us/BookUsForm.tsx` and `PlantCards.tsx` to `src/components/book-us/`. Keep every field, label, option, helper text, status line, validation message, the "Use my location" behaviour, the honeypot, the Lead ID confirmation state and the `dataLayer` push exactly as the kit has them. ONLY change styling: replace `neutral-*` classes and raw hex with our theme tokens (`primary`, `secondary`, `ink`, `grey-line`, `grey-2`, `tint-pink`, `tint-cyan`) and match the look of `src/components/forms/ContactForm.tsx` (inputs, labels, submit button `bg-secondary`, rounded, spacing). Keep tap targets ≥44px and `aria-live` errors.
2. `PlantCards`: map iframe `src` built from `plant.mapQuery` (lazy-loaded, `title` set), "Open in Google Maps" link = `plant.mapLink`. Areas as real HTML lists by `areaGroups`. No distances or delivery times.
3. `src/app/ready-mix-concrete-contact-in-raipur/page.tsx`: keep the URL. Use the existing `PageHero` (H1 exactly "Contact SolidMix RMC in Raipur" per kit/`01-seo-meta.csv`) with breadcrumb. Then in the kit's order: answer-first line + Call/WhatsApp buttons (kit text), `BookUsForm`, `PlantCards`, the kit's 2 FAQs (visible text = `FAQPage` JSON-LD, answers in server HTML — reusing `FaqAccordion` since its answers render server-side under a `hidden` attribute, not via `useEffect`), JSON-LD exactly as the kit page builds it (`ContactPage`, `BreadcrumbList`, `FAQPage`, one `LocalBusiness` per plant with `parentOrganization` `https://solidmixrmc.com/#organization`) via the existing `JsonLd` component. Metadata title/description from the `01-seo-meta.csv` contact row (base title only, so the root template's single brand suffix fixes the existing duplicated-brand bug).
4. Merge rule (kit: "if this URL already exists, merge into it"): after the kit sections, keep the existing office-address card, office map, second phone (+91 9111109642), and the CEO video exactly as they are now. Remove: the old `ContactForm`, the "Working Hour / We Are Open 24*7" card, the `support@solidmixrmc.com` email (show only `info@solidmixrmc.com`, using `site.emails[0]` the same way `Footer`/`TopBar` already do — no edit to `src/content/site.ts`'s `emails` array itself), and the old single plant-address card + old plant map iframe (replaced by `PlantCards`). `src/content` JSON is not edited.
5. `/appointments/` removal: delete `src/app/appointments/page.tsx`, `src/components/forms/AppointmentForm.tsx`, `src/content/pages/appointments.json` and its `src/content/index.json` entry; add permanent redirects in `next.config.ts` (`/appointments/`, `/appointment/`, `/book-appointment/` → `/ready-mix-concrete-contact-in-raipur/`, single hop, existing redirects kept); remove `/appointments/` from `src/app/sitemap.ts`, `public/llms.txt`, the revalidate allow-list in `src/app/api/revalidate-blog/route.ts`, and the path lists in `PostEditor.tsx`/`BlogTab.tsx`. In `src/content/site.ts`'s Contact Us dropdown, remove the "Appointments" item (dropdown becomes Book Us + Careers). `convex/` stays untouched — the `appointments` table and `submitAppointment` mutation remain for the historical records.
6. `tsconfig.json`: add `"seo-kit"` to `exclude` so the read-only kit's own reference files (which import components that don't exist as `seo-kit`'s own paths) are not type-checked as part of this build. Nothing else in `tsconfig.json` changes.
7. `docs/BUILD-LOG.md` created: what was built, these decisions (incl. the merge rule and kept office/video section), and "Waiting for client": grade list M5–M80 vs M20–M40 elsewhere, browser pin check for all 3 plants, confirm the kept office/video section is wanted.

### Map embed logic (clarifying decision 2 against Build 1's data)

`plant.mapQuery` for Plant 1/3 is a plain address string (Build 1); for Plant 2 it's the resolved coordinate pair `21.339633,81.644060`. `PlantCards` detects a coordinate-shaped string and embeds it directly (`q=<lat,lng>`); otherwise it prepends `SolidMix RMC ` to the address text before the `output=embed` query, exactly as the kit's own `mapQuery()` helper did — only the source of the string moves from a hardcoded `p.address` to the new `p.mapQuery` field.
