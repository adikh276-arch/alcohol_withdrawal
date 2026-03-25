import { format } from "date-fns";
import { Trash2, Clock, Activity } from "lucide-react";
import type { WithdrawalLog } from "@/lib/withdrawal-types";
import { SEVERITY_CONFIG } from "@/lib/withdrawal-types";
import { Button } from "@/components/ui/button";

interface LogCardProps {
  log: WithdrawalLog;
  onDelete: (id: string) => void;
}

export function LogCard({ log, onDelete }: LogCardProps) {
  const severity = SEVERITY_CONFIG[log.severity];
  const date = new Date(log.timestamp);

  return (
    <div className="glass-card rounded-xl p-4 space-y-3 transition-all hover:shadow-md">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <div
            className="w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: `hsl(var(--${severity.color}))` }}
          />
          <span
            className="text-xs font-semibold uppercase tracking-wider"
            style={{ color: `hsl(var(--${severity.color}))` }}
          >
            {severity.label}
          </span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-muted-foreground hover:text-destructive"
          onClick={() => onDelete(log.id)}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>

      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Clock className="h-3 w-3" />
        <span>{format(date, "EEE, MMM d · h:mm a")}</span>
      </div>

      {log.symptoms.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {log.symptoms.map((s) => (
            <span
              key={s}
              className="text-xs px-2.5 py-1 rounded-full bg-secondary text-secondary-foreground"
            >
              {s}
            </span>
          ))}
        </div>
      )}

      {log.notes && (
        <p className="text-sm text-muted-foreground leading-relaxed">
          {log.notes}
        </p>
      )}

      {log.vitalSigns && (log.vitalSigns.heartRate || log.vitalSigns.bloodPressure) && (
        <div className="flex items-center gap-3 text-xs text-muted-foreground pt-1 border-t border-border/50">
          <Activity className="h-3 w-3" />
          {log.vitalSigns.heartRate && <span>HR: {log.vitalSigns.heartRate} bpm</span>}
          {log.vitalSigns.bloodPressure && <span>BP: {log.vitalSigns.bloodPressure}</span>}
        </div>
      )}
    </div>
  );
}
