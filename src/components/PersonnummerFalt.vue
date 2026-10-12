<script setup lang="ts">
import { FIcon } from "@fkui/vue";

const personnummer = defineModel<string>({ required: true });

defineProps<{
  id: string;
  valideringsfel: string | null;
}>();
</script>

<template>
  <!-- A plain input with FKUI classes, like the one in SokUppgift: FTextField
       only updates its v-model on change/blur, and the validation text here is
       driven by the form's own submit rather than FKUI's validation service. -->
  <div class="text-field personnummer-falt">
    <label :for="id" class="label">
      Personnummer
      <span class="label__description">ÅÅÅÅMMDDNNNN eller ÅÅÅÅMMDD-NNNN</span>
      <span v-if="valideringsfel" class="label__message label__message--error">
        <FIcon name="error" class="label__icon--left" />
        {{ valideringsfel }}
      </span>
    </label>
    <div class="text-field__input-wrapper">
      <input
        :id
        v-model="personnummer"
        class="text-field__input"
        :class="{ 'text-field__input--error': valideringsfel }"
        type="text"
        inputmode="numeric"
        autocomplete="off"
        :aria-invalid="valideringsfel ? 'true' : undefined"
      />
    </div>
  </div>
</template>

<style scoped>
.personnummer-falt .text-field__input-wrapper {
  max-width: 20rem;
}
</style>
