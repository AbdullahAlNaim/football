export function stageLabel(stage: string, matchday: number | null): string {
  const name = stage
    .toLowerCase()
    .split("_")
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");
  return stage === "LEAGUE_STAGE" && matchday ? `${name} · Matchday ${matchday}` : name;
}
