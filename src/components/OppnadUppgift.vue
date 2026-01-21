<script setup lang="ts">
import { computed, ref, watch } from "vue";

import ExempelKomponent from "exampleApp/ExempelKomponent";
import VardAvHusdjur from "remoteApp/VardAvHusdjur";
import { useRoute } from "vue-router";

const route = useRoute();
const kundbehovsflodeId = computed(() => route.params.id as string | null);
const regeltyp = computed(() => "rtf-manuell"); // Hardcoded for example
const componentKey = ref(0);

// const AsyncComponent = defineAsyncComponent(() => {
//   const remoteUrl = getRegelApiUrl(
//     "/rtf-manuell/042b3193-ceb6-4edb-95d5-e35675bcdbdc",
//   );
//   return import(/* @vite-ignore */ `${remoteUrl}`).then(
//     (module) => module.default,
//   );
// });

watch(
  () => route.params.id,
  () => {
    componentKey.value++;
  },
);
</script>

<template>
  <div>
    <ExempelKomponent />
    <VardAvHusdjur :key="componentKey" :kundbehovsflode-id :regeltyp />
  </div>
</template>
