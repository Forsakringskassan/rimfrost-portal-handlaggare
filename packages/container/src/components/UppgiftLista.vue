<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import uppgiftLista from "../assets/uppgiftLista.json";

export interface UppgiftItem {
  id: number;
  typ: string;
  status: string;
}

const items = ref<UppgiftItem[]>([]);
const router = useRouter();
const route = useRoute();

onMounted(async () => {
  items.value = await uppgiftLista;
});

function goTo(item: { id: number; typ: string }) {
  router.push({
    name: "item",
    params: { id: item.id.toString() },
    query: { title: item.typ },
  });
}

const activeId = computed(() => {
  return route?.params?.id ? Number(route.params.id) : null;
});
</script>

<template>
  <ul class="list list--unstyled">
    <li
      v-for="item in items"
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
