// Centralized admin helpers
export const ADMIN_EMAILS = [
  'pedrosannger16@gmail.com',
  'sannger@proton.me',
];

export function isAdminEmail(email?: string | null): boolean {
  if (!email) return false;
  const e = email.toLowerCase();
  return ADMIN_EMAILS.includes(e) || e.endsWith('@volt.com');
}
