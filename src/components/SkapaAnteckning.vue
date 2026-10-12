<script setup lang="ts">
import { onMounted, ref, useTemplateRef, watch } from "vue";
import { FButton, FTextareaField } from "@fkui/vue";
import { useSamtalStore } from "../stores/samtalStore";
import { PERSONNUMMER_FEL, normalizePersonnummer } from "../utils/personnummer";
import { useToast } from "../utils/useToast";
import PersonnummerFalt from "./PersonnummerFalt.vue";

const emit = defineEmits<{
  tillbaka: [];
}>();

const samtalStore = useSamtalStore();
const toast = useToast();
const rubrik = useTemplateRef("rubrik");

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

onMounted(() => {
  rubrik.value?.focus();
});
</script>

<template>
  <section class="skapa-anteckning">
    <h2 ref="rubrik" class="h3" tabindex="-1">Skapa anteckning</h2>
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
      <div class="button-group">
        <FButton type="submit" class="button-group__item">Spara</FButton>
        <FButton
          variant="secondary"
          class="button-group__item"
          @click="emit('tillbaka')"
          >Tillbaka</FButton
        >
      </div>
    </form>
  </section>
</template>

<style scoped>
.skapa-anteckning h2:focus {
  outline: none;
}

.skapa-anteckning :deep(.textarea-field) {
  max-width: 40rem;
}
</style>
