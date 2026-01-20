import { env } from "../config/env.js";
import { router } from "../router/index.js";
import { useProductStore } from "../stores/uppgiftListaStore.js";
import type { OperativUppgiftItem } from "../types.js";
import { transformUppgift } from "./transformUppgift.js";

export async function getNextUppgift() {
  const mockHandlaggarId = env.mockHandlaggareId;
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

    const uppgift = transformUppgift(data.uppgift);
    const exists = uppgiftLista.find(
      (item: OperativUppgiftItem) => item.uppgiftId === uppgift.uppgiftId,
    );
    if (!exists) {
      const newUppgiftLista = [...uppgiftLista, uppgift];
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
