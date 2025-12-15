import type { RawUppgift, UppgiftItem } from "../types";

export function transformUppgift(rawUppgift: RawUppgift): UppgiftItem {
  return {
    uppgiftId: rawUppgift.uppgift_id,
    kundbehovsflodeId: rawUppgift.kundbehovsflode_id,
    skapad: rawUppgift.skapad,
    status: rawUppgift.status,
    handlaggarId: rawUppgift.handlaggar_id,
    planeradTill: rawUppgift.planerad_till || "",
    utford: rawUppgift.utford || "",
    regeltyp: rawUppgift.regeltyp,
  };
}
