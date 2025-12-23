import { createApp } from "vue";
import { ValidationPlugin } from "@fkui/vue";
import "@fkui/design";
import "./main.scss";
import "./style.css";
import App from "./components/Uppgift01App.vue";

const app = createApp(App);
app.use(ValidationPlugin);
app.mount("#app");
