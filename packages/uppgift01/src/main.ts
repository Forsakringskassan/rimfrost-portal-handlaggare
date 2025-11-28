import { createApp } from "vue";
import { ValidationPlugin } from "@fkui/vue";
import "@fkui/design";
import "./main.scss";
import "./style.css";
import App from "./HuvudytaVAH.vue";
import { router } from "./router";

const app = createApp(App);
app.use(ValidationPlugin);
app.use(router);
app.mount("#app");
