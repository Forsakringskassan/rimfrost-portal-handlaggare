import type { App } from "vue";
import { createApp } from "vue";
import { ValidationPlugin } from "@fkui/vue";
import { createPinia } from "pinia";
import "./style.css";
import AppComponent from "./HuvudytaVAH.vue";

// createApp(App).mount('#app')

export function init(
  selector: string,
  params?: { kundbehovsflodeId?: string; regeltyp?: string },
): App {
  const container = document.querySelector(selector);

  if (!container) {
    throw new Error(`Container element not found: ${selector}`);
  }

  container.addEventListener("component-validity", (event: Event) => {
    console.log("App stoppar");
    event.stopPropagation();
  });

  container.addEventListener("component-unmount", (event: Event) => {
    console.log("App stoppar");
    event.stopPropagation();
  });

  const app = createApp(AppComponent, {
    kundbehovsflodeId: params?.kundbehovsflodeId ?? null,
    regeltyp: params?.regeltyp ?? null,
  });
  app.use(ValidationPlugin);
  app.use(createPinia());
  app.mount(selector);

  return app;
}
