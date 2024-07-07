"use client";

import { useState } from "react";

export default function useToggle(
  defaultValue: boolean = true
): [boolean, (value?: boolean) => void] {
  const [on, setOn] = useState(defaultValue);

  function toggle(value?: boolean) {
    setOn((prev) => (typeof value !== "undefined" ? value : !prev));
  }

  return [on, toggle];
}
