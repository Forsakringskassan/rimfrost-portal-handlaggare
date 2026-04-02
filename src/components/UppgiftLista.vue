<script setup lang="ts">
import { computed, onBeforeMount, ref } from "vue";
import { FLoader, FNavigationMenu } from "@fkui/vue";
import { useRoute, useRouter } from "vue-router";
import { useProductStore } from "../stores/uppgiftListaStore";
import type { OperativUppgiftItem } from "../types";
import { getTilldeladeUppgifter } from "../utils/getTilldeladeUppgifter";

const store = useProductStore();
const isLoading = ref(false);
const error = ref<string | null>(null);
const router = useRouter();
const route = useRoute();

const routes = computed(() => {
  return store.uppgiftLista
    .filter((item: OperativUppgiftItem) => !!item.handlaggningId)
    .map((item: OperativUppgiftItem) => ({
      label: `${item.handlaggningId.slice(-7)}: ${item.kundbehov}`,
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
      query: { title: item.kundbehov },
    });
  }
}

const currentRoute = computed(() => {
  return route?.params?.id ? `item-${route.params.id}` : "";
});

onBeforeMount(async () => {
  isLoading.value = true;
  error.value = null;
  try {
    await getTilldeladeUppgifter();
  } catch {
    error.value = "Kunde inte ladda uppgiftslistan. Försök igen senare.";
  } finally {
    isLoading.value = false;
  }
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

    <p v-if="error" class="error-message">{{ error }}</p>

    <f-navigation-menu
      v-if="!isLoading && !error"
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
