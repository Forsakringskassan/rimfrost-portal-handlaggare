import { useProductStore } from "../stores/uppgiftListaStore";
import type { RawUppgift } from "../types";
import { transformUppgift } from "./transformUppgift";

export async function getTilldeladeUppgifter() {
  const mockHandlaggarId = "3f439f0d-a915-42cb-ba8f-6a4170c6011f";
  try {
    const response = await fetch(`/uppgifter/handlaggare/${mockHandlaggarId}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const store = useProductStore();

    const transformedUppgifter = data.uppgifter.map((item: RawUppgift) =>
      transformUppgift(item),
    );

    store.setUppgiftLista(transformedUppgifter);
  } catch (error) {
    console.error("Error fetching next uppgift:", error);
  }
}
