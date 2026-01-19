import {
  Configuration,
  FullmaktsControllerApi,
} from "@forsakringskassan/template-api";
import type { AlternativesModel } from "./types";

const DEFAULT_ALTERNATIVES: AlternativesModel[] = [
  { id: "1", label: "Alternativ 1" },
  { id: "2", label: "Alternativ 2" },
  { id: "3", label: "Alternativ 3" },
  { id: "4", label: "Alternativ 4" },
  { id: "5", label: "Alternativ 5" },
  { id: "6", label: "Alternativ 6" },
];

const api = new FullmaktsControllerApi(
  new Configuration({
    basePath: window.location.origin,
  }),
);

export async function getAlternatives(): Promise<AlternativesModel[]> {
  try {
    const response = await api.getAlternatives();
    const alternatives = response?.alternatives;

    if (!alternatives || alternatives.length === 0) {
      return DEFAULT_ALTERNATIVES;
    }

    return alternatives.map(
      ({ id, name }): AlternativesModel => ({
        id: String(id),
        label: name,
      }),
    );
  } catch (error) {
    console.error("Error fetching alternatives:", error);
    return DEFAULT_ALTERNATIVES;
  }
}
