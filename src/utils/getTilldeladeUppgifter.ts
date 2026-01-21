import { useProductStore } from "../stores/uppgiftListaStore";
import type { RawOperativUppgift } from "../types";
import { getUppgifterApiUrl } from "./apiUrls";
import { transformUppgift } from "./transformUppgift";

export async function getTilldeladeUppgifter() {
  const mockHandlaggarId = import.meta.env.VITE_MOCK_HANDLAGGARE_ID;
  try {
    const response = await fetch(
      getUppgifterApiUrl(`/handlaggare/${mockHandlaggarId}`),
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const store = useProductStore();

    const transformedUppgifter = data.operativa_uppgifter.map(
      (item: RawOperativUppgift) => transformUppgift(item),
    );

    store.setUppgiftLista(transformedUppgifter);
  } catch (error) {
    console.error("Error fetching next uppgift:", error);
  }
}
