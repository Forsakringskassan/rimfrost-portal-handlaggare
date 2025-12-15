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

    for (const uppgift of data) {
      const exists = uppgiftLista.find(
        (item: UppgiftItem) => item.uppgiftId === uppgift.id,
      );
      if (!exists) {
        const newUppgiftLista = [...uppgiftLista, uppgift];
        store.setUppgiftLista(newUppgiftLista);
        goToItem(uppgift);
        return;
      }
    }
  } catch (error) {
    console.error("Error fetching next uppgift:", error);
  }
}

// export function getNextUppgiftMock() {
//   const store = useProductStore();
//   const uppgiftLista = store.uppgiftLista;

//   if (uppgiftLista.length >= uppgiftListaMock.length) {
//     return;
//   }

//   for (const uppgift of uppgiftListaMock) {
//     const exists = uppgiftLista.find((u) => u.id === uppgift.id);
//     if (!exists) {
//       const newUppgiftLista = [...uppgiftLista, uppgift];
//       store.setUppgiftLista(newUppgiftLista);
//       goToItem(uppgift);
//       return;
//     }
//   }
// }

function goToItem(item: { id: string; typ: string }) {
  const routeName = "item";
  router.push({
    name: routeName,
    params: { id: item.id.toString() },
    query: { title: item.typ },
  });
}
