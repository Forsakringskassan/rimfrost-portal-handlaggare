<script setup lang="ts">
import type { App } from "vue";
import { nextTick, onBeforeUnmount, ref, useTemplateRef, watch } from "vue";
import { useRoute } from "vue-router";

interface UppgiftModule {
  init: (
    mountSelector: string,
    props: {
      kundbehovsflodeId: string | null;
      regeltyp: string | null;
    },
  ) => App;
}

const route = useRoute();

const containerEl = useTemplateRef<HTMLElement>("containerEl");
const mountKey = ref(0);

let currentVueApp: App | null = null;
let activeCssLink: HTMLLinkElement | null = null;

// Cancels stale loads if route changes quickly
let loadToken = 0;

function cleanupMicroFrontend() {
  if (currentVueApp) {
    try {
      currentVueApp.unmount();
    } catch (err) {
      console.warn("Failed to unmount previous app:", err);
    }
    currentVueApp = null;
  }

  if (activeCssLink) {
    activeCssLink.remove();
    activeCssLink = null;
  }
}

async function ensureCssLoaded(moduleUrl: string) {
  const cssUrl = moduleUrl.replace(/\.js$/, ".css");

  if (activeCssLink) {
    activeCssLink.remove();
    activeCssLink = null;
  }

  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = cssUrl;
  link.dataset.microfe = "uppgift-01";
  document.head.appendChild(link);

  activeCssLink = link;
}

async function loadUppgift() {
  const myToken = ++loadToken;

  // Always clean up first (handles route changes + re-renders)
  cleanupMicroFrontend();

  // Force Vue to recreate the container node (fresh mount target)
  mountKey.value++;
  await nextTick();

  // Abort if a newer navigation/load started while we awaited
  if (myToken !== loadToken) {
    return;
  }

  const mountEl = containerEl.value;
  if (!mountEl) {
    console.error("Mount container ref is missing");
    return;
  }
  if (!mountEl.id) {
    console.error("Mount container has no id; init requires a selector");
    return;
  }

  // Important: init() expects a selector string (it uses document.querySelector internally)
  // CSS.escape ensures the ID is valid even if it starts with a digit
  const mountSelector = `#${CSS.escape(mountEl.id)}`;

  try {
    const response = await fetch("/api/hamta-uppgifter");
    if (!response.ok) {
      throw new Error(`Failed to fetch uppgifter: ${response.status}`);
    }

    const result = await response.json();
    const moduleUrl: unknown = result?.[0]?.url;

    if (typeof moduleUrl !== "string" || moduleUrl.length === 0) {
      return;
    }

    await ensureCssLoaded(moduleUrl);

    // Abort if route changed mid-flight
    if (myToken !== loadToken) {
      return;
    }

    const imported = (await import(
      /* @vite-ignore */ moduleUrl
    )) as UppgiftModule;

    if (typeof imported?.init !== "function") {
      throw new Error("Imported module missing init()");
    }

    const idParam = route.params.id;
    const regeltypParam = route.params.regeltyp;

    currentVueApp = imported.init(mountSelector, {
      kundbehovsflodeId: typeof idParam === "string" ? idParam : null,
      regeltyp: typeof regeltypParam === "string" ? regeltypParam : null,
    });
  } catch (err) {
    console.error("Failed to load uppgift module:", err);
  }
}

// Reload on any route change that could affect the micro FE
watch(
  () => route.fullPath,
  () => {
    void loadUppgift();
  },
  { immediate: true },
);

onBeforeUnmount(() => {
  // Invalidate any in-flight load
  loadToken++;
  cleanupMicroFrontend();
});
</script>

<template>
  <!-- This element is the micro-frontend mount target -->
  <div id="imported-uppgift-01" ref="containerEl" :key="mountKey" />
</template>
