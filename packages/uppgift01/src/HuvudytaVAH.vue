<script setup lang="ts">
import { computed } from "vue";
import { FStaticField, FTooltip } from "@fkui/vue";
import kundUppgifter from "./assets/mockKunduppgifter-new.json";
import ListaDatum from "./components/ListaDatum.vue";
import { useProductStore } from "./stores/uppgiftStore";

const { kundbehovsflodeId } = defineProps<{
  kundbehovsflodeId?: string | null;
}>();

const store = useProductStore();
store.setKundbehovsflodeId(kundbehovsflodeId ?? null);

const selected = computed(() => {
  let kund = null;

  if (typeof store.kundbehovsflodeId === "string") {
    kund =
      kundUppgifter.find(
        (kund) => kund.kundbehovsflodeId === store.kundbehovsflodeId,
      ) ?? kundUppgifter[0];
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
        <template #label><span>Organisationsnamn</span></template>
        <template #default>
          <span>{{
            selected?.anstallning?.organisationsnamn ?? "Missing"
          }}</span>
        </template>
      </f-static-field>
      <f-static-field>
        <template #label><span>Kontaktperson</span></template>
        <template #default>
          <span>Anna Andersson</span>
        </template>
      </f-static-field>
      <f-static-field>
        <template #label><span>Telefonnummer</span></template>
        <template #default>
          <span>012 345 67 89</span>
        </template>
      </f-static-field>
      <!-- <f-static-field>
        <template #label><span>Adress</span></template>
        <template #default>
          <span>{{ selected?.anstallning?.adress ?? "" }}</span>
        </template>
      </f-static-field>
      <f-static-field>
        <template #label>
          <span>Kontaktperson</span>
        </template>
        <template #default>
          <span>{{ selected?.anstallning?.kontaktperson ?? "" }}</span>
        </template>
      </f-static-field>
      <f-static-field>
        <template #label>
          <span>Telefonnummer</span>
        </template>
        <template #default>
          <span>{{ selected?.anstallning?.telefon ?? "" }}</span>
        </template>
      </f-static-field> -->
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
