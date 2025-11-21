<script setup lang="ts">
import type { App } from "vue";
import { onBeforeUnmount, ref, watch } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

let currentVueApp: App | null = null;
const mountKey = ref(0);

async function loadUppgift() {
  // Unmount previous Vue app instance if it exists
  if (currentVueApp) {
    try {
      currentVueApp.unmount();
    } catch (err) {
      console.warn("Failed to unmount previous app:", err);
    }
    currentVueApp = null;
  }

  // Force re-render of the container
  mountKey.value++;

  // Wait for next tick to ensure DOM is updated
  await new Promise((resolve) => setTimeout(resolve, 0));

  const container = document.getElementById("imported-uppgift-01");
  if (!container) {
    console.error("Container not found");
    return;
  }

  try {
    const response = await fetch("/api/hamta-uppgifter");
    const result = await response.json();

    const moduleUrl = result?.[0]?.url;
    if (!moduleUrl) {
      return;
    }

    // Import directly - CORS is enabled on the preview server
    // This allows Vite to properly handle CSS and other assets
    const importedUppgift01 = await import(/* @vite-ignore */ moduleUrl);

    const id = Number(route.params.id);
    currentVueApp = importedUppgift01.init("#imported-uppgift-01", {
      uppgiftId: isNaN(id) ? undefined : id,
    });
  } catch (err) {
    console.error("Failed to load uppgift module:", err);
  }
}

watch(() => route.params.id, loadUppgift, { immediate: true });

onBeforeUnmount(() => {
  if (currentVueApp) {
    try {
      currentVueApp.unmount();
    } catch (err) {
      console.warn("Failed to unmount app:", err);
    }
    currentVueApp = null;
  }
});
</script>

<template>
  <div id="imported-uppgift-01" :key="mountKey"></div>
</template>
