<script setup lang="ts">
import {
  FButton,
  FLayoutApplicationTemplate,
  FLayoutLeftPanel,
  FPageHeader,
} from "@fkui/vue";
import IdList from "./components/UppgiftLista.vue";
</script>

<template>
  <f-layout-application-template>
    <template #header>
      <f-page-header skip-link="main-title">
        Rimfrost Demoapp
        <template #right>Handläggare Handläggaresson</template>
      </f-page-header>
    </template>

    <f-layout-left-panel>
      <template #heading>
        <h3 class="h3">Uppgifter</h3>
      </template>

      <template #content>
        <div class="left-nav-custom">
          <div class="nav-content">
            <p class="body">Välj en uppgift i listan.</p>
            <div class="scrollable-list">
              <IdList />
            </div>
          </div>
          <div class="nav-footer">
            <FButton>Ny uppgift</FButton>
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
