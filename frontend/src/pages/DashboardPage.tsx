import { LatestResults } from "../components/LatestResults";
import { MatchdayCard } from "../components/MatchdayCard";
import { StandingsTable } from "../components/StandingsTable";

// Desktop: two columns (main | results). Mobile: one column in DOM order,
// so results come right after the featured match, before the long table.
export function DashboardPage() {
  return (
    <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
      <div className="min-w-0 lg:col-start-1 lg:row-start-1">
        <MatchdayCard />
      </div>
      <aside className="lg:col-start-2 lg:row-span-2 lg:row-start-1">
        <LatestResults />
      </aside>
      <div className="min-w-0 lg:col-start-1 lg:row-start-2">
        <StandingsTable />
      </div>
    </div>
  );
}
