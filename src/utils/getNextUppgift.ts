import { env } from "../config/env.js";
import { router } from "../router/index.js";
import { useHandlaggareStore } from "../stores/handlaggareStore.js";
import { useProductStore } from "../stores/uppgiftListaStore.js";
import type { OperativUppgiftItem } from "../types.js";

export async function getNextUppgift(): Promise<void> {
  const handlaggareStore = useHandlaggareStore();
  const bffUrl = env.bffUrl;
  const handlaggarId =
    handlaggareStore.selectedHandlaggare?.handlaggarId ?? null;

  if (!handlaggarId) {
    throw new Error("Ingen handläggare vald");
  }

  const response = await fetch(`${bffUrl}/tasks/getNext`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      typId: handlaggarId.typId,
      varde: handlaggarId.varde,
    }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  const store = useProductStore();
  const uppgiftLista = store.uppgiftLista;

  const uppgift = data.uppgift;

  if (!uppgift) {
    throw new Error("Ingen uppgift i svaret från backend");
  }

  const exists = uppgiftLista.find(
    (item: OperativUppgiftItem) => item.uppgiftId === uppgift.uppgiftId,
  );

  if (!exists) {
    const newUppgiftLista = [...uppgiftLista, uppgift];
    store.setUppgiftLista(newUppgiftLista);
    goToItem(uppgift);
  }
}

function goToItem(item: OperativUppgiftItem) {
  router.push({
    name: "item",
    params: { id: item.handlaggningId.toString() },
  });
}
