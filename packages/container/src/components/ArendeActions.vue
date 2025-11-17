<script setup lang="ts">
import { FButton } from "@fkui/vue";
</script>

<template>
  <div>
    <div class="button-group">
      <f-button variant="primary" size="small">Spara och klarmarkera</f-button>
      <f-button variant="secondary" size="small">Spara</f-button>
    </div>
  </div>
</template>

<style scoped>
.button-group {
  display: flex;
  flex-direction: row-reverse;
  justify-content: end;
  align-items: center;
  gap: 1rem;
}
</style>
