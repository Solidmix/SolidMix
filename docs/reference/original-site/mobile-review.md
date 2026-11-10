# Mobile Review — Original Site

Captured 2026-11-09 from https://solidmixrmc.com/ via Playwright (branch audit/original-site, GET/page-load only). Checked at mobile 375x812 (isMobile, hasTouch, DPR 2), tablet 768x1024, and desktop 1440x900 for each page: horizontal overflow, fixed/sticky elements, tap target size, small text, oversized images, console errors, and load time.

## Summary table

| Page | Overflow@375 | Overflow@768 | Small tap targets (375) | Small text (375) | Wide images (375) | Floating buttons | Load time (375) |
|---|---|---|---|---|---|---|---|
| 10mm-rod-weight-guide | no | no | 31 | 0 | 0 | 2 fixed/sticky el(s) | 16.2s |
| 12mm-rod-weight | no | no | 32 | 0 | 0 | 2 fixed/sticky el(s) | 16.4s |
| appointments | no | no | 31 | 0 | 0 | 2 fixed/sticky el(s) | 22.6s |
| author-admin-2 | FAILED TO LOAD |  |  |  |  |  |  |
| author-admin-2-page-2 | FAILED TO LOAD |  |  |  |  |  |  |
| author-admin-2-page-3 | FAILED TO LOAD |  |  |  |  |  |  |
| author-admin-2-page-4 | no | no | 35 | 0 | 0 | 2 fixed/sticky el(s) | 17.2s |
| best-concrete-supplier-raipur | no | no | 31 | 0 | 0 | 2 fixed/sticky el(s) | 22.6s |
| best-ready-mix-concrete-supplier-in-raipur-what-to-look-for | no | no | 33 | 0 | 0 | 2 fixed/sticky el(s) | 21.1s |
| home | no | no | 32 | 0 | 0 | 2 fixed/sticky el(s) | 17.1s |

## Top mobile problems

- 10mm-rod-weight-guide: 31 tap targets under 40x40px at 375px
- 10mm-rod-weight-guide: slow load at 375px (16.2s)
- 12mm-rod-weight: 32 tap targets under 40x40px at 375px
- 12mm-rod-weight: slow load at 375px (16.4s)
- appointments: 31 tap targets under 40x40px at 375px
- appointments: slow load at 375px (22.6s)
- author-admin-2-page-4: 35 tap targets under 40x40px at 375px
- author-admin-2-page-4: slow load at 375px (17.2s)
- best-concrete-supplier-raipur: 31 tap targets under 40x40px at 375px
- best-concrete-supplier-raipur: slow load at 375px (22.6s)
- best-ready-mix-concrete-supplier-in-raipur-what-to-look-for: 33 tap targets under 40x40px at 375px
- best-ready-mix-concrete-supplier-in-raipur-what-to-look-for: slow load at 375px (21.1s)
- home: 32 tap targets under 40x40px at 375px
- home: slow load at 375px (17.1s)

## Pages that failed to load during capture

- **author-admin-2** (https://solidmixrmc.com/author/admin-2/)
  - mobile: page.goto: net::ERR_ADDRESS_UNREACHABLE at https://solidmixrmc.com/author/admin-2/
  - tablet: page.goto: net::ERR_NETWORK_CHANGED at https://solidmixrmc.com/author/admin-2/
  - desktop: page.goto: net::ERR_INTERNET_DISCONNECTED at https://solidmixrmc.com/author/admin-2/
- **author-admin-2-page-2** (https://solidmixrmc.com/author/admin-2/page/2/)
  - mobile: page.goto: net::ERR_INTERNET_DISCONNECTED at https://solidmixrmc.com/author/admin-2/page/2/
  - tablet: page.goto: net::ERR_INTERNET_DISCONNECTED at https://solidmixrmc.com/author/admin-2/page/2/
  - desktop: page.goto: net::ERR_INTERNET_DISCONNECTED at https://solidmixrmc.com/author/admin-2/page/2/
- **author-admin-2-page-3** (https://solidmixrmc.com/author/admin-2/page/3/)
  - mobile: page.goto: net::ERR_INTERNET_DISCONNECTED at https://solidmixrmc.com/author/admin-2/page/3/
  - tablet: page.goto: net::ERR_INTERNET_DISCONNECTED at https://solidmixrmc.com/author/admin-2/page/3/
  - desktop: page.goto: net::ERR_NETWORK_CHANGED at https://solidmixrmc.com/author/admin-2/page/3/

## Floating and sticky elements

Elements with `position: fixed` or `position: sticky` detected 3s after load (collected across all pages; same element appears on every page it was found on):

### DIV.elementor-element elementor-element-76a505b e-con-full e-flex e-con e-parent e-lazyloaded elementor-sticky elementor-sti
- Text: "+91 9893111201
											
									
								
											

	"
- Link: tel:+919893111201
- Position: fixed, rect (mobile 375): top=0 left=0 right=375 bottom=73 (375x73px)
- Seen on 7 page(s) (e.g. 10mm-rod-weight-guide, 12mm-rod-weight, appointments, author-admin-2-page-4, best-concrete-supplier-raipur, ...)

### DIV.ht-ctc ht-ctc-chat ctc-analytics ctc_wp_mobile style-2 ht_ctc_entry_animation ht_ctc_an_entry_corner ht_ctc_animation no
- Text: "WhatsApp us"
- Link: none
- Position: fixed, rect (mobile 375): top=747 left=310 right=360 bottom=797 (50x50px)
- Seen on 7 page(s) (e.g. 10mm-rod-weight-guide, 12mm-rod-weight, appointments, author-admin-2-page-4, best-concrete-supplier-raipur, ...)

