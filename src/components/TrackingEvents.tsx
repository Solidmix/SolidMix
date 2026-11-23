"use client";

import { useEffect } from "react";
import { pushEvent } from "@/lib/track";

// Single delegated click listener for tel:/wa.me/.pdf links anywhere on the
// page (seo-kit/05-tracking.md). `location` comes from the nearest ancestor
// with data-track-location (set on <header> and MobileActionBar); anywhere
// else it falls back to "page".
export function TrackingEvents() {
  useEffect(() => {
    function onClick(e: MouseEvent) {
      const target = e.target as Element | null;
      const anchor = target?.closest("a[href]") as HTMLAnchorElement | null;
      if (!anchor) return;
      const href = anchor.getAttribute("href") || "";
      const location = (anchor.closest("[data-track-location]") as HTMLElement | null)
        ?.getAttribute("data-track-location") || "page";

      if (href.startsWith("tel:")) {
        pushEvent("phone_click", { link_url: href, location });
      } else if (href.includes("wa.me")) {
        pushEvent("whatsapp_click", { link_url: href, location });
      } else if (href.toLowerCase().endsWith(".pdf")) {
        pushEvent("file_download", { link_url: href, location });
      }
    }
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return null;
}
