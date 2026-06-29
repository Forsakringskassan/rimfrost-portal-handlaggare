import { env } from "../config/env.js";
import { router } from "../router/index.js";
import { useHandlaggareStore } from "../stores/handlaggareStore.js";
import { useProductStore } from "../stores/uppgiftListaStore.js";
import type { OperativUppgiftItem } from "../types.js";

export async function reassignUppgift(uppgiftId: string): Promise<void> {
  const bffUrl = env.bffUrl;
  const handlaggareStore = useHandlaggareStore();
  const token = handlaggareStore.bearerToken;

  const response = await fetch(`${bffUrl}/tasks/${uppgiftId}/reassign`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
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
    store.setUppgiftLista([...uppgiftLista, uppgift]);
  }

  router.push({
    name: "item",
    params: { id: uppgift.handlaggningId.toString() },
  });
}
