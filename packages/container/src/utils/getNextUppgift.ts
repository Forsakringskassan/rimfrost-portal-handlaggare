import { router } from "../router/index.js";
import { useProductStore } from "../stores/uppgiftListaStore.js";
import type { UppgiftItem } from "../types.js";

export async function getNextUppgift() {
  const mockHandlaggarId = "3f439f0d-a915-42cb-ba8f-6a4170c6011f";
  try {
    const response = await fetch(`/uppgifter/handlaggare/${mockHandlaggarId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const store = useProductStore();
    const uppgiftLista = store.uppgiftLista;

    const transformedUppgift = {
      uppgiftId: data.uppgift.uppgift_id,
      kundbehovsflodeId: data.uppgift.kundbehovsflode_id,
      skapad: data.uppgift.skapad,
      status: data.uppgift.status,
      handlaggarId: data.uppgift.handlaggar_id,
      planeradTill: data.uppgift.planerad_till || "",
      utford: data.uppgift.utford || "",
      regeltyp: data.uppgift.regeltyp,
    };

    const exists = uppgiftLista.find(
      (item: UppgiftItem) => item.uppgiftId === transformedUppgift.uppgiftId,
    );
    if (!exists) {
      const newUppgiftLista = [...uppgiftLista, transformedUppgift];
      store.setUppgiftLista(newUppgiftLista);
      goToItem(data.uppgift);
      return;
    }
  } catch (error) {
    console.error("Error fetching next uppgift:", error);
  }
}

function goToItem(item: { id: string; typ: string }) {
  const routeName = "item";
  router.push({
    name: routeName,
    params: { id: item.id.toString() },
    query: { title: item.typ },
  });
}
