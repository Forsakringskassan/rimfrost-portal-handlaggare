import { ref } from "vue";
import { defineStore } from "pinia";
import type { Handlaggare } from "../types";

export const useHandlaggareStore = defineStore("handlaggareStore", () => {
  const handlaggare = ref<Handlaggare[]>([]);
  const valdHandlaggare = ref<Handlaggare | null>(null);

  function setValdHandlaggare(handlaggarId: string) {
    const hittad = handlaggare.value.find(
      (h) => h.handlaggarId === handlaggarId,
    );
    if (hittad) {
      valdHandlaggare.value = hittad;
    }
  }

  async function fetchHandlaggare() {
    const bffUrl = import.meta.env.VITE_BFF_URL ?? "";
    try {
      const response = await fetch(`${bffUrl}/handlaggare`);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const data = await response.json();
      handlaggare.value = data.handlaggare;
      if (handlaggare.value.length > 0) {
        valdHandlaggare.value = handlaggare.value[0];
      }
    } catch (error) {
      console.error("Fel vid hämtning av handläggare:", error);
    }
  }

  return {
    handlaggare,
    valdHandlaggare,
    setValdHandlaggare,
    fetchHandlaggare,
  };
});
