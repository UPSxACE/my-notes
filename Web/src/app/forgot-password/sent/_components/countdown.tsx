"use client";

import { useEffect, useState } from "react";

export default function Countdown() {
  const thirtyMinutes = 1000 * 60 * 30.5;
  const [counter, setCounter] = useState(new Date(thirtyMinutes));

  useEffect(() => {
    const interval = setInterval(() => {
      setCounter((counter) => new Date(counter.getTime() - 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatedTime = `${counter.getMinutes()}:${counter
    .getSeconds()
    .toString()
    .padStart(2, "0")}`;

  return <div>Time remaining to resend: {formatedTime}</div>;
}
