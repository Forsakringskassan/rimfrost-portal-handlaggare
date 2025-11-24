<!--
This component displays what will later be embedded as a GUI
sent from the corresponding regel system
-->

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { type Uppgift, getItemById } from "../utils/useItems";

const route = useRoute();
const item = ref<Uppgift | null>(null);
const loading = ref(false);
const error = ref<string | null>(null);

const pageTitle = computed(() => route.query.title ?? "Ingen titel");
const pageId = computed(() => route.params.id ?? "Inget ID");

async function loadUppgift() {
  error.value = null;
  loading.value = true;

  try {
    const id = Number(route.params.id);
    item.value = await getItemById(id);
    if (!item.value) {
      error.value = `Item ${id} not found`;
    }
  } catch (error: unknown) {
    error.value = error?.message ?? "Failed to load";
  } finally {
    loading.value = false;
  }
}

onMounted(loadUppgift);
watch(() => route.params.id, loadUppgift);
</script>

<template>
  <h1>{{ pageTitle }} - {{ pageId }}</h1>
</template>
