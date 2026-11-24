import { NextResponse } from 'next/server';
import { plants } from '@/data/plants';
import { makeLeadId } from '@/lib/leadId';
import { validateBooking } from '@/lib/validateBooking';
import { saveLead, notifyTeam, type StoredLead } from '@/lib/leadStore';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  let raw: Record<string, unknown>;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ error: 'Bad request.' }, { status: 400 });
  }

  const result = validateBooking(raw);
  if (!result.ok) {
    // Honeypot hits get a fake success so bots learn nothing. Nothing is saved.
    if (result.error === 'spam') return NextResponse.json({ leadId: makeLeadId() });
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  const base = {
    ...result.data,
    createdAt: new Date().toISOString(),
    sourcePage: '/ready-mix-concrete-contact-in-raipur/',
  };

  let lead: StoredLead | null = null;
  for (let i = 0; i < 5 && !lead; i++) {
    const candidate: StoredLead = { ...base, leadId: makeLeadId() };
    if (await saveLead(candidate)) lead = candidate; // false = ID already used, try again
  }
  if (!lead) {
    return NextResponse.json({ error: 'Could not save your request. Please call us.' }, { status: 500 });
  }

  const plantName = plants.find((p) => p.id === lead!.plantId)?.name ?? 'Plant not chosen';
  const subject = `${lead.leadId} | ${plantName} | ${lead.topic} | ${lead.pump}`;
  const body = Object.entries(lead)
    .filter(([k]) => k !== 'website')
    .map(([k, v]) => `${k}: ${v ?? ''}`)
    .join('\n');
  try {
    await notifyTeam(lead, subject, body);
  } catch {
    /* the lead is already saved; do not fail the visitor */
  }

  return NextResponse.json({ leadId: lead.leadId });
}
