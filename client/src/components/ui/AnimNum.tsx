import { useState, useEffect } from "react";
import type { AnimNumProps } from "../../types";

export function AnimNum({ value, duration = 1200, suffix = "", prefix = "" }: AnimNumProps) {
  const [d, setD] = useState(0);
  useEffect(() => {
    let s = 0;
    const step = value / (duration / 16);
    const id = setInterval(() => {
      s += step;
      if (s >= value) { setD(value); clearInterval(id); }
      else setD(Math.floor(s));
    }, 16);
    return () => clearInterval(id);
  }, [value, duration]);
  return <>{prefix}{d.toLocaleString()}{suffix}</>;
}
