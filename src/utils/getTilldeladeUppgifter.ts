import { useHandlaggareStore } from "../stores/handlaggareStore";
import { useProductStore } from "../stores/uppgiftListaStore";

export async function getTilldeladeUppgifter() {
  const store = useProductStore();
  const handlaggareStore = useHandlaggareStore();

  try {
    const bffUrl = import.meta.env.VITE_BFF_URL ?? "";
    const handlaggarId =
      handlaggareStore.selectedHandlaggare?.handlaggarId ??
      import.meta.env.VITE_MOCK_HANDLAGGARE_ID ??
      "";

    const response = await fetch(`${bffUrl}/tasks/${handlaggarId}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const tasks = data.operativa_uppgifter;

    if (Array.isArray(tasks)) {
      store.setUppgiftLista(tasks);
    }
  } catch (error) {
    console.error("Error loading tasks:", error);
  }
}
