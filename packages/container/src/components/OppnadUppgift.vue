<script setup lang="ts">
import type { App } from "vue";
import Uppgift01App from "remoteApp/Uppgift01App";
import { useRoute } from "vue-router";

// interface UppgiftModule {
//   init: (
//     mountSelector: string,
//     props: {
//       kundbehovsflodeId: string | null;
//       regeltyp: string | null;
//     },
//   ) => App;
// }

const route = useRoute();
console.log(route);
</script>

<template>
  <!-- This element is the micro-frontend mount target -->
  <div id="imported-uppgift-01" ref="containerEl">
    <Uppgift01App />
  </div>
</template>
