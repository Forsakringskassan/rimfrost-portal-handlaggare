<script setup lang="ts">
import { computed, ref, watch, shallowRef } from "vue";
import type { Component } from "vue";
import { FLoader } from "@fkui/vue";
import { useRoute, useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { useProductStore } from "../stores/uppgiftListaStore";
import { loadRemoteModule } from "../utils/loadRemoteModule";
import { checkSidStatus } from "../utils/checkSidStatus";
import { ManifestLoadError } from "../config/remoteRegistry";
import type { HandlaggarId } from "../types";

const route = useRoute();
const router = useRouter();
const store = useProductStore();
const { uppgiftLista, hasFetched } = storeToRefs(store);

const handlaggningId = computed(() => route.params.id as string | null);
const componentKey = ref(0);
const loadedHandlaggningId = ref<string | null>(null);

const RemoteComponent = shallowRef<Component | null>(null);
const isLoading = ref(false);
const error = ref<string | null>(null);

const currentUppgift = computed(() => {
  if (!handlaggningId.value) return null;
  return uppgiftLista.value.find(
    (item) => item.handlaggningId === handlaggningId.value,
  );
});

const remoteKey = computed(() => {
  const url = currentUppgift.value?.url ?? "";
  return url.split("/").pop() || handlaggningId.value || "";
});

async function loadComponent() {
  if (!remoteKey.value) {
    error.value = "Uppgiften saknar en giltig url — kan inte ladda komponent";
    return;
  }

  isLoading.value = true;
  error.value = null;
  RemoteComponent.value = null;

  try {
    const component = await loadRemoteModule(remoteKey.value);
    RemoteComponent.value = component;
  } catch (err) {
    if (err instanceof ManifestLoadError) {
      error.value =
        "Kunde inte ladda applikationskonfigurationen. Ladda om sidan.";
    } else {
      error.value = `Kunde inte ladda komponent för "${remoteKey.value}". Kontrollera att micro-frontenden körs.`;
    }
    console.error(err);
  } finally {
    isLoading.value = false;
  }
}

async function logSidStatus(individer: HandlaggarId[]) {
  try {
    const sidFinns = await checkSidStatus(individer);
    console.log(`SID finns i ärendet: ${sidFinns ? "ja" : "nej"}`);
  } catch (err) {
    console.error("Kunde inte hämta SID-status:", err);
  }
}

watch(
  [currentUppgift, handlaggningId, hasFetched],
  ([uppgift, id, fetched]) => {
    if (!id || id === loadedHandlaggningId.value) return;

    if (uppgift) {
      loadedHandlaggningId.value = id;
      loadComponent();
      logSidStatus(uppgift.individer ?? []);
    } else if (!fetched) {
      // Task list hasn't loaded yet — wait for it
      return;
    } else if (!uppgiftLista.value.some((u) => u.handlaggningId === id)) {
      // id is not an uppgift — treat as a direct manifest key
      loadedHandlaggningId.value = id;
      loadComponent();
    } else {
      router.push("/");
    }
  },
  { immediate: true },
);

watch(
  () => route.params.id,
  () => {
    componentKey.value++;
  },
);
</script>

<template>
  <div class="oppnad-uppgift">
    <f-loader
      :show="isLoading"
      :delay="true"
      style="
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 18.75rem;
        margin-top: 10vh !important;
      "
    >
      Vänligen vänta
    </f-loader>

    <div v-if="error" class="error-message">{{ error }}</div>

    <component
      v-else-if="RemoteComponent"
      :is="RemoteComponent"
      :key="componentKey"
      :handlaggning-id="handlaggningId"
    />
  </div>
</template>

<style scoped>
.error-message {
  color: red;
  padding: 1rem;
}
</style>
