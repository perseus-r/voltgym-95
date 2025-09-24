// Centralized admin helpers
export const ADMIN_EMAILS = [
  'pedrosannger16@gmail.com',
  'sannger@proton.me',
];

export function isAdminEmail(email?: string | null): boolean {
  if (!email) return false;
  const e = email.toLowerCase().trim();
  
  // Log para debug
  console.log('Checking admin email:', e);
  console.log('Admin emails list:', ADMIN_EMAILS);
  
  const isAdmin = ADMIN_EMAILS.includes(e) || e.endsWith('@volt.com');
  console.log('Is admin?', isAdmin);
  
  return isAdmin;
}
