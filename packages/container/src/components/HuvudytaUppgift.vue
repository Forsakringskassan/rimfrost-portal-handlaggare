<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import ArendeActions from "./ArendeActions.vue";
import OppnatArende from "./OppnatArende.vue";

const route = useRoute();

const pageTitle = computed(() => route.query.title ?? "Ingen titel");
const pageId = computed(() => route.params.id ?? "Inget ID");
</script>

<template>
  <div class="container">
    <h1 class="page-title">{{ pageTitle }} - {{ pageId }}</h1>
    <OppnatArende />
    <ArendeActions />
  </div>
</template>

<style scoped>
.page-title {
  margin-top: 1rem;
  margin-bottom: 1.5rem;
}
</style>
