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
      (item) => item.kundbehovsflodeId === kundbehovsflodeId.value
    );
  });

  const regeltyp = computed(() => {
    return (currentUppgift.value as any)?.path || 'regel/rtf-manuell';
  });

  async function loadComponent(path: string, kundbehovsflodeIdValue: string) {
    console.log("Loading component for path:", path, "and kundbehovsflodeId:", kundbehovsflodeIdValue);
    isLoading.value = true;
    error.value = null;

    try {
      const component = await loadRemoteModule(path, kundbehovsflodeIdValue, './VardAvHusdjur');
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
        const path = (uppgift as any).path || 'regel/rtf-manuell';
        console.log("Uppgift found, loading component for path:", path);
        loadComponent(path, kundbehovsflodeId.value);
      }
      componentKey.value++;
    },
    { immediate: true }
  )

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
