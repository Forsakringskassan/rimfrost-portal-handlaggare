import { ref } from "vue";
import { defineStore } from "pinia";
import type { Handlaggare } from "../types";

export const useHandlaggareStore = defineStore("handlaggareStore", () => {
  const handlaggare = ref<Handlaggare[]>([]);
  const selectedHandlaggare = ref<Handlaggare | null>(null);

  function setSelectedHandlaggare(handlaggarId: string) {
    const found = handlaggare.value.find(
      (handlaggare) => handlaggare.handlaggarId === handlaggarId,
    );
    if (found) {
      selectedHandlaggare.value = found;
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
      selectedHandlaggare.value = handlaggare.value[0] ?? null;
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
