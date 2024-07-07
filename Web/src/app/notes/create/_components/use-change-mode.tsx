"use client";

import useDelayer from "@/hooks/use-delayer";
import useToggle from "@/hooks/use-toggle";
import { notifyWarning } from "@/utils/toaster-notifications";
import { useState } from "react";

export enum Mode {
  Default,
  NewFolder,
}

export default function useChangeMode(localFolderSelection: string) {
  const [visible, setVisibility] = useToggle();
  const visibleClass = visible
    ? "opacity-100 transition-opacity [transition-duration:200ms]"
    : "opacity-0 transition-opacity [transition-duration:200ms]";
  const [mode, setMode] = useState<Mode>(Mode.Default);

  const { delayed, cancelAll: cancelTransition } = useDelayer(200);

  const changeMode = (mode: Mode) => () => {
    if (mode === Mode.NewFolder) {
      const slashMatch = /\//g;
      const pathLevels = Array.from(
        localFolderSelection.matchAll(slashMatch)
      ).length;

      if (pathLevels >= 5)
        return notifyWarning("Reached limit of folder nesting.");
    }

    setVisibility(false);
    delayed(() => {
      setMode(mode);
      // NOTE: after mode is changed successfully, manually trigger visibilityOn
    });
  };

  function resetMode() {
    cancelTransition();
    setMode(Mode.Default);
    setVisibility(true);
  }

  return {
    visible,
    setVisibility,
    visibleClass,
    mode,
    changeMode,
    resetMode,
  };
}
