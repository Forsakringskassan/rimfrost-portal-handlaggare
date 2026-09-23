<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import {
  FInteractiveTable,
  FLoader,
  FSortFilterDataset,
  FTableButton,
  FTableColumn,
  useModal,
} from "@fkui/vue";
import { useHandlaggareStore } from "../stores/handlaggareStore";
import { useTeamUppgiftListaStore } from "../stores/teamUppgiftListaStore";
import type { HandlaggarId, OperativUppgiftItem } from "../types";
import { getTeamUppgifter } from "../utils/getTeamUppgifter";
import { NotTeamMemberError, reassignUppgift } from "../utils/reassignUppgift";
import { useToast } from "../utils/useToast";

const store = useTeamUppgiftListaStore();
const handlaggareStore = useHandlaggareStore();
const { confirmModal } = useModal();
const toast = useToast();
const isLoading = ref(false);
const error = ref<string | null>(null);
const pickingUppgiftId = ref<string | null>(null);

function formatDate(dateString: string): string {
  if (!dateString) {
    return "—";
  }
  return new Date(dateString).toLocaleString("sv-SE", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

function handlaggareLabel(id: HandlaggarId): string {
  const match = handlaggareStore.handlaggare.find(
    (h) =>
      h.handlaggarId.typId === id.typId && h.handlaggarId.varde === id.varde,
  );
  return match ? `${match.fornamn} ${match.efternamn}` : id.varde;
}

function isEgenUppgift(id: HandlaggarId): boolean {
  const egen = handlaggareStore.selectedHandlaggare?.handlaggarId;
  return egen?.typId === id.typId && egen?.varde === id.varde;
}

async function handleTaOver(item: OperativUppgiftItem): Promise<void> {
  if (pickingUppgiftId.value) {
    return;
  }

  // Set before the modal opens — two fast clicks would otherwise both pass the guard.
  pickingUppgiftId.value = item.uppgiftId;
  try {
    const confirmed = await confirmModal({
      heading: "Ta över uppgiften?",
      content: `Uppgiften tas över från ${handlaggareLabel(item.handlaggarId)} och läggs till i din egen uppgiftslista.`,
      confirm: "Ta över",
      dismiss: "Avbryt",
    });
    if (!confirmed) {
      return;
    }

    await reassignUppgift(item.uppgiftId);
    toast.success("Uppgiften har tagits över.");
  } catch (err) {
    console.error("Failed to reassign uppgift:", err);
    toast.error(
      err instanceof NotTeamMemberError
        ? err.message
        : "Kunde inte ta över uppgiften. Försök igen senare.",
    );
  } finally {
    pickingUppgiftId.value = null;
  }
}

const sortableTeamUppgiftLista = computed(() =>
  store.teamUppgiftLista.map((item) => ({
    ...item,
    handlaggareLabel: handlaggareLabel(item.handlaggarId),
  })),
);

onMounted(async () => {
  isLoading.value = true;
  error.value = null;
  try {
    await getTeamUppgifter();
  } catch {
    error.value = "Kunde inte hämta teamets uppgifter. Försök igen senare.";
  } finally {
    isLoading.value = false;
  }
});
</script>

<template>
  <div class="team-uppgift-lista">
    <h1 id="main-title" class="h1">Teamets uppgifter</h1>

    <f-loader
      :show="isLoading"
      :delay="true"
      style="margin-top: 10vh; display: block"
    >
      Hämtar teamets uppgifter...
    </f-loader>

    <p v-if="error" class="error-message">{{ error }}</p>

    <template v-if="!isLoading && !error">
      <p v-if="store.teamUppgiftLista.length === 0" class="body">
        Inga uppgifter hos teamet hittades
      </p>

      <FSortFilterDataset
        v-else
        :data="sortableTeamUppgiftLista"
        :sortable-attributes="{
          skapad: 'Skapad',
          regel: 'Regeltyp',
          status: 'Status',
          roll: 'Roll',
          handlaggareLabel: 'Tilldelad',
        }"
        default-sort-attribute="skapad"
        :default-sort-ascending="false"
      >
        <template #default="{ sortFilterResult }">
          <FInteractiveTable :rows="sortFilterResult" key-attribute="uppgiftId">
            <template #default="{ row }">
              <FTableColumn name="handlaggningId" title="ID" shrink>
                <span class="id-cell" :title="row.handlaggningId">
                  {{ row.handlaggningId.slice(-8) }}
                </span>
              </FTableColumn>
              <FTableColumn name="status" title="Status" sortable>
                {{ row.status }}
              </FTableColumn>
              <FTableColumn name="regel" title="Regel" sortable>
                {{ row.regel }}
              </FTableColumn>
              <FTableColumn name="roll" title="Roll" sortable>
                {{ row.roll }}
              </FTableColumn>
              <FTableColumn name="skapad" title="Skapad" sortable>
                {{ formatDate(row.skapad) }}
              </FTableColumn>
              <FTableColumn name="handlaggareLabel" title="Tilldelad" sortable>
                {{ row.handlaggareLabel }}
              </FTableColumn>
              <FTableColumn name="taOver" title="Åtgärd" shrink>
                <FTableButton
                  v-if="!isEgenUppgift(row.handlaggarId)"
                  label
                  :disabled="pickingUppgiftId === row.uppgiftId"
                  @click="handleTaOver(row)"
                >
                  Ta över
                </FTableButton>
              </FTableColumn>
            </template>
          </FInteractiveTable>
        </template>
      </FSortFilterDataset>
    </template>
  </div>
</template>

<style scoped>
.team-uppgift-lista {
  padding: 1.5rem 2rem;
}

.id-cell {
  font-family: monospace;
  font-size: 0.8rem;
  color: #666;
}

.error-message {
  color: red;
  padding: 0.5rem 0;
}
</style>
