import type { App } from "vue";
import { createApp } from "vue";
import { ValidationPlugin } from "@fkui/vue";
import { createPinia } from "pinia";
import "./style.css";
import AppComponent from "./App.vue";

// createApp(App).mount('#app')

export function init(
  mount: string | Element,
  params?: { kundbehovsflodeId?: string; regeltyp?: string },
): App {
  const container =
    typeof mount === "string" ? document.querySelector(mount) : mount;

  if (!container) {
    throw new Error(
      `Container element not found: ${typeof mount === "string" ? mount : "[Element]"}`,
    );
  }

  container.addEventListener("component-validity", (event: Event) => {
    event.stopPropagation();
  });

  container.addEventListener("component-unmount", (event: Event) => {
    event.stopPropagation();
  });

  const app = createApp(AppComponent, {
    kundbehovsflodeId: params?.kundbehovsflodeId ?? null,
    regeltyp: params?.regeltyp ?? null,
  });

  app.use(ValidationPlugin);
  app.use(createPinia());

  // Mount to the *element* if provided, otherwise selector
  app.mount(container);

  return app;
}
