import { site } from "@/content/site";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../convex/_generated/api";

// Central enquiry submission. For this phase it opens WhatsApp with a
// pre-filled message; it can later be swapped for an email service (Resend)
// without changing the forms that call it.
export function sendEnquiry(formName: string, pagePath: string, fields: Record<string, string>) {
  const lines = Object.entries(fields)
    .filter(([, value]) => value && value.trim().length > 0)
    .map(([label, value]) => `${label}: ${value.trim()}`);
  const text = encodeURIComponent(
    `New ${formName} enquiry from ${pagePath}\n\n${lines.join("\n")}`,
  );
  const url = `https://wa.me/${site.whatsappNumber}?text=${text}`;
  window.open(url, "_blank", "noopener,noreferrer");
}

type EnquirySubmission = {
  source: "contact" | "home";
  name?: string;
  email: string;
  phone?: string;
  area: string;
  otherArea?: string;
  message?: string;
  page: string;
  honeypot?: string;
};

type AppointmentSubmission = {
  firstName?: string;
  lastName?: string;
  email: string;
  mobile?: string;
  date?: string;
  time?: string;
  topic: string;
  page: string;
  honeypot?: string;
};

type CareerSubmission = {
  firstName?: string;
  lastName?: string;
  email: string;
  subject?: string;
  resumeFileName?: string;
  comments?: string;
  page: string;
  honeypot?: string;
};

// Fire-and-forget save to Convex, run in the background after sendEnquiry
// opens WhatsApp. Never awaited by the caller, so a missing URL or a failed
// request never blocks or delays the WhatsApp flow. No personal data logged.
export function saveSubmission(kind: "enquiry", data: EnquirySubmission): void;
export function saveSubmission(kind: "appointment", data: AppointmentSubmission): void;
export function saveSubmission(kind: "career", data: CareerSubmission): void;
export function saveSubmission(
  kind: "enquiry" | "appointment" | "career",
  data: EnquirySubmission | AppointmentSubmission | CareerSubmission,
): void {
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!convexUrl) return;

  const client = new ConvexHttpClient(convexUrl);
  let promise: Promise<unknown>;
  if (kind === "enquiry") {
    promise = client.mutation(api.submissions.submitEnquiry, data as EnquirySubmission);
  } else if (kind === "appointment") {
    promise = client.mutation(api.submissions.submitAppointment, data as AppointmentSubmission);
  } else {
    promise = client.mutation(api.submissions.submitCareerApplication, data as CareerSubmission);
  }
  promise.catch(() => {
    console.warn("saveSubmission: Convex save failed");
  });
}

// Hidden field name every form includes as a honeypot. Bots tend to fill
// every input; a non-empty value here means the submit is silently dropped.
export const HONEYPOT_FIELD = "website_url";

export function isHoneypotFilled(value: string): boolean {
  return value.trim().length > 0;
}

export function validateRequired(value: string): string | undefined {
  return value.trim().length === 0 ? "This field is required." : undefined;
}

export function validateEmail(value: string, required: boolean): string | undefined {
  if (!value.trim()) return required ? "Email is required." : undefined;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()) ? undefined : "Enter a valid email address.";
}

// 10-digit Indian mobile number, optional leading +91/0.
const INDIAN_MOBILE_RE = /^(?:\+91|0)?[6-9]\d{9}$/;

export function validateIndianMobile(value: string, required: boolean): string | undefined {
  const digits = value.trim();
  if (!digits) return required ? "Contact number is required." : undefined;
  return INDIAN_MOBILE_RE.test(digits.replace(/[\s-]/g, ""))
    ? undefined
    : "Enter a valid 10-digit Indian mobile number.";
}
