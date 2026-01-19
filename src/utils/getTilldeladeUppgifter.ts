import { useProductStore } from "../stores/uppgiftListaStore";
import type { RawOperativUppgift } from "../types";
import { transformUppgift } from "./transformUppgift";

export async function getTilldeladeUppgifter() {
  const mockHandlaggarId = "469ddd20-6796-4e05-9e18-6a95953f6cb3";
  try {
    const response = await fetch(`/uppgifter/handlaggare/${mockHandlaggarId}`);

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
