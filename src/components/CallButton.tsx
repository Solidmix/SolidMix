import { site } from "@/content/site";

// Mobile-only quick-call button, stacked above the WhatsApp button (<=767px).
export function CallButton() {
  return (
    <a
      href={site.phoneHref}
      aria-label="Call SolidMix RMC"
      className="fixed bottom-[75px] right-[15px] z-[90] flex h-[50px] w-[50px] items-center justify-center rounded-full bg-secondary text-white shadow-lg transition-transform hover:scale-105 md:hidden"
    >
      <svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor" aria-hidden="true">
        <path d="M6.6 10.8a15.6 15.6 0 0 0 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.4.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1A17 17 0 0 1 3 4c0-.6.4-1 1-1h3.4c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.4 0 .8-.3 1l-2.1 2.2Z" />
      </svg>
    </a>
  );
}
