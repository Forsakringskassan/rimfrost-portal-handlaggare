import { defineStore } from "pinia";
import type { OperativUppgiftItem } from "../types";

export const useProductStore = defineStore("uppgiftStore", {
  state: () => ({
    uppgiftLista: [] as OperativUppgiftItem[],
    hasFetched: false,
    error: null as string | null,
  }),
  actions: {
    setUppgiftLista(uppgiftLista: OperativUppgiftItem[]) {
      this.uppgiftLista = uppgiftLista;
      this.hasFetched = true;
      this.error = null;
    },
    setError(error: string | null) {
      this.error = error;
      if (error !== null) {
        this.hasFetched = true;
      }
    },
    // Drops a single uppgift without refetching, so the list updates immediately
    // when the handläggare hands a task back (PORT-FR-04.3).
    removeUppgift(uppgiftId: string) {
      this.uppgiftLista = this.uppgiftLista.filter(
        (item) => item.uppgiftId !== uppgiftId,
      );
    },
  },
});
