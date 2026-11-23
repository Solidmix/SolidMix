# Tracking (GA4 + GTM) for Next.js

Needs from client: GA4 property, GTM container, Search Console access, Meta pixel ID. Replace `GTM-REPLACE`, `G-REPLACE`.

## Install GTM once (App Router)
```tsx
// app/layout.tsx
import Script from 'next/script';

const GTM = process.env.NEXT_PUBLIC_GTM_ID; // set in Vercel > Settings > Environment Variables (Production only)

// inside <html><head> or top of <body>
{GTM && (
  <Script id="gtm" strategy="afterInteractive">
    {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM}');`}
  </Script>
)}
// right after <body>:
{GTM && (<noscript><iframe src={`https://www.googletagmanager.com/ns.html?id=${GTM}`} height="0" width="0" style={{display:'none',visibility:'hidden'}} /></noscript>)}
```
(`@next/third-parties/google` `GoogleTagManager` is an equally good option.) Install only once; no second GA tag.

Single-page navigation: GTM's built-in **History Change** trigger fires page views on client-side route changes. Use it for the GA4 page_view tag, or Next.js route changes will be missed.

## Events

| Event name | Trigger | Key event |
|---|---|---|
| `generate_lead` | Contact / Book Us form submitted successfully | Yes |
| `contact_form_submit` | Contact form submitted successfully | Yes |
| `phone_click` | Click on `a[href^="tel:"]` | Yes |
| `whatsapp_click` | Click on a link containing `wa.me` | Yes |
| `book_us_click` | Click on the Book Us button (header, mobile bar) | No |
| `calculator_used` | Calculator "Calculate" pressed | No |
| `file_download` | Click on a `.pdf` link (brochure) | No |

## GTM triggers
- Click: Click URL starts with `tel:`; contains `wa.me`; click text is "Book Us"; ends with `.pdf`.
- Forms: do **not** rely on a thank-you URL. Push a dataLayer event from the form's success handler:

```tsx
// after the API/form call succeeds
window.dataLayer = window.dataLayer || [];
window.dataLayer.push({ event: 'generate_lead', form_name: 'book_us', lead_id, customer_category, pump_requirement, plant, delivery_area });
```
```tsx
// calculator button handler
window.dataLayer.push({ event: 'calculator_used', calc_shape: shape });
```
Add a custom-event trigger in GTM for each event name above, then a GA4 event tag per trigger.

## Test
GTM Preview + GA4 DebugView on the **production domain** (or a preview URL with the GTM env var set): fire each event once, confirm it appears, mark key events in GA4 Admin > Events. Link GA4 to Search Console. Verify the Meta pixel with Pixel Helper. Do not count test submissions: use a test phone number and filter internal traffic.
