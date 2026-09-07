<script setup lang="ts">
import { onMounted, ref } from "vue";
import { FLoader } from "@fkui/vue";
import { useTeamUppgiftListaStore } from "../stores/teamUppgiftListaStore";
import { getTeamUppgifter } from "../utils/getTeamUppgifter";

const store = useTeamUppgiftListaStore();
const isLoading = ref(false);
const error = ref<string | null>(null);

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
  <div>
    <f-loader
      :show="isLoading"
      :delay="true"
      style="margin-top: 10vh !important; display: block"
    >
      Vänligen vänta
    </f-loader>

    <p v-if="error" class="error-message">{{ error }}</p>

    <p
      v-else-if="!isLoading && store.teamUppgiftLista.length === 0"
      class="body"
    >
      Inga uppgifter hos teamet hittades
    </p>

    <ul v-else-if="!isLoading" class="team-uppgift-list">
      <li
        v-for="item in store.teamUppgiftLista"
        :key="item.uppgiftId"
        class="team-uppgift-list__item"
      >
        <span class="team-uppgift-list__title">
          {{ item.handlaggningId.slice(-7) }}: {{ item.regel }}
        </span>
        <span class="team-uppgift-list__assignee">
          Tilldelad: {{ item.handlaggarId.varde }}
        </span>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.error-message {
  color: red;
  padding: 0.5rem;
  font-size: 0.875rem;
}

.team-uppgift-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.team-uppgift-list__item {
  background-color: white;
  margin-bottom: 0.5rem;
  padding: 0.75rem 1rem;
  border-radius: 0.25rem;
  border: 0.0625rem solid rgb(201, 201, 201);
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.team-uppgift-list__assignee {
  font-size: 0.875rem;
  color: rgb(90, 90, 90);
}
</style>
