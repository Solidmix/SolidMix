// Lead ID like SM-261121-A4F9: India date + 4 random characters (no 0/O/1/I to avoid mix-ups).
import { randomInt } from 'node:crypto';

const CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

export function makeLeadId(now: Date = new Date()): string {
  const ist = new Date(now.getTime() + 5.5 * 60 * 60 * 1000);
  const yy = String(ist.getUTCFullYear()).slice(2);
  const mm = String(ist.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(ist.getUTCDate()).padStart(2, '0');
  let code = '';
  for (let i = 0; i < 4; i++) code += CHARS[randomInt(CHARS.length)];
  return `SM-${yy}${mm}${dd}-${code}`;
}
