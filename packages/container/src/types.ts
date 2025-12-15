export interface RawUppgift {
  uppgift_id: string;
  kundbehovsflode_id: string;
  skapad: string;
  status: string;
  handlaggar_id: string;
  planerad_till?: string;
  utford?: string;
  regeltyp: string;
}

export interface UppgiftItem {
  uppgiftId: string;
  kundbehovsflodeId: string;
  skapad: string;
  status: string;
  handlaggarId: string;
  planeradTill: string;
  utford: string;
  regeltyp: string;
}
