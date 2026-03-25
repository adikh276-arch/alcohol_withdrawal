export interface WithdrawalLog {
  id: string;
  timestamp: string; // ISO string
  severity: "low" | "moderate" | "high" | "severe";
  symptoms: string[];
  notes: string;
  vitalSigns?: {
    heartRate?: number;
    bloodPressure?: string;
  };
}

export const SYMPTOM_OPTIONS = [
  "Tremors",
  "Sweating",
  "Nausea",
  "Anxiety",
  "Insomnia",
  "Headache",
  "Irritability",
  "Fatigue",
  "Loss of appetite",
  "Confusion",
  "Hallucinations",
  "Seizures",
] as const;

export const SEVERITY_CONFIG = {
  low: { label: "Mild", color: "severity-low" },
  moderate: { label: "Moderate", color: "severity-moderate" },
  high: { label: "High", color: "severity-high" },
  severe: { label: "Severe", color: "severity-severe" },
} as const;
