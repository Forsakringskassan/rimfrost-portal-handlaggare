<script setup lang="ts">
import { computed } from "vue";
import { FStaticField } from "@fkui/vue";
import kunduppgifter from "../assets/mockKunduppgifter.json";
import { useProductStore } from "../stores/uppgiftStore";

const store = useProductStore();

const selected = computed(() => {
  let kund = null;

  if (typeof store.uppgiftId === "number") {
    kund =
      kunduppgifter.find((kund) => kund.uppgiftId === store.uppgiftId) ??
      kunduppgifter[0];
  }
  return kund;
});
</script>

<template>
  <div>
    <f-static-field>
      <template #label><span>Folkbokförd</span></template>
      <template #default>
        <span>{{ selected?.adress?.folkbokförd ? "Ja" : "Nej" }}</span>
      </template>
    </f-static-field>
    <f-static-field>
      <template #label><span>Gata</span></template>
      <template #default>
        <span>{{
          selected?.adress?.gata && selected?.adress?.nummer
            ? `${selected.adress.gata} ${selected.adress.nummer}`
            : ""
        }}</span>
      </template>
    </f-static-field>
    <f-static-field>
      <template #label><span>Postnummer</span></template>
      <template #default>
        <span>{{ selected?.adress?.postnummer ?? "" }}</span>
      </template>
    </f-static-field>
    <f-static-field>
      <template #label>
        <span>Stad</span>
      </template>
      <template #default>
        <span>{{ selected?.adress?.stad ?? "" }}</span>
      </template>
    </f-static-field>
  </div>
</template>

<style scoped></style>
