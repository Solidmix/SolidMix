// One place for every dropdown. The server validates against these same arrays.
export const topics = ['Ready Mix Concrete', 'Others'] as const;

export const customerCategories = [
  'Individual',
  'Contractor',
  'Builder',
  'Infrastructure company',
  'Dealer',
] as const;

// Client said the list starts at M5. The top end (M80) and the steps of 5 come from the
// client FAQ doc and are NOT confirmed (the website says M20-M40). Confirm, then edit here only.
export const grades: string[] = Array.from({ length: 16 }, (_, i) => `M${(i + 1) * 5}`);
export const GRADE_OTHER = 'Other grade';
export const GRADE_NOT_SURE = 'Not sure';

// "Only dump" is the client's wording (discharge without a pump). Confirm the label.
export const pumpOptions = ['Boom pump', 'Line pump', 'Only dump (no pump)', 'Not sure'] as const;

export const PLANT_NOT_SURE = 'not-sure';
export const AREA_OTHER = 'Other area (type below)';
