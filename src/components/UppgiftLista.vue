<script setup lang="ts">
import { computed, onBeforeMount, onBeforeUnmount, onMounted, ref } from "vue";
import { FLoader, FNavigationMenu } from "@fkui/vue";
import { useRoute, useRouter } from "vue-router";
import { useProductStore } from "../stores/uppgiftListaStore";
import type { OperativUppgiftItem } from "../types";
import { getTilldeladeUppgifter } from "../utils/getTilldeladeUppgifter";

const store = useProductStore();
const isLoading = ref(false);

const router = useRouter();
const route = useRoute();

const routes = computed(() => {
  return store.uppgiftLista.map((item: OperativUppgiftItem) => ({
    label: `${item.handlaggningId.slice(-7)}: ${item.yrkande}`,
    route: `item-${item.handlaggningId}`,
  }));
});

function onSelectedRoute(routeId: string) {
  const itemId = routeId.replace("item-", "");
  const item = store.uppgiftLista.find(
    (item: OperativUppgiftItem) => item.handlaggningId === itemId,
  );
  if (item) {
    router.push({
      name: "item",
      params: {
        id: item.handlaggningId.toString(),
      },
      query: { title: item.yrkande },
    });
  }
}

const currentRoute = computed(() => {
  return route?.params?.id ? `item-${route.params.id}` : "";
});

onBeforeMount(async () => {
  isLoading.value = true;
  try {
    await getTilldeladeUppgifter();
  } finally {
    isLoading.value = false;
  }
});

async function onTaskDone() {
  isLoading.value = true;
  try {
    await getTilldeladeUppgifter();
  } finally {
    isLoading.value = false;
  }
}

onMounted(() => {
  window.addEventListener("rtf-manuell-task-done", onTaskDone);
});

onBeforeUnmount(() => {
  window.removeEventListener("rtf-manuell-task-done", onTaskDone);
});
</script>

<template>
  <div>
    <f-loader
      :show="isLoading"
      :delay="true"
      style="margin-top: 10vh !important; display: block"
    >
      Vänligen vänta
    </f-loader>

    <f-navigation-menu
      v-if="!isLoading"
      :route="currentRoute"
      :routes
      vertical
      menu-aria-label="Uppgiftslista"
      @selected-route="onSelectedRoute"
    ></f-navigation-menu>
  </div>
</template>

<style scoped>
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
