import { ref } from "vue";
import { defineStore } from "pinia";

export interface PagaendeSamtal {
  personnummer?: string;
}

/**
 * The call the handläggare is in right now. Used to prefill the
 * personnummer in Skapa uppgift and Skapa anteckning. Always empty until the
 * telephony integration fills it in.
 */
export const useSamtalStore = defineStore("samtalStore", () => {
  const pagaendeSamtal = ref<PagaendeSamtal>({});

  function setPagaendeSamtal(samtal: PagaendeSamtal) {
    pagaendeSamtal.value = samtal;
  }

  return { pagaendeSamtal, setPagaendeSamtal };
});
