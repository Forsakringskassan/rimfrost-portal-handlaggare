<script setup lang="ts">
import type { Uppgiftstyp } from "../types";

defineProps<{
  typer: Uppgiftstyp[];
  visaKategori?: boolean;
}>();

const emit = defineEmits<{
  valj: [typ: Uppgiftstyp];
}>();
</script>

<template>
  <!-- Native buttons so every choice is reached with Tab and chosen with
       Enter or space (PORT-NFR-04.2). -->
  <ul class="uppgiftstyp-lista">
    <li v-for="typ in typer" :key="typ.id">
      <button
        type="button"
        class="uppgiftstyp-lista__val"
        :data-uppgiftstyp-id="typ.id"
        @click="emit('valj', typ)"
      >
        <span class="uppgiftstyp-lista__namn">{{ typ.namn }}</span>
        <span v-if="visaKategori" class="uppgiftstyp-lista__kategori">
          {{ typ.kategori }}
        </span>
      </button>
    </li>
  </ul>
</template>

<style scoped>
.uppgiftstyp-lista {
  list-style: none;
  margin: 0;
  padding: 0;
}

.uppgiftstyp-lista__val {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 0.25rem 0.75rem;
  width: 100%;
  padding: 0.5rem 0.25rem;
  border: none;
  border-bottom: 1px solid var(--fkds-color-border-weak, #e0e0e0);
  background: none;
  font: inherit;
  text-align: left;
  cursor: pointer;
  color: inherit;
}

.uppgiftstyp-lista__val:hover .uppgiftstyp-lista__namn {
  text-decoration: underline;
}

.uppgiftstyp-lista__val:focus-visible {
  outline: 2px solid var(--fkds-color-action-border-primary-focus, #1b1e23);
  outline-offset: 2px;
}

.uppgiftstyp-lista__namn {
  color: var(--fkds-color-action-text-primary-default, #0b6ba3);
  font-weight: 600;
}

.uppgiftstyp-lista__kategori {
  font-size: 0.875rem;
  color: var(--fkds-color-text-secondary, #5c5c5c);
}
</style>
