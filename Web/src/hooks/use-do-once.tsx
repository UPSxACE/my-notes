"use client";

import { useState } from "react";

export default function useDoOnce(callback: Function) {
  const [did, setDid] = useState(false);

  return () => {
    if (!did) {
      setDid(true);
      callback();
    }
  };
}
