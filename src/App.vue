<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import {
  FButton,
  FLayoutApplicationTemplate,
  FLayoutLeftPanel,
  FPageHeader,
  FSelectField,
} from "@fkui/vue";
import { useRouter } from "vue-router";
import ToastContainer from "./components/ToastContainer.vue";
import UppgiftLista from "./components/UppgiftLista.vue";
import { useHandlaggareStore } from "./stores/handlaggareStore";
import { useProductStore } from "./stores/uppgiftListaStore";
import { getNextUppgift } from "./utils/getNextUppgift";
import { getTilldeladeUppgifter } from "./utils/getTilldeladeUppgifter";
import { useToast } from "./utils/useToast";

const store = useProductStore();
const router = useRouter();
const handlaggareStore = useHandlaggareStore();
const getNextUppgiftFel = ref<string | null>(null);
const isLoadingHandlaggare = ref(true);
const toast = useToast();

const selectedId = computed({
  get: () => handlaggareStore.selectedHandlaggare?.handlaggarId.typId ?? "",
  set: (value) => handlaggareStore.setSelectedHandlaggare(value),
});

watch(
  () => handlaggareStore.selectedHandlaggare,
  async (newHandlaggare) => {
    if (!newHandlaggare) {
      return;
    }
    await getTilldeladeUppgifter(newHandlaggare.handlaggarId);
  },
);

function handleTaskDone(event: Event) {
  const customEvent = event as CustomEvent;
  toast.success(customEvent.detail.message || "Uppgift slutförd");
}

onMounted(async () => {
  await handlaggareStore.fetchHandlaggare();
  isLoadingHandlaggare.value = false;
  window.addEventListener("task-done", handleTaskDone);
});

onUnmounted(() => {
  window.removeEventListener("task-done", handleTaskDone);
});

async function handleGetNextUppgift() {
  getNextUppgiftFel.value = null;
  try {
    await getNextUppgift();
  } catch (err) {
    getNextUppgiftFel.value =
      "Kunde inte hämta ny uppgift. Försök igen senare.";
    console.error(err);
  }
}
</script>

<template>
  <ToastContainer />
  <f-layout-application-template>
    <template #header>
      <f-page-header skip-link="main-title">
        <div
          style="cursor: pointer; font-weight: bold; font-size: 1.25rem"
          @click="router.push('/')"
        >
          Rimfrost Demoapp
        </div>
        <template #right>
          <f-select-field id="handlaggare-dropdown" v-model="selectedId" inline>
            <option v-if="isLoadingHandlaggare" value="" disabled>
              Laddar handläggare...
            </option>
            <option
              v-for="handlaggare in handlaggareStore.handlaggare"
              :key="handlaggare.handlaggarId.typId"
              :value="handlaggare.handlaggarId.typId"
            >
              {{ handlaggare.fornamn }} {{ handlaggare.efternamn }}
            </option>
          </f-select-field>
        </template>
      </f-page-header>
    </template>

    <f-layout-left-panel>
      <template #heading>
        <h3 class="h3">Uppgifter</h3>
      </template>

      <template #content>
        <div class="left-nav-custom">
          <div class="nav-content">
            <p v-if="store.uppgiftLista.length > 0" class="body">
              Välj en uppgift i listan
            </p>
            <p v-else class="body">Inga tilldelade uppgifter hittades</p>
            <div class="scrollable-list">
              <UppgiftLista />
            </div>
          </div>
          <div class="nav-footer">
            <FButton @click="handleGetNextUppgift">Hämta ny uppgift</FButton>
            <p v-if="getNextUppgiftFel" class="error-message">
              {{ getNextUppgiftFel }}
            </p>
          </div>
        </div>
      </template>

      <router-view />
    </f-layout-left-panel>

    <template #footer>
      <div
        class="container-fluid"
        style="padding: 1rem 0; text-align: center"
      ></div>
    </template>
  </f-layout-application-template>
</template>

<style>
div:has(.left-nav-custom) {
  display: flex;
  flex-direction: column;
  height: 100% !important;
  overflow: hidden !important;
}

.left-nav-custom {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

.nav-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-height: 0;
}

.scrollable-list {
  flex: 1;
  overflow-y: auto;
  min-height: 0;
}

.nav-footer {
  padding: 0.75rem 0;
  border-top: 1px solid #e0e0e0;
  width: 100%;

  & button {
    width: 100%;
  }
}

.error-message {
  color: red;
  font-size: 0.875rem;
  padding: 0.25rem 0;
}
.layout-navigation__navigation {
  top: var(--fkui-header-height, 5.688rem) !important;
}
</style>
