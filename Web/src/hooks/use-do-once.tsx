"use client";

import { useRef, useState } from "react";

export default function useDoOnce(callback: Function, deps?: any[]) {
  const [did, setDid] = useState(false); // NOTE: only used when there is no deps
  const _deps = useRef<any[] | null>(deps || null);

  return () => {
    // no deps
    if (!_deps.current) {
      if (!did) {
        setDid(true);
        callback();
      }
      return;
    }

    if (!deps) throw new Error("Deps is not an array.");

    const __deps = _deps.current; // typescript is annoying
    // with deps
    const depsChanged = deps.some((x, index) => x !== __deps[index]);
    if (depsChanged) {
      _deps.current = deps;
      callback();
    }
  };
}
