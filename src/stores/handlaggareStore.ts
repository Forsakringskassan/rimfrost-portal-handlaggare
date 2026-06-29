import { ref } from "vue";
import { defineStore } from "pinia";
import { env } from "../config/env";
import type { Handlaggare } from "../types";

const DEV_SESSION_KEY = "dev_handlaggare_typId";

function createDevToken(typId: string, varde: string): string {
  return `${typId}:${varde}`;
}

export const useHandlaggareStore = defineStore("handlaggareStore", () => {
  const handlaggare = ref<Handlaggare[]>([]);
  const selectedHandlaggare = ref<Handlaggare | null>(null);
  const isAuthenticated = ref(false);
  const bearerToken = ref<string | null>(null);

  function setSelectedHandlaggare(varde: string) {
    const found = handlaggare.value.find(
      (handlaggare) => handlaggare.handlaggarId.varde === varde,
    );
    if (found) {
      selectedHandlaggare.value = found;
    }
  }

  function login(varde: string) {
    setSelectedHandlaggare(varde);
    isAuthenticated.value = true;
    localStorage.setItem(DEV_SESSION_KEY, varde);
    const handlaggarId = selectedHandlaggare.value?.handlaggarId;
    if (handlaggarId) {
      bearerToken.value = createDevToken(
        handlaggarId.typId,
        handlaggarId.varde,
      );
    }
  }

  function logout() {
    selectedHandlaggare.value = null;
    isAuthenticated.value = false;
    bearerToken.value = null;
    localStorage.removeItem(DEV_SESSION_KEY);
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
      selectedHandlaggare.value = data.handlaggare[0] ?? null;

      const savedTypId = localStorage.getItem(DEV_SESSION_KEY);
      if (savedTypId) {
        login(savedTypId);
      }
    } catch (error) {
      console.error("Fel vid hämtning av handläggare:", error);
    }
  }

  return {
    handlaggare,
    selectedHandlaggare,
    isAuthenticated,
    bearerToken,
    login,
    logout,
    setSelectedHandlaggare,
    fetchHandlaggare,
  };
});
