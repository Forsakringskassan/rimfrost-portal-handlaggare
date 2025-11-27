export interface Kund {
  fornamn: string;
  efternamn: string;
  personnummer: number;
  anstalld: boolean;
  harHund: boolean;
  uppgiftId: number;
  uppgiftsTyp: string;
  uppgiftsStatus: string;
  adress: {
    gata: string;
    nummer: string;
    postnummer: string;
    lagenhetsnummer: string;
    stad: string;
    folkbokford: boolean;
  };
  arbetsgivare: {
    id: number;
    namn: string;
    adress: string;
    kontaktperson: string;
    telefon: string;
    orgNummer?: undefined;
  };
  datum: Array<{
    datumVarde: string;
    rattTillForsakring: boolean;
  }>;
}
