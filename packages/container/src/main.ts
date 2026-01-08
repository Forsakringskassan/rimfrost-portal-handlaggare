import "@fkui/icon-lib-default/dist/f";
import "@fkui/user-lib-design";
import "./main.scss";

import { createApp } from "vue";
import { ValidationPlugin } from "@fkui/vue";
import App from "./App.vue";
import { pinia } from "./pinia";
import { router } from "./router";

const app = createApp(App);
app.use(ValidationPlugin);
app.use(pinia);
app.use(router);
app.mount("#app");
