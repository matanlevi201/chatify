import { useEffect, useState } from "react";

export function useNowUpdate(intervalMs = 60000) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => {
      setNow(new Date());
    }, intervalMs);

    return () => clearInterval(id);
  }, [intervalMs]);

  return now;
}
