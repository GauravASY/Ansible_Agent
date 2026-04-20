import { useEffect, useState } from "react";
import { ShieldCheck } from "lucide-react";

export function RpoCard() {
  const [value, setValue] = useState(0);
  const targetValue = 4;

  useEffect(() => {
    const duration = 1500;
    const startTime = performance.now();
    function updateCount(currentTime: number) {
      const elapsed = currentTime - startTime;
      const t = Math.min(elapsed / duration, 1);
      setValue(Math.floor(t * targetValue));
      if (t < 1) requestAnimationFrame(updateCount);
    }
    requestAnimationFrame(updateCount);
  }, []);

  return (
    <div className="bg-card rounded-lg p-4 border border-border/20 relative overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-px bg-accent/50" />
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">RPO</h3>
        <ShieldCheck className="h-4 w-4 text-accent/70" />
      </div>
      <p className="text-3xl font-mono font-bold text-accent">{value} hrs</p>
      <p className="mt-1 text-xs text-muted-foreground">Max tolerable data loss</p>
      <div className="mt-3">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/10 text-green-400">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          WITHIN SLA
        </span>
      </div>
    </div>
  );
}
