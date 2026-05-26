<!-- eslint-disable vue/component-api-style -->
<script lang="ts">
import { type PropType, defineComponent } from "vue";
import { FFormModal, FSelectField, FTextField } from "@fkui/vue";
import type { Handlaggare } from "../types";

const CANCEL = 1;

export default defineComponent({
  name: "LoginModal",
  components: { FFormModal, FSelectField, FTextField },
  props: {
    handlaggare: {
      type: Array as PropType<Handlaggare[]>,
      required: true,
    },
  },
  emits: ["confirm", "cancel"],
  data() {
    return {
      value: {
        selectedId: this.handlaggare[0]?.handlaggarId.typId ?? "",
        securityCode: "",
      },
      securityCodeError: "",
    };
  },
  computed: {
    buttons() {
      return [
        {
          label: "OK",
          event: "submit",
          type: "primary" as const,
          submitButton: true,
        },
        {
          label: "Avbryt",
          event: "dismiss",
          type: "secondary" as const,
          submitButton: false,
        },
      ];
    },
  },
  methods: {
    beforeSubmit() {
      if (!this.value.securityCode.trim()) {
        this.securityCodeError = "Säkerhetskod måste anges";
        return CANCEL;
      }
      if (!/^\d+$/.test(this.value.securityCode)) {
        this.securityCodeError = "Säkerhetskod får bara innehålla siffror";
        return CANCEL;
      }
      this.securityCodeError = "";
    },
  },
});
</script>

<template>
  <f-form-modal
    :value
    :buttons
    :before-submit
    @submit="$emit('confirm', $event.data)"
    @cancel="$emit('cancel')"
  >
    <template #header>Logga in som handläggare</template>
    <template #input-text-fields>
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
      <f-text-field v-model="value.securityCode" type="password">
        Ange säkerhetskod
      </f-text-field>
      <p v-if="securityCodeError" class="cert-password-error">
        {{ securityCodeError }}
      </p>
    </template>
  </f-form-modal>
</template>

<style scoped>
.cert-password-error {
  color: #c0392b;
  font-size: 0.85rem;
  margin-top: 0.25rem;
}
</style>
