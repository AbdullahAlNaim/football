from dataclasses import dataclass
from datetime import date, datetime
from typing import Protocol


@dataclass
class TeamData:
    provider_id: int
    name: str
    short_name: str
    tla: str
    crest_url: str


@dataclass
class MatchData:
    provider_id: int
    season: int
    stage: str
    matchday: int | None
    home_team: TeamData
    away_team: TeamData
    kickoff_utc: datetime
    status: str
    home_score: int | None
    away_score: int | None


@dataclass
class StandingData:
    team: TeamData
    position: int
    played: int
    won: int
    draw: int
    lost: int
    points: int
    goals_for: int
    goals_against: int


class FixtureProvider(Protocol):
    def get_matches(self, season: int) -> list[MatchData]: ...
    def get_matches_on(self, day: date) -> list[MatchData]: ...
    def get_standings(self, season: int) -> list[StandingData]: ...