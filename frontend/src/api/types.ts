export type Team = {
  id: number;
  name: string;
  short_name: string;
  tla: string;
  crest_url: string;
  is_followed: boolean;
};

export type FormResult = "W" | "D" | "L";

export type Standing = {
  position: number;
  team: Team;
  played: number;
  won: number;
  draw: number;
  lost: number;
  points: number;
  goals_for: number;
  goals_against: number;
  goal_difference: number;
  form: FormResult[];
};

export type MatchStatus =
  | "SCHEDULED" | "TIMED" | "IN_PLAY" | "PAUSED"
  | "FINISHED" | "POSTPONED" | "SUSPENDED" | "CANCELLED";

export type Match = {
  id: number;
  competition: string;
  stage: string;
  matchday: number | null;
  kickoff_utc: string;
  status: MatchStatus;
  home_score: number | null;
  away_score: number | null;
  home_team: Team;
  away_team: Team;
};
