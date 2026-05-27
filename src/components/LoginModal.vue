<script setup lang="ts">
import { computed, ref } from "vue";
import { FFormModal, FSelectField, FTextField } from "@fkui/vue";
import type { Handlaggare } from "../types";

const props = defineProps<{
  handlaggare: Handlaggare[];
}>();

const emit = defineEmits<{
  confirm: [data: { selectedId: string; securityCode: string }];
  cancel: [];
}>();

const hasHandlaggare = computed(() => props.handlaggare.length > 0);

const value = ref({
  selectedId: props.handlaggare[0]?.handlaggarId.typId ?? "",
  securityCode: "",
});

const buttons = computed(() => [
  {
    label: "OK",
    event: "submit",
    type: "primary" as const,
    submitButton: true,
    disabled: !hasHandlaggare.value,
  },
  {
    label: "Avbryt",
    event: "dismiss",
    type: "secondary" as const,
    submitButton: false,
  },
]);
</script>

<template>
  <f-form-modal
    :value
    :buttons
    @submit="emit('confirm', $event.data)"
    @cancel="emit('cancel')"
  >
    <template #header>Logga in</template>
    <template #input-text-fields>
      <p v-if="!hasHandlaggare" class="error-message">
        Kunde inte hämta handläggare från servern. Försök igen senare.
      </p>
      <template v-else>
        <p class="body">
          Temporär inloggning — välj handläggare och fyll i valfri kod.<br />
          OBS: endast siffror i koden accepteras.
        </p>
        <f-select-field v-model="value.selectedId">
          <template #label>Välj handläggare</template>
          <option
            v-for="h in handlaggare"
            :key="h.handlaggarId.typId"
            :value="h.handlaggarId.typId"
          >
            {{ h.fornamn }} {{ h.efternamn }}
          </option>
        </f-select-field>
        <f-text-field
          v-model="value.securityCode"
          v-validation.required.integer
          type="password"
        >
          Ange säkerhetskod
        </f-text-field>
      </template>
    </template>
  </f-form-modal>
</template>
