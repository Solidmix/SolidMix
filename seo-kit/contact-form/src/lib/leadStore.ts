import type { BookingInput } from './validateBooking';

// ============================================================================
// Client decision 2026-11-23: leads go to the CRM being built, through the
// database the developer has already built. Implement `saveLead` and `notifyTeam`
// against that database and keep these signatures.
// If the CRM needs an API call or a different shape, ask the human first.
// Keep keys in environment variables only.
// ============================================================================

export type StoredLead = BookingInput & { leadId: string; createdAt: string; sourcePage: string };

// Must return false (not throw) if `leadId` already exists, so the caller can retry with a new ID.
export async function saveLead(_lead: StoredLead): Promise<boolean> {
  throw new Error('leadStore.saveLead is not implemented. See contact-form/README-PLACEMENT.md, step 4.');
}

// Subject must start with the Lead ID, then the plant name (the route builds it).
export async function notifyTeam(_lead: StoredLead, _subject: string, _body: string): Promise<void> {
  throw new Error('leadStore.notifyTeam is not implemented. See contact-form/README-PLACEMENT.md, step 4.');
}
