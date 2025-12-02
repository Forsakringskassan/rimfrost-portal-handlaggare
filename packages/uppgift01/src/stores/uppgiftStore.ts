import { defineStore } from "pinia";

export const useProductStore = defineStore("uppgiftStore", {
  state: () => ({
    kundbehovsflodeId: null as string | null,
  }),
  actions: {
    setKundbehovsflodeId(id: string | null) {
      this.kundbehovsflodeId = id;
    },
  },
});
