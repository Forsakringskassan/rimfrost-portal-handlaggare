<script setup lang="ts">
import { computed } from "vue";
import { FStaticField, FTooltip } from "@fkui/vue";
import kunduppgifter from "./assets/mockKunduppgifter.json";
import ListaDatum from "./components/ListaDatum.vue";
import { useProductStore } from "./stores/uppgiftStore";

const { uppgiftId } = defineProps<{ uppgiftId?: number | null }>();

const store = useProductStore();
store.setUppgiftId(uppgiftId ?? null);

const selected = computed(() => {
  let kund = null;

  if (typeof store.uppgiftId === "number") {
    kund =
      kunduppgifter.find((kund) => kund.uppgiftId === store.uppgiftId) ??
      kunduppgifter[0];
  }
  return kund;
});
</script>

<template>
  <div>
    <f-static-field>
      <template #label
        >Arbetsuppgift: Kontrollera frånvaro från arbete</template
      >
      <template #tooltip>
        <f-tooltip
          screen-reader-text="Läs mer om uppgiften kontrollera frånvaro från arbete"
          header-tag="h2"
        >
          <template #header
            >Läs mer om uppgiften "Kontrollera frånvaro från arbete"</template
          >
          <template #body>
            Brödtext om att ringa arbetsgivaren och kontrollera att ansökt
            procent VAH överensstämmer med faktisk arbetsfrånvaro
          </template>
        </f-tooltip>
      </template>
    </f-static-field>
  </div>
  <div>
    <div class="arende-information">
      <f-static-field>
        <template #label><span>Namn</span></template>
        <template #default>
          <span>{{ selected?.arbetsgivare?.namn ?? "" }}</span>
        </template>
      </f-static-field>
      <f-static-field>
        <template #label><span>Adress</span></template>
        <template #default>
          <span>{{ selected?.arbetsgivare?.adress ?? "" }}</span>
        </template>
      </f-static-field>
      <f-static-field>
        <template #label>
          <span>Kontaktperson</span>
        </template>
        <template #default>
          <span>{{ selected?.arbetsgivare?.kontaktperson ?? "" }}</span>
        </template>
      </f-static-field>
      <f-static-field>
        <template #label>
          <span>Telefonnummer</span>
        </template>
        <template #default>
          <span>{{ selected?.arbetsgivare?.telefon ?? "" }}</span>
        </template>
      </f-static-field>
    </div>
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

.arende-information {
  margin-bottom: 1rem;
}
</style>
