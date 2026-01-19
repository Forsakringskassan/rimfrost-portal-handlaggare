import type { OperativUppgiftItem, RawOperativUppgift } from "../types";

export function transformUppgift(
  rawOperativUppgift: RawOperativUppgift,
): OperativUppgiftItem {
  return {
    uppgiftId: rawOperativUppgift.uppgift_id,
    kundbehovsflodeId: rawOperativUppgift.kundbehovsflode_id,
    skapad: rawOperativUppgift.skapad,
    status: rawOperativUppgift.status,
    handlaggarId: rawOperativUppgift.handlaggar_id,
    planeradTill: rawOperativUppgift.planerad_till || "",
    utford: rawOperativUppgift.utford || "",
    kundbehov: rawOperativUppgift.kundbehov,
    regel: rawOperativUppgift.regel,
    beskrivning: rawOperativUppgift.beskrivning,
    verksamhetslogik: rawOperativUppgift.verksamhetslogik,
    roll: rawOperativUppgift.roll,
    url: rawOperativUppgift.url,
  };
}
