/** US display while typing: (XXX) XXX-XXXX; strips non-digits, max 10 digits. */
export function formatUsPhoneInput(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 10);
  if (digits.length === 0) return '';
  if (digits.length <= 3) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

export function uppercaseRegistrationText(value: string): string {
  return value.toLocaleUpperCase('en-US');
}

const PRESERVE_EMAIL_CASE = new Set(['contactEmail']);

/** Main registration form: uppercase text; format phone; leave email as typed. */
export function normalizeRegistrationInput(fieldName: string, value: string): string {
  if (PRESERVE_EMAIL_CASE.has(fieldName)) return value;
  if (fieldName === 'contactPhone') return formatUsPhoneInput(value);
  return uppercaseRegistrationText(value);
}
