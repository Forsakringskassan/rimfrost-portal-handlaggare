<script setup lang="ts">
import { computed, ref } from "vue";
import { FButton, FFieldset, FRadioField } from "@fkui/vue";
import mockKunduppgifter from "../assets/mockKunduppgifter.json";
import { useProductStore } from "../stores/uppgiftStore";

interface Kund {
  fornamn: string;
  efternamn: string;
  personnummer: number;
  anstalld: boolean;
  harHund: boolean;
  uppgiftId: number;
  uppgiftsTyp: string;
  uppgiftsStatus: string;
  adress: {
    gata: string;
    nummer: string;
    postnummer: string;
    lagenhetsnummer: string;
    stad: string;
    folkbokford: boolean;
  };
  arbetsgivare: {
    id: number;
    namn: string;
    adress: string;
    kontaktperson: string;
    telefon: string;
    orgNummer?: undefined;
  };
  datum: Array<{
    datumVarde: string;
    rattTillForsakring: boolean;
  }>;
}

const store = useProductStore();

const kundData = ref<Kund[]>(JSON.parse(JSON.stringify(mockKunduppgifter)));

const filtreradKund = computed(() => {
  const kund = kundData.value.find((k) => k.uppgiftId === store.uppgiftId);
  return kund || null;
});

const selections = ref<Record<string, string>>({});

const sparaAndringar = () => {
  if (!filtreradKund.value) {
    return;
  }

  filtreradKund.value.datum.forEach((datumItem) => {
    const selection = selections.value[datumItem.datumVarde];
    if (selection) {
      datumItem.rattTillForsakring = selection === "godkand";
    }
  });

  console.log("Sparade ändringar:", filtreradKund.value);
};
</script>

<template>
  <div v-if="filtreradKund">
    <div
      v-for="item in filtreradKund.datum"
      :key="item.datumVarde"
      class="radio-container"
    >
      <p>{{ item.datumVarde }}</p>
      <f-fieldset
        v-validation.required
        :name="`arende-utfall-${item.datumVarde}`"
      >
        <template #default>
          <f-radio-field v-model="selections[item.datumVarde]" value="godkand">
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
    <div class="button-group">
      <f-button variant="secondary" @click="sparaAndringar">Spara</f-button>
      <f-button @click="sparaAndringar">Signera & Klarmarkera</f-button>
    </div>
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
