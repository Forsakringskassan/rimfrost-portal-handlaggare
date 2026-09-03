<script setup lang="ts">
import { useToast } from "../utils/useToast";

const { toasts, dismiss } = useToast();
</script>

<template>
  <div class="toast-container">
    <div
      v-for="toast in toasts"
      :key="toast.id"
      class="toast"
      :class="[
        'toast--' + toast.type,
        {
          'toast--removing': toast.removing,
          'toast--persistent': toast.persistent,
        },
      ]"
    >
      <span class="toast__message">{{ toast.message }}</span>
      <button
        v-if="toast.persistent"
        type="button"
        class="toast__close"
        aria-label="Stäng"
        @click="dismiss(toast.id)"
      >
        &times;
      </button>
    </div>
  </div>
</template>

<style scoped>
.toast-container {
  position: fixed;
  bottom: 6rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: center;
}

.toast {
  padding: 1rem 2rem;
  border-radius: 4px;
  color: #fff;
  font-size: 1.125rem;
  min-width: 25rem;
  text-align: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.4);
  animation: slideIn 0.3s ease;
}

.toast--removing {
  animation: slideOut 0.3s ease forwards;
}

.toast--success {
  background: #227a52;
}
.toast--error {
  background: #c53030;
}
.toast--warning {
  background: #b7791f;
}
.toast--info {
  background: #2b6cb0;
}

.toast--persistent {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  text-align: left;
  background: #fff;
  color: #c53030;
  border: 2px solid #c53030;
}

.toast__close {
  flex-shrink: 0;
  background: none;
  border: none;
  color: inherit;
  font-size: 1.5rem;
  line-height: 1;
  padding: 0;
  cursor: pointer;
}

@keyframes slideIn {
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes slideOut {
  from {
    transform: translateY(0);
    opacity: 1;
  }
  to {
    transform: translateY(100%);
    opacity: 0;
  }
}
</style>
