<script setup lang="ts">
import type { Component } from "vue";
import { onMounted, shallowRef } from "vue";
import { loadRemoteModule } from "../utils/loadRemoteModule";

const RemoteComponent = shallowRef<Component | null>(null);

onMounted(async () => {
  RemoteComponent.value = await loadRemoteModule("template");
});
</script>

<template>
  <component
    :is="RemoteComponent"
    v-if="RemoteComponent"
    handlaggning-id="dev-preview"
  />
  <p v-else>Laddar template MFE...</p>
</template>
