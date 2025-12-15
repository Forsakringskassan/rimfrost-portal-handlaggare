import { useProductStore } from "../stores/uppgiftListaStore";
import type { UppgiftItem } from "../types";

export default function removeUppgift(uppgiftId: string) {
  const store = useProductStore();
  const uppgiftLista = store.uppgiftLista;
  const updatedLista = uppgiftLista.filter(
    (uppgift: UppgiftItem) => uppgift.uppgiftId !== uppgiftId,
  );
  store.setUppgiftLista(updatedLista);
}
