from datetime import date, datetime

import requests
from django.conf import settings

from .base import MatchData, StandingData, TeamData

BASE_URL = "https://api.football-data.org/v4"
COMPETITION = "CL"


class RateLimited(Exception):
    pass


class FootballDataProvider:
    def __init__(self, token: str):
        self.session = requests.Session()
        self.session.headers["X-Auth-Token"] = token

    # ---- public methods (the FixtureProvider interface) ----

    def get_matches(self, season: int) -> list[MatchData]:
        data = self._get(f"/competitions/{COMPETITION}/matches", {"season": season})
        return self._parse_matches(data, season)

    def get_matches_on(self, day: date) -> list[MatchData]:
        iso = day.isoformat()
        data = self._get(
            f"/competitions/{COMPETITION}/matches",
            {"dateFrom": iso, "dateTo": iso},
        )
        return self._parse_matches(data, settings.CURRENT_SEASON)

    def get_standings(self, season: int) -> list[StandingData]:
        data = self._get(f"/competitions/{COMPETITION}/standings", {"season": season})
        total = next(s for s in data["standings"] if s["type"] == "TOTAL")
        return [
            StandingData(
                team=self._parse_team(row["team"]),
                position=row["position"],
                played=row["playedGames"],
                won=row["won"],
                draw=row["draw"],
                lost=row["lost"],
                points=row["points"],
                goals_for=row["goalsFor"],
                goals_against=row["goalsAgainst"],
            )
            for row in total["table"]
        ]

    # ---- private helpers ----

    def _get(self, path: str, params: dict) -> dict:
        response = self.session.get(f"{BASE_URL}{path}", params=params, timeout=15)
        if response.status_code == 429:
            raise RateLimited("football-data.org rate limit hit; try again in a minute")
        if not response.ok:
            raise requests.HTTPError(
                f"{response.status_code} from football-data.org for {response.url}: {response.text}",
                response=response,
            )
        return response.json()

    def _parse_matches(self, data: dict, season: int) -> list[MatchData]:
        matches = []
        for m in data["matches"]:
            # Knockout fixtures can exist before the teams are known.
            if not m["homeTeam"].get("id") or not m["awayTeam"].get("id"):
                continue
            full_time = m["score"]["fullTime"]
            matches.append(
                MatchData(
                    provider_id=m["id"],
                    season=self._season_of(m, season),
                    stage=m["stage"],
                    matchday=m.get("matchday"),
                    home_team=self._parse_team(m["homeTeam"]),
                    away_team=self._parse_team(m["awayTeam"]),
                    kickoff_utc=datetime.fromisoformat(m["utcDate"].replace("Z", "+00:00")),
                    status=m["status"],
                    home_score=full_time["home"],
                    away_score=full_time["away"],
                )
            )
        return matches

    def _season_of(self, m: dict, fallback: int) -> int:
        # Each match says which season it belongs to ("startDate": "2026-07-07"),
        # so a date-range query that spans two seasons still labels matches correctly.
        start = ((m.get("season") or {}).get("startDate") or "")[:4]
        return int(start) if start.isdigit() else fallback

    def _parse_team(self, t: dict) -> TeamData:
        return TeamData(
            provider_id=t["id"],
            name=t["name"],
            short_name=t.get("shortName") or t["name"],
            tla=t.get("tla") or "",
            crest_url=t.get("crest") or "",
        )