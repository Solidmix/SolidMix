# Design Tokens — Original Site

Captured 2026-11-09 from https://solidmixrmc.com/ CSS + HTML (GET-only). Platform detected: **WordPress + Elementor** page builder (Elementor global-color CSS variables present; per-post `post-XXXX.css` files; `frontend.min.css`, `e-swiper`, `e-gallery`, `motion-fx` Elementor assets). SEO plugin: **Rank Math** (sitemap XSL + schema). Fonts self-hosted via a `poppins.css` file.

## Brand colors (from Elementor global color variables)

| Token | Hex | Role / where used |
|---|---|---|
| Primary | `#9F1481` | Elementor `--e-global-color-primary` — brand magenta/purple (headings, accents, buttons) |
| Secondary | `#167484` | Elementor `--e-global-color-secondary` — teal (secondary accents) |
| Text | `#292929` | Elementor `--e-global-color-text` — body text near-black |
| Accent | `#FFFFFF` | Elementor `--e-global-color-accent` — white |

Other hex values seen in page CSS (likely section backgrounds / decorative): `#FF00C8` (bright pink), `#FFD7F6` (pale pink), `#DFF9FD` / `#F1FCFF` (pale cyan), `#0E0E0E` / `#000000` (dark), `#616161` / `#a5a5a5` (grey), `#FFBC7D` (peach), `#DAD8D8` (light grey). The dominant pair is magenta `#9F1481` + teal `#167484` on white.

## Typography

- **Font family:** `Poppins`, Sans-serif — used everywhere (491 `font-family:"Poppins", Sans-serif` declarations). All Elementor global typography vars resolve to Poppins.
- **Loaded from:** self-hosted `poppins.css` (served from the theme/Elementor, not Google Fonts CDN).
- **Weights available:** 100, 200, 300, 400, 500, 600, 700, 800, 900 (full family loaded).
- Icon fonts: `eicons` (Elementor icons), `swiper-icons`.
- H1–H6 / body / button sizes are set per-element inside Elementor `post-XXXX.css` (no single global scale in a theme stylesheet); the replica should establish a clean typographic scale rather than copy per-widget sizes. H1 on most pages is the page title string.

## Layout

- **Container max-width:** dominant value `1024px` (37 declarations); some sections use `1140px`, `1050px`, or `1380px`. Treat ~1024–1140px as the content container target.
- **Breakpoints found in media queries:** `479px`, `576px`, `767px`, `768px`, `992px`, `1024px`, `1025px` (standard Elementor set: mobile ≤767, tablet 768–1024, desktop ≥1025). A `99999px` max-width appears (Elementor's "no upper bound" sentinel).

## Header

Top-to-bottom:
1. **Top bar:** phone `+91 9893111201` (`tel:+919893111201`), email `info@solidmixrmc.com` (`mailto:`), and social links — Facebook, YouTube, Instagram, LinkedIn.
2. **Logo:** SolidMix logo (`wp-content/uploads/.../Solidmix-Logo-...webp`).
3. **Main menu (in order):** Home · About Us · Our Team · **Products** (dropdown) · Our Services · Our Work · Calculator · Safety · Blogs · Gallery · Contact Us · Appointments · Careers · Legal · Privacy Policy.
   - **Products submenu (in order):** Standard Concrete, Steel Fiber Concrete, PP Fiber Concrete, Waterproof Concrete, Heat Resistant Concrete, Stamped Concrete, Bagged Concrete, Permeable Concrete, Eco Friendly Concrete, Lightweight Concrete, Self Compacting Concrete, High Strength Concrete. (All under `/ready-mix-concrete-in-raipur/...`.)
   - Note: menu "About Us" -> `/trusted-concrete-supplier-in-raipur/`; "Products" parent -> `/ready-mix-concrete-in-raipur/`; "Our Services" -> `/rmc-services-in-raipur/`; "Blogs" -> `/concrete-blog-in-raipur/`; "Contact Us" -> `/ready-mix-concrete-contact-in-raipur/`.

### Header menu target URLs
| Label | URL |
|---|---|
| Home | https://solidmixrmc.com/ |
| About Us | https://solidmixrmc.com/trusted-concrete-supplier-in-raipur/ |
| Our Team | https://solidmixrmc.com/our-team/ |
| Products (parent) | https://solidmixrmc.com/ready-mix-concrete-in-raipur/ |
| Our Services | https://solidmixrmc.com/rmc-services-in-raipur/ |
| Our Work | https://solidmixrmc.com/our-work/ |
| Calculator | https://solidmixrmc.com/calculator/ |
| Safety | https://solidmixrmc.com/safety/ |
| Blogs | https://solidmixrmc.com/concrete-blog-in-raipur/ |
| Gallery | https://solidmixrmc.com/rmc-gallery-in-raipur/ |
| Contact Us | https://solidmixrmc.com/ready-mix-concrete-contact-in-raipur/ |
| Appointments | https://solidmixrmc.com/appointments/ |
| Careers | https://solidmixrmc.com/careers/ |
| Legal | https://solidmixrmc.com/legal/ |
| Privacy Policy | https://solidmixrmc.com/privacy-policy/ |

## Footer

- **Columns:** "Useful Links", "Phone Number", "Email Address", "Office Address", "Plant Address".
  - Phone: `+91 9893111201`
  - Email: `info@solidmixrmc.com`
  - Office Address: Lalganga Business Park, Pachpedi Naka, Raipur, C.G. 492001
  - Plant Address: PH No. 77, Khasra No. 365/5, Serikhedi, Raipur, Chhattisgarh – 492101
- **Socials:** Facebook, YouTube, Instagram, LinkedIn (same as top bar).
- **Copyright:** `Copyright © 2025, All rights reserved`.

## Floating buttons

Verified by rendering the homepage in a real browser (Playwright) and inspecting the DOM/inline JS — the floating button IS present in the server HTML, it was just easy to miss by text-search alone because it's injected near the end of the body:

- **Plugin:** "Click to Chat" by HoliThemes (`ht-ctc`, v4.46 — HTML comment `<!-- Click to Chat - https://holithemes.com/plugins/click-to-chat/ v4.46 -->`).
- **Type:** WhatsApp chat button only. **No separate floating call button exists** — the phone number as a tap-to-call link (`tel:+919893111201`) appears only in the sticky top bar/header, not as a second floating widget.
- **Number:** `919893111201` (confirmed from inline config `ht_ctc_chat_var = {"number":"919893111201", ...}` and from the widget's `data-settings` JSON `{"number":"919893111201", ...}`).
- **Position (both desktop and mobile — identical):** `position: fixed; bottom: 15px; right: 15px;` (`pos_d` and `pos_m` in the JS config are the same string). Side: `right` for both. Confirmed live at mobile 375×812: button occupies roughly x=310–360, y=747–797 (50×50px), i.e. pinned to the bottom-right corner above the viewport edge.
- **Style/markup:** `class="ht-ctc ht-ctc-chat ctc-analytics style-2 ht_ctc_entry_animation ht_ctc_an_entry_corner"`, `id="ht-ctc-chat"`. Renders as a 50×50px circular WhatsApp-green (`#25D366`) icon button (white WhatsApp glyph SVG with a green gradient fill `#61fd7d → #2bb826`); an optional "WhatsApp us" text pill (`ht-ctc-cta`, background `#25D366`, white text, `border-radius:10px`) can appear beside it on hover/desktop but is `display:none` by default on this site.
- **Entry animation:** CSS class `ht_ctc_an_entry_corner` (slides/settles in from the corner on load) — the plugin's own JS-level animation flag (`ani`) is set to `"no-animation"`, so there is no extra JS entrance animation beyond this CSS corner-entry class.
- **Device variant classes:** the static HTML ships the `ctc_wp_desktop` class; the plugin's own JS swaps it to `ctc_wp_mobile` at runtime based on viewport/device — both variants share the same fixed bottom-right position and size.
- **Behavior:** `dis_m`/`dis_d` both `"show"` (visible on mobile and desktop), opens WhatsApp with `url_target_d: "_blank"`, no scheduled hide (`schedule: "no"`), tracked via GA/GTM/Facebook Pixel events ("Click to Chat").
- **Replica guidance:** add one floating WhatsApp button, fixed bottom-right (15px/15px inset) on both mobile and desktop, number `+91 9893111201`, no separate call button needed to match the original — though a call button may still be a worthwhile UX improvement for the replica if Ma'am wants one added later.

## Maps / embeds

- Plant map embed: `https://maps.google.com/maps?q=%20Serikhedi%20Chhattisgarh&...&output=embed`
- Office map embed: `https://maps.google.com/maps?q=Lalganga%20Business%20Park%20Raipur...Pachpedi%20Naka...492001&...&output=embed`

## Contact form (Elementor form)

Fields captured on `/ready-mix-concrete-contact-in-raipur/`:
| Field | name | type | required |
|---|---|---|---|
| Name | `form_fields[name]` | text | no |
| Email | `form_fields[email]` | email | yes |
| Contact No. | `form_fields[field_3083ce8]` | tel | yes |
| Message | `form_fields[message]` | textarea | no |
Submit button label: **Send**. Plus hidden Elementor fields (`post_id`, `form_id`, `referer_title`, `queried_id`).

**No "your area" field exists** — this confirms the requested area dropdown must be ADDED in the replica.

## Assets note

- All brand images are `.webp` (plus some `.jpeg`/`.png`) under `wp-content/uploads/`.
- One brochure PDF (`Brochure_Solidmix-2-1.pdf`, ~19.9 MB) exceeded the original 15 MB cap; it has now been downloaded (cap raised to 50 MB for this one file, with approval) to `assets/Brochure_Solidmix-2-1.pdf`. A smaller `Solidmix-8.5-x-11-in-5_compressed.pdf` is also present.
