import { ref } from "vue";

interface Toast {
  id: number;
  message: string;
  type: "success" | "error" | "warning" | "info";
  removing: boolean;
}

const toasts = ref<Toast[]>([]);
let idCounter = 0;

function removeToast(id: number) {
  toasts.value = toasts.value.filter((t) => t.id !== id);
}

function startRemoveAnimation(id: number) {
  const toast = toasts.value.find((t) => t.id === id);
  if (toast) {
    toast.removing = true;
  }
  setTimeout(() => removeToast(id), 300);
}

function show(
  message: string,
  type: Toast["type"] = "success",
  duration = 3000,
) {
  const id = idCounter++;
  toasts.value.push({ id, message, type, removing: false });
  setTimeout(() => startRemoveAnimation(id), duration);
}

export function useToast() {
  return {
    toasts,
    success: (msg: string) => show(msg, "success"),
    error: (msg: string) => show(msg, "error"),
    warning: (msg: string) => show(msg, "warning"),
    info: (msg: string) => show(msg, "info"),
  };
}
