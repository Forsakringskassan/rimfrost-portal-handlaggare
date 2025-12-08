import {
  type RouteRecordRaw,
  createMemoryHistory,
  createRouter,
} from "vue-router";
import HuvudytaVAH from "../HuvudytaVAH.vue";
import VisaArbetsgivare from "../components/VisaArbetsgivare.vue";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    component: HuvudytaVAH,
  },
  {
    path: "/arbetsgivare",
    name: "arbetsgivare",
    component: VisaArbetsgivare,
  },
];

export const router = createRouter({
  history: createMemoryHistory(),
  routes,
});
