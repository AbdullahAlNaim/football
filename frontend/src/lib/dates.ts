import {
  addDays,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  startOfMonth,
  startOfWeek,
} from "date-fns";

export function startOfMatchWeek(date: Date): Date {
  return startOfWeek(date, { weekStartsOn: 1 }); // Monday, like the design
}

export function weekDays(start: Date): Date[] {
  return Array.from({ length: 7 }, (_, i) => addDays(start, i));
}

export function toApiDate(date: Date): string {
  return format(date, "yyyy-MM-dd");
}

export function kickoffLabel(isoUtc: string): string {
  return format(new Date(isoUtc), "EEE d MMM · h:mm a");
}

// Every day shown in a month grid: from the Monday on or before the 1st
// to the Sunday on or after the last day (5 or 6 full weeks).
export function monthGridDays(month: Date): Date[] {
  return eachDayOfInterval({
    start: startOfWeek(startOfMonth(month), { weekStartsOn: 1 }),
    end: endOfWeek(endOfMonth(month), { weekStartsOn: 1 }),
  });
}

export function timeLabel(isoUtc: string): string {
  return format(new Date(isoUtc), "h:mm a");
}
