import { useProductStore } from "../stores/uppgiftListaStore";

export async function getTilldeladeUppgifter(handlaggarId: string) {
  const store = useProductStore();

  try {
    const bffUrl = import.meta.env.VITE_BFF_URL ?? "";

    const response = await fetch(`${bffUrl}/tasks/${handlaggarId}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    store.setUppgiftLista(
      Array.isArray(data.operativa_uppgifter) ? data.operativa_uppgifter : [],
    );
  } catch (error) {
    console.error("Error loading tasks:", error);
  }
}
