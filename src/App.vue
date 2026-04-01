<script setup lang="ts">
import { onMounted, ref } from "vue";
import {
  FButton,
  FLayoutApplicationTemplate,
  FLayoutLeftPanel,
  FPageHeader,
  FSelectField,
} from "@fkui/vue";
import { useRouter } from "vue-router";
import UppgiftLista from "./components/UppgiftLista.vue";
import { useHandlaggareStore } from "./stores/handlaggareStore";
import { getNextUppgift } from "./utils/getNextUppgift";

const router = useRouter();
const handlaggareStore = useHandlaggareStore();
const selectedId = ref("");

onMounted(async () => {
  await handlaggareStore.fetchHandlaggare();
  selectedId.value = handlaggareStore.selectedHandlaggare?.handlaggarId ?? "";
});

function onHandlaggareChange(handlaggarId: string) {
  if (handlaggarId === "logga-ut") {
    loggaUt();
    return;
  }
  selectedId.value = handlaggarId;
  handlaggareStore.setSelectedHandlaggare(handlaggarId);
}

function loggaUt() {
  // TODO: implementera utloggning när backend är redo
  console.log("Logga ut:", handlaggareStore.selectedHandlaggare?.handlaggarId);
}
</script>

<template>
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
          <f-select-field
            id="handlaggare-dropdown"
            v-model="selectedId"
            inline
            @update:model-value="onHandlaggareChange"
          >
            <option
              v-for="handlaggare in handlaggareStore.handlaggare"
              :key="handlaggare.handlaggarId"
              :value="handlaggare.handlaggarId"
            >
              {{ handlaggare.fornamn }} {{ handlaggare.efternamn }}
            </option>
            <option value="logga-ut" @click.prevent="loggaUt">Logga ut</option>
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
            <p class="body">Välj en uppgift i listan</p>
            <div class="scrollable-list">
              <UppgiftLista />
            </div>
          </div>
          <div class="nav-footer">
            <FButton @click="getNextUppgift">Hämta ny uppgift</FButton>
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
</style>
