<script setup lang="ts">
import { computed, ref, watch, shallowRef } from "vue";
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

const remoteName = computed(() => {
  const url = (currentUppgift.value as any)?.url || "rtf-manuell";
  return url.split('/').pop() || "rtf-manuell";
});

async function loadComponent() {
  isLoading.value = true;
  error.value = null;

  try {
    const component = await loadRemoteModule(remoteName.value);
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
    <div v-if="isLoading">Laddar komponent...</div>
    <div v-else-if="error">{{ error }}</div>
    <component
      v-else-if="RemoteComponent"
      :is="RemoteComponent"
      :key="componentKey"
      :handlaggning-id="handlaggningId"
    />
    <div v-else>Ingen uppgift vald</div>
  </div>
</template>
