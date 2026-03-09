import { ref } from "vue";
import { useProductStore } from "../stores/uppgiftListaStore";

export async function getTilldeladeUppgifter() {
  const loading = ref(false);
  const tasks = ref();
  const store = useProductStore();

  try {
    loading.value = true;
    const data = await fetchAssignedTasks();
    tasks.value = data;
  } catch (error) {
    console.error("Error loading tasks:", error);
  } finally {
    loading.value = false;
    if (tasks.value) {
      store.setUppgiftLista(tasks.value);
    }
  }

  async function fetchAssignedTasks() {
    const bffUrl = import.meta.env.VITE_BFF_URL ?? "";
    const response = await fetch(
      `${bffUrl}/uppgifter/handlaggare/${import.meta.env.VITE_MOCK_HANDLAGGARE_ID}`,
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.operativa_uppgifter;
  }
}
