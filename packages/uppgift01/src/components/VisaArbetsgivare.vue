<script setup lang="ts">
import { computed } from "vue";
import { FStaticField } from "@fkui/vue";
import kunduppgifter from "../assets/mockKunduppgifter-new.json";
import { useProductStore } from "../stores/uppgiftStore";
import ListaDatum from "./ListaDatum.vue";

const store = useProductStore();

const selected = computed(() => {
  let kund = null;

  if (typeof store.kundbehovsflodeId === "number") {
    kund =
      kunduppgifter.find(
        (kund) => kund.kundbehovsflodeId === store.kundbehovsflodeId,
      ) ?? kunduppgifter[0];
  }
  return kund;
});
</script>

<template>
  <div>
    <f-static-field>
      <template #label><span>Namn</span></template>
      <template #default>
        <span>{{ selected?.anstallning?.organisationsnamn ?? "" }}</span>
      </template>
    </f-static-field>
    <!-- <f-static-field>
      <template #label><span>Adress</span></template>
      <template #default>
        <span>{{ selected?.anstallning?.adress ?? "" }}</span>
      </template>
    </f-static-field> -->
    <!-- <f-static-field>
      <template #label>
        <span>Kontaktperson</span>
      </template>
      <template #default>
        <span>{{ selected?.anstallning?.kontaktperson ?? "" }}</span>
      </template>
    </f-static-field> -->
    <!-- <f-static-field>
      <template #label>
        <span>Telefonnummer</span>
      </template>
      <template #default>
        <span>{{ selected?.anstallning?.telefon ?? "" }}</span>
      </template>
    </f-static-field> -->
    <ListaDatum />
  </div>
</template>

<style scoped>
.output-field {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 1rem;
  & .label span {
    font-weight: bold;
  }
}
</style>
