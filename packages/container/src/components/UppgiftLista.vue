<script setup lang="ts">
import { computed, onBeforeMount } from "vue";
import { FNavigationMenu } from "@fkui/vue";
import { useRoute, useRouter } from "vue-router";
import { useProductStore } from "../stores/uppgiftListaStore";
import type { UppgiftItem } from "../types";
import { getTilldeladeUppgifter } from "../utils/getTilldeladeUppgifter";

const store = useProductStore();

const router = useRouter();
const route = useRoute();

/*
Här kommer vi skapa URLer med den information vi har,
exempelvis regel och id. Vi skickar in den som id som
param till router. Vi kan väl behöva regel-id i OUL
för att bygga en korrekt URL?
*/
const routes = computed(() => {
  return store.uppgiftLista.map((item: UppgiftItem) => ({
    label: `${item.kundbehovsflodeId.slice(-7)}: ${item.regeltyp}`,
    route: `item-${item.kundbehovsflodeId}`,
  }));
});

function onSelectedRoute(routeId: string) {
  const itemId = routeId.replace("item-", "");
  const item = store.uppgiftLista.find(
    (item: UppgiftItem) => item.kundbehovsflodeId === itemId,
  );
  if (item) {
    router.push({
      name: "item",
      params: {
        id: item.kundbehovsflodeId.toString(),
        regeltyp: item.regeltyp,
      },
      query: { title: item.regeltyp },
    });
  }
}

const currentRoute = computed(() => {
  return route?.params?.id ? `item-${route.params.id}` : "";
});

onBeforeMount(async () => {
  getTilldeladeUppgifter();
});
</script>

<template>
  <f-navigation-menu
    :route="currentRoute"
    :routes
    vertical
    menu-aria-label="Uppgiftslista"
    @selected-route="onSelectedRoute"
  ></f-navigation-menu>
</template>

<style scoped>
.id-list__item {
  background-color: white;
  margin-bottom: 0.5rem;
  padding: 0.75rem 1rem;
  border-radius: 4px;
  border: 1px solid rgb(201, 201, 201);
  cursor: pointer;
  list-style: none;
  &:hover {
    background-color: rgb(201, 201, 201);
  }
}
.id-list__item--active {
  background-color: rgb(207, 235, 218);
  font-weight: bold;
}
</style>
