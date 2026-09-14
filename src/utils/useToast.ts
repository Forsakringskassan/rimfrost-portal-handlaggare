import { ref } from "vue";

interface Toast {
  id: number;
  message: string;
  type: "success" | "error" | "warning" | "info";
  removing: boolean;
  persistent: boolean;
}

interface ToastOptions {
  // A persistent toast does not auto-dismiss; it stays until dismiss() is called.
  persistent?: boolean;
  duration?: number;
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
  options: ToastOptions = {},
) {
  const { persistent = false, duration = 3000 } = options;
  const id = idCounter++;
  toasts.value.push({ id, message, type, removing: false, persistent });
  if (!persistent) {
    setTimeout(() => startRemoveAnimation(id), duration);
  }
  return id;
}

export function useToast() {
  return {
    toasts,
    success: (msg: string, options?: ToastOptions) =>
      show(msg, "success", options),
    error: (msg: string, options?: ToastOptions) => show(msg, "error", options),
    warning: (msg: string, options?: ToastOptions) =>
      show(msg, "warning", options),
    info: (msg: string, options?: ToastOptions) => show(msg, "info", options),
    dismiss: (id: number) => startRemoveAnimation(id),
  };
}
