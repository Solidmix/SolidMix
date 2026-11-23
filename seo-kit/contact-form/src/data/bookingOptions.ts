// One place for every dropdown. The server validates against these same arrays.
export const topics = ['Ready Mix Concrete', 'Others'] as const;

export const customerCategories = [
  'Individual',
  'Contractor',
  'Builder',
  'Infrastructure company',
  'Dealer',
] as const;

// Client confirmed 2026-11-23: the form list runs M5 to M80, plus a custom "Other grade" option.
// Steps of 5 (M5, M10, M15 ... M80) are still assumed. This is the enquiry list only: do not
// show these grades on product pages until the client confirms what is actually produced.
export const grades: string[] = Array.from({ length: 16 }, (_, i) => `M${(i + 1) * 5}`);
export const GRADE_OTHER = 'Other grade';
export const GRADE_NOT_SURE = 'Not sure';

// "Only dump (no pump)": label confirmed by the client 2026-11-23.
export const pumpOptions = ['Boom pump', 'Line pump', 'Only dump (no pump)', 'Not sure'] as const;

export const PLANT_NOT_SURE = 'not-sure';
export const AREA_OTHER = 'Other area (type below)';
