// "Senast använda" uppgiftstyper, kept per handläggare in localStorage
//. Only uppgiftstyp ids are stored — never a
// personnummer or note text.

export const MAX_SENAST_ANVANDA = 8;

const NYCKEL_PREFIX = "rimfrost.senastAnvandaUppgiftstyper.";

function nyckel(handlaggarId: string): string {
  return `${NYCKEL_PREFIX}${handlaggarId}`;
}

/**
 * Returns the stored ids, newest first. Returns an empty list if storage is
 * unavailable or holds something unexpected, so the view works without it.
 */
export function lasSenastAnvanda(handlaggarId: string): string[] {
  try {
    const varde = localStorage.getItem(nyckel(handlaggarId));
    if (!varde) {
      return [];
    }
    const lista: unknown = JSON.parse(varde);
    if (!Array.isArray(lista)) {
      return [];
    }
    return lista
      .filter((id): id is string => typeof id === "string")
      .slice(0, MAX_SENAST_ANVANDA);
  } catch {
    return [];
  }
}

/**
 * Puts the id first, removes any older copy of it and keeps at most
 * MAX_SENAST_ANVANDA. Returns the new list even if it could not be saved.
 */
export function laggTillSenastAnvanda(
  handlaggarId: string,
  uppgiftstypId: string,
): string[] {
  const lista = [
    uppgiftstypId,
    ...lasSenastAnvanda(handlaggarId).filter((id) => id !== uppgiftstypId),
  ].slice(0, MAX_SENAST_ANVANDA);
  try {
    localStorage.setItem(nyckel(handlaggarId), JSON.stringify(lista));
  } catch {
    // Storage full or blocked — the list just isn't remembered.
  }
  return lista;
}
