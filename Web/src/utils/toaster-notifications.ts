"use client";

import { toast } from "sonner";

export function notifySuccess(message: string, durationSecs?: number) {
  toast.success(message, {
    duration: durationSecs ? durationSecs * 1000 : 20000,
    closeButton: true,
    dismissible: true,
  });
}

export function notifyWarning(message: string, durationSecs?: number) {
  toast.warning(message, {
    duration: durationSecs ? durationSecs * 1000 : 10000,
    closeButton: true,
    dismissible: true,
  });
}

export function notifyError(message?: string) {
  toast.error(
    message ||
      "An unexpected error has occurred. Please try again later, and if the error persists, contact us.",
    {
      duration: 30000,
      closeButton: true,
      dismissible: true,
    }
  );
}

export function notifyFatal(message?: string, uniqueId?: string) {
  toast.error(
    message ||
      "A fatal error has occurred. Please refresh the page to avoid bugs.",
    {
      id: uniqueId || "fatal",
      duration: Infinity,
      closeButton: false,
      dismissible: false,
    }
  );
}
