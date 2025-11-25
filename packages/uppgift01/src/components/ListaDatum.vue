<script setup lang="ts">
import { computed } from "vue";
import mockKunduppgifter from "../assets/mockKunduppgifter.json";
import { useProductStore } from "../stores/uppgiftStore";

const store = useProductStore();

const filteredDatum = computed(() => {
  const customer = mockKunduppgifter.find(
    (k) => k.uppgiftId === store.uppgiftId,
  );
  return customer?.datum || [];
});
</script>

<template>
  <div>
    <div
      v-for="item in filteredDatum"
      :key="item.datumVarde"
      class="checkbox-group"
    >
      <p>{{ item.datumVarde }}</p>
      <div>
        <label>
          <input type="checkbox" />
          Godkänd
        </label>
        <label>
          <input type="checkbox" />
          Avslag
        </label>
      </div>
    </div>
  </div>
</template>

<style scoped>
.checkbox-group {
  min-width: 15rem;
  max-width: 30rem;
  margin-bottom: 1rem;
  display: flex;
  justify-content: space-between;
}
</style>
