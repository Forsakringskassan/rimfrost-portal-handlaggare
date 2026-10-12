import { defineStore } from "pinia";

export type UppgiftVy = "mina" | "team" | "sok" | "skapa";

export const useViewStore = defineStore("viewStore", {
  state: () => ({
    uppgiftVy: "mina" as UppgiftVy,
  }),
  actions: {
    setVy(vy: UppgiftVy) {
      this.uppgiftVy = vy;
    },
  },
});
