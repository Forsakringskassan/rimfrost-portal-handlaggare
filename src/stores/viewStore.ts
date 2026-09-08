import { defineStore } from "pinia";

export const useViewStore = defineStore("viewStore", {
  state: () => ({
    uppgiftVy: "mina" as "mina" | "team",
  }),
  actions: {
    setVy(vy: "mina" | "team") {
      this.uppgiftVy = vy;
    },
  },
});
