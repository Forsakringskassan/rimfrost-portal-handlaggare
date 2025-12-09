<script setup lang="ts">
import { computed, ref } from "vue";
import { FFieldset, FRadioField, FValidationForm } from "@fkui/vue";
import mockKunduppgifter from "../assets/mockKunduppgifter-new.json";
import { useProductStore } from "../stores/uppgiftStore";
import type { KundData } from "../types";

const store = useProductStore();

const kundData = ref<KundData[]>(JSON.parse(JSON.stringify(mockKunduppgifter)));

const filtreradKund = computed(() => {
  const kund = kundData.value.find(
    (k) => k.kundbehovsflodeId === store.kundbehovsflodeId,
  );
  console.log("filtreradKund", kund);
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
        v-for="item in filtreradKund.ersattning"
        :key="item.ersattningId"
        class="radio-container"
      >
        <f-fieldset
          v-validation.required
          :name="`arende-utfall-${item.ersattningId}`"
        >
          <template #label>
            <div class="ersattning-info-container">
              <div class="ersattning-info-item">
                <p>Datum:</p>
                <span>{{ item.from }} - {{ item.tom }}</span>
              </div>
              <div class="ersattning-info-item">
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

          <template #default>
            <f-radio-field
              v-model="selections[item.ersattningId]"
              value="godkand"
            >
              Godkänd
            </f-radio-field>
            <f-radio-field
              v-model="selections[item.ersattningId]"
              value="avslag"
            >
              Avslag
            </f-radio-field>
            <f-radio-field
              v-model="selections[item.ersattningId]"
              value="utredning"
            >
              Utredning
            </f-radio-field>
          </template>
        </f-fieldset>
      </div>

      <!-- 
      Commented out in mock
      <f-button type="submit">Klarmarkera</f-button> -->
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
