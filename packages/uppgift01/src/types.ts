export interface GetDataResponse {
  kundbehovsflodeId: string;
  kund: Kund;
  ersattning: Ersattning[];
}

export interface PatchDataRequest {
  ersattningId: string;
  beslutsutfall: Beslutsutfall;
  avslagsanledning?: string | null;
  signera: boolean;
}

export interface Kund {
  fornamn: string;
  efternamn: string;
  kon: KonEnum;
  anstallning: Anstallning;
}

export interface KundData {
  kundbehovsflodeId: string;
  kund: Kund;
  ersattning: Ersattning[];
}

export interface Anstallning {
  anstallningsdag: string;
  arbetstidProcent: number;
  sistaAnstallningsdag?: string | null;
  organisationsnamn: string;
  organisationsnummer: string;
  lon: Lon;
}

export interface Lon {
  from: string;
  tom?: string | null;
  lonesumma: number;
}

export interface Ersattning {
  ersattningId: string;
  ersattningstyp: string;
  omfattningProcent: number;
  belopp: number;
  berakningsgrund: number;
  beslutsutfall?: Beslutsutfall | null;
  from: string;
  tom: string;
  avslagsanledning?: string | null;
}

export const KonEnum = {
  MAN: "MAN",
  KVINNA: "KVINNA",
};

export const Beslutsutfall = {
  JA: "JA",
  NEJ: "NEJ",
  FU: "FU",
};

export interface BackendResponse {
  kundbehovsflode_id: string;
  kund: {
    efternamn: string;
    fornamn: string;
    kon: string;
    anstallning: {
      organisationsnummer: string;
      organisationsnamn: string;
      arbetstid_procent: number;
      anstallningsdag: string;
      sista_anstallningsdag: string | null;
      lon: {
        lonesumma: number;
        from: string;
        tom: string | null;
      };
    };
  };
  ersattning: Array<{
    ersattning_id: string;
    ersattningstyp: string;
    omfattning_procent: number;
    belopp: number;
    berakningsgrund: number;
    beslutsutfall: string | null;
    avslagsanledning: string | null;
    from: string;
    tom: string;
  }>;
}

export type KonEnum = (typeof KonEnum)[keyof typeof KonEnum];
export type Beslutsutfall = (typeof Beslutsutfall)[keyof typeof Beslutsutfall];
