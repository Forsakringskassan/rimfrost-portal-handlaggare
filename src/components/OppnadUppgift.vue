<script setup lang="ts">
import { computed, ref, watch, shallowRef } from "vue";
import { useRoute } from "vue-router";
import { storeToRefs } from "pinia";
import { useProductStore } from "../stores/uppgiftListaStore";
import { loadRemoteModule } from "../utils/loadRemoteModule";

const route = useRoute();
const store = useProductStore();
const { uppgiftLista } = storeToRefs(store);

const kundbehovsflodeId = computed(() => route.params.id as string | null);
const componentKey = ref(0);

const RemoteComponent = shallowRef<any>(null);
const isLoading = ref(false);
const error = ref<string | null>(null);

const currentUppgift = computed(() => {
  if (!kundbehovsflodeId.value) return null;
  return uppgiftLista.value.find(
    (item) => item.kundbehovsflodeId === kundbehovsflodeId.value,
  );
});

const regeltyp = computed(() => {
  return (currentUppgift.value as any)?.url || "regel/rtf-manuell";
});

async function loadComponent(url: string, kundbehovsflodeIdValue: string) {
  console.log(
    "Loading component for url:",
    url,
    "and kundbehovsflodeId:",
    kundbehovsflodeIdValue,
  );
  isLoading.value = true;
  error.value = null;

  try {
    const component = await loadRemoteModule(
      url,
      kundbehovsflodeIdValue,
      "./VardAvHusdjur",
    );
    RemoteComponent.value = component;
  } catch (err) {
    error.value = `Failed to load component: ${err}`;
  } finally {
    isLoading.value = false;
  }
}

watch(
  currentUppgift,
  (uppgift) => {
    if (uppgift && kundbehovsflodeId.value) {
      const url = (uppgift as any).url || "regel/rtf-manuell";
      console.log("Uppgift found, loading component for url:", url);
      loadComponent(url, kundbehovsflodeId.value);
    }
    componentKey.value++;
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
  <div>
    <div v-if="isLoading">Laddar komponent...</div>
    <div v-else-if="error">{{ error }}</div>
    <component
      v-else-if="RemoteComponent"
      :is="RemoteComponent"
      :key="componentKey"
      :kundbehovsflode-id="kundbehovsflodeId"
      :regeltyp="regeltyp"
    />
    <div v-else>Ingen uppgift vald</div>
  </div>
</template>
