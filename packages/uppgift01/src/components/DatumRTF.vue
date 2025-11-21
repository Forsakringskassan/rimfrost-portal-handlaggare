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
    <div v-for="item in filteredDatum" :key="item.datumVarde">
      <label>
        <input type="checkbox" :checked="item.rattTillForsakring" />
        {{ item.datumVarde }}
      </label>
    </div>
  </div>
</template>
