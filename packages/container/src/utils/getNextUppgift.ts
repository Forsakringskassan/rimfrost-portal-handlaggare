import uppgiftListaMock from "../assets/uppgiftLista.json";
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
      return;
    }
  }
}
