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
  },
});
