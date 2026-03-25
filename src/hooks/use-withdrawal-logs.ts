import { useState, useCallback } from "react";
import type { WithdrawalLog } from "@/lib/withdrawal-types";

const STORAGE_KEY = "withdrawal-logs";

function loadLogs(): WithdrawalLog[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLogs(logs: WithdrawalLog[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
}

export function useWithdrawalLogs() {
  const [logs, setLogs] = useState<WithdrawalLog[]>(loadLogs);

  const addLog = useCallback((log: Omit<WithdrawalLog, "id">) => {
    const newLog: WithdrawalLog = { ...log, id: crypto.randomUUID() };
    setLogs((prev) => {
      const updated = [newLog, ...prev];
      saveLogs(updated);
      return updated;
    });
  }, []);

  const deleteLog = useCallback((id: string) => {
    setLogs((prev) => {
      const updated = prev.filter((l) => l.id !== id);
      saveLogs(updated);
      return updated;
    });
  }, []);

  return { logs, addLog, deleteLog };
}
