<script setup lang="ts">
import { FStaticField } from "@fkui/vue";
import arbetsgivare from "./assets/mockArbetsgivare.json";
</script>

<template>
  <div class="">
    <h2>Arbetsgivare</h2>
    <f-static-field>
      <template #label><span>Namn</span></template>
      <template #default>
        <span>{{ arbetsgivare[0]?.namn }}</span>
      </template>
    </f-static-field>
    <f-static-field>
      <template #label><span>Adress</span></template>
      <template #default>
        <span>{{ arbetsgivare[0]?.adress }}</span>
      </template>
    </f-static-field>
    <f-static-field>
      <template #label>
        <span>Kontaktperson</span>
      </template>
      <template #default>
        <span>{{ arbetsgivare[0]?.kontaktperson }}</span>
      </template>
    </f-static-field>
    <f-static-field>
      <template #label>
        <span>Telefonnummer</span>
      </template>
      <template #default>
        <span>{{ arbetsgivare[0]?.telefon }}</span>
      </template>
    </f-static-field>
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
