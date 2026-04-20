import { useBCPStore } from "@/store/bcpStore";
import { useEffect, useState } from "react";

export function EstimatedCompletionCard() {
  const { getOverallProgress } = useBCPStore();
  const [timeLeft, setTimeLeft] = useState("00:00:00");

  // Simulate a total expected duration of 4 hours (in seconds)
  const TOTAL_DURATION_SECONDS = 4 * 60 * 60; // 4 hours

  useEffect(() => {
    const updateTimer = () => {
      const progress = getOverallProgress(); // 0-100
      const elapsedSeconds = (progress / 100) * TOTAL_DURATION_SECONDS;
      let remainingSeconds = TOTAL_DURATION_SECONDS - elapsedSeconds;

      // Ensure remainingSeconds doesn't go below 0
      if (remainingSeconds < 0) {
        remainingSeconds = 0;
      }

      const hours = Math.floor(remainingSeconds / 3600);
      const minutes = Math.floor((remainingSeconds % 3600) / 60);
      const seconds = Math.floor(remainingSeconds % 60);

      const formattedTime =
        `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

      setTimeLeft(formattedTime);
    };

    // Update every second
    const timerId = setInterval(updateTimer, 1000);
    // Initial update
    updateTimer();

    return () => clearInterval(timerId);
  }, [getOverallProgress]);

  return (
    <div className="bg-card rounded-lg p-4 text-sm">
      <h3 className="font-medium text-muted-foreground">Estimated Completion</p>
      <p className="mt-1 text-2xl font-mono text-accent">{timeLeft}</p>
      <p className="mt-1 text-xs text-muted-foreground">Based on current throughput</p>
      <span className="mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green/10 text-green">
        LIVE
      </span>
    </div>
  );
}