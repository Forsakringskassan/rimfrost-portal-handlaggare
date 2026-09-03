import { env } from "../config/env";
import { useHandlaggareStore } from "../stores/handlaggareStore";
import { useProductStore } from "../stores/uppgiftListaStore";
import { useToast } from "./useToast";

export async function getTilldeladeUppgifter(handlaggarId: {
  typId: string;
  varde: string;
}) {
  const store = useProductStore();
  const handlaggareStore = useHandlaggareStore();
  const toast = useToast();

  try {
    const bffUrl = env.bffUrl;
    const token = handlaggareStore.bearerToken;

    const response = await fetch(`${bffUrl}/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
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
    if (data.borttagna_pga_behorighet > 0) {
      toast.error(
        "En eller flera uppgifter har tagits bort av behörighetsskäl",
        { persistent: true },
      );
    }
  } catch (error) {
    console.error("Error loading tasks:", error);
    throw error;
  }
}
