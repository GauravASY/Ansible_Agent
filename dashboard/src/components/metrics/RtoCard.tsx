import { useEffect, useState } from "react";

export function RtoCard() {
  const [value, setValue] = useState(0);
  const targetValue = 135; // 2 hrs 15 min in minutes
  const [progress, setProgress] = useState(0); // percentage of RTO window consumed

  useEffect(() => {
    // Simulate consuming 60% of RTO window (for example)
    const duration = 2000; // 2 seconds
    const startTime = performance.now();

    function updateCount(currentTime: number) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      setProgress(progress * 0.6); // 60% consumed
      setValue(Math.floor(progress * targetValue)); // Update the value display

      if (progress < 1) {
        requestAnimationFrame(updateCount);
      }
    }

    requestAnimationFrame(updateCount);
  }, []);

  return (
    <div className="bg-card rounded-lg p-4 text-sm">
      <h3 className="font-medium text-muted-foreground">RTO</h3>
      <div className="mt-2 flex items-center">
        <div className="relative w-12 h-12">
          <svg className="w-12 h-12" viewBox="0 0 24 24">
            {/* Background circle */}
            <circle cx="12" cy="12" r="10" stroke="border/20" strokeWidth="2" fill="none" />
            {/* Progress arc */}
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="accent"
              strokeWidth="2"
              fill="none"
              strokeDasharray="62.83" {/* 2 * PI * r = 2 * 3.1415 * 10 ≈ 62.83 */}
              strokeDashoffset={`${62.83 * (1 - progress)}`}
              transition="stroke-dashoffset 0.3s ease"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center text-xs font-mono">
            {Math.max(0, targetValue - Math.round(progress * targetValue))} min
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