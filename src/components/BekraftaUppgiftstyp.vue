<script setup lang="ts">
import { onMounted, ref, useTemplateRef, watch } from "vue";
import { FButton, FTextareaField } from "@fkui/vue";
import { useSamtalStore } from "../stores/samtalStore";
import type { Uppgiftstyp } from "../types";
import { PERSONNUMMER_FEL, normalizePersonnummer } from "../utils/personnummer";
import PersonnummerFalt from "./PersonnummerFalt.vue";

defineProps<{
  typ: Uppgiftstyp;
}>();

const emit = defineEmits<{
  skapa: [personnummer: string];
  tillbaka: [];
}>();

const samtalStore = useSamtalStore();
const rubrik = useTemplateRef("rubrik");

// Prefilled from the ongoing call when known (PORT-FR-10.2).
const personnummer = ref(samtalStore.pagaendeSamtal.personnummer ?? "");
const valideringsfel = ref<string | null>(null);
// Every uppgift can carry a note. Type-specific fields wait until we know
// how the uppgift is processed (PORT-FR-10.1). Not logged or stored
// (PORT-NFR-04.4).
const anteckning = ref("");

watch(personnummer, () => {
  valideringsfel.value = null;
});

function onSubmit(): void {
  const normaliserat = normalizePersonnummer(personnummer.value);
  if (!normaliserat) {
    valideringsfel.value = PERSONNUMMER_FEL;
    return;
  }
  emit("skapa", normaliserat);
}

onMounted(() => {
  // Moves focus into the step that replaced the list (PORT-NFR-04.2).
  rubrik.value?.focus();
});
</script>

<template>
  <section class="bekrafta-uppgiftstyp">
    <h2 ref="rubrik" class="h3" tabindex="-1">{{ typ.namn }}</h2>
    <dl class="bekrafta-uppgiftstyp__typ">
      <dt>Kategori</dt>
      <dd>{{ typ.kategori }}</dd>
    </dl>
    <form novalidate @submit.prevent="onSubmit">
      <PersonnummerFalt
        id="skapa-uppgift-personnummer"
        v-model="personnummer"
        :valideringsfel
      />
      <FTextareaField v-model="anteckning">
        <template #default>Anteckning (valfri)</template>
      </FTextareaField>
      <div class="button-group">
        <FButton type="submit" class="button-group__item"
          >Skapa uppgift</FButton
        >
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
.bekrafta-uppgiftstyp__typ {
  display: grid;
  grid-template-columns: max-content 1fr;
  gap: 0.25rem 1.5rem;
  margin: 0 0 1.5rem;
}

.bekrafta-uppgiftstyp__typ dt {
  font-weight: 600;
}

.bekrafta-uppgiftstyp__typ dd {
  margin: 0;
}

.bekrafta-uppgiftstyp :deep(.textarea-field) {
  max-width: 40rem;
}

.bekrafta-uppgiftstyp h2:focus {
  outline: none;
}
</style>
