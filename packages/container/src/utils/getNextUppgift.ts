import uppgiftListaMock from "../assets/uppgiftLista.json";
import { router } from "../router/index.js";
import { useProductStore } from "../stores/uppgiftListaStore.js";

export function getNextUppgift() {
  const store = useProductStore();
  const uppgiftLista = store.uppgiftLista;

  if (uppgiftLista.length >= uppgiftListaMock.length) {
    return;
  }

  for (const uppgift of uppgiftListaMock) {
    const exists = uppgiftLista.find((u) => u.id === uppgift.id);
    if (!exists) {
      const newUppgiftLista = [...uppgiftLista, uppgift];
      store.setUppgiftLista(newUppgiftLista);
      goToItem(uppgift);
      return;
    }
  }
}

function goToItem(item: { id: string; typ: string }) {
  const routeName = "item";
  router.push({
    name: routeName,
    params: { id: item.id.toString() },
    query: { title: item.typ },
  });
}
