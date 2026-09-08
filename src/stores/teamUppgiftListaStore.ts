import { defineStore } from "pinia";
import type { OperativUppgiftItem } from "../types";

export const useTeamUppgiftListaStore = defineStore("teamUppgiftListaStore", {
  state: () => ({
    teamUppgiftLista: [] as OperativUppgiftItem[],
    hasFetched: false,
  }),
  actions: {
    setTeamUppgiftLista(teamUppgiftLista: OperativUppgiftItem[]) {
      this.teamUppgiftLista = teamUppgiftLista;
      this.hasFetched = true;
    },
  },
});
