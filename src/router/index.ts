import {
  type RouteRecordRaw,
  createRouter,
  createWebHistory,
} from "vue-router";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    component: () => import("../components/HuvudytaUppgift.vue"),
    children: [
      {
        path: "",
        component: () => import("../components/IngenUppgiftVald.vue"),
      },
      {
        path: "items/:id",
        name: "item",
        component: () => import("../components/OppnadUppgift.vue"),
        props: true,
      },
      {
        path: "dev/template",
        name: "dev-template",
        component: () => import("../components/DevTemplateMFE.vue"),
      },
    ],
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
