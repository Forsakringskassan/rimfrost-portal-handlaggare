import { env } from "../config/env";
import { useHandlaggareStore } from "../stores/handlaggareStore";
import type { OperativUppgiftItem } from "../types";

/**
 * Searches for tasks that are not handed out via the queue (PORT-FR-06.7).
 * The personnummer goes in the body to keep it out of URLs and access logs.
 * What the handläggare may see is decided by the BFF and OUL (PORT-NFR-03.1).
 */
export async function searchUppgifter(
  personnummer: string,
  signal?: AbortSignal,
): Promise<OperativUppgiftItem[]> {
  const handlaggareStore = useHandlaggareStore();
  const token = handlaggareStore.bearerToken;

  const response = await fetch(`${env.bffUrl}/tasks/search`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ personnummer }),
    signal,
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return Array.isArray(data.operativa_uppgifter)
    ? data.operativa_uppgifter
    : [];
}
