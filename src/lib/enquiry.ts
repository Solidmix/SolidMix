import { site } from "@/content/site";

// Central enquiry submission. For this phase it opens WhatsApp with a
// pre-filled message; it can later be swapped for an email service (Resend)
// without changing the forms that call it.
export function sendEnquiry(fields: Record<string, string>) {
  const lines = Object.entries(fields)
    .filter(([, value]) => value && value.trim().length > 0)
    .map(([label, value]) => `${label}: ${value.trim()}`);
  const text = encodeURIComponent(`New enquiry from the website\n\n${lines.join("\n")}`);
  const url = `https://wa.me/${site.whatsappNumber}?text=${text}`;
  window.open(url, "_blank", "noopener,noreferrer");
}
