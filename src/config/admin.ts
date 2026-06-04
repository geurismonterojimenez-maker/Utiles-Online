export const ADMIN_EMAIL = 'jeuri905@gmail.com';

export function isAdminEmail(email?: string | null): boolean {
  return !!email && email.toLowerCase() === ADMIN_EMAIL.toLowerCase();
}
