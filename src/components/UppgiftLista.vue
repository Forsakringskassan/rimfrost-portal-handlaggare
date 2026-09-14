<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted } from "vue";
import { FNavigationMenu } from "@fkui/vue";
import { useRoute, useRouter } from "vue-router";
import { useProductStore } from "../stores/uppgiftListaStore";
import type { OperativUppgiftItem } from "../types";

const store = useProductStore();
const router = useRouter();
const route = useRoute();

const routes = computed(() => {
  return store.uppgiftLista.map((item: OperativUppgiftItem) => ({
    label: `${item.uppgiftId.slice(-7)}: ${item.regel}`,
    route: `item-${item.uppgiftId}`,
  }));
});

function onSelectedRoute(routeId: string) {
  const itemId = routeId.replace("item-", "");
  const item = store.uppgiftLista.find(
    (item: OperativUppgiftItem) => item.uppgiftId === itemId,
  );
  if (item) {
    router.push({
      name: "item",
      params: {
        uppgiftId: item.uppgiftId.toString(),
      },
      query: { title: item.regel },
    });
  }
}

const currentRoute = computed(() => {
  return route?.params?.uppgiftId ? `item-${route.params.uppgiftId}` : "";
});

// The remote micro frontend's task-done contract only carries handlaggningId
// (see README), not uppgiftId, so this still removes by case id — if a case
// ever has more than one open uppgift, finishing one here clears all of them.
function onTaskDone(event: Event) {
  const handlaggningId = (event as CustomEvent).detail?.handlaggningId;
  if (handlaggningId) {
    store.setUppgiftLista(
      store.uppgiftLista.filter(
        (item) => item.handlaggningId !== handlaggningId,
      ),
    );
  }
}

onMounted(() => {
  window.addEventListener("task-done", onTaskDone);
});

onBeforeUnmount(() => {
  window.removeEventListener("task-done", onTaskDone);
});
</script>

<template>
  <div>
    <p v-if="store.error" class="error-message">{{ store.error }}</p>

    <f-navigation-menu
      v-else
      :route="currentRoute"
      :routes
      vertical
      menu-aria-label="Uppgiftslista"
      @selected-route="onSelectedRoute"
    ></f-navigation-menu>
  </div>
</template>

<style scoped>
.error-message {
  color: red;
  padding: 0.5rem;
  font-size: 0.875rem;
}

.id-list__item {
  background-color: white;
  margin-bottom: 0.5rem;
  padding: 0.75rem 1rem;
  border-radius: 0.25rem;
  border: 0.0625rem solid rgb(201, 201, 201);
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
