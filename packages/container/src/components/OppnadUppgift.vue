<script setup lang="ts">
import type { App } from "vue";
import { onBeforeUnmount, ref, watch } from "vue";
import { FButton } from "@fkui/vue";
import { useRoute } from "vue-router";
import { router } from "../router";
import removeUppgift from "../utils/removeUppgift";

const route = useRoute();

let currentVueApp: App | null = null;
const buttonVisible = ref(false);
const mountKey = ref(0);

function goTo() {
  router.push("/");
}

function finishTask() {
  removeUppgift(route.params.id as string);
  goTo();
}

// This whole sections feels meh and hacky, needs proper refactoring
// We might be able to get around all this with Module Federation
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

  buttonVisible.value = false;

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

    // Load CSS file (replace .js with .css in the URL)
    const cssUrl = moduleUrl.replace(/\.js$/, ".css");
    const cssLinkId = "uppgift-css-link";

    const existingLink = document.getElementById(cssLinkId);
    if (existingLink) {
      existingLink.remove();
    }

    // Create new link element for CSS
    const linkElement = document.createElement("link");
    linkElement.id = cssLinkId;
    linkElement.rel = "stylesheet";
    linkElement.href = cssUrl;
    document.head.appendChild(linkElement);

    const importedUppgift01 = await import(/* @vite-ignore */ moduleUrl);

    currentVueApp = importedUppgift01.init("#imported-uppgift-01", {
      kundbehovsflodeId: route.params.id ? route.params.id : null,
    });

    buttonVisible.value = true;
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
  <FButton v-if="buttonVisible" @click="finishTask"> Klarmarkera </FButton>
</template>
