import { useState, useCallback, useRef, useEffect } from "react";
import { triggerBugReport } from "@/lib/bugReport";

export function useBugReportBubble() {
  const [isCopied, setIsCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleClick = useCallback(async () => {
    if (isCopied) return;
    try {
      const { copied } = await triggerBugReport();
      if (copied) {
        setIsCopied(true);
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => setIsCopied(false), 2800);
      }
    } catch {
      // Ignore report errors
    }
  }, [isCopied]);

  return { isCopied, handleClick };
}
