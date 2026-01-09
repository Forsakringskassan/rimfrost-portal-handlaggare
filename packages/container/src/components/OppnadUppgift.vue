<script setup lang="ts">
import { computed, ref, watch } from "vue";
import VardAvHusdjur from "remoteApp/VardAvHusdjur";
import { useRoute } from "vue-router";

const route = useRoute();
const kundbehovsflodeId = computed(() => route.params.id as string | null);
const regeltyp = computed(() => route.params.regeltyp as string | null);
const componentKey = ref(0);

watch(
  () => route.params.id,
  () => {
    componentKey.value++;
  },
);
</script>

<template>
  <div>
    <VardAvHusdjur :key="componentKey" :kundbehovsflode-id :regeltyp />
  </div>
</template>
