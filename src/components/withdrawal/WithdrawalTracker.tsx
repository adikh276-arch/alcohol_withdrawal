import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { startOfWeek, endOfWeek, isWithinInterval, format, eachDayOfInterval, isSameDay } from "date-fns";
import { Plus, Droplets } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWithdrawalLogs } from "@/hooks/use-withdrawal-logs";
import { WeekNavigator } from "./WeekNavigator";
import { LogCard } from "./LogCard";
import { useTranslation } from "react-i18next";
import { LanguageSelector } from "../LanguageSelector";

export function WithdrawalTracker() {
  const { t } = useTranslation();
  const { logs, deleteLog } = useWithdrawalLogs();
  const navigate = useNavigate();
  const [currentWeekStart, setCurrentWeekStart] = useState(
    startOfWeek(new Date(), { weekStartsOn: 1 })
  );

  const weekEnd = endOfWeek(currentWeekStart, { weekStartsOn: 1 });
  const weekDays = eachDayOfInterval({ start: currentWeekStart, end: weekEnd });

  const weekLogs = useMemo(
    () =>
      logs
        .filter((l) =>
          isWithinInterval(new Date(l.timestamp), { start: currentWeekStart, end: weekEnd })
        )
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()),
    [logs, currentWeekStart, weekEnd]
  );

  // Group logs by day
  const logsByDay = useMemo(() => {
    const map = new Map<string, typeof weekLogs>();
    weekDays.forEach((day) => {
      const key = format(day, "yyyy-MM-dd");
      map.set(key, weekLogs.filter((l) => isSameDay(new Date(l.timestamp), day)));
    });
    return map;
  }, [weekLogs, weekDays]);

  // Day dots summary
  const daySummary = weekDays.map((day) => {
    const key = format(day, "yyyy-MM-dd");
    const dayLogs = logsByDay.get(key) || [];
    const isToday = isSameDay(day, new Date());
    return { day, count: dayLogs.length, isToday, key };
  });

  return (
    <div className="min-h-screen bg-background relative pb-24">
      <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Droplets className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">{t('alcohol_withdrawal_tracker')}</h1>
              <p className="text-xs text-muted-foreground">{t('track_symptoms_progress')}</p>
            </div>
          </div>
          <LanguageSelector />
        </div>

        {/* Week Nav */}
        <WeekNavigator currentWeekStart={currentWeekStart} onWeekChange={setCurrentWeekStart} />

        {/* Day dots */}
        <div className="grid grid-cols-7 gap-1">
          {daySummary.map(({ day, count, isToday, key }) => (
            <div key={key} className="flex flex-col items-center gap-1">
              <span className="text-[10px] text-muted-foreground uppercase">
                {format(day, "EEE")}
              </span>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all ${
                  isToday
                    ? "bg-primary text-primary-foreground"
                    : count > 0
                    ? "bg-primary/15 text-primary"
                    : "bg-secondary text-muted-foreground"
                }`}
              >
                {format(day, "d")}
              </div>
              {count > 0 && (
                <div className="flex gap-0.5">
                  {Array.from({ length: Math.min(count, 3) }).map((_, i) => (
                    <div key={i} className="w-1 h-1 rounded-full bg-primary" />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Stats bar */}
        <div className="glass-card rounded-xl p-3 flex justify-around text-center">
          <div>
            <p className="text-lg font-bold text-foreground">{weekLogs.length}</p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{t('entries')}</p>
          </div>
          <div className="w-px bg-border" />
          <div>
            <p className="text-lg font-bold text-foreground">
              {weekLogs.length > 0
                ? new Set(weekLogs.flatMap((l) => l.symptoms)).size
                : 0}
            </p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{t('symptoms')}</p>
          </div>
          <div className="w-px bg-border" />
          <div>
            <p className="text-lg font-bold text-foreground">
              {weekLogs.filter((l) => l.severity === "severe" || l.severity === "high").length}
            </p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{t('high_severe')}</p>
          </div>
        </div>

        {/* Logs */}
        {weekLogs.length === 0 ? (
          <div className="text-center py-12 space-y-2">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-secondary flex items-center justify-center">
              <Droplets className="h-8 w-8 text-muted-foreground/40" />
            </div>
            <p className="text-sm text-muted-foreground">{t('no_logs_this_week')}</p>
            <p className="text-xs text-muted-foreground/70">{t('tap_plus_to_add')}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {weekLogs.map((log) => (
              <LogCard key={log.id} log={log} onDelete={deleteLog} />
            ))}
          </div>
        )}
      </div>

      {/* Floating Add Button */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
        <Button
          onClick={() => navigate("/add")}
          className="h-14 px-8 rounded-full shadow-lg shadow-primary/25 text-base font-semibold gap-2"
        >
          <Plus className="h-5 w-5" />
          {t('add_log')}
        </Button>
      </div>
    </div>
  );
}
