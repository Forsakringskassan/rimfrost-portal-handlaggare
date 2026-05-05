import { ref } from "vue";
import { defineStore } from "pinia";
import { env } from "../config/env";
import type { Handlaggare } from "../types";

export const useHandlaggareStore = defineStore("handlaggareStore", () => {
  const handlaggare = ref<Handlaggare[]>([]);
  const selectedHandlaggare = ref<Handlaggare | null>(null);

  function setSelectedHandlaggare(typId: string) {
    const found = handlaggare.value.find(
      (handlaggare) => handlaggare.handlaggarId.typId === typId,
    );
    if (found) {
      selectedHandlaggare.value = found;
    }
  }

  async function fetchHandlaggare() {
    const bffUrl = env.bffUrl;
    try {
      const response = await fetch(`${bffUrl}/handlaggare`);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const data = await response.json();

      if (!Array.isArray(data.handlaggare)) {
        throw new Error(
          "Oväntat format från backend — handlaggare är inte en array",
        );
      }

      handlaggare.value = data.handlaggare;
      selectedHandlaggare.value = handlaggare.value.at(0) ?? null;
    } catch (error) {
      console.error("Fel vid hämtning av handläggare:", error);
    }
  }

  return {
    handlaggare,
    selectedHandlaggare,
    setSelectedHandlaggare,
    fetchHandlaggare,
  };
});
