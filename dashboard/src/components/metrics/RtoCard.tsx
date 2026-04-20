import { useEffect, useState } from "react";
import { useBCPStore } from "@/store/bcpStore";

export function RtoCard() {
  const { getOverallProgress } = useBCPStore();
  const targetFraction = getOverallProgress() / 100;

  const targetValue = 135; // 2 hrs 15 min in minutes
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

      if (t < 1) {
        requestAnimationFrame(updateCount);
      }
    }

    requestAnimationFrame(updateCount);
  }, [targetFraction]);

  const remainingMin = Math.max(0, targetValue - Math.round(progress * targetValue));

  return (
    <div className="bg-card rounded-lg p-4 text-sm">
      <h3 className="font-medium text-muted-foreground">RTO</h3>
      <div className="mt-2 flex items-center">
        <div className="relative w-12 h-12">
          <svg className="w-12 h-12" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" stroke="border/20" strokeWidth="2" fill="none" />
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              className="text-accent"
              strokeWidth="2"
              fill="none"
              strokeDasharray="62.83"
              strokeDashoffset={`${62.83 * (1 - progress)}`}
              style={{ transition: "stroke-dashoffset 0.3s ease" }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center text-xs font-mono">
            {remainingMin} min
          </div>
        </div>
        <div className="ml-3">
          <p className="text-2xl font-mono text-accent">{Math.floor(value / 60)} hrs {value % 60} min</p>
          <p className="text-xs text-muted-foreground">Target restoration time</p>
        </div>
      </div>
      <span className="mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green/10 text-green">
        ON TRACK
      </span>
    </div>
  );
}
