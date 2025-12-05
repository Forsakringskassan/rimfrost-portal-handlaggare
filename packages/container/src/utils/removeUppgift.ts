import { useProductStore } from "../stores/uppgiftListaStore";

export default function removeUppgift(uppgiftId: string) {
  const store = useProductStore();
  const uppgiftLista = store.uppgiftLista;
  const updatedLista = uppgiftLista.filter(
    (uppgift) => uppgift.id !== uppgiftId,
  );
  store.setUppgiftLista(updatedLista);
}
