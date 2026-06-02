import { defineStore } from "pinia";
import type { OperativUppgiftItem } from "../types";

export const useProductStore = defineStore("uppgiftStore", {
  state: () => ({
    uppgiftLista: [] as OperativUppgiftItem[],
    hasFetched: false,
  }),
  actions: {
    setUppgiftLista(uppgiftLista: OperativUppgiftItem[]) {
      this.uppgiftLista = uppgiftLista;
      this.hasFetched = true;
    },
  },
});
