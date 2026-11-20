SolidMix forms backend (Convex), approved by Saidul 2026-11-20.
Goal: every customer form submission is saved in Convex. Customer experience does not change: same fields, same wording, same WhatsApp flow.
Forms: Contact (/ready-mix-concrete-contact-in-raipur/), Home contact (/), Appointment (/appointments/), Careers (/careers/). Not included: Calculator, Blog search.
Tables: enquiries (Contact + Home, field source: "contact" | "home"), appointments, careerApplications. Every row stores page path and createdAt.
Flow: on submit, client validation as today, then WhatsApp opens immediately (same as today), and the Convex save runs in the background without blocking. If the save fails or Convex URL is missing, the customer still gets WhatsApp and the same success text. No await before window.open (popup blockers).
Server checks: honeypot filled = silently ignore (return ok, save nothing); trim all strings; max lengths; email format; phone characters/length; rate limit max 5 submissions per email per 10 minutes per table.
Careers: store resume file NAME only (no file upload in this phase).
Leads are viewed in the Convex dashboard (Data tab). No admin page, no email notification in this phase (Resend waits for Ma'am's approval).
