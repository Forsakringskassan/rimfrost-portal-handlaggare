<script setup lang="ts">
import { computed, ref, watch, shallowRef } from "vue";
import { FLoader } from "@fkui/vue";
import { useRoute } from "vue-router";
import { storeToRefs } from "pinia";
import { useProductStore } from "../stores/uppgiftListaStore";
import { loadRemoteModule } from "../utils/loadRemoteModule";

const route = useRoute();
const store = useProductStore();
const { uppgiftLista } = storeToRefs(store);

const handlaggningId = computed(() => route.params.id as string | null);
const componentKey = ref(0);

const RemoteComponent = shallowRef<any>(null);
const isLoading = ref(false);
const error = ref<string | null>(null);

const currentUppgift = computed(() => {
  if (!handlaggningId.value) return null;
  return uppgiftLista.value.find(
    (item) => item.handlaggningId === handlaggningId.value,
  );
});

const regeltyp = computed(() => {
  const url = (currentUppgift.value as any)?.url || "remoteExample";
  // Remove leading slash if present to avoid double slashes in API paths
  return url.startsWith("/") ? url.slice(1) : url;
});

async function loadComponent() {
  isLoading.value = true;
  error.value = null;

  try {
    const component = await loadRemoteModule(regeltyp.value);
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
    if (uppgift && handlaggningId.value) {
      loadComponent();
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

    <div v-if="error">{{ error }}</div>
    <component
      v-else-if="RemoteComponent"
      :is="RemoteComponent"
      :key="componentKey"
      :handlaggning-id="handlaggningId"
      :regeltyp="regeltyp"
    />
  </div>
</template>
