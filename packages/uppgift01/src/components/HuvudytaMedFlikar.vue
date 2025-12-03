<script setup lang="ts">
import { type NavigationMenuItem, FNavigationMenu } from "@fkui/vue";
import { useRouter } from "vue-router";
import { useProductStore } from "../stores/uppgiftStore";

const { kundbehovsflodeId } = defineProps<{
  kundbehovsflodeId?: string | null;
}>();

const router = useRouter();

const routes: NavigationMenuItem[] = [
  { label: "Arbetsgivare", route: "arbetsgivare" },
  { label: "Folkbokföring", route: "folkbokforing" },
];

const store = useProductStore();
store.setKundbehovsflodeId(kundbehovsflodeId ?? null);

function onSelectRoute(route: string): void {
  router.push({ name: route });
}
</script>

<template>
  <div>
    <f-navigation-menu
      :routes
      @selected-route="onSelectRoute"
    ></f-navigation-menu>
  </div>
  <div><router-view /></div>
</template>
