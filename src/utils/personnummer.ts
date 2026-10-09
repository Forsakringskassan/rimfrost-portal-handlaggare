// Same 12-digit rule as the BFF (PBFF-FR-05.6), so the portal never sends a
// value the BFF would reject with 400 (PORT-FR-06.4, PORT-FR-06.6).
const PERSONNUMMER = /^(\d{8})-?(\d{4})$/;

/** Returns the personnummer as ÅÅÅÅMMDD-NNNN, or null if it is not valid. */
export function normalizePersonnummer(value: string): string | null {
  const match = PERSONNUMMER.exec(value.trim());
  return match ? `${match[1]}-${match[2]}` : null;
}
