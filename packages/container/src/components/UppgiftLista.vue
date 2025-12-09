<script setup lang="ts">
import { computed } from "vue";
import { FNavigationMenu } from "@fkui/vue";
import { useRoute, useRouter } from "vue-router";
import { useProductStore } from "../stores/uppgiftListaStore";

export interface UppgiftItem {
  id: string;
  typ: string;
  status: string;
}
const store = useProductStore();

const router = useRouter();
const route = useRoute();

const routes = computed(() => {
  return store.uppgiftLista.map((item) => ({
    label: `${item.id}: ${item.typ}`,
    route: `item-${item.id}`,
  }));
});

function onSelectedRoute(routeId: string) {
  const itemId = routeId.replace("item-", "");
  const item = store.uppgiftLista.find((i) => i.id === itemId);
  if (item) {
    router.push({
      name: "item",
      params: { id: item.id.toString() },
      query: { title: item.typ },
    });
  }
}

const currentRoute = computed(() => {
  return route?.params?.id ? `item-${route.params.id}` : "";
});
</script>

<template>
  <f-navigation-menu
    v-model:route="currentRoute"
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
