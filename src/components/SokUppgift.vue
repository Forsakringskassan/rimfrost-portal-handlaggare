<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from "vue";
import {
  FButton,
  FIcon,
  FInteractiveTable,
  FLoader,
  FTableButton,
  FTableColumn,
} from "@fkui/vue";
import type { OperativUppgiftItem } from "../types";
import { formatDate } from "../utils/formatDate";
import { normalizePersonnummer } from "../utils/personnummer";
import {
  NotTeamMemberError,
  UppgiftNotFoundError,
  reassignUppgift,
} from "../utils/reassignUppgift";
import { searchUppgifter } from "../utils/searchUppgifter";
import { useToast } from "../utils/useToast";

const SEARCH_DELAY_MS = 300;

const toast = useToast();

const personnummerInput = ref("");
const valideringsfel = ref<string | null>(null);
// The personnummer of the latest search, in flight or done — used both as the
// heading above the list and to avoid duplicate searches (PORT-NFR-03.2).
const soktPersonnummer = ref<string | null>(null);
const traffar = ref<OperativUppgiftItem[]>([]);
const isLoading = ref(false);
const error = ref<string | null>(null);
const tilldelarUppgiftId = ref<string | null>(null);

let searchTimer: ReturnType<typeof setTimeout> | undefined;
let pagaendeSokning: AbortController | null = null;

async function sok(personnummer: string, igen = false): Promise<void> {
  // Never a second call while the same value is in flight. An automatic search
  // also skips a value already searched, while igen (Sök/Enter, or a refresh
  // after a failed tilldelning) fetches it again (PORT-NFR-03.2).
  if (
    personnummer === soktPersonnummer.value &&
    (pagaendeSokning !== null || !igen)
  ) {
    return;
  }

  // A new valid value replaces a search still in flight for an older one.
  pagaendeSokning?.abort();
  const sokning = new AbortController();
  pagaendeSokning = sokning;

  soktPersonnummer.value = personnummer;
  traffar.value = [];
  error.value = null;
  isLoading.value = true;
  try {
    const result = await searchUppgifter(personnummer, sokning.signal);
    if (sokning.signal.aborted) {
      return;
    }
    traffar.value = result;
  } catch (err) {
    if (sokning.signal.aborted) {
      return;
    }
    console.error("Failed to search uppgifter:", err);
    error.value = "Kunde inte söka efter uppgifter. Försök igen senare.";
    // Lets the automatic search retry the same personnummer after a failure.
    soktPersonnummer.value = null;
  }
  isLoading.value = false;
  pagaendeSokning = null;
}

watch(personnummerInput, (value) => {
  clearTimeout(searchTimer);
  valideringsfel.value = null;
  const personnummer = normalizePersonnummer(value);
  if (personnummer) {
    searchTimer = setTimeout(() => sok(personnummer), SEARCH_DELAY_MS);
  }
});

function onSubmit(): void {
  clearTimeout(searchTimer);
  const personnummer = normalizePersonnummer(personnummerInput.value);
  if (!personnummer) {
    valideringsfel.value =
      "Ange ett personnummer med 12 siffror, ÅÅÅÅMMDDNNNN eller ÅÅÅÅMMDD-NNNN.";
    return;
  }
  void sok(personnummer, true);
}

async function handleTilldela(item: OperativUppgiftItem): Promise<void> {
  if (tilldelarUppgiftId.value) {
    return;
  }

  tilldelarUppgiftId.value = item.uppgiftId;
  try {
    // No confirmation dialog: unlike Ta över in the team view, the task is not
    // assigned to anyone else (PORT-FR-06.10). On success reassignUppgift adds
    // it to the own list and opens it (PORT-FR-06.11).
    await reassignUppgift(item.uppgiftId);
    toast.success("Uppgiften har tilldelats dig.");
  } catch (err) {
    console.error("Failed to assign uppgift:", err);
    if (
      err instanceof NotTeamMemberError ||
      err instanceof UppgiftNotFoundError
    ) {
      // The BFF passes OUL's 403 on without a reason, so an SID refusal can't
      // be told apart from other 403s — all get the same message.
      toast.error(
        err instanceof NotTeamMemberError
          ? "Uppgiften kunde inte tilldelas."
          : "Uppgiften kan inte längre tilldelas. Listan har uppdaterats.",
      );
      // The hit list has drifted, e.g. someone else got there first (PORT-FR-06.12).
      if (soktPersonnummer.value) {
        void sok(soktPersonnummer.value, true);
      }
    } else {
      toast.error("Kunde inte tilldela uppgiften. Försök igen senare.");
    }
  } finally {
    tilldelarUppgiftId.value = null;
  }
}

onBeforeUnmount(() => {
  clearTimeout(searchTimer);
  pagaendeSokning?.abort();
});
</script>

<template>
  <div class="sok-uppgift">
    <h1 id="main-title" class="h1">Sök uppgift</h1>

    <!-- A plain input rather than FTextField: FTextField only updates its
         v-model on change/blur, and the search starts while typing (PORT-FR-06.5). -->
    <form class="sok-form" novalidate @submit.prevent="onSubmit">
      <div class="text-field">
        <label for="sok-personnummer" class="label">
          Personnummer
          <span class="label__description">
            ÅÅÅÅMMDDNNNN eller ÅÅÅÅMMDD-NNNN
          </span>
          <span
            v-if="valideringsfel"
            class="label__message label__message--error"
          >
            <FIcon name="error" class="label__icon--left" />
            {{ valideringsfel }}
          </span>
        </label>
        <div class="sok-form__row">
          <div class="text-field__input-wrapper">
            <input
              id="sok-personnummer"
              v-model="personnummerInput"
              class="text-field__input"
              :class="{ 'text-field__input--error': valideringsfel }"
              type="text"
              inputmode="numeric"
              autocomplete="off"
              :aria-invalid="valideringsfel ? 'true' : undefined"
            />
          </div>
          <FButton type="submit">Sök</FButton>
        </div>
      </div>
    </form>

    <f-loader
      :show="isLoading"
      :delay="true"
      style="margin-top: 10vh; display: block"
    >
      Söker efter uppgifter...
    </f-loader>

    <p v-if="error" class="error-message" role="alert">{{ error }}</p>

    <template v-if="soktPersonnummer && !isLoading && !error">
      <h2 class="h3">Uppgifter för {{ soktPersonnummer }}</h2>
      <p v-if="traffar.length === 0" class="body">Inga uppgifter hittades</p>
      <FInteractiveTable v-else :rows="traffar" key-attribute="uppgiftId">
        <template #default="{ row }">
          <FTableColumn name="beskrivning" title="Beskrivning">
            {{ row.beskrivning }}
          </FTableColumn>
          <FTableColumn name="regel" title="Regel">
            {{ row.regel }}
          </FTableColumn>
          <FTableColumn name="skapad" title="Skapad">
            {{ formatDate(row.skapad) }}
          </FTableColumn>
          <FTableColumn name="tilldela" title="Åtgärd" shrink>
            <FTableButton
              label
              :disabled="tilldelarUppgiftId === row.uppgiftId"
              @click="handleTilldela(row)"
            >
              Tilldela uppgift
            </FTableButton>
          </FTableColumn>
        </template>
      </FInteractiveTable>
    </template>
  </div>
</template>

<style scoped>
.sok-uppgift {
  padding: 1.5rem 2rem;
}

.sok-form__row {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.sok-form__row .text-field__input-wrapper {
  max-width: 20rem;
  flex: 1;
}

/* FKUI gives buttons a bottom margin meant for forms in a column; here the
   button sits beside the input and should line up with it. */
.sok-form__row :deep(.button) {
  margin: 0;
}

.error-message {
  color: red;
  padding: 0.5rem 0;
}
</style>
