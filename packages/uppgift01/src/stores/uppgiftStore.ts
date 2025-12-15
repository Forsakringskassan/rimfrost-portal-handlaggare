import { defineStore } from "pinia";
import type { GetDataResponse } from "../types";

export const useProductStore = defineStore("uppgiftStore", {
  state: () => ({
    uppgift: null as GetDataResponse | null,
    errors: [] as string[],
  }),
  actions: {
    setUppgift(uppgift: GetDataResponse | null) {
      this.uppgift = uppgift;
    },
    setErrors(errors: string[]) {
      this.errors = errors;
    },
  },
});
