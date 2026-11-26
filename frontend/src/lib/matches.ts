import type { Match } from "../api/types";
import { toApiDate } from "./dates";

// Groups matches by their LOCAL calendar day, e.g. "2026-12-09" -> [match, match].
export function groupMatchesByDay(matches: Match[]): Map<string, Match[]> {
  const byDay = new Map<string, Match[]>();
  for (const match of matches) {
    const key = toApiDate(new Date(match.kickoff_utc));
    const list = byDay.get(key) ?? [];
    list.push(match);
    byDay.set(key, list);
  }
  return byDay;
}
