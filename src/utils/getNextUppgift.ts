import { router } from "../router/index.js";
import { getTilldeladeUppgifter } from "./getTilldeladeUppgifter.js";

export async function getNextUppgift() {
  const mockHandlaggarId = import.meta.env.VITE_MOCK_HANDLAGGARE_ID ?? "";
  const bffUrl = import.meta.env.VITE_BFF_URL ?? "";
  try {
    const response = await fetch(
      `${bffUrl}/tasks/getNext/${mockHandlaggarId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const task = data.uppgift;

    await getTilldeladeUppgifter();

    if (task?.handlaggningId) {
      goToItem(task.handlaggningId, task.regel);
    }
  } catch (error) {
    console.error("Error fetching next uppgift:", error);
  }
}

function goToItem(id: string, type: string) {
  const routeName = "item";
  router.push({
    name: routeName,
    params: { id: id.toString() },
    query: { title: type },
  });
}
