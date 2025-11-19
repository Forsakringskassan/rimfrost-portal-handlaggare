<script setup lang="ts">
import { onBeforeUnmount, watch } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

let currentBlobUrl: string | null = null;

async function loadUppgift() {
  const container = document.getElementById("imported-uppgift-01");
  if (container) {
    container.innerHTML = "";
  }

  try {
    const response = await fetch("/api/hamta-uppgifter");
    const result = await response.json();

    const moduleUrl = result?.[0]?.url;
    if (!moduleUrl) {
      return;
    }

    // Fetch the remote JS as text, create a blob URL and import it
    // Used to bypass CORS issues with dynamic imports
    const jsResp = await fetch(moduleUrl);
    const code = await jsResp.text();

    if (currentBlobUrl) {
      URL.revokeObjectURL(currentBlobUrl);
      currentBlobUrl = null;
    }

    const blob = new Blob([code], { type: "text/javascript" });
    currentBlobUrl = URL.createObjectURL(blob);

    // Suppress Vite static-analysis warning for dynamic runtime import
    const importedUppgift01 = await import(/* @vite-ignore */ currentBlobUrl);

    const id = Number(route.params.id);
    importedUppgift01.init("#imported-uppgift-01", {
      uppgiftId: isNaN(id) ? undefined : id,
    });
  } catch (err) {
    console.error("Failed to load uppgift module:", err);
  }
}

watch(() => route.params.id, loadUppgift, { immediate: true });

onBeforeUnmount(() => {
  if (currentBlobUrl) {
    URL.revokeObjectURL(currentBlobUrl);
    currentBlobUrl = null;
  }
});
</script>

<template>
  <div id="imported-uppgift-01"></div>
</template>
