import { useProductStore } from "../stores/uppgiftListaStore";

export async function getTilldeladeUppgifter() {
  const store = useProductStore();

  try {
    const bffUrl = import.meta.env.VITE_BFF_URL ?? "";
    const response = await fetch(
      `${bffUrl}/tasks/${import.meta.env.VITE_MOCK_HANDLAGGARE_ID}`,
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const tasks = data.operativa_uppgifter;

    if (tasks) {
      store.setUppgiftLista(tasks);
    }
  } catch (error) {
    console.error("Error loading tasks:", error);
  }
}
