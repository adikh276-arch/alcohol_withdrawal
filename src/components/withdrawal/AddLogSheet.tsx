import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { SYMPTOM_OPTIONS, SEVERITY_CONFIG } from "@/lib/withdrawal-types";
import type { WithdrawalLog } from "@/lib/withdrawal-types";
import { cn } from "@/lib/utils";

interface AddLogSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (log: Omit<WithdrawalLog, "id">) => void;
}

const severities = Object.entries(SEVERITY_CONFIG) as [WithdrawalLog["severity"], typeof SEVERITY_CONFIG[keyof typeof SEVERITY_CONFIG]][];

export function AddLogSheet({ open, onOpenChange, onAdd }: AddLogSheetProps) {
  const [severity, setSeverity] = useState<WithdrawalLog["severity"]>("low");
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const [heartRate, setHeartRate] = useState("");
  const [bp, setBp] = useState("");

  const toggleSymptom = (s: string) => {
    setSymptoms((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );
  };

  const handleSubmit = () => {
    onAdd({
      timestamp: new Date().toISOString(),
      severity,
      symptoms,
      notes,
      vitalSigns: {
        heartRate: heartRate ? parseInt(heartRate) : undefined,
        bloodPressure: bp || undefined,
      },
    });
    // Reset
    setSeverity("low");
    setSymptoms([]);
    setNotes("");
    setHeartRate("");
    setBp("");
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-2xl max-h-[85vh] overflow-y-auto">
        <SheetHeader className="pb-4">
          <SheetTitle className="text-lg">Log Withdrawal Symptoms</SheetTitle>
        </SheetHeader>

        <div className="space-y-6 pb-6">
          {/* Severity */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Severity</Label>
            <div className="grid grid-cols-4 gap-2">
              {severities.map(([key, config]) => (
                <button
                  key={key}
                  onClick={() => setSeverity(key)}
                  className={cn(
                    "py-2.5 px-2 rounded-lg text-xs font-semibold transition-all border-2",
                    severity === key
                      ? "border-current shadow-sm"
                      : "border-transparent bg-secondary"
                  )}
                  style={
                    severity === key
                      ? { color: `hsl(var(--${config.color}))`, backgroundColor: `hsl(var(--${config.color}) / 0.1)` }
                      : undefined
                  }
                >
                  {config.label}
                </button>
              ))}
            </div>
          </div>

          {/* Symptoms */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Symptoms</Label>
            <div className="flex flex-wrap gap-2">
              {SYMPTOM_OPTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => toggleSymptom(s)}
                  className={cn(
                    "text-xs px-3 py-1.5 rounded-full transition-all",
                    symptoms.includes(s)
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "bg-secondary text-secondary-foreground"
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Vitals */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Vitals (optional)</Label>
            <div className="grid grid-cols-2 gap-3">
              <Input
                type="number"
                placeholder="Heart rate (bpm)"
                value={heartRate}
                onChange={(e) => setHeartRate(e.target.value)}
              />
              <Input
                placeholder="Blood pressure"
                value={bp}
                onChange={(e) => setBp(e.target.value)}
              />
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Notes</Label>
            <Textarea
              placeholder="How are you feeling?"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>

          <Button onClick={handleSubmit} className="w-full h-12 text-base font-semibold rounded-xl">
            Save Log
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
