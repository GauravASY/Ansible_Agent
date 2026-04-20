import { useEffect, useState } from "react";
import { useBCPStore } from "@/store/bcpStore";
import { Target } from "lucide-react";

export function RtoCard() {
  const { getOverallProgress } = useBCPStore();
  const targetFraction = getOverallProgress() / 100;
  const targetValue = 135;
  const [value, setValue] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const duration = 2000;
    const startTime = performance.now();
    function updateCount(currentTime: number) {
      const elapsed = currentTime - startTime;
      const t = Math.min(elapsed / duration, 1);
      setProgress(t * targetFraction);
      setValue(Math.floor(t * targetFraction * targetValue));
      if (t < 1) requestAnimationFrame(updateCount);
    }
    requestAnimationFrame(updateCount);
  }, [targetFraction]);

  const remainingMin = Math.max(0, targetValue - Math.round(progress * targetValue));

  return (
    <div className="bg-card rounded-lg p-4 border border-border/20 relative overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-px bg-accent/50" />
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">RTO</h3>
        <Target className="h-4 w-4 text-accent/70" />
      </div>
      <div className="flex items-center gap-3">
        <div className="relative w-12 h-12 shrink-0">
          <svg className="w-12 h-12 -rotate-90" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" stroke="currentColor" className="text-muted/40" strokeWidth="2" fill="none" />
            <circle
              cx="12" cy="12" r="10"
              stroke="currentColor" className="text-accent"
              strokeWidth="2" fill="none"
              strokeDasharray="62.83"
              strokeDashoffset={`${62.83 * (1 - progress)}`}
              style={{ transition: "stroke-dashoffset 0.3s ease" }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center text-[9px] font-mono font-bold text-accent">
            {remainingMin}m
          </div>
        </div>
        <div>
          <p className="text-2xl font-mono font-bold text-accent">
            {Math.floor(value / 60)}h {value % 60}m
          </p>
          <p className="text-xs text-muted-foreground">Target restoration time</p>
        </div>
      </div>
      <div className="mt-3">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/10 text-green-400">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          ON TRACK
        </span>
      </div>
    </div>
  );
}
