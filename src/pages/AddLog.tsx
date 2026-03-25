import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Heart, Stethoscope, StickyNote, ChevronRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SYMPTOM_OPTIONS, SEVERITY_CONFIG } from "@/lib/withdrawal-types";
import type { WithdrawalLog } from "@/lib/withdrawal-types";
import { cn } from "@/lib/utils";
import { useWithdrawalLogs } from "@/hooks/use-withdrawal-logs";

const severities = Object.entries(SEVERITY_CONFIG) as [
  WithdrawalLog["severity"],
  (typeof SEVERITY_CONFIG)[keyof typeof SEVERITY_CONFIG]
][];

const SEVERITY_EMOJI: Record<WithdrawalLog["severity"], string> = {
  low: "😌",
  moderate: "😐",
  high: "😣",
  severe: "🆘",
};

export default function AddLog() {
  const navigate = useNavigate();
  const { addLog } = useWithdrawalLogs();

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
    addLog({
      timestamp: new Date().toISOString(),
      severity,
      symptoms,
      notes,
      vitalSigns: {
        heartRate: heartRate ? parseInt(heartRate) : undefined,
        bloodPressure: bp || undefined,
      },
    });
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="max-w-lg mx-auto flex items-center justify-between px-4 h-14">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="text-sm font-medium">Back</span>
          </button>
          <h1 className="text-base font-semibold text-foreground">New Entry</h1>
          <div className="w-16" />
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6 space-y-8 pb-32">
        {/* Step 1: How are you feeling? */}
        <section className="space-y-4">
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-foreground">
              How are you feeling right now?
            </h2>
            <p className="text-sm text-muted-foreground">
              Choose the level that best describes your current state
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {severities.map(([key, config]) => {
              const isSelected = severity === key;
              return (
                <button
                  key={key}
                  onClick={() => setSeverity(key)}
                  className={cn(
                    "relative p-4 rounded-xl border-2 transition-all text-left",
                    isSelected
                      ? "shadow-md scale-[1.02]"
                      : "border-transparent bg-secondary hover:bg-secondary/80"
                  )}
                  style={
                    isSelected
                      ? {
                          borderColor: `hsl(var(--severity-${key}))`,
                          backgroundColor: `hsl(var(--severity-${key}) / 0.08)`,
                        }
                      : undefined
                  }
                >
                  <span className="text-2xl">{SEVERITY_EMOJI[key]}</span>
                  <p
                    className="text-sm font-semibold mt-1"
                    style={
                      isSelected
                        ? { color: `hsl(var(--severity-${key}))` }
                        : undefined
                    }
                  >
                    {config.label}
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    {key === "low" && "Mild discomfort"}
                    {key === "moderate" && "Noticeable symptoms"}
                    {key === "high" && "Significant distress"}
                    {key === "severe" && "Need immediate help"}
                  </p>
                  {isSelected && (
                    <div
                      className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center"
                      style={{
                        backgroundColor: `hsl(var(--severity-${key}))`,
                      }}
                    >
                      <Check className="h-3 w-3 text-white" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </section>

        {/* Step 2: Symptoms */}
        <section className="space-y-4">
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-foreground">
              What symptoms are you experiencing?
            </h2>
            <p className="text-sm text-muted-foreground">
              Tap all that apply — {symptoms.length} selected
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {SYMPTOM_OPTIONS.map((s) => {
              const isActive = symptoms.includes(s);
              return (
                <button
                  key={s}
                  onClick={() => toggleSymptom(s)}
                  className={cn(
                    "px-3.5 py-2 rounded-xl text-sm font-medium transition-all border",
                    isActive
                      ? "bg-primary text-primary-foreground border-primary shadow-sm"
                      : "bg-card text-foreground border-border hover:border-primary/40"
                  )}
                >
                  {isActive && <Check className="h-3.5 w-3.5 inline mr-1.5 -mt-0.5" />}
                  {s}
                </button>
              );
            })}
          </div>
        </section>

        {/* Step 3: Vitals */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Stethoscope className="h-5 w-5 text-muted-foreground" />
            <div>
              <h2 className="text-lg font-bold text-foreground">Vitals</h2>
              <p className="text-sm text-muted-foreground">Optional — if you have readings</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                <Heart className="h-3.5 w-3.5" /> Heart Rate
              </label>
              <Input
                type="number"
                placeholder="e.g. 80 bpm"
                value={heartRate}
                onChange={(e) => setHeartRate(e.target.value)}
                className="rounded-xl"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">
                Blood Pressure
              </label>
              <Input
                placeholder="e.g. 120/80"
                value={bp}
                onChange={(e) => setBp(e.target.value)}
                className="rounded-xl"
              />
            </div>
          </div>
        </section>

        {/* Step 4: Notes */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <StickyNote className="h-5 w-5 text-muted-foreground" />
            <div>
              <h2 className="text-lg font-bold text-foreground">Notes</h2>
              <p className="text-sm text-muted-foreground">
                Anything else you want to remember
              </p>
            </div>
          </div>

          <Textarea
            placeholder="How are you feeling? What triggered this? What helped?"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
            className="rounded-xl resize-none"
          />
        </section>
      </div>

      {/* Fixed bottom save */}
      <div className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-lg border-t border-border p-4 z-40">
        <div className="max-w-lg mx-auto">
          <Button
            onClick={handleSubmit}
            className="w-full h-13 text-base font-semibold rounded-xl gap-2"
          >
            Save Entry
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
