import { useProductStore } from "../stores/uppgiftListaStore";

export async function getTilldeladeUppgifter() {
  const mockHandlaggarId = "3f439f0d-a915-42cb-ba8f-6a4170c6011f";
  try {
    const response = await fetch(`/uppgifter/handlaggare/${mockHandlaggarId}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const store = useProductStore();

    const transformedUppgifter = data.uppgifter.map((item: anyl) => ({
      uppgiftId: item.uppgift_id,
      kundbehovsflodeId: item.kundbehovsflode_id,
      skapad: item.skapad,
      status: item.status,
      handlaggarId: item.handlaggar_id,
      planeradTill: item.planerad_till || "",
      utford: item.utford || "",
      regeltyp: item.regeltyp,
    }));

    store.setUppgiftLista(transformedUppgifter);
  } catch (error) {
    console.error("Error fetching next uppgift:", error);
  }
}
