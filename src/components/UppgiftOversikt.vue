<script setup lang="ts">
import { useViewStore } from "../stores/viewStore";
import IngenUppgiftVald from "./IngenUppgiftVald.vue";
import SkapaUppgift from "./SkapaUppgift.vue";
import SokUppgift from "./SokUppgift.vue";
import TeamUppgiftLista from "./TeamUppgiftLista.vue";

const viewStore = useViewStore();
</script>

<template>
  <TeamUppgiftLista v-if="viewStore.uppgiftVy === 'team'" />
  <SokUppgift v-else-if="viewStore.uppgiftVy === 'sok'" />
  <SkapaUppgift v-else-if="viewStore.uppgiftVy === 'skapa'" />
  <IngenUppgiftVald v-else />
</template>
