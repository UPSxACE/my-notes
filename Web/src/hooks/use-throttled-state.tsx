"use client";

import { useEffect, useState } from "react";

export default function useThrottledState<T>(
  value: T,
  delayMs: number,
  throttleWhen: (value: T) => boolean
) {
  const [current, setCurrent] = useState<T>(value);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (current !== value) {
      const throttle = throttleWhen ? throttleWhen(value) : true;

      if (!throttle) setCurrent(value);

      timeout = setTimeout(() => {
        setCurrent(value);
      }, delayMs);
    }

    return () => clearTimeout(timeout);
  }, [value, delayMs, current, throttleWhen]);

  // do not wait for useEffect to return the current value when "throttleWhen" is being used"
  const throttle = throttleWhen ? throttleWhen(value) : true;
  if (!throttle) value;

  return current;
}
