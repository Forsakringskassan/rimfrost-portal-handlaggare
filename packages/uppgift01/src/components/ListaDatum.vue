<script setup lang="ts">
import { computed, ref } from "vue";
import { FButton, FFieldset, FRadioField, FValidationForm } from "@fkui/vue";
import mockKunduppgifter from "../assets/mockKunduppgifter.json";
import { useProductStore } from "../stores/uppgiftStore";
import type { Kund } from "../types";

const store = useProductStore();

const kundData = ref<Kund[]>(JSON.parse(JSON.stringify(mockKunduppgifter)));

const filtreradKund = computed(() => {
  const kund = kundData.value.find((k) => k.uppgiftId === store.uppgiftId);
  return kund || null;
});

const selections = ref<Record<string, string>>({});
</script>

<template>
  <div v-if="filtreradKund">
    <f-validation-form>
      <template #error-message>
        <p>Du har glömt fylla i något. Gå till fältet som är markerat.</p>
      </template>

      <div
        v-for="item in filtreradKund.datum"
        :key="item.datumVarde"
        class="radio-container"
      >
        <f-fieldset
          v-validation.required
          :name="`arende-utfall-${item.datumVarde}`"
        >
          <template #label>
            <p>{{ item.datumVarde }}</p>
          </template>

          <template #error-message="{ hasError, validationMessage }">
            <div class="error-list">
              <p v-if="hasError">
                {{ validationMessage }}
              </p>
            </div>
          </template>

          <template #default>
            <f-radio-field
              v-model="selections[item.datumVarde]"
              value="godkand"
            >
              Godkänd
            </f-radio-field>
            <f-radio-field v-model="selections[item.datumVarde]" value="avslag">
              Avslag
            </f-radio-field>
            <f-radio-field
              v-model="selections[item.datumVarde]"
              value="utredning"
            >
              Utredning
            </f-radio-field>
          </template>
        </f-fieldset>
      </div>

      <f-button type="submit"> Signera och Klarmarkera </f-button>
    </f-validation-form>
  </div>
</template>

<style scoped>
.radio-container {
  min-width: 7rem;
  max-width: 20rem;
  margin-bottom: 1rem;
  display: flex;
  justify-content: space-between;
  border-radius: 0.35rem;
  border: 1px solid black;
  padding: 1.1rem;
}

.fieldset {
  width: auto;
}

.radio-group {
  display: flex;
  gap: 1rem;
}

.button-group {
  margin-top: 2rem;
  display: flex;
  gap: 0.75rem;
}

.radio-button-group {
  margin: 0;
}
</style>
