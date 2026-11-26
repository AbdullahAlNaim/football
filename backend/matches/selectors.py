from collections import defaultdict
from datetime import date

from django.db.models import Q

from .models import Match


def matches_between(start: date, end: date, followed_only: bool = False):
    qs = (
        Match.objects
        .filter(kickoff_utc__date__gte=start, kickoff_utc__date__lte=end)
        .select_related("home_team", "away_team")
    )
    if followed_only:
        qs = qs.filter(Q(home_team__is_followed=True) | Q(away_team__is_followed=True))
    return qs


def result_for(match: Match, team_id: int) -> str:
    if match.home_score == match.away_score:
        return "D"
    home_won = match.home_score > match.away_score
    is_home = match.home_team_id == team_id
    return "W" if home_won == is_home else "L"


def recent_form(season: int, limit: int = 3, stage: str | None = None) -> dict[int, list[str]]:
    """Last `limit` results per team, oldest first, e.g. {81: ["W", "D", "W"]}.

    Pass `stage` (e.g. "LEAGUE_STAGE") to count only matches from that stage,
    so a table's form matches the table it sits in.
    """
    finished = (
        Match.objects
        .filter(season=season, status=Match.Status.FINISHED)
        .order_by("-kickoff_utc")
    )
    if stage:
        finished = finished.filter(stage=stage)
    form = defaultdict(list)
    for match in finished:
        for team_id in (match.home_team_id, match.away_team_id):
            if len(form[team_id]) < limit:
                form[team_id].append(result_for(match, team_id))
    return {team_id: list(reversed(results)) for team_id, results in form.items()}


def team_season_matches(team_id: int, season: int):
    """All of one team's matches in a season, newest first."""
    return (
        Match.objects
        .filter(season=season)
        .filter(Q(home_team_id=team_id) | Q(away_team_id=team_id))
        .select_related("home_team", "away_team")
        .order_by("-kickoff_utc")
    )


def team_stats(team_id: int, matches) -> dict:
    """Totals from the team's finished matches (`matches` may be in any order)."""
    finished = sorted(
        (m for m in matches if m.status == Match.Status.FINISHED),
        key=lambda m: m.kickoff_utc,
    )
    stats = {
        "played": 0, "won": 0, "drawn": 0, "lost": 0,
        "goals_for": 0, "goals_against": 0, "clean_sheets": 0,
    }
    for m in finished:
        is_home = m.home_team_id == team_id
        scored = m.home_score if is_home else m.away_score
        conceded = m.away_score if is_home else m.home_score
        result = result_for(m, team_id)

        stats["played"] += 1
        stats["won"] += result == "W"
        stats["drawn"] += result == "D"
        stats["lost"] += result == "L"
        stats["goals_for"] += scored or 0
        stats["goals_against"] += conceded or 0
        stats["clean_sheets"] += conceded == 0

    stats["goal_difference"] = stats["goals_for"] - stats["goals_against"]
    stats["win_rate"] = round(100 * stats["won"] / stats["played"]) if stats["played"] else 0
    stats["form"] = [result_for(m, team_id) for m in finished[-5:]]  # oldest -> newest
    return stats


def available_seasons() -> list[int]:
    """Seasons that have matches stored, newest first."""
    return list(
        Match.objects.order_by("-season").values_list("season", flat=True).distinct()
    )
