import { defineStore } from "pinia";

export const useProductStore = defineStore("uppgiftStore", {
  state: () => ({
    kundbehovsflodeId: "",
  }),
  actions: {
    setKundbehovsflodeId(id: string | null) {
      this.kundbehovsflodeId = id ? id : "";
    },
  },
});
