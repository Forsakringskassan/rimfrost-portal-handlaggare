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
//   ValidationService.setErrorMessages({
//     required: "Detta fält är obligatoriskt.",
//   });
//   if (!filtreradKund.value) {
//     return;
//   }

//   console.log("Radio group state:", {
//     isValid: radioGroup.value.isValid,
//     componentCount: radioGroup.value.componentCount,
//     componentsWithError: radioGroup.value.componentsWithError,
//   });

//   if (!radioGroup.value.isValid) {
//     const missingDates = filtreradKund.value.datum.filter(
//       (item) => !selections.value[item.datumVarde],
//     );

//     const errorMessage =
//       missingDates.length > 0
//         ? `Vänligen fyll i alla val innan du sparar. Saknade datum: ${missingDates.map((d) => d.datumVarde).join(", ")}`
//         : "Vänligen fyll i alla val innan du sparar.";

//     alert(errorMessage);
//     console.log("Missing dates:", missingDates);
//     return;
//   }

//   filtreradKund.value.datum.forEach((datumItem) => {
//     const selection = selections.value[datumItem.datumVarde];
//     if (selection) {
//       datumItem.rattTillForsakring = selection === "godkand";
//     }
//   });

//   console.log("Sparade ändringar:", filtreradKund.value);
// };
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
            <p v-if="hasError">
              {{ validationMessage }}
            </p>
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

      <f-button type="submit"> Submit </f-button>
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
</style>
