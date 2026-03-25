import { format, startOfWeek, endOfWeek, addWeeks, subWeeks, isThisWeek } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WeekNavigatorProps {
  currentWeekStart: Date;
  onWeekChange: (date: Date) => void;
}

export function WeekNavigator({ currentWeekStart, onWeekChange }: WeekNavigatorProps) {
  const weekEnd = endOfWeek(currentWeekStart, { weekStartsOn: 1 });
  const isCurrentWeek = isThisWeek(currentWeekStart, { weekStartsOn: 1 });

  return (
    <div className="flex items-center justify-between">
      <Button
        variant="ghost"
        size="icon"
        className="h-9 w-9 rounded-full"
        onClick={() => onWeekChange(subWeeks(currentWeekStart, 1))}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <div className="text-center">
        <p className="text-sm font-semibold text-foreground">
          {format(currentWeekStart, "MMM d")} – {format(weekEnd, "MMM d, yyyy")}
        </p>
        {isCurrentWeek && (
          <p className="text-xs text-primary font-medium">This Week</p>
        )}
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="h-9 w-9 rounded-full"
        onClick={() => onWeekChange(addWeeks(currentWeekStart, 1))}
        disabled={isCurrentWeek}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
