export interface HandlaggarId {
  typId: string;
  varde: string;
}

export interface RawOperativUppgift {
  uppgift_id: string;
  handlaggning_id: string;
  skapad: string;
  status: string;
  handlaggar_id: HandlaggarId;
  planerad_till: string | null;
  utford: string | null;
  individer: HandlaggarId[];
  regel: string;
  beskrivning: string;
  verksamhetslogik: string;
  roll: string;
  url: string;
}

export interface OperativUppgiftItem {
  uppgiftId: string;
  handlaggningId: string;
  skapad: string;
  status: string;
  handlaggarId: HandlaggarId;
  planeradTill: string;
  utford: string;
  individer: HandlaggarId[];
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

export interface Handlaggare {
  handlaggarId: HandlaggarId;
  fornamn: string;
  efternamn: string;
}
