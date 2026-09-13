import { useEffect, useState } from "react";

function getRemainingSeconds(targetTimestamp: number | null): number {
  if (!targetTimestamp) {
    return 0;
  }

  const diffMs = targetTimestamp - Date.now();

  return diffMs > 0 ? Math.ceil(diffMs / 1000) : 0;
}

export function useCountdown(targetTimestamp: number | null): number {
  const [remainingSeconds, setRemainingSeconds] = useState(() =>
    getRemainingSeconds(targetTimestamp),
  );

  useEffect(() => {
    setRemainingSeconds(getRemainingSeconds(targetTimestamp));

    if (!targetTimestamp) {
      return;
    }

    const intervalId = setInterval(() => {
      setRemainingSeconds(getRemainingSeconds(targetTimestamp));
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [targetTimestamp]);

  return remainingSeconds;
}
