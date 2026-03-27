import { useState, useCallback, useEffect } from "react";
import type { WithdrawalLog } from "@/lib/withdrawal-types";
import { apiFetch } from "@/lib/api";

export function useWithdrawalLogs() {
  const [logs, setLogs] = useState<WithdrawalLog[]>([]);
  const userId = sessionStorage.getItem('user_id');

  const fetchLogs = useCallback(async () => {
    if (!userId) return;
    try {
      const response = await apiFetch('/api/withdrawal', {
        headers: { 'x-user-id': userId }
      });
      const data = await response.json();
      setLogs(data);
    } catch (err) {
      console.error('Failed to fetch logs:', err);
    }
  }, [userId]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const addLog = useCallback(async (log: Omit<WithdrawalLog, "id">) => {
    if (!userId) return;
    const newLog: WithdrawalLog = { ...log, id: crypto.randomUUID() };
    
    try {
      await apiFetch('/api/withdrawal', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-user-id': userId
        },
        body: JSON.stringify(newLog)
      });
      setLogs((prev) => [newLog, ...prev]);
    } catch (err) {
      console.error('Failed to add log:', err);
    }
  }, [userId]);

  const deleteLog = useCallback(async (id: string) => {
    if (!userId) return;
    try {
      await apiFetch(`/api/withdrawal/${id}`, {
        method: 'DELETE',
        headers: { 'x-user-id': userId }
      });
      setLogs((prev) => prev.filter((l) => l.id !== id));
    } catch (err) {
      console.error('Failed to delete log:', err);
    }
  }, [userId]);

  return { logs, addLog, deleteLog };
}
