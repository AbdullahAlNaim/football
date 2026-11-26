from django.db import transaction
from django.utils import timezone

from .models import Match, Standing, Team
from .providers.base import MatchData, StandingData, TeamData


def save_team(data: TeamData) -> Team:
    team, _ = Team.objects.update_or_create(
        provider_id=data.provider_id,
        defaults={
            "name": data.name,
            "short_name": data.short_name,
            "tla": data.tla,
            "crest_url": data.crest_url,
        },
    )
    return team


def save_match(data: MatchData) -> Match:
    match, _ = Match.objects.update_or_create(
        provider_id=data.provider_id,
        defaults={
            "season": data.season,
            "stage": data.stage,
            "matchday": data.matchday,
            "home_team": save_team(data.home_team),
            "away_team": save_team(data.away_team),
            "kickoff_utc": data.kickoff_utc,
            "status": data.status,
            "home_score": data.home_score,
            "away_score": data.away_score,
            "last_synced_at": timezone.now(),
        },
    )
    return match


@transaction.atomic
def save_matches(items: list[MatchData]) -> int:
    for item in items:
        save_match(item)
    return len(items)


@transaction.atomic
def save_standings(season: int, items: list[StandingData]) -> int:
    for item in items:
        Standing.objects.update_or_create(
            season=season,
            team=save_team(item.team),
            defaults={
                "position": item.position,
                "played": item.played,
                "won": item.won,
                "draw": item.draw,
                "lost": item.lost,
                "points": item.points,
                "goals_for": item.goals_for,
                "goals_against": item.goals_against,
            },
        )
    return len(items)