import {
  type RouteRecordRaw,
  createRouter,
  createWebHistory,
} from "vue-router";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    component: () => import("../HuvudytaVAH.vue"),
  },
  {
    path: "/arbetsgivare",
    name: "arbetsgivare",
    component: () => import("../components/VisaArbetsgivare.vue"),
  },
  {
    path: "/folkbokforing",
    name: "folkbokforing",
    component: () => import("../components/VisaFolkbokforing.vue"),
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
