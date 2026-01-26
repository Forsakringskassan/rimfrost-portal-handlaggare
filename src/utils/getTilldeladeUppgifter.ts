import { ref } from "vue";
import { env } from "../config/env";
import { useProductStore } from "../stores/uppgiftListaStore";
import type { RawOperativUppgift } from "../types";
import { transformUppgift } from "./transformUppgift";

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
    store.setUppgiftLista(
      tasks.value.map((item: RawOperativUppgift) => transformUppgift(item)),
    );
  }

  async function fetchAssignedTasks() {
    const response = await fetch(
      `${env.bffUrl}uppgifter/handlaggare/${env.mockHandlaggareId}`,
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.operativa_uppgifter;
  }
}
