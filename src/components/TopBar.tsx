import { site } from "@/content/site";
import { SocialIcons } from "./SocialIcons";

export function TopBar() {
  return (
    <div className="hidden bg-primary text-white lg:block">
      <div className="container-content flex h-10 items-center justify-between gap-4">
        <div className="flex items-center gap-5 text-sm">
          <a href={site.phoneHref} className="flex items-center gap-2 hover:underline">
            <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor" aria-hidden="true">
              <path d="M6.6 10.8a15.6 15.6 0 0 0 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.4.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1A17 17 0 0 1 3 4c0-.6.4-1 1-1h3.4c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.4 0 .8-.3 1l-2.1 2.2Z" />
            </svg>
            {site.phoneDisplay}
          </a>
          <span className="opacity-50">|</span>
          <a href={site.emails[0].href} className="flex items-center gap-2 hover:underline">
            <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor" aria-hidden="true">
              <path d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Zm0 4-8 5-8-5V6l8 5 8-5v2Z" />
            </svg>
            {site.emails[0].display}
          </a>
        </div>
        <SocialIcons linkClassName="text-white/90 hover:text-white transition-colors" />
      </div>
    </div>
  );
}
