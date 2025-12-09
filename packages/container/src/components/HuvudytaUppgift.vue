<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

const pageTitle = computed(() => route.query.title ?? "Ingen titel");
const pageId = computed(() => route.params.id ?? "Inget ID");
</script>

<template>
  <div class="container">
    <h1 v-if="route.params.id" class="page-title">
      {{ pageTitle }} - {{ pageId }}
    </h1>
    <router-view />
  </div>
</template>

<style scoped>
.page-title {
  margin-top: 1rem;
  margin-bottom: 1.5rem;
}
</style>
