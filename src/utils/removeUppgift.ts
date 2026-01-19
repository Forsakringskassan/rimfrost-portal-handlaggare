import { useProductStore } from "../stores/uppgiftListaStore";
import type { OperativUppgiftItem } from "../types";

export default function removeUppgift(uppgiftId: string) {
  const store = useProductStore();
  const uppgiftLista = store.uppgiftLista;
  const updatedLista = uppgiftLista.filter(
    (uppgift: OperativUppgiftItem) => uppgift.uppgiftId !== uppgiftId,
  );
  store.setUppgiftLista(updatedLista);
}
