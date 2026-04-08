export interface OperativUppgiftItem {
  uppgiftId: string;
  handlaggningId: string;
  skapad: string;
  status: string;
  handlaggarId: string;
  planeradTill: string;
  utford: string;
  individer: string[];
  regel: string;
  beskrivning: string;
  verksamhetslogik: string;
  roll: string;
  url: string;
}

export interface AlternativesModel {
  id: string;
  label: string;
}
