<script setup lang="ts">
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  useTemplateRef,
  watch,
} from "vue";
import { FButton, FExpandablePanel, FFieldset, FRadioField } from "@fkui/vue";
import { useHandlaggareStore } from "../stores/handlaggareStore";
import type { Uppgiftstyp } from "../types";
import {
  laggTillSenastAnvanda,
  lasSenastAnvanda,
} from "../utils/senastAnvanda";
import {
  byggSokindex,
  grupperaPerKategori,
  hamtaUppgiftstyper,
  sokUppgiftstyper,
} from "../utils/uppgiftstyper";
import { useToast } from "../utils/useToast";
import BekraftaUppgiftstyp from "./BekraftaUppgiftstyp.vue";
import SkapaAnteckning from "./SkapaAnteckning.vue";
import UppgiftstypLista from "./UppgiftstypLista.vue";

const SEARCH_DELAY_MS = 300;

type Steg = "hitta" | "bekrafta";
type Lage = "uppgift" | "anteckning";

const handlaggareStore = useHandlaggareStore();
const toast = useToast();
const sokfalt = useTemplateRef("sokfalt");

const katalog = ref<Uppgiftstyp[]>([]);
const isLoading = ref(true);
const error = ref<string | null>(null);

// The choice at the top decides whether an uppgift or an anteckning is
// registered (PORT-FR-11.1).
const lage = ref<Lage>("uppgift");
const steg = ref<Steg>("hitta");
const valdTyp = ref<Uppgiftstyp | null>(null);

// soktext follows the input; aktivSoktext is what the list shows and trails
// soktext by the delay while typing (PORT-FR-09.2). Both survive the confirm
// step and the note form, so Tillbaka keeps the search (PORT-FR-10.5).
const soktext = ref("");
const aktivSoktext = ref("");
const oppnaKategorier = ref<Record<string, boolean>>({});
const senastAnvandaIds = ref<string[]>([]);

let searchTimer: ReturnType<typeof setTimeout> | undefined;

const sokindex = computed(() => byggSokindex(katalog.value));
const kategorier = computed(() => grupperaPerKategori(katalog.value));
const typPerId = computed(
  () => new Map(katalog.value.map((typ) => [typ.id, typ])),
);

const harSoktext = computed(() => aktivSoktext.value.trim().length > 0);
const traffar = computed(() =>
  sokUppgiftstyper(sokindex.value, aktivSoktext.value),
);
const antalTraffarText = computed(() =>
  traffar.value.length === 1 ? "1 träff" : `${traffar.value.length} träffar`,
);

// Ids no longer in the catalog are skipped rather than shown broken.
const senastAnvanda = computed(() =>
  senastAnvandaIds.value
    .map((id) => typPerId.value.get(id))
    .filter((typ): typ is Uppgiftstyp => typ !== undefined),
);

const handlaggarId = computed(
  () => handlaggareStore.selectedHandlaggare?.handlaggarId.varde ?? null,
);

watch(
  handlaggarId,
  (id) => {
    senastAnvandaIds.value = id ? lasSenastAnvanda(id) : [];
  },
  { immediate: true },
);

watch(soktext, (value) => {
  clearTimeout(searchTimer);
  if (!value.trim()) {
    // Back to browsing at once when the field is emptied.
    aktivSoktext.value = value;
    return;
  }
  searchTimer = setTimeout(() => {
    aktivSoktext.value = value;
  }, SEARCH_DELAY_MS);
});

function onSubmit(): void {
  clearTimeout(searchTimer);
  aktivSoktext.value = soktext.value;
}

function toggleKategori(namn: string): void {
  oppnaKategorier.value[namn] = !oppnaKategorier.value[namn];
}

function valjTyp(typ: Uppgiftstyp): void {
  valdTyp.value = typ;
  steg.value = "bekrafta";
}

async function tillbaka(): Promise<void> {
  steg.value = "hitta";
  valdTyp.value = null;
  await nextTick();
  sokfalt.value?.focus();
}

function onSkapa(): void {
  const typ = valdTyp.value;
  if (!typ) {
    return;
  }
  if (handlaggarId.value) {
    senastAnvandaIds.value = laggTillSenastAnvanda(handlaggarId.value, typ.id);
  }
  // Creating an uppgift is not wired up yet (PORT-FR-10.4).
  toast.info(
    `Att skapa uppgift är inte inkopplat än. Ingen uppgift av typen "${typ.namn}" har skapats.`,
  );
  void tillbaka();
}

onMounted(async () => {
  try {
    katalog.value = await hamtaUppgiftstyper();
  } catch (err) {
    console.error("Failed to fetch uppgiftstyper:", err);
    error.value = "Kunde inte hämta uppgiftstyper. Försök igen senare.";
  } finally {
    isLoading.value = false;
  }
});

onBeforeUnmount(() => {
  clearTimeout(searchTimer);
});
</script>

<template>
  <div class="skapa-uppgift">
    <h1 id="main-title" class="h1">Skapa uppgift</h1>
    <p class="body skapa-uppgift__ingress">
      Registrera en manuell uppgift antingen via uppgiftstyp eller som
      anteckning.
    </p>

    <BekraftaUppgiftstyp
      v-if="steg === 'bekrafta' && valdTyp"
      :typ="valdTyp"
      @skapa="onSkapa"
      @tillbaka="tillbaka"
    />

    <template v-else>
      <FFieldset name="registrera-lage" horizontal class="registrera-lage">
        <template #label>Vad vill du registrera?</template>
        <FRadioField v-model="lage" value="uppgift">Uppgift</FRadioField>
        <FRadioField v-model="lage" value="anteckning">Anteckning</FRadioField>
      </FFieldset>

      <SkapaAnteckning v-if="lage === 'anteckning'" />

      <template v-else>
        <!-- A plain input rather than FTextField: FTextField only updates its
           v-model on change/blur, and the list follows the typing (PORT-FR-09.2). -->
        <form
          class="sok-form"
          novalidate
          role="search"
          @submit.prevent="onSubmit"
        >
          <div class="text-field">
            <label for="sok-uppgiftstyp" class="label">
              Uppgiftstyp
              <span class="label__description">
                Sök på namn, kategori eller sökord
              </span>
            </label>
            <div class="sok-form__row">
              <div class="text-field__input-wrapper">
                <input
                  id="sok-uppgiftstyp"
                  ref="sokfalt"
                  v-model="soktext"
                  class="text-field__input"
                  type="search"
                  placeholder="Sök uppgiftstyp"
                  autocomplete="off"
                />
              </div>
              <FButton type="submit">Sök</FButton>
            </div>
          </div>
        </form>

        <p v-if="isLoading" class="body">Hämtar uppgiftstyper...</p>
        <p v-else-if="error" class="error-message" role="alert">{{ error }}</p>

        <template v-else-if="harSoktext">
          <!-- Flat hit list while searching (PORT-FR-09.4, PORT-FR-09.5). -->
          <p class="body traffar-antal" role="status">
            <template v-if="traffar.length > 0">{{
              antalTraffarText
            }}</template>
            <template v-else>
              Inga uppgiftstyper matchar "{{ aktivSoktext.trim() }}". Töm
              sökfältet för att bläddra bland kategorierna, eller
              <button
                type="button"
                class="anchor registrera-anteckning-lank"
                @click="lage = 'anteckning'"
              >
                registrera som anteckning
              </button>
              om ingen uppgift behövs.
            </template>
          </p>
          <UppgiftstypLista
            v-if="traffar.length > 0"
            :typer="traffar"
            visa-kategori
            @valj="valjTyp"
          />
        </template>

        <template v-else>
          <section v-if="senastAnvanda.length > 0" class="senast-anvanda">
            <h2 class="h3">Senast använda</h2>
            <UppgiftstypLista
              :typer="senastAnvanda"
              visa-kategori
              @valj="valjTyp"
            />
          </section>

          <section class="kategorier">
            <h2 class="h3">Kategorier</h2>
            <FExpandablePanel
              v-for="kategori in kategorier"
              :key="kategori.namn"
              header-tag="h3"
              :expanded="oppnaKategorier[kategori.namn] ?? false"
              @toggle="toggleKategori(kategori.namn)"
            >
              <template #title>
                {{ kategori.namn }} ({{ kategori.typer.length }})
              </template>
              <UppgiftstypLista :typer="kategori.typer" @valj="valjTyp" />
            </FExpandablePanel>
          </section>
        </template>
      </template>
    </template>
  </div>
</template>

<style scoped>
.skapa-uppgift {
  padding: 1.5rem 2rem;
  max-width: 60rem;
}

/* The h1's 0.25rem bottom margin collapses into this one, so the gap grows
   by 7px. */
.skapa-uppgift__ingress {
  margin-top: calc(0.25rem + 7px);
}

.sok-form__row {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.sok-form__row .text-field__input-wrapper {
  max-width: 30rem;
  flex: 1;
}

/* FKUI gives buttons a bottom margin meant for forms in a column; here the
   button sits beside the input and should line up with it. */
.sok-form__row :deep(.button) {
  margin: 0;
}

.registrera-anteckning-lank {
  padding: 0;
  border: none;
  background: none;
  font: inherit;
}

.senast-anvanda {
  margin-bottom: 1.5rem;
}

.error-message {
  color: red;
  padding: 0.5rem 0;
}
</style>
