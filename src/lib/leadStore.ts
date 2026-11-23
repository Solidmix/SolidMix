import type { BookingInput } from './validateBooking';
import { getServerConvexClient } from './convexServer';
import { api } from '../../convex/_generated/api';

// Implements the two stubs from seo-kit/contact-form/src/lib/leadStore.ts
// (README-PLACEMENT.md step 4) against the leads table in convex/schema.ts
// and the convex/leads.saveLead mutation. See
// docs/superpowers/specs/2026-11-21-book-us-page-design.md.

export type StoredLead = BookingInput & { leadId: string; createdAt: string; sourcePage: string };

// Must return false (not throw) if `leadId` already exists, so the caller can retry with a new ID.
export async function saveLead(lead: StoredLead): Promise<boolean> {
  const client = getServerConvexClient();
  if (!client) {
    throw new Error('saveLead: NEXT_PUBLIC_CONVEX_URL is not configured.');
  }

  // Built field-by-field (never a spread of `lead`) so `website` (the
  // honeypot, part of BookingInput) and any other stray key can never reach
  // the Convex mutation args — the leads table has no `website` column and
  // Convex arg validation rejects unknown keys.
  const result = await client.mutation(api.leads.saveLead, {
    topic: lead.topic,
    othersText: lead.othersText,
    category: lead.category,
    grade: lead.grade,
    gradeText: lead.gradeText,
    plantId: lead.plantId,
    area: lead.area,
    siteLocation: lead.siteLocation,
    lat: lead.lat,
    lng: lead.lng,
    pump: lead.pump,
    quantity: lead.quantity,
    pourDate: lead.pourDate,
    pourTime: lead.pourTime,
    name: lead.name,
    phone: lead.phone,
    email: lead.email,
    organisation: lead.organisation,
    designation: lead.designation,
    message: lead.message,
    leadId: lead.leadId,
    createdAt: lead.createdAt,
    sourcePage: lead.sourcePage,
  });

  if (result.ok) return true;
  if (result.reason === 'duplicate') return false;
  // Any other failure (rate limit, etc.) throws so the route stops retrying
  // and shows an error instead of looping on an unrelated rejection.
  throw new Error(`saveLead: Convex rejected the lead (${result.reason}).`);
}

// Subject must start with the Lead ID, then the plant name (the route builds it).
// No email/WhatsApp yet; a CRM will be connected later (Ma'am, 2026-11-21).
export async function notifyTeam(_lead: StoredLead, _subject: string, _body: string): Promise<void> {
  // Intentionally empty.
}
