import { defineStore } from "pinia";
import type { GetDataResponse } from "../types";

export const useProductStore = defineStore("uppgiftStore", {
  state: () => ({
    uppgift: null as GetDataResponse | null,
    regeltyp: "",
  }),
  actions: {
    setUppgift(uppgift: GetDataResponse | null) {
      this.uppgift = uppgift;
    },
    setRegeltyp(regeltyp: string) {
      this.regeltyp = regeltyp;
    },
  },
});
