import { useBCPStore } from "@/store/bcpStore";
import { useEffect, useState } from "react";
import { Timer } from "lucide-react";

export function EstimatedCompletionCard() {
  const { getOverallProgress } = useBCPStore();
  const [timeLeft, setTimeLeft] = useState("00:00:00");
  const TOTAL_DURATION_SECONDS = 4 * 60 * 60;

  useEffect(() => {
    const updateTimer = () => {
      const progress = getOverallProgress();
      const elapsedSeconds = (progress / 100) * TOTAL_DURATION_SECONDS;
      const remainingSeconds = Math.max(0, TOTAL_DURATION_SECONDS - elapsedSeconds);
      const h = Math.floor(remainingSeconds / 3600);
      const m = Math.floor((remainingSeconds % 3600) / 60);
      const s = Math.floor(remainingSeconds % 60);
      setTimeLeft(
        `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`
      );
    };
    const timerId = setInterval(updateTimer, 1000);
    updateTimer();
    return () => clearInterval(timerId);
  }, [getOverallProgress]);

  return (
    <div className="bg-card rounded-lg p-4 border border-border/20 relative overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-px bg-accent/50" />
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Est. Completion</h3>
        <Timer className="h-4 w-4 text-accent/70" />
      </div>
      <p className="text-3xl font-mono font-bold text-accent">{timeLeft}</p>
      <p className="mt-1 text-xs text-muted-foreground">Based on current throughput</p>
      <div className="mt-3">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
          LIVE
        </span>
      </div>
    </div>
  );
}
