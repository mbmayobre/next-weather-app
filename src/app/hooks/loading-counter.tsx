import { useCallback, useState } from "react";

export function useLoadingCounter() {
  const [count, setCount] = useState(0);
  console.log("count: " + count);
  const start = useCallback(() => setCount((c) => c + 1), []);
  const stop = useCallback(() => setCount((c) => Math.max(0, c - 1)), []);
  return { isLoading: count > 0, start, stop };
};