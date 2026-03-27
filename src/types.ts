export interface RawOperativUppgift {
  uppgift_id: string;
  handlaggning_id: string;
  skapad: string;
  status: string;
  handlaggar_id: string;
  planerad_till: string | null;
  utford: string | null;
  kundbehov: string;
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
  handlaggarId: string;
  planeradTill: string;
  utford: string;
  kundbehov: string;
  regel: string;
  beskrivning: string;
  verksamhetslogik: string;
  roll: string;
  url: string;
}

export interface Handlaggare {
  handlaggarId: string;
  fornamn: string;
  efternamn: string;
}
