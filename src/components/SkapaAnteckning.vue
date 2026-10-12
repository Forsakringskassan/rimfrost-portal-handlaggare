<script setup lang="ts">
import { ref, watch } from "vue";
import { FButton, FTextareaField } from "@fkui/vue";
import { useSamtalStore } from "../stores/samtalStore";
import { PERSONNUMMER_FEL, normalizePersonnummer } from "../utils/personnummer";
import { useToast } from "../utils/useToast";
import PersonnummerFalt from "./PersonnummerFalt.vue";

const samtalStore = useSamtalStore();
const toast = useToast();

// Prefilled from the ongoing call when known (PORT-FR-11.5).
const personnummer = ref(samtalStore.pagaendeSamtal.personnummer ?? "");
const anteckning = ref("");
const personnummerfel = ref<string | null>(null);
const anteckningsfel = ref<string | null>(null);

watch(personnummer, () => {
  personnummerfel.value = null;
});

watch(anteckning, () => {
  anteckningsfel.value = null;
});

function onSubmit(): void {
  // Neither the note nor the personnummer is logged or stored (PORT-NFR-04.4).
  const giltigtPersonnummer = normalizePersonnummer(personnummer.value);
  const harAnteckning = anteckning.value.trim().length > 0;
  personnummerfel.value = giltigtPersonnummer ? null : PERSONNUMMER_FEL;
  anteckningsfel.value = harAnteckning ? null : "Skriv en anteckning.";
  if (!giltigtPersonnummer || !harAnteckning) {
    return;
  }
  // Not saved anywhere yet — storage is a later task (PORT-FR-11.4).
  toast.success("Anteckningen har sparats.");
  anteckning.value = "";
}
</script>

<template>
  <section class="skapa-anteckning">
    <h2 class="h3">Anteckning</h2>
    <form novalidate @submit.prevent="onSubmit">
      <PersonnummerFalt
        id="anteckning-personnummer"
        v-model="personnummer"
        :valideringsfel="personnummerfel"
      />
      <FTextareaField
        v-model="anteckning"
        :aria-invalid="anteckningsfel ? 'true' : undefined"
      >
        <template #default>Anteckning</template>
        <!-- Always passed, with the text inside the v-if: FLabel decides once
             whether the slot has content, and only re-checks when a reactive
             value it read changes. -->
        <template #error-message>
          <template v-if="anteckningsfel">{{ anteckningsfel }}</template>
        </template>
      </FTextareaField>
      <FButton type="submit">Spara</FButton>
    </form>
  </section>
</template>

<style scoped>
.skapa-anteckning :deep(.textarea-field) {
  max-width: 40rem;
}
</style>
