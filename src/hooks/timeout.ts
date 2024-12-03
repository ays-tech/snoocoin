import { useEffect, useRef } from "react";

export function useIdleCallback(callback: () => void, delay = 2000): void {
  const timeoutId = useRef<NodeJS.Timeout | null>(null);
  const idleCallbackId = useRef<number | null>(null);

  useEffect(() => {
    // Function to start the idle timer
    const startIdleTimer = () => {
      if (timeoutId.current) {
        clearTimeout(timeoutId.current);
      }

      timeoutId.current = setTimeout(() => {
        idleCallbackId.current = requestIdleCallback(callback);
      }, delay);
    };

    // Function to reset the idle timer and stop the callback
    const resetIdleTimer = () => {
      if (timeoutId.current) {
        clearTimeout(timeoutId.current);
      }
      if (idleCallbackId.current) {
        cancelIdleCallback(idleCallbackId.current);
      }
      startIdleTimer();
    };

    // Set up event listeners to reset the timer on user activity
    window.addEventListener("click", resetIdleTimer);

    // Start the idle timer initially
    startIdleTimer();

    // Clean up event listeners and timeout on component unmount
    return () => {
      window.removeEventListener("click", resetIdleTimer);

      if (timeoutId.current) {
        clearTimeout(timeoutId.current);
      }
      if (idleCallbackId.current) {
        cancelIdleCallback(idleCallbackId.current);
      }
    };
  }, [callback, delay]);
}
