import type {
  Anstallning,
  BackendResponse,
  Beslutsutfall,
  Ersattning,
  GetDataResponse,
  KonEnum,
  Kund,
  Lon,
} from "../types";

export function transformBackendResponse(
  backendData: BackendResponse,
): GetDataResponse {
  const lon: Lon = {
    from: backendData.kund.anstallning.lon.from,
    tom: backendData.kund.anstallning.lon.tom,
    lonesumma: backendData.kund.anstallning.lon.lonesumma,
  };

  const anstallning: Anstallning = {
    anstallningsdag: backendData.kund.anstallning.anstallningsdag,
    arbetstidProcent: backendData.kund.anstallning.arbetstid_procent,
    sistaAnstallningsdag: backendData.kund.anstallning.sista_anstallningsdag,
    organisationsnamn: backendData.kund.anstallning.organisationsnamn,
    organisationsnummer: backendData.kund.anstallning.organisationsnummer,
    lon,
  };

  const kund: Kund = {
    fornamn: backendData.kund.fornamn,
    efternamn: backendData.kund.efternamn,
    kon: backendData.kund.kon as KonEnum,
    anstallning,
  };

  const ersattning: Ersattning[] = backendData.ersattning.map((e) => ({
    ersattningId: e.ersattning_id,
    ersattningstyp: e.ersattningstyp,
    omfattningProcent: e.omfattning_procent,
    belopp: e.belopp,
    berakningsgrund: e.berakningsgrund,
    beslutsutfall: e.beslutsutfall as Beslutsutfall | null,
    from: e.from,
    tom: e.tom,
    avslagsanledning: e.avslagsanledning,
  }));

  return {
    kundbehovsflodeId: backendData.kundbehovsflode_id,
    kund,
    ersattning,
  };
}
