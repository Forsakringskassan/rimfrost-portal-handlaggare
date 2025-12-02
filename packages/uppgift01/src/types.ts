// export interface Kund {
//   fornamn: string;
//   efternamn: string;
//   personnummer: number;
//   anstalld: boolean;
//   harHund: boolean;
//   uppgiftId: number;
//   uppgiftsTyp: string;
//   uppgiftsStatus: string;
//   adress: {
//     gata: string;
//     nummer: string;
//     postnummer: string;
//     lagenhetsnummer: string;
//     stad: string;
//     folkbokford: boolean;
//   };
//   arbetsgivare: {
//     id: number;
//     namn: string;
//     adress: string;
//     kontaktperson: string;
//     telefon: string;
//     orgNummer?: undefined;
//   };
//   datum: Array<{
//     datumVarde: string;
//     rattTillForsakring: boolean;
//   }>;
// }

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

export type KonEnum = (typeof KonEnum)[keyof typeof KonEnum];
export type Beslutsutfall = (typeof Beslutsutfall)[keyof typeof Beslutsutfall];
