import {
  type RouteRecordRaw,
  createRouter,
  createWebHistory,
} from "vue-router";

const routes: RouteRecordRaw[] = [
  { path: "/", component: () => import("../components/IngetArendeValt.vue") },
  {
    path: "/items/:id",
    name: "item",
    component: () => import("../components/HuvudytaUppgift.vue"),
    props: true,
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
