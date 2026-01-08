import { createApp } from "vue";
import { ValidationPlugin } from "@fkui/vue";
import "@fkui/design";
import "./main.scss";
import "./style.css";
import { createPinia } from "pinia";
import App from "./App.vue";

const app = createApp(App);
app.use(ValidationPlugin);
app.use(createPinia());
app.mount("#app");
