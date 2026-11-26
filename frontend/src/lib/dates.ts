import { addDays, format, startOfWeek } from "date-fns";

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
