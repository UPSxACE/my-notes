import { useState } from "react";

export default function useDelayer(delayMs: number) {
  const [tm, setTm] = useState<NodeJS.Timeout[]>([]);

  function delayed(callback: Function) {
    const timeout = setTimeout(() => {
      callback();
    }, delayMs);

    setTm((prev) => [...prev, timeout]);
  }

  function cancelAll() {
    setTm((prev) => {
      prev.forEach((x) => clearTimeout(x));
      return [];
    });
  }

  return { delayed, cancelAll };
}
