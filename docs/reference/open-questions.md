# Open Questions (for the client)

1. Correct office address (Lalganga Business Park, Pachpedi Naka vs Serikhedi) and PIN (492001 vs 492101)?
2. Grades M15-M40 or M20-M40?
3. Keep both phone numbers 9893111201 and 9111109642?
4. Calculator: volume only or also cost?
5. Where should contact form enquiries go (email, WhatsApp, Google Sheet)?
6. Domain migration to solidmixrmc.com: later, after Ma'am's approval (needs DNS access then).
7. Area-list questions (from docs/reference/service-areas.md):
   - "Tilda", "Tilda-Neora" and "Neora": keep all three or merge?
   - Add an "Other area" option at the end (proposed: yes).

## Decisions (Saidul, 2026-11-10)
1. Forms: frontend only for now. "Send" opens WhatsApp +91 9893111201 with the enquiry pre-filled. Email delivery (Resend) only after Ma'am's approval.
2. Concrete grades: keep the wording exactly as on the original site.
3. Second phone number +91 9111109642: keep it.
4. Domain: not now. The new site stays on its own Vercel review URL (noindex); going live on solidmixrmc.com only after Ma'am's approval.
5. Service areas: every group in docs/reference/service-areas.md is in the Contact and Home "Your Area" dropdown (including Beyond 40 km and Additional areas), Simga listed once, Tilda / Tilda-Neora / Neora kept as separate entries, plus an "Other area" option with a free-text field.
