import type { BookingInput } from './validateBooking';

// ============================================================================
// STOP POINT FOR THE DEVELOPER
// The site needs ONE place to keep leads. Implement `saveLead` and `notifyTeam`
// with what the project ALREADY uses (database table, Google Sheet API, or the
// existing email service) and keep these signatures.
// If the repo has no lead store or email service, STOP and ask the human.
// Do not invent a new service, and keep keys in environment variables only.
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
