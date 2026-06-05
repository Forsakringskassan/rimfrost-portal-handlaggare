import { env } from "../config/env";
import { useProductStore } from "../stores/uppgiftListaStore";

export async function getTilldeladeUppgifter(handlaggarId: {
  typId: string;
  varde: string;
}) {
  const store = useProductStore();

  try {
    const bffUrl = env.bffUrl;

    const response = await fetch(`${bffUrl}/tasks`, {
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
    store.setUppgiftLista(
      Array.isArray(data.operativa_uppgifter) ? data.operativa_uppgifter : [],
    );
  } catch (error) {
    console.error("Error loading tasks:", error);
    throw error;
  }
}
