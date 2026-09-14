<script setup lang="ts">
import { useViewStore } from "../stores/viewStore";
import IngenUppgiftVald from "./IngenUppgiftVald.vue";
import TeamUppgiftLista from "./TeamUppgiftLista.vue";

const viewStore = useViewStore();
</script>

<template>
  <TeamUppgiftLista v-if="viewStore.uppgiftVy === 'team'" />
  <IngenUppgiftVald v-else />
</template>
