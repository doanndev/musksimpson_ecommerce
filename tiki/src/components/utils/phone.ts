export function normalizePhone(phone: string): string {
  return phone.replace(/\s+/g, '').replace(/^0/, '+84');
}

export function formatPhone(phone: string): string {
  const raw = normalizePhone(phone);
  if (!/^\+84\d{9}$/.test(raw)) return phone;
  return raw.replace(/(\+84)(\d{3})(\d{3})(\d{3})/, '$1 $2 $3 $4');
}
