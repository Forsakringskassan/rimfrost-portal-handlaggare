import { defineStore } from "pinia";
import type { UppgiftItem } from "../components/UppgiftLista.vue";

export const useProductStore = defineStore("uppgiftStore", {
  state: () => ({
    uppgiftLista: [] as UppgiftItem[],
  }),
  actions: {
    setUppgiftLista(uppgiftLista: UppgiftItem[]) {
      this.uppgiftLista = uppgiftLista;
    },
  },
});
