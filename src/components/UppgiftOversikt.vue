<script setup lang="ts">
import { useViewStore } from "../stores/viewStore";
import IngenUppgiftVald from "./IngenUppgiftVald.vue";
import SokUppgift from "./SokUppgift.vue";
import TeamUppgiftLista from "./TeamUppgiftLista.vue";

const viewStore = useViewStore();
</script>

<template>
  <TeamUppgiftLista v-if="viewStore.uppgiftVy === 'team'" />
  <SokUppgift v-else-if="viewStore.uppgiftVy === 'sok'" />
  <IngenUppgiftVald v-else />
</template>
