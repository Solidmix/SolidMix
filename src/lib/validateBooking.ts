import { plants } from '@/data/plants';
import {
  topics,
  customerCategories,
  grades,
  GRADE_OTHER,
  GRADE_NOT_SURE,
  pumpOptions,
  PLANT_NOT_SURE,
  AREA_OTHER,
} from '@/data/bookingOptions';

export type BookingInput = {
  topic: string;
  othersText?: string;
  category: string;
  grade?: string;
  gradeText?: string;
  plantId: string;
  area: string;
  siteLocation?: string;
  lat?: number;
  lng?: number;
  pump: string;
  quantity?: string;
  pourDate?: string;
  pourTime?: string;
  name: string;
  phone: string;
  email?: string;
  message?: string;
  website?: string; // honeypot: must stay empty
};

const clean = (v: unknown, max = 500) => String(v ?? '').trim().slice(0, max);
const num = (v: unknown) => (typeof v === 'number' && Number.isFinite(v) ? v : undefined);

export function validateBooking(
  raw: Record<string, unknown>,
): { ok: true; data: BookingInput } | { ok: false; error: string } {
  const d: BookingInput = {
    topic: clean(raw.topic, 40),
    othersText: clean(raw.othersText, 1000),
    category: clean(raw.category, 60),
    grade: clean(raw.grade, 40),
    gradeText: clean(raw.gradeText, 80),
    plantId: clean(raw.plantId, 60),
    area: clean(raw.area, 120),
    siteLocation: clean(raw.siteLocation, 300),
    lat: num(raw.lat),
    lng: num(raw.lng),
    pump: clean(raw.pump, 40),
    quantity: clean(raw.quantity, 20),
    pourDate: clean(raw.pourDate, 10),
    pourTime: clean(raw.pourTime, 5),
    name: clean(raw.name, 100),
    phone: clean(raw.phone, 20),
    email: clean(raw.email, 120),
    message: clean(raw.message, 1500),
    website: clean(raw.website, 50),
  };

  if (d.website) return { ok: false, error: 'spam' };
  if (!(topics as readonly string[]).includes(d.topic)) return { ok: false, error: 'Choose what this is about.' };
  if (d.topic === 'Others' && (d.othersText?.length ?? 0) < 10)
    return { ok: false, error: 'Tell us what you expect (at least 10 characters).' };
  if (!(customerCategories as readonly string[]).includes(d.category))
    return { ok: false, error: 'Choose your customer category.' };

  if (d.topic === 'Ready Mix Concrete') {
    const okGrade = grades.includes(d.grade ?? '') || d.grade === GRADE_OTHER || d.grade === GRADE_NOT_SURE;
    if (!okGrade) return { ok: false, error: 'Choose a grade.' };
    if (d.grade === GRADE_OTHER && !d.gradeText) return { ok: false, error: 'Write the grade you need.' };
  }

  if (d.plantId !== PLANT_NOT_SURE) {
    const plant = plants.find((p) => p.id === d.plantId);
    if (!plant) return { ok: false, error: 'Choose the nearest plant.' };
    const inList = plant.areaGroups.some((g) => g.areas.includes(d.area));
    if (!inList && d.area !== AREA_OTHER) return { ok: false, error: 'Choose your delivery area.' };
    if (d.area === AREA_OTHER && !d.siteLocation) return { ok: false, error: 'Type your site location.' };
  } else if (!d.siteLocation) {
    return { ok: false, error: 'Type your site location.' };
  }

  if (!(pumpOptions as readonly string[]).includes(d.pump))
    return { ok: false, error: 'Choose your pump requirement.' };
  if (d.quantity && d.quantity !== 'Not sure' && !/^\d{1,5}(\.\d{1,2})?$/.test(d.quantity))
    return { ok: false, error: 'Enter the quantity as a number.' };
  if (d.pourDate && !/^\d{4}-\d{2}-\d{2}$/.test(d.pourDate)) return { ok: false, error: 'Check the pour date.' };
  if (d.pourTime && !/^\d{2}:\d{2}$/.test(d.pourTime)) return { ok: false, error: 'Check the pour time.' };
  if (!d.name) return { ok: false, error: 'Enter your name.' };
  if (!/^(\+?91[\s-]?)?[6-9]\d{4}[\s-]?\d{5}$/.test(d.phone))
    return { ok: false, error: 'Enter a valid Indian mobile number.' };
  if (d.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email)) return { ok: false, error: 'Check your email address.' };

  return { ok: true, data: d };
}
