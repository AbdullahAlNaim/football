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


def recent_form(season: int, limit: int = 3) -> dict[int, list[str]]:
    """Last `limit` results per team, oldest first, e.g. {81: ["W", "D", "W"]}."""
    finished = (
        Match.objects
        .filter(season=season, status=Match.Status.FINISHED)
        .order_by("-kickoff_utc")
    )
    form = defaultdict(list)
    for match in finished:
        for team_id in (match.home_team_id, match.away_team_id):
            if len(form[team_id]) < limit:
                form[team_id].append(result_for(match, team_id))
    return {team_id: list(reversed(results)) for team_id, results in form.items()}