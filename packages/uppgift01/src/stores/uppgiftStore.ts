import { defineStore } from "pinia";

export const useProductStore = defineStore("uppgiftStore", {
  state: () => ({
    uppgiftId: null as number | null,
  }),
  actions: {
    setUppgiftId(id: number | null) {
      this.uppgiftId = id;
    },
  },
});
