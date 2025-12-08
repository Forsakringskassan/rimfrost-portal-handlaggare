<script setup lang="ts">
import { computed } from "vue";
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

function goTo(item: { id: string; typ: string }) {
  router.push({
    name: "item",
    params: { id: item.id.toString() },
    query: { title: item.typ },
  });
}

const activeId = computed(() => {
  return route?.params?.id ? route.params.id : null;
});
</script>

<template>
  <ul class="list list--unstyled">
    <li
      v-for="item in store.uppgiftLista"
      :key="item.id"
      :class="[
        'id-list__item',
        { 'id-list__item--active': item.id === activeId },
      ]"
      @click="goTo(item)"
    >
      <strong>{{ item.typ }}</strong
      ><br />
      <span>ID: {{ item.id }} - Status: {{ item.status }}</span>
    </li>
  </ul>
</template>

<style scoped>
.id-list__item {
  margin-bottom: 0.5rem;
  padding: 0.5rem 0.75rem;
  border-radius: 4px;
  cursor: pointer;
  list-style: none;
  &:hover {
    background-color: rgb(201, 201, 201);
  }
}
.id-list__item--active {
  background-color: var(--f-color-primary-100);
  font-weight: bold;
}
</style>
