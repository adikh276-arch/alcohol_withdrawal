import { useState, useCallback, useEffect } from "react";
import type { WithdrawalLog } from "@/lib/withdrawal-types";
import { pool } from "@/lib/db";

export function useWithdrawalLogs() {
  const [logs, setLogs] = useState<WithdrawalLog[]>([]);
  const userId = sessionStorage.getItem('user_id');

  const fetchLogs = useCallback(async () => {
    if (!userId) return;
    try {
      const result = await pool.query('SELECT * FROM withdrawal_logs WHERE user_id = $1 ORDER BY timestamp DESC', [userId]);
      setLogs(result.rows);
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
      await pool.query(
        'INSERT INTO withdrawal_logs (id, user_id, severity, symptoms, notes, heart_rate, blood_pressure, timestamp) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
        [newLog.id, userId, newLog.severity, newLog.symptoms, newLog.notes, newLog.vitalSigns?.heartRate || null, newLog.vitalSigns?.bloodPressure || null, newLog.timestamp]
      );
      setLogs((prev) => [newLog, ...prev]);
    } catch (err) {
      console.error('Failed to add log:', err);
    }
  }, [userId]);

  const deleteLog = useCallback(async (id: string) => {
    if (!userId) return;
    try {
      await pool.query('DELETE FROM withdrawal_logs WHERE id = $1 AND user_id = $2', [id, userId]);
      setLogs((prev) => prev.filter((l) => l.id !== id));
    } catch (err) {
      console.error('Failed to delete log:', err);
    }
  }, [userId]);

  return { logs, addLog, deleteLog };
}
