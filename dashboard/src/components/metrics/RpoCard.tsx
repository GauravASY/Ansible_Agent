import { useEffect, useState } from "react";

export function RpoCard() {
  const [value, setValue] = useState(0);
  const targetValue = 4; // 4 hrs

  useEffect(() => {
    const duration = 1500; // 1.5 seconds
    const startTime = performance.now();

    function updateCount(currentTime: number) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      setValue(Math.floor(progress * targetValue));

      if (progress < 1) {
        requestAnimationFrame(updateCount);
      }
    }

    requestAnimationFrame(updateCount);
  }, []);

  return (
    <div className="bg-card rounded-lg p-4 text-sm">
      <h3 className="font-medium text-muted-foreground">RPO</h3>
      <p className="mt-1 text-2xl font-mono text-accent">{value} hrs</p>
      <p className="mt-1 text-xs text-muted-foreground">Max tolerable data loss window</p>
      <span className="mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green/10 text-green">
        WITHIN SLA
      </span>
    </div>
  );
}