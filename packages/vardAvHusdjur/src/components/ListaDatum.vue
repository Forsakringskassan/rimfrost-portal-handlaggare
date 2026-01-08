<script setup lang="ts">
import { reactive, watch } from "vue";
import { FButton, FFieldset, FRadioField, FValidationForm } from "@fkui/vue";
import { useProductStore } from "../stores/VAHStore";
import type { Ersattning } from "../types";
import { setKlar } from "../utils/setKlar";

const store = useProductStore();

const selections = reactive<Record<string, "JA" | "NEJ" | undefined>>({});

watch(
  () => store.uppgift?.ersattning,
  (ersattning) => {
    if (ersattning) {
      ersattning.forEach((item: Ersattning) => {
        if (item.beslutsutfall) {
          selections[item.ersattningId] = item.beslutsutfall as "JA" | "NEJ";
        }
      });
    }
  },
  { immediate: true },
);

function handleSubmit() {
  setKlar();
}
</script>

<template>
  <div v-if="store.uppgift?.ersattning">
    <f-validation-form @submit.prevent="handleSubmit">
      <template #error-message>
        <p>Du har glömt fylla i något. Gå till fältet som är markerat.</p>
      </template>

      <div
        v-for="item in store.uppgift?.ersattning"
        :key="item.ersattningId"
        class="radio-container"
      >
        <f-fieldset
          v-validation.required
          :name="`arende-utfall-${String(item.ersattningId)}`"
        >
          <template #label>
            <div class="ersattning-info-container">
              <div class="ersattning-info-item">
                <p>Datum:</p>
                <span>{{ item.from }}</span
                ><span v-if="item.from != item.tom"> - {{ item.tom }}</span>
              </div>
              <div v-if="item.omfattningProcent" class="ersattning-info-item">
                <p>Omfattning:</p>
                <span>{{ item.omfattningProcent }}%</span>
              </div>
            </div>
          </template>

          <template #error-message="{ hasError, validationMessage }">
            <div class="error-list">
              <p v-if="hasError">
                {{ validationMessage }}
              </p>
            </div>
          </template>

          <template #default="{ sharedName }">
            <f-radio-field
              v-model="selections[String(item.ersattningId)]"
              :name="sharedName"
              value="JA"
            >
              Godkänd
            </f-radio-field>

            <f-radio-field
              v-model="selections[String(item.ersattningId)]"
              :name="sharedName"
              value="NEJ"
            >
              Avslag
            </f-radio-field>
          </template>
        </f-fieldset>
      </div>

      <f-button type="submit">Klarmarkera</f-button>
    </f-validation-form>
  </div>
</template>

<style scoped>
.radio-container {
  min-width: 7rem;
  max-width: 25rem;
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

.ersattning-info-container {
  display: flex;
  flex-direction: column;
  width: fit-content;
  & p {
    width: 6rem;
  }
}

.ersattning-info-item {
  display: flex;
  gap: 0.5rem;
}
</style>
