<script setup lang="ts">
import type { Component } from "vue";
import { computed, onErrorCaptured, ref, shallowRef, watch } from "vue";
import { loadRemoteModule } from "../utils/loadRemoteModule";

/**
 * Laddar processens mikrofrontend (processvyn) för den öppnade uppgiften
 * (PORT-FR-08). Processvyn är ett tillägg: om den inte kan laddas, eller kastar
 * fel när den visas, döljs den utan felmeddelande så att uppgiftens
 * mikrofrontend och portalen fungerar som vanligt (PORT-FR-08.4).
 */
const props = defineProps<{
  processvyUrl?: string | null;
  handlaggningId?: string | null;
  aktivitetId?: string | null;
}>();

const ProcessComponent = shallowRef<Component | null>(null);
const failed = ref(false);
// Guards against a slow load for a previous uppgift overwriting the current one.
let loadCount = 0;

// Route-manifest key from the last segment of the url, e.g. "/process/vah" →
// "vah" (PORT-FR-08.1). Empty segments are skipped so a trailing slash works.
const processKey = computed(
  () => props.processvyUrl?.split("/").filter(Boolean).pop() ?? "",
);

async function loadProcessvy(key: string): Promise<void> {
  const current = ++loadCount;
  ProcessComponent.value = null;
  failed.value = false;

  // A task without processvyUrl has no processvy (PORT-FR-08.5).
  if (!key) {
    return;
  }

  try {
    const component = await loadRemoteModule(key);
    if (current === loadCount) {
      ProcessComponent.value = component;
    }
  } catch (err) {
    // ProcessComponent stays null, so nothing is rendered.
    console.warn(`Kunde inte ladda processvyn för "${key}":`, err);
  }
}

watch(processKey, loadProcessvy, { immediate: true });

// A render error inside the remote must not propagate to the portal.
onErrorCaptured((err) => {
  failed.value = true;
  console.warn("Processvyn kastade ett fel och döljs:", err);
  return false;
});
</script>

<template>
  <div v-if="ProcessComponent && !failed" class="process-vy">
    <component :is="ProcessComponent" :handlaggning-id :aktivitet-id />
  </div>
</template>

<style scoped>
.process-vy {
  margin-bottom: 1.5rem;
}

/* The remote may choose to render nothing (e.g. an unknown aktivitetId), which
   would otherwise leave the margin as an empty gap above the uppgift. */
.process-vy:empty {
  display: none;
}
</style>
