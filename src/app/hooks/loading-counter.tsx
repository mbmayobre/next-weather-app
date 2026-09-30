/**
 * Tracks how many requests are in flight, rather than a simple on/off boolean.
 *
 * Why: weather.tsx fires three fetches at once via Promise.all. With a boolean,
 * the first one to finish would flip it to false and hide the spinner while the
 * other two were still loading. Counting instead means the spinner stays up
 * until the last request settles.
 *
 * Every start() must be paired with a stop() — fetchJson does that in a
 * `finally` block so an error cannot leave the counter stuck above zero.
 */
import { useCallback, useState } from "react";

export function useLoadingCounter() {
  const [count, setCount] = useState(0);
  const start = useCallback(() => setCount((c) => c + 1), []);
  const stop = useCallback(() => setCount((c) => Math.max(0, c - 1)), []);
  return { isLoading: count > 0, start, stop };
};