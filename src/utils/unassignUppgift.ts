import { env } from "../config/env.js";
import { router } from "../router/index.js";
import { useHandlaggareStore } from "../stores/handlaggareStore.js";
import { useProductStore } from "../stores/uppgiftListaStore.js";

/**
 * The task no longer exists in OUL. Kept distinct from a general failure because
 * the local list has provably drifted and has been corrected.
 */
export class UppgiftGoneError extends Error {
  public constructor() {
    super("Uppgiften finns inte längre och har tagits bort ur listan.");
    this.name = "UppgiftGoneError";
  }
}

/**
 * Hands a task back to the pool on behalf of the calling handläggare
 * (PORT-FR-04.1). The BFF forwards this to OUL, which checks that the caller is
 * the task's current handläggare and answers 403 if not (OUL-FR-19.3).
 *
 * Throws on any non-2xx so the caller can show a message and leave the task in
 * the list (PORT-FR-04.5).
 */
export async function unassignUppgift(uppgiftId: string): Promise<void> {
  const bffUrl = env.bffUrl;
  const handlaggareStore = useHandlaggareStore();
  const token = handlaggareStore.bearerToken;

  const response = await fetch(`${bffUrl}/tasks/${uppgiftId}/unassign`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (response.status === 404) {
    // A 404 from this endpoint proves OUL no longer has the task, so the local
    // list is stale. Drop it, rather than leaving a button that can never succeed.
    useProductStore().removeUppgift(uppgiftId);
    throw new UppgiftGoneError();
  }

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  // Unlike reassign, this endpoint answers 204 with no body — parsing it would
  // throw on success, so the response is deliberately not read.
  useProductStore().removeUppgift(uppgiftId);

  // replace, not push: the task no longer exists for this handläggare, so leaving
  // /items/<id> in history means Back lands on a task OppnadUppgift can no longer
  // resolve and reports as a missing micro frontend.
  router.replace("/");
}
