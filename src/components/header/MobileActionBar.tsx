'use client';

import Link from 'next/link';
import { cta, site } from '@/data/navigation';
import { pushEvent } from '@/lib/track';

// Sticky bottom bar on phones only: Call / WhatsApp / Book Us.
// Colours are the site's existing primary/secondary tokens (no new palette);
// rendered once in app/layout.tsx, just before </body>, with `pb-16 lg:pb-0`
// on <body> so it never covers the footer.
export default function MobileActionBar() {
  return (
    <div
      data-track-location="mobile_bar"
      className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-3 border-t border-grey-line bg-white shadow-[0_-2px_8px_rgba(0,0,0,0.08)] lg:hidden"
    >
      <a href={site.phoneHref} className="flex min-h-[56px] items-center justify-center text-[14px] font-semibold text-primary">
        Call
      </a>
      <a
        href={site.whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        className="flex min-h-[56px] items-center justify-center border-x border-grey-line text-[14px] font-semibold text-secondary"
      >
        WhatsApp
      </a>
      <Link
        href={cta.href}
        onClick={() => pushEvent('book_us_click', { location: 'mobile_bar' })}
        className="flex min-h-[56px] items-center justify-center bg-primary text-[14px] font-semibold text-white"
      >
        {cta.label}
      </Link>
    </div>
  );
}
