import { env } from "../config/env";
import { useHandlaggareStore } from "../stores/handlaggareStore";
import { useProductStore } from "../stores/uppgiftListaStore";

export async function getTeamUppgifter(): Promise<void> {
  const store = useProductStore();
  const handlaggareStore = useHandlaggareStore();

  try {
    const bffUrl = env.bffUrl;
    const token = handlaggareStore.bearerToken;

    const response = await fetch(`${bffUrl}/tasks/team`, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    store.setUppgiftLista(
      Array.isArray(data.operativa_uppgifter) ? data.operativa_uppgifter : [],
    );
  } catch (error) {
    console.error("Error loading team tasks:", error);
    throw error;
  }
}
