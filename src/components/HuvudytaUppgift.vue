<script setup lang="ts">
import { computed, ref } from "vue";
import { FButton, useModal } from "@fkui/vue";
import { useRoute } from "vue-router";
import { useProductStore } from "../stores/uppgiftListaStore";
import { UppgiftGoneError, unassignUppgift } from "../utils/unassignUppgift";
import { useToast } from "../utils/useToast";

const route = useRoute();
const store = useProductStore();
const { confirmModal } = useModal();
const toast = useToast();

const pageTitle = computed(() => route.query.title ?? "Ingen titel");
const pageId = computed(() => route.params.uppgiftId ?? "Inget ID");

const isUnassigning = ref(false);

// Looking the task up in the handläggare's own list limits the action to
// tasks assigned to them (PORT-FR-04.1) — a team member's task is not in
// this list, so no button is offered for it.
const egenUppgift = computed(() =>
  store.uppgiftLista.find((item) => item.uppgiftId === route.params.uppgiftId),
);

async function handleUnassign(): Promise<void> {
  const uppgift = egenUppgift.value;
  if (!uppgift || isUnassigning.value) {
    return;
  }

  const confirmed = await confirmModal({
    heading: "Lämna tillbaka uppgiften?",
    content:
      "Uppgiften går tillbaka till kön och tilldelas en annan handläggare. Du kommer inte att kunna hämta den igen. " +
      "Återlämning är avsedd för jäv eller annat formellt hinder — inte för att välja bort en enskild uppgift.",
    confirm: "Lämna tillbaka",
    dismiss: "Avbryt",
  });
  if (!confirmed) {
    return;
  }

  isUnassigning.value = true;
  try {
    await unassignUppgift(uppgift.uppgiftId);
    toast.success("Uppgiften har lämnats tillbaka.");
  } catch (err) {
    // For a recoverable failure the task stays in the list so the handläggare can
    // try again (PORT-FR-04.5); a 404 instead means it is gone and has already been
    // removed. Logged because the causes are indistinguishable to the user.
    console.error("Failed to unassign uppgift:", err);
    toast.error(
      err instanceof UppgiftGoneError
        ? err.message
        : "Kunde inte lämna tillbaka uppgiften. Försök igen senare.",
    );
  } finally {
    isUnassigning.value = false;
  }
}
</script>

<template>
  <div class="container">
    <div v-if="route.params.uppgiftId" class="uppgift-header">
      <h1 class="page-title">{{ pageTitle }} - {{ pageId }}</h1>
      <FButton
        v-if="egenUppgift"
        variant="secondary"
        :disabled="isUnassigning"
        @click="handleUnassign"
      >
        Lämna tillbaka uppgift
      </FButton>
    </div>
    <router-view />
  </div>
</template>

<style scoped>
/* Not .page-header — FKUI has a global class by that name that paints a
   green banner, and a global rule still matches even with scoped styles. */
.uppgift-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 1rem;
  margin-bottom: 1.5rem;
}

.page-title {
  margin: 0;
}

/* flex-shrink: the heading takes the available width, so without this the button
   is squeezed until its label wraps onto two rows.
   margin: FKUI gives buttons 0.25rem top and 1.5rem bottom, meant for forms in a
   column. align-items: center centres the margin box, so the asymmetry would
   push the button off the heading's centre line — and the container already
   supplies the spacing below. */
.uppgift-header :deep(.button) {
  flex-shrink: 0;
  white-space: nowrap;
  margin: 0;
}
</style>
