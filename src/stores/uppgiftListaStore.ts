import { defineStore } from "pinia";
import type { OperativUppgiftItem } from "../types";

export const useProductStore = defineStore("uppgiftStore", {
  state: () => ({
    uppgiftLista: [] as OperativUppgiftItem[],
  }),
  actions: {
    setUppgiftLista(uppgiftLista: OperativUppgiftItem[]) {
      this.uppgiftLista = uppgiftLista;
    },
  },
});
